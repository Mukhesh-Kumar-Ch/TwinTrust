// Minimal API service wrapper placeholder
export const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export async function post(path: string, body: any) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return res.json();
}
