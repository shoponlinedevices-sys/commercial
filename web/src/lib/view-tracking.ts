import { GATEWAY_URL } from './api-config';

export type TrackedEntityType = 'category' | 'brand' | 'product';

const CONSENT_KEY = 'commercial_view_tracking_consent';
const VISITOR_ID_KEY = 'commercial_view_tracking_visitor_id';
const SESSION_ID_KEY = 'commercial_view_tracking_session_id';

export function getViewTrackingConsent(): 'granted' | 'declined' | null {
  if (typeof window === 'undefined') return null;
  const value = window.localStorage.getItem(CONSENT_KEY);
  return value === 'granted' || value === 'declined' ? value : null;
}

export function setViewTrackingConsent(consent: 'granted' | 'declined') {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(CONSENT_KEY, consent);
  if (consent === 'declined') {
    window.localStorage.removeItem(VISITOR_ID_KEY);
    window.sessionStorage.removeItem(SESSION_ID_KEY);
  }
  window.dispatchEvent(new Event('commercial-view-tracking-consent'));
}

function createId(): string {
  if (typeof window.crypto.randomUUID === 'function') return window.crypto.randomUUID();
  const bytes = new Uint8Array(16);
  window.crypto.getRandomValues(bytes);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function getOrCreateId(storage: Storage, key: string): string {
  const existing = storage.getItem(key);
  if (existing) return existing;
  const id = createId();
  storage.setItem(key, id);
  return id;
}

function safePageUrl(value: string): string {
  try {
    const url = new URL(value);
    return `${url.origin}${url.pathname}`.slice(0, 1000);
  } catch {
    return '';
  }
}

export function recordViewEvent(entityType: TrackedEntityType, entityId: number | string) {
  if (typeof window === 'undefined' || getViewTrackingConsent() !== 'granted') return;
  const normalizedId = String(entityId);
  if (!/^[1-9]\d{0,19}$/.test(normalizedId)) return;

  const body = {
    entityType,
    entityId: normalizedId,
    visitorId: getOrCreateId(window.localStorage, VISITOR_ID_KEY),
    sessionId: getOrCreateId(window.sessionStorage, SESSION_ID_KEY),
    pageUrl: safePageUrl(window.location.href),
    referrerUrl: safePageUrl(document.referrer),
  };
  const token = window.localStorage.getItem('access_token');
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  void fetch(`${GATEWAY_URL}/view-events`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
    keepalive: true,
    cache: 'no-store',
  }).then((response) => {
    if (!response.ok) console.warn('View event could not be recorded');
  }).catch(() => {
    console.warn('View event could not be recorded');
  });
}
