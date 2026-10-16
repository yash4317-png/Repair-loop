const TOKEN_KEY = 'repairloop_token_v4';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> | undefined)
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(path, { ...options, headers });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.error || `Request failed (${response.status})`);
  }
  return payload as T;
}

export const api = {
  health: () => request<{ ok: boolean }>('/api/health'),
  login: (email: string, password: string) =>
    request<any>('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  register: (data: { name: string; email: string; password: string; role: string }) =>
    request<any>('/api/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  demo: (body: { email?: string; userId?: string }) =>
    request<any>('/api/auth/demo', { method: 'POST', body: JSON.stringify(body) }),
  me: () => request<any>('/api/auth/me'),
  bootstrap: () => request<any>('/api/bootstrap'),
  createInspection: (data: unknown) =>
    request<any>('/api/inspections', { method: 'POST', body: JSON.stringify(data) }),
  createOffer: (data: unknown) =>
    request<any>('/api/offers', { method: 'POST', body: JSON.stringify(data) }),
  acceptOffer: (offerId: string, inspectionId: string) =>
    request<any>(`/api/offers/${offerId}/accept`, { method: 'POST', body: JSON.stringify({ inspectionId }) }),
  createQuickRequest: (data: unknown) =>
    request<any>('/api/quick-requests', { method: 'POST', body: JSON.stringify(data) }),
  assignTechnician: (inspectionId: string, technicianId: string, taskDescription?: string) =>
    request<any>(`/api/inspections/${inspectionId}/assign-technician`, {
      method: 'POST',
      body: JSON.stringify({ technicianId, taskDescription })
    }),
  addInventoryPart: (data: unknown) =>
    request<any>('/api/inventory', { method: 'POST', body: JSON.stringify(data) }),
  updateInventoryStock: (partId: string, quantityChange: number) =>
    request<any>(`/api/inventory/${partId}/stock`, { method: 'PATCH', body: JSON.stringify({ quantityChange }) }),
  resetDemo: () => request<any>('/api/demo/reset', { method: 'POST' })
};
