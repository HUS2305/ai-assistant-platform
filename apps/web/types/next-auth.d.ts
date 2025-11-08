import { DefaultSession } from "next-auth";
import "next-auth/jwt";
import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      workspaceId?: string;
      role?: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    workspaceId?: string | null;
    role?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    workspaceId?: string | null;
    role?: string | null;
  }
}

