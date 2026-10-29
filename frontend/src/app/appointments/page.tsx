"use client";

import { useEffect, useMemo, useState } from "react";
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

// ---- Filter tabs ----

type Tab = "requests" | "upcoming" | "past" | "all";

const TABS: { key: Tab; label: string }[] = [
  { key: "requests", label: "Requests" },
  { key: "upcoming", label: "Upcoming" },
  { key: "past", label: "Past" },
  { key: "all", label: "All" },
];

const TAB_DESCRIPTIONS: Record<Tab, string> = {
  requests: "Waiting for confirmation.",
  upcoming: "Confirmed sessions in the future.",
  past: "Completed or confirmed sessions that already happened.",
  all: "Every appointment, including canceled.",
};

function filterByTab(appts: Appointment[], tab: Tab): Appointment[] {
  const now = new Date();
  switch (tab) {
    case "requests":
      return appts.filter((a) => a.status === "REQUESTED");
    case "upcoming":
      return appts.filter(
        (a) =>
          a.status === "CONFIRMED" && new Date(a.start_time) > now,
      );
    case "past":
      return appts.filter(
        (a) =>
          new Date(a.start_time) <= now &&
          (a.status === "CONFIRMED" || a.status === "COMPLETED"),
      );
    case "all":
      return appts;
  }
}

function sortForTab(appts: Appointment[], tab: Tab): Appointment[] {
  const sorted = [...appts];
  if (tab === "requests") {
    // oldest request first — first in, first action
    sorted.sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
    );
  } else if (tab === "past") {
    // newest past session first
    sorted.sort(
      (a, b) =>
        new Date(b.start_time).getTime() - new Date(a.start_time).getTime(),
    );
  } else if (tab === "upcoming") {
    // soonest upcoming first
    sorted.sort(
      (a, b) =>
        new Date(a.start_time).getTime() - new Date(b.start_time).getTime(),
    );
  } else {
    // all — most recent activity first
    sorted.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );
  }
  return sorted;
}

// ---- UI constants ----

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

// ---- Page ----

export default function AppointmentsPage() {
  const router = useRouter();
  const [me, setMe] = useState<Me | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<number | null>(null);
  const [tab, setTab] = useState<Tab>("upcoming");

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
        // Therapist's inbox is the requests queue — default there.
        if (profile.role === "THERAPIST") setTab("requests");
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

  function switchTab(next: Tab) {
    setTab(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Live counts for the tab labels (also proves filters stay in sync as state changes)
  const counts = useMemo(() => {
    const now = new Date();
    return {
      requests: appointments.filter((a) => a.status === "REQUESTED").length,
      upcoming: appointments.filter(
        (a) =>
          a.status === "CONFIRMED" && new Date(a.start_time) > now,
      ).length,
      past: appointments.filter(
        (a) =>
          new Date(a.start_time) <= now &&
          (a.status === "CONFIRMED" || a.status === "COMPLETED"),
      ).length,
      all: appointments.length,
    };
  }, [appointments]);

  const visible = useMemo(
    () => sortForTab(filterByTab(appointments, tab), tab),
    [appointments, tab],
  );

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
                Signed in as <strong className="text-text">{me.username}</strong>
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
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <h1 className="font-serif text-3xl">Your Appointments</h1>
          <button
            onClick={() => router.push("/appointments/new")}
            className="flex items-center gap-2 bg-gold text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-[#8e6b27] transition"
          >
            <Plus className="w-4 h-4" /> New appointment
          </button>
        </div>

        {appointments.length > 0 && (
          <>
            <div className="flex flex-wrap gap-2 mb-2">
              {TABS.map((t) => {
                const active = tab === t.key;
                return (
                  <button
                    key={t.key}
                    onClick={() => switchTab(t.key)}
                    className={`px-4 py-2 rounded-full text-sm font-bold transition ${
                      active
                        ? "bg-gold text-white"
                        : "bg-white border border-border text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {t.label}
                    {counts[t.key] > 0 && (
                      <span
                        className={`ml-2 inline-flex items-center justify-center min-w-[1.25rem] h-5 rounded-full text-xs px-1.5 ${
                          active
                            ? "bg-white/25 text-white"
                            : "bg-gold/15 text-gold"
                        }`}
                      >
                        {counts[t.key]}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-gray-500 mb-6">
              {TAB_DESCRIPTIONS[tab]}
            </p>
          </>
        )}

        {error && (
          <div
            role="alert"
            className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-800 mb-6"
          >
            {error}
          </div>
        )}

        {visible.length === 0 ? (
          <EmptyState tab={tab} hasAnyAppointments={appointments.length > 0} />
        ) : (
          <ul className="space-y-4">
            {visible.map((a) => {
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

function EmptyState({
  tab,
  hasAnyAppointments,
}: {
  tab: Tab;
  hasAnyAppointments: boolean;
}) {
  const copy: Record<Tab, { title: string; body: string }> = {
    requests: {
      title: "All caught up",
      body: "No pending requests to act on right now.",
    },
    upcoming: {
      title: "No upcoming sessions",
      body: "Confirmed sessions will appear here once they're booked.",
    },
    past: {
      title: "No past sessions yet",
      body: "Sessions that have already happened will appear here.",
    },
    all: {
      title: "No appointments yet",
      body: "When you book a session, it'll appear here.",
    },
  };

  const { title, body } = hasAnyAppointments
    ? copy[tab]
    : copy.all;

  return (
    <div className="bg-white border border-border rounded-2xl p-12 text-center">
      <CalendarDays className="w-12 h-12 text-gold mx-auto mb-4" />
      <h2 className="font-serif text-2xl mb-2">{title}</h2>
      <p className="text-gray-600">{body}</p>
    </div>
  );
}