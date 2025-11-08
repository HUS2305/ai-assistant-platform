"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@ai-assistant/ui";

type FieldErrors = Record<string, string[]>;

export default function RegisterForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    workspaceName: ""
  });
  const [errors, setErrors] = useState<FieldErrors | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const setField =
    (key: keyof typeof form) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [key]: event.target.value }));
    };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setErrors(null);
    setSuccess(false);

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    if (response.ok) {
      setSuccess(true);
      setTimeout(() => router.replace("/signin"), 800);
      return;
    }

    const data = await response.json();
    setErrors(data.error ?? { base: ["Registration failed"] });
    setLoading(false);
  };

  const renderError = (field: keyof typeof form | "base") => {
    if (!errors?.[field]) {
      return null;
    }

    return (
      <p className="text-sm text-red-400">
        {errors[field].join(". ")}
      </p>
    );
  };

  return (
    <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-4">
      <label className="flex flex-col gap-1 text-sm">
        <span className="text-slate-300">Full name</span>
        <input
          type="text"
          value={form.name}
          onChange={setField("name")}
          className="rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 focus:border-slate-500 focus:outline-none"
          required
        />
        {renderError("name")}
      </label>

      <label className="flex flex-col gap-1 text-sm">
        <span className="text-slate-300">Work email</span>
        <input
          type="email"
          value={form.email}
          onChange={setField("email")}
          className="rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 focus:border-slate-500 focus:outline-none"
          required
        />
        {renderError("email")}
      </label>

      <label className="flex flex-col gap-1 text-sm">
        <span className="text-slate-300">Password</span>
        <input
          type="password"
          value={form.password}
          onChange={setField("password")}
          className="rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 focus:border-slate-500 focus:outline-none"
          required
          minLength={8}
        />
        {renderError("password")}
      </label>

      <label className="flex flex-col gap-1 text-sm">
        <span className="text-slate-300">Workspace name</span>
        <input
          type="text"
          value={form.workspaceName}
          onChange={setField("workspaceName")}
          className="rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 focus:border-slate-500 focus:outline-none"
          required
        />
        {renderError("workspaceName")}
      </label>

      {errors?.base ? (
        <p className="rounded-md border border-red-800 bg-red-950/40 px-3 py-2 text-sm text-red-400">
          {errors.base.join(". ")}
        </p>
      ) : null}

      {success ? (
        <p className="rounded-md border border-emerald-800 bg-emerald-900/20 px-3 py-2 text-sm text-emerald-300">
          Workspace created. Redirecting to sign-in…
        </p>
      ) : null}

      <Button type="submit" disabled={loading}>
        {loading ? "Creating account..." : "Create workspace"}
      </Button>
    </form>
  );
}

