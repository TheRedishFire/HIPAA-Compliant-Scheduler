"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CalendarDays } from "lucide-react";
import {
  Me,
  createAppointment,
  getMe,
  getToken,
} from "../../../lib/api";

const DURATIONS = [50, 60, 75, 90];

function todayString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export default function NewAppointmentPage() {
  const router = useRouter();
  const [me, setMe] = useState<Me | null>(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState(50);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!getToken()) {
      router.push("/login");
      return;
    }
    (async () => {
      try {
        const profile = await getMe();
        setMe(profile);
      } catch {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (!date || !time) {
      setError("Please pick a date and time.");
      return;
    }

    // Build LOCAL Date objects, then serialize as UTC.
    // Example: user in MST picks 2:00 PM → sent as 21:00 UTC.
    const [year, month, day] = date.split("-").map(Number);
    const [hour, minute] = time.split(":").map(Number);
    const startLocal = new Date(year, month - 1, day, hour, minute, 0, 0);
    const endLocal = new Date(startLocal.getTime() + duration * 60 * 1000);

    if (startLocal <= new Date()) {
      setError("Please pick a time in the future.");
      return;
    }

    setSubmitting(true);
    try {
      await createAppointment({
        start_time: startLocal.toISOString(),
        end_time: endLocal.toISOString(),
      });
      router.push("/appointments");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not book appointment.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-light flex items-center justify-center">
        <p className="text-gray-500">Loading…</p>
      </div>
    );
  }

  // Therapists can't book for clients through this page yet (see notes below).
  if (me?.role === "THERAPIST") {
    return (
      <div className="min-h-screen bg-light">
        <header className="bg-white border-b border-border px-6 py-5">
          <div className="max-w-2xl mx-auto">
            <Link
              href="/appointments"
              className="flex items-center gap-2 text-sm font-bold text-gold hover:text-[#8e6b27]"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </Link>
          </div>
        </header>
        <main className="max-w-lg mx-auto px-6 py-16">
          <div className="bg-white border border-border rounded-2xl p-8 text-center">
            <h1 className="font-serif text-2xl mb-3">Booking on behalf of a client</h1>
            <p className="text-gray-600 mb-6">
              To schedule a session for a specific client, please contact them
              directly for now. Self-service booking for therapists is coming soon.
            </p>
            <Link
              href="/appointments"
              className="text-gold font-bold hover:underline"
            >
              Back to appointments
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light text-text">
      <header className="bg-white border-b border-border px-6 py-5">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link
            href="/appointments"
            className="flex items-center gap-2 text-sm font-bold text-gold hover:text-[#8e6b27] transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
          <div className="flex flex-col items-end">
            <span className="font-serif text-xl leading-none tracking-wide">
              VALENTINE
            </span>
            <span className="text-[0.55rem] tracking-[0.25em] uppercase mt-1 text-gray-500">
              Counseling
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-10">
        <div className="bg-white border border-border rounded-2xl p-8 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
          <h1 className="font-serif text-3xl mb-2">Request a session</h1>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Pick a time that works for you. Jill will confirm within one
            business day.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold mb-1.5">Date</label>
              <div className="relative">
                <CalendarDays className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  type="date"
                  required
                  min={todayString()}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-lg border border-border pl-10 pr-4 py-2.5 text-text focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold mb-1.5">
                  Start time
                </label>
                <input
                  type="time"
                  required
                  step={1800}
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full rounded-lg border border-border px-4 py-2.5 text-text focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1.5">
                  Duration
                </label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full rounded-lg border border-border px-4 py-2.5 text-text focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 transition bg-white"
                >
                  {DURATIONS.map((d) => (
                    <option key={d} value={d}>
                      {d} minutes
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {error && (
              <div
                role="alert"
                className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-800"
              >
                {error}
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-full bg-gold text-white py-3 px-6 text-sm font-bold tracking-wide hover:bg-[#8e6b27] transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Sending request…" : "Request appointment"}
              </button>
            </div>
          </form>

          <p className="mt-6 text-center text-xs text-gray-500 leading-relaxed">
            You&apos;ll see this request in your portal with status{" "}
            <strong>Requested</strong> until Jill confirms.
          </p>
        </div>
      </main>
    </div>
  );
}