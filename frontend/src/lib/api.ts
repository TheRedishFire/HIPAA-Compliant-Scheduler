const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

const TOKEN_KEY = "auth_token";

export type Appointment = {
  id: number;
  therapist: number;
  client: number;
  start_time: string;
  end_time: string;
  status: "REQUESTED" | "CONFIRMED" | "CANCELED" | "COMPLETED";
  created_at: string;
};

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  window.localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  window.localStorage.removeItem(TOKEN_KEY);
}

export async function login(
  username: string,
  password: string,
): Promise<string> {
  const res = await fetch(`${API_URL}/api-token-auth/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (res.status === 429) {
    throw new Error("Too many attempts. Please wait a minute and try again.");
  }
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.detail || "Invalid username or password.");
  }

  const data: { token: string } = await res.json();
  return data.token;
}

export async function getAppointments(): Promise<Appointment[]> {
  const token = getToken();
  if (!token) throw new Error("Not logged in.");

  const res = await fetch(`${API_URL}/api/appointments/`, {
    headers: { Authorization: `Token ${token}` },
  });

  if (res.status === 401) {
    clearToken();
    throw new Error("Session expired. Please log in again.");
  }
  if (!res.ok) throw new Error("Failed to load appointments.");

  return res.json();
}