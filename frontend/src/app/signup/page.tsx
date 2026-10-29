"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { register, setToken } from "../../lib/api";

type FormState = {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  phone_number: string;
  password: string;
  password_confirm: string;
};

const EMPTY_FORM: FormState = {
  first_name: "",
  last_name: "",
  username: "",
  email: "",
  phone_number: "",
  password: "",
  password_confirm: "",
};

export default function SignupPage() {
  const router = useRouter();
  const REGISTRATION_ENABLED =
  process.env.NEXT_PUBLIC_REGISTRATION_ENABLED !== "false";
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update<K extends keyof FormState>(field: K, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    if (form.password !== form.password_confirm) {
      setFieldErrors({ password_confirm: "Passwords do not match." });
      return;
    }
    if (form.password.length < 8) {
      setFieldErrors({ password: "Password must be at least 8 characters." });
      return;
    }

    setLoading(true);
    try {
      const token = await register(form);
      setToken(token);
      router.push("/appointments");
    } catch (err) {
      const e = err as Error & {
        fields?: Record<string, string | string[]>;
      };
      if (e.fields) {
        const normalized: Record<string, string> = {};
        for (const [field, msg] of Object.entries(e.fields)) {
          normalized[field] = Array.isArray(msg) ? msg.join(" ") : String(msg);
        }
        setFieldErrors(normalized);
      } else {
        setError(e.message || "Registration failed.");
      }
    } finally {
      setLoading(false);
    }
  }
  if (!REGISTRATION_ENABLED) {
    return (
      <div className="min-h-screen bg-light flex flex-col items-center justify-center px-6 py-12">
        <Link
          href="/request-appointment"
          className="mb-8 flex items-center gap-2 text-sm font-bold text-gold hover:text-[#8e6b27] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
        <div className="w-full max-w-md bg-white border border-border rounded-2xl p-8 text-center shadow-[0_4px_20px_rgb(0,0,0,0.04)]">
          <div className="text-center mb-6">
            <div className="font-serif text-2xl tracking-wide text-text">
              VALENTINE
            </div>
            <div className="font-sans text-[0.5rem] tracking-[0.25em] uppercase mt-1 text-gray-500">
              Counseling
            </div>
          </div>
          <h1 className="font-serif text-2xl mb-3">Invitation only</h1>
          <p className="text-gray-600 mb-6 text-sm leading-relaxed">
            The client portal is currently by invitation. Please contact the
            practice to be added as a client.
          </p>
          <a
            href="tel:4356190326"
            className="block text-gold font-bold hover:text-[#8e6b27] mb-2"
          >
            (435) 619-0326
          </a>
          <a
            href="mailto:jillevalentine@gmail.com"
            className="text-gold font-bold hover:text-[#8e6b27] break-all"
          >
            jillevalentine@gmail.com
          </a>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-light flex flex-col items-center justify-center px-6 py-12">

      <Link
        href="/request-appointment"
        className="mb-8 flex items-center gap-2 text-sm font-bold text-gold hover:text-[#8e6b27] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </Link>

      <div className="w-full max-w-2xl bg-white border border-border rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.04)] p-8 sm:p-10">
        <div className="text-center mb-8">
          <div className="font-serif text-3xl tracking-wide text-text">
            VALENTINE
          </div>
          <div className="font-sans text-[0.55rem] tracking-[0.25em] uppercase mt-1 text-gray-500">
            Counseling
          </div>
        </div>

        <h1 className="font-serif text-2xl mb-2 text-center text-text">
          Create your account
        </h1>
        <p className="text-center text-sm text-gray-600 mb-8">
          A few details and you&apos;ll be ready to request a session.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field
              label="First name"
              value={form.first_name}
              onChange={(v) => update("first_name", v)}
              error={fieldErrors.first_name}
              autoComplete="given-name"
            />
            <Field
              label="Last name"
              value={form.last_name}
              onChange={(v) => update("last_name", v)}
              error={fieldErrors.last_name}
              autoComplete="family-name"
            />
          </div>

          <Field
            label="Email"
            type="email"
            value={form.email}
            onChange={(v) => update("email", v)}
            error={fieldErrors.email}
            autoComplete="email"
          />

          <Field
            label="Username"
            value={form.username}
            onChange={(v) => update("username", v)}
            error={fieldErrors.username}
            autoComplete="username"
            hint="Letters, numbers, and @/./+/-/_ only."
          />

          <Field
            label="Phone number"
            type="tel"
            value={form.phone_number}
            onChange={(v) => update("phone_number", v)}
            error={fieldErrors.phone_number}
            autoComplete="tel"
            placeholder="(555) 555-0100"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field
              label="Password"
              type="password"
              value={form.password}
              onChange={(v) => update("password", v)}
              error={fieldErrors.password}
              autoComplete="new-password"
              hint="At least 8 characters."
            />
            <Field
              label="Confirm password"
              type="password"
              value={form.password_confirm}
              onChange={(v) => update("password_confirm", v)}
              error={fieldErrors.password_confirm}
              autoComplete="new-password"
            />
          </div>

          {(error || fieldErrors.non_field_errors) && (
            <div
              role="alert"
              className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-800"
            >
              {error || fieldErrors.non_field_errors}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-gold text-white py-3 px-6 text-sm font-bold tracking-wide hover:bg-[#8e6b27] transition disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="text-gold hover:underline font-bold">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  error,
  type = "text",
  autoComplete,
  placeholder,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  type?: string;
  autoComplete?: string;
  placeholder?: string;
  hint?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-bold mb-1.5 text-text">
        {label}
      </label>
      <input
        type={type}
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className={`w-full rounded-lg border px-4 py-2.5 text-text focus:outline-none focus:ring-2 transition ${
          error
            ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
            : "border-border focus:border-gold focus:ring-gold/20"
        }`}
      />
      {error && <p className="mt-1 text-xs text-red-700">{error}</p>}
      {hint && !error && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
    </div>
  );
}