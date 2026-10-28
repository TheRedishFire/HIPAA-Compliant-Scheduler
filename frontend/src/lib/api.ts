const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

const TOKEN_KEY = "auth_token";

export type Appointment = {
  id: number;
  therapist: number;
  therapist_name: string;
  client: number;
  client_name: string;
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

export type Me = {
  id: number;
  username: string;
  role: "THERAPIST" | "CLIENT";
  first_name: string;
  last_name: string;
};

export async function getMe(): Promise<Me> {
  const token = getToken();
  if (!token) throw new Error("Not logged in.");
  const res = await fetch(`${API_URL}/api/me/`, {
    headers: { Authorization: `Token ${token}` },
  });
  if (res.status === 401) {
    clearToken();
    throw new Error("Session expired. Please log in again.");
  }
  if (!res.ok) throw new Error("Failed to load your profile.");
  return res.json();
}

export async function updateAppointment(
  id: number,
  data: { status?: Appointment["status"] },
): Promise<Appointment> {
  const token = getToken();
  if (!token) throw new Error("Not logged in.");
  const res = await fetch(`${API_URL}/api/appointments/${id}/`, {
    method: "PATCH",
    headers: {
      Authorization: `Token ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (res.status === 401) {
    clearToken();
    throw new Error("Session expired. Please log in again.");
  }
  if (res.status === 403) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.detail || "You don't have permission for that.");
  }
  if (!res.ok) throw new Error("Failed to update appointment.");
  return res.json();
}

export async function register(data: {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  password: string;
  password_confirm: string;
}): Promise<string> {
  const res = await fetch(`${API_URL}/api/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (res.status === 429) {
    throw new Error("Too many signup attempts. Please try again later.");
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const err = new Error(
      typeof body.detail === "string"
        ? body.detail
        : "Please fix the errors below.",
    ) as Error & { fields?: Record<string, string | string[]> };
    err.fields = body;
    throw err;
  }

  const result: { token: string } = await res.json();
  return result.token;
}

export async function createAppointment(data: {
  start_time: string;
  end_time: string;
}): Promise<Appointment> {
  const token = getToken();
  if (!token) throw new Error("Not logged in.");

  const res = await fetch(`${API_URL}/api/appointments/`, {
    method: "POST",
    headers: {
      Authorization: `Token ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (res.status === 401) {
    clearToken();
    throw new Error("Session expired. Please log in again.");
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const msg =
      body.detail ||
      (Array.isArray(body.non_field_errors) && body.non_field_errors.join(" ")) ||
      "Could not create appointment.";
    throw new Error(msg);
  }

  return res.json();
}