import { Button, Logo } from "@ai-assistant/ui";

const features = [
  {
    title: "Multimodal Understanding",
    description: "Chat with the assistant using text, voice notes, or images."
  },
  {
    title: "Creator Suite",
    description: "Plan and schedule cross-platform content in minutes."
  },
  {
    title: "Email Management",
    description: "Summarize inboxes, draft replies, and never miss follow-ups."
  }
];

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col gap-16 bg-slate-950 px-6 py-16 text-slate-100">
      <header className="flex w-full items-center justify-between">
        <div className="flex items-center gap-3">
          <Logo className="h-10 w-10" />
          <span className="text-xl font-semibold tracking-tight">Astra Assistant</span>
        </div>
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost">
            <a href="/signin">Dashboard Login</a>
          </Button>
          <Button asChild>
            <a href="/register">Request Access</a>
          </Button>
        </div>
      </header>

      <section className="mx-auto flex max-w-4xl flex-col items-center gap-8 text-center">
        <h1 className="text-4xl font-bold leading-tight md:text-5xl">
          Run your day from WhatsApp, Telegram, or the web — one AI assistant everywhere.
        </h1>
        <p className="max-w-2xl text-lg text-slate-300">
          Astra understands your conversations, organizes your schedule, and coordinates your
          content, email, and reminders so you can focus on meaningful work.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button>Start a WhatsApp chat</Button>
          <Button variant="secondary">Open the web dashboard</Button>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
        {features.map((feature) => (
          <article
            key={feature.title}
            className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 text-left"
          >
            <h2 className="text-xl font-semibold text-white">{feature.title}</h2>
            <p className="mt-3 text-sm text-slate-300">{feature.description}</p>
          </article>
        ))}
      </section>
    </main>
  );
}

