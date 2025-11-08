import { prisma } from "@ai-assistant/db";
import { MembershipRole } from "@prisma/client";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { verify } from "argon2";
import { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { z } from "zod";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt"
  },
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email },
          include: {
            memberships: {
              orderBy: { createdAt: "asc" }
            }
          }
        });

        if (!user || !user.passwordHash) {
          return null;
        }

        const valid = await verify(user.passwordHash, parsed.data.password);
        if (!valid) {
          return null;
        }

        const primaryMembership = user.memberships[0];

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          workspaceId: primaryMembership?.workspaceId ?? null,
          role: primaryMembership?.role ?? MembershipRole.MEMBER
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.workspaceId = (user as unknown as { workspaceId?: string | null }).workspaceId ?? null;
        token.role = (user as unknown as { role?: MembershipRole }).role ?? MembershipRole.MEMBER;
      } else if (token.sub) {
        const membership = await prisma.workspaceMembership.findFirst({
          where: { userId: token.sub },
          orderBy: { createdAt: "asc" }
        });
        if (membership) {
          token.workspaceId = membership.workspaceId;
          token.role = membership.role;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.workspaceId =
          (token.workspaceId as string | undefined | null) ?? undefined;
        session.user.role = (token.role as MembershipRole | undefined) ?? undefined;
      }
      return session;
    }
  },
  pages: {
    signIn: "/signin"
  }
};

