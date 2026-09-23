// ==========================================================
// Single source of truth for every frontend -> backend call.
// ==========================================================

// In production (single Render service) the API is same-origin, so "/api" works
// without needing an env var. In local dev, Vite's proxy (see vite.config.js)
// also makes "/api" reach the server on :5000 — set VITE_API_URL only if you
// need to point the frontend at a different backend.
const API_URL = import.meta.env.VITE_API_URL || "/api";

function getToken() {
  return localStorage.getItem("rmu_src_admin_token");
}

export function setToken(token) {
  if (token) localStorage.setItem("rmu_src_admin_token", token);
  else localStorage.removeItem("rmu_src_admin_token");
}

async function request(path, { method = "GET", body, isForm = false, auth = false } = {}) {
  const headers = {};
  if (!isForm) headers["Content-Type"] = "application/json";
  if (auth) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? (isForm ? body : JSON.stringify(body)) : undefined,
  });

  let data = null;
  const text = await res.text();
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!res.ok) {
    const message = (data && data.error) || res.statusText || "Request failed";
    throw new Error(message);
  }
  return data;
}

/* ---------------- Auth ---------------- */
export const authApi = {
  login: (email, password) => request("/auth/login", { method: "POST", body: { email, password } }),
  me: () => request("/auth/me", { auth: true }),
  forgotPassword: (email) => request("/auth/forgot-password", { method: "POST", body: { email } }),
  resetPassword: (token, password) => request("/auth/reset-password", { method: "POST", body: { token, password } }),
};

/* ---------------- Executives ---------------- */
export const executivesApi = {
  list: () => request("/executives"),
  create: (data) => request("/executives", { method: "POST", body: data, auth: true }),
  update: (id, data) => request(`/executives/${id}`, { method: "PUT", body: data, auth: true }),
  remove: (id) => request(`/executives/${id}`, { method: "DELETE", auth: true }),
};

/* ---------------- News ---------------- */
export const newsApi = {
  list: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/news${qs ? `?${qs}` : ""}`);
  },
  get: (slug) => request(`/news/${slug}`),
  create: (data) => request("/news", { method: "POST", body: data, auth: true }),
  update: (id, data) => request(`/news/${id}`, { method: "PUT", body: data, auth: true }),
  remove: (id) => request(`/news/${id}`, { method: "DELETE", auth: true }),
};

/* ---------------- Events ---------------- */
export const eventsApi = {
  list: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/events${qs ? `?${qs}` : ""}`);
  },
  get: (id) => request(`/events/${id}`),
  create: (data) => request("/events", { method: "POST", body: data, auth: true }),
  update: (id, data) => request(`/events/${id}`, { method: "PUT", body: data, auth: true }),
  remove: (id) => request(`/events/${id}`, { method: "DELETE", auth: true }),
};

/* ---------------- Marketplace ---------------- */
export const marketplaceApi = {
  list: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/marketplace${qs ? `?${qs}` : ""}`);
  },
  get: (id) => request(`/marketplace/${id}`),
  create: (data) => request("/marketplace", { method: "POST", body: data, auth: true }),
  update: (id, data) => request(`/marketplace/${id}`, { method: "PUT", body: data, auth: true }),
  remove: (id) => request(`/marketplace/${id}`, { method: "DELETE", auth: true }),
};

/* ---------------- Orders / Paystack checkout ---------------- */
export const ordersApi = {
  init: (data) => request("/orders/init", { method: "POST", body: data }),
  verify: (data) => request("/orders/verify", { method: "POST", body: data }),
  list: () => request("/orders", { auth: true }),
};

/* ---------------- Contact ---------------- */
export const contactApi = {
  send: (data) => request("/contact", { method: "POST", body: data }),
  list: () => request("/contact", { auth: true }),
  markRead: (id) => request(`/contact/${id}/read`, { method: "PUT", auth: true }),
  remove: (id) => request(`/contact/${id}`, { method: "DELETE", auth: true }),
};

/* ---------------- Settings / partners / services / constitution ---------------- */
export const settingsApi = {
  get: () => request("/settings"),
  set: (key, value) => request(`/settings/${key}`, { method: "PUT", body: { value }, auth: true }),

  partners: {
    list: () => request("/settings/partners/list"),
    create: (data) => request("/settings/partners", { method: "POST", body: data, auth: true }),
    remove: (id) => request(`/settings/partners/${id}`, { method: "DELETE", auth: true }),
  },
  services: {
    list: () => request("/settings/services/list"),
    create: (data) => request("/settings/services", { method: "POST", body: data, auth: true }),
    remove: (id) => request(`/settings/services/${id}`, { method: "DELETE", auth: true }),
  },
  constitution: {
    current: () => request("/settings/constitution/current"),
    create: (data) => request("/settings/constitution", { method: "POST", body: data, auth: true }),
  },
};

/* ---------------- Upload ---------------- */
export const uploadApi = {
  file: (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return request("/upload", { method: "POST", body: formData, isForm: true, auth: true });
  },
};

export default {
  authApi,
  executivesApi,
  newsApi,
  eventsApi,
  marketplaceApi,
  ordersApi,
  contactApi,
  settingsApi,
  uploadApi,
};
