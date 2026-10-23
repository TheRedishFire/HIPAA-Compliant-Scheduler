"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { login, setToken } from "../../lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const token = await login(username.trim(), password);
      setToken(token);
      router.push("/appointments");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-light flex flex-col items-center justify-center px-6 py-12">
      <Link
        href="/"
        className="mb-12 flex items-center gap-2 text-sm font-bold text-gold hover:text-[#8e6b27] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to site
      </Link>

      <div className="w-full max-w-md bg-white border border-border rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.04)] p-8 sm:p-10">
        <div className="text-center mb-8">
          <div className="font-serif text-3xl tracking-wide text-text">
            VALENTINE
          </div>
          <div className="font-sans text-[0.55rem] tracking-[0.25em] uppercase mt-1 text-gray-500">
            Counseling
          </div>
        </div>

        <h1 className="font-serif text-2xl mb-6 text-center text-text">
          Sign in to your portal
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-1.5 text-text">
              Username
            </label>
            <input
              type="text"
              autoComplete="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-lg border border-border px-4 py-2.5 text-text focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-1.5 text-text">
              Password
            </label>
            <input
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-border px-4 py-2.5 text-text focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 transition"
            />
          </div>

          {error && (
            <div
              role="alert"
              className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-800"
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-gold text-white py-3 px-6 text-sm font-bold tracking-wide hover:bg-[#8e6b27] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Forgot your password?{" "}
          <a href="mailto:jillevalentine@gmail.com" className="text-gold hover:underline">
            Contact us
          </a>
        </p>
      </div>
    </div>
  );
}