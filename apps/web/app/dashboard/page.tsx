import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { Button } from "@ai-assistant/ui";

import { authOptions } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/signin");
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100">
      <div className="mx-auto flex max-w-4xl flex-col gap-6">
        <header>
          <p className="text-sm text-slate-400">
            Workspace ID: {session.user.workspaceId ?? "not assigned"}
          </p>
          <h1 className="text-3xl font-semibold">
            Welcome back, {session.user.name ?? "there"} 👋
          </h1>
          <p className="mt-2 text-slate-300">
            This dashboard will soon show conversations, reminders, and suite analytics.
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-2">
          <article className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <h2 className="text-lg font-semibold text-white">Next steps</h2>
            <ul className="mt-3 space-y-2 text-sm text-slate-300">
              <li>• Connect WhatsApp or Telegram to start chatting.</li>
              <li>• Link Google Calendar for scheduling assistance.</li>
              <li>• Invite teammates to collaborate inside Astra.</li>
            </ul>
          </article>

          <article className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <h2 className="text-lg font-semibold text-white">Billing & onboarding</h2>
            <p className="mt-3 text-sm text-slate-300">
              Stripe integration and guided onboarding will appear here once configured.
            </p>
            <Button className="mt-4" variant="secondary">
              Coming soon
            </Button>
          </article>
        </section>
      </div>
    </main>
  );
}

