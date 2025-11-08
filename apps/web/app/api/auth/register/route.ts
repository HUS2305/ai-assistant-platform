import { prisma } from "@ai-assistant/db";
import { MembershipRole } from "@prisma/client";
import { hash } from "argon2";
import { NextResponse } from "next/server";
import { z } from "zod";

import { slugify } from "@ai-assistant/utils";

const registerSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  workspaceName: z.string().min(2, "Workspace name is required")
});

const ensureWorkspaceSlug = async (name: string) => {
  const base = slugify(name);
  let slug = base;
  let counter = 1;

  while (await prisma.workspace.findUnique({ where: { slug } })) {
    slug = `${base}-${counter}`;
    counter += 1;
  }

  return slug;
};

export const POST = async (request: Request) => {
  const body = await request.json();
  const parsed = registerSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const { email, password, workspaceName, name } = parsed.data;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return NextResponse.json(
      { error: { email: ["Email already in use"] } },
      { status: 409 }
    );
  }

  const passwordHash = await hash(password);
  const slug = await ensureWorkspaceSlug(workspaceName);

  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        email,
        name,
        passwordHash
      }
    });

    const workspace = await tx.workspace.create({
      data: {
        name: workspaceName,
        slug,
        ownerId: user.id
      }
    });

    await tx.workspaceMembership.create({
      data: {
        workspaceId: workspace.id,
        userId: user.id,
        role: MembershipRole.OWNER
      }
    });

    return { user, workspace };
  });

  return NextResponse.json(
    {
      userId: result.user.id,
      workspaceId: result.workspace.id
    },
    { status: 201 }
  );
};

