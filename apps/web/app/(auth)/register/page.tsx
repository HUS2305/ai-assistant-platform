import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { Button, Logo } from "@ai-assistant/ui";

import { authOptions } from "@/lib/auth";

import RegisterForm from "./register-form";

export default async function RegisterPage() {
  const session = await getServerSession(authOptions);
  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-4 py-10 text-slate-100">
      <div className="w-full max-w-xl rounded-2xl border border-slate-800 bg-slate-900/70 p-8 shadow-xl">
        <div className="flex flex-col items-center gap-2">
          <Logo className="h-10 w-10" />
          <h1 className="text-xl font-semibold">Create your workspace</h1>
          <p className="text-sm text-slate-300">
            Set up your Astra workspace to start managing conversations and automations.
          </p>
        </div>

        <RegisterForm />

        <div className="mt-6 text-center text-sm text-slate-400">
          Already have an account?{" "}
          <Button asChild variant="ghost" className="px-0 py-0 text-slate-200">
            <Link href="/signin">Sign in</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}

