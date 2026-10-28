"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, Clock, LogOut, Plus } from "lucide-react";
import {
  Appointment,
  Me,
  clearToken,
  getAppointments,
  getMe,
  getToken,
  updateAppointment,
} from "../../lib/api";

const STATUS_STYLES: Record<Appointment["status"], string> = {
  REQUESTED: "bg-amber-100 text-amber-800 border-amber-200",
  CONFIRMED: "bg-green-100 text-green-800 border-green-200",
  CANCELED: "bg-gray-100 text-gray-600 border-gray-200",
  COMPLETED: "bg-blue-100 text-blue-800 border-blue-200",
};

const STATUS_LABELS: Record<Appointment["status"], string> = {
  REQUESTED: "Requested",
  CONFIRMED: "Confirmed",
  CANCELED: "Canceled",
  COMPLETED: "Completed",
};

function formatRange(start: string, end: string) {
  const s = new Date(start);
  const e = new Date(end);
  const day = s.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const timeOpts: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "2-digit",
  };
  return {
    day,
    time: `${s.toLocaleTimeString("en-US", timeOpts)} – ${e.toLocaleTimeString("en-US", timeOpts)}`,
  };
}

export default function AppointmentsPage() {
  const router = useRouter();
  const [me, setMe] = useState<Me | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<number | null>(null);

  useEffect(() => {
    if (!getToken()) {
      router.push("/login");
      return;
    }
    (async () => {
      try {
        const [profile, appts] = await Promise.all([
          getMe(),
          getAppointments(),
        ]);
        setMe(profile);
        setAppointments(appts);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to load.";
        if (msg.toLowerCase().includes("session")) {
          router.push("/login");
        } else {
          setError(msg);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  async function changeStatus(id: number, status: Appointment["status"]) {
    setBusyId(id);
    setError("");
    try {
      const updated = await updateAppointment(id, { status });
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? updated : a)),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed.");
    } finally {
      setBusyId(null);
    }
  }

  function handleLogout() {
    clearToken();
    router.push("/login");
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-light flex items-center justify-center">
        <p className="text-gray-500">Loading…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light text-text">
      <header className="bg-white border-b border-border px-6 sm:px-8 py-5">
        
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-serif text-xl leading-none tracking-wide">
              VALENTINE
            </span>
            <span className="text-[0.55rem] tracking-[0.25em] uppercase mt-1 text-gray-500">
              Counseling
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            {me && (
              <span className="text-gray-600 hidden sm:inline">
                Signed in as{" "}
                <strong className="text-text">{me.username}</strong>
              </span>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-gold hover:text-[#8e6b27] font-bold transition"
            >
              <LogOut className="w-4 h-4" /> Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <h1 className="font-serif text-3xl">Your Appointments</h1>
          <button
            onClick={() => router.push("/appointments/new")}
            className="flex items-center gap-2 bg-gold text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-[#8e6b27] transition"
          >
            <Plus className="w-4 h-4" /> New appointment
          </button>
        </div>

        {error && (
          <div
            role="alert"
            className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-800 mb-6"
          >
            {error}
          </div>
        )}

        {appointments.length === 0 ? (
          <div className="bg-white border border-border rounded-2xl p-12 text-center">
            <CalendarDays className="w-12 h-12 text-gold mx-auto mb-4" />
            <h2 className="font-serif text-2xl mb-2">No appointments yet</h2>
            <p className="text-gray-600">
              When you book a session, it&apos;ll appear here.
            </p>
          </div>
        ) : (
          <ul className="space-y-4">
            {appointments.map((a) => {
              const { day, time } = formatRange(a.start_time, a.end_time);
              const otherParty =
                me?.role === "THERAPIST" ? a.client_name : a.therapist_name;
              const otherLabel =
                me?.role === "THERAPIST" ? "with client" : "with";
              const isBusy = busyId === a.id;

              return (
                <li
                  key={a.id}
                  className={`bg-white border border-border rounded-xl p-6 shadow-[0_2px_10px_rgb(0,0,0,0.03)] transition ${isBusy ? "opacity-60" : ""}`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                        <CalendarDays className="w-4 h-4 shrink-0" />
                        {day}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                        <Clock className="w-4 h-4 shrink-0" />
                        {time}
                      </div>
                      <p className="text-lg">
                        <span className="text-gray-500 text-sm">
                          {otherLabel}{" "}
                        </span>
                        <strong className="font-serif">{otherParty}</strong>
                      </p>
                    </div>
                    <span
                      className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${STATUS_STYLES[a.status]}`}
                    >
                      {STATUS_LABELS[a.status]}
                    </span>
                  </div>

                  <div className="mt-4 pt-4 border-t border-border flex flex-wrap gap-2">
                    {me?.role === "CLIENT" && a.status === "REQUESTED" && (
                      <button
                        onClick={() => changeStatus(a.id, "CANCELED")}
                        disabled={isBusy}
                        className="text-sm font-bold text-gray-600 hover:text-red-700 transition disabled:opacity-50"
                      >
                        Cancel request
                      </button>
                    )}
                    {me?.role === "THERAPIST" && a.status === "REQUESTED" && (
                      <>
                        <button
                          onClick={() => changeStatus(a.id, "CONFIRMED")}
                          disabled={isBusy}
                          className="text-sm font-bold bg-green-600 text-white px-4 py-1.5 rounded-full hover:bg-green-700 transition disabled:opacity-50"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => changeStatus(a.id, "CANCELED")}
                          disabled={isBusy}
                          className="text-sm font-bold text-gray-600 hover:text-red-700 transition disabled:opacity-50"
                        >
                          Decline
                        </button>
                      </>
                    )}
                    {me?.role === "THERAPIST" && a.status === "CONFIRMED" && (
                      <>
                        <button
                          onClick={() => changeStatus(a.id, "COMPLETED")}
                          disabled={isBusy}
                          className="text-sm font-bold bg-blue-600 text-white px-4 py-1.5 rounded-full hover:bg-blue-700 transition disabled:opacity-50"
                        >
                          Mark complete
                        </button>
                        <button
                          onClick={() => changeStatus(a.id, "CANCELED")}
                          disabled={isBusy}
                          className="text-sm font-bold text-gray-600 hover:text-red-700 transition disabled:opacity-50"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </main>
    </div>
  );
}