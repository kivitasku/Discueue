export interface RegisterResponse {
  id?: number;
  username?: string;
  message?: string;
  error?: string;
}

export async function registerUser(
  username: string,
  password: string
): Promise<RegisterResponse> {
  const response = await fetch("/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      username,
      password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error ?? "Registration failed");
  }

  return data;
}


export interface LoginResponse {
  id?: number;
  username?: string;
  message?: string;
  error?: string;
}

export async function loginUser(
  username: string,
  password: string
): Promise<LoginResponse> {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      username,
      password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error ?? "Login failed");
  }

  return data;
}

export async function getCurrentUser() {
  const response = await fetch("/api/auth/me", {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Authentication failed");
  }

  return response.json();
}

export async function getRecentAlbums() {
  const response = await fetch("/api/auth/recent-albums", {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch recent albums");
  }

  return response.json();
}

export async function logoutUser() {
  const response = await fetch("/api/auth/logout", {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Logout failed");
  }

  return response.json();
}