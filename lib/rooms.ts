export function generateRoomId(): string {
  return Math.random().toString(36).substring(2, 9).toUpperCase();
}

export function getRoomFromUrl(): string | null {
  if (typeof window === 'undefined') return null;
  const params = new URLSearchParams(window.location.search);
  return params.get('room');
}

export function setRoomInUrl(room: string): void {
  if (typeof window === 'undefined') return;
  const url = new URL(window.location.href);
  url.searchParams.set('room', room);
  window.history.replaceState({}, '', url.toString());
}

export function getRoomUrl(room: string): string {
  if (typeof window === 'undefined') return '';
  const url = new URL(window.location.href);
  url.searchParams.set('room', room);
  return url.toString();
}
