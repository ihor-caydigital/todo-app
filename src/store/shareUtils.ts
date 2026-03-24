import type { SharePayload } from '../types';

const SHARE_PARAM = 'share';

export const encodeSharePayload = (payload: SharePayload): string => {
  const json = JSON.stringify(payload);
  const bytes = new TextEncoder().encode(json);
  let binary = '';
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary);
};

export const decodeSharePayload = (token: string): SharePayload | null => {
  try {
    const binary = atob(token);
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    const json = new TextDecoder().decode(bytes);
    const parsed = JSON.parse(json) as Record<string, unknown>;
    if (!parsed || typeof parsed !== 'object') return null;
    if (!('list' in parsed) || !('permission' in parsed)) return null;
    return parsed as unknown as SharePayload;
  } catch {
    return null;
  }
};

export const buildShareUrl = (payload: SharePayload): string => {
  const url = new URL(window.location.href);
  url.search = '';
  url.hash = '';
  url.searchParams.set(SHARE_PARAM, encodeSharePayload(payload));
  return url.toString();
};

export const getSharePayloadFromUrl = (): SharePayload | null => {
  const params = new URLSearchParams(window.location.search);
  const token = params.get(SHARE_PARAM);
  if (!token) return null;
  return decodeSharePayload(token);
};

export const clearShareParam = (): void => {
  const url = new URL(window.location.href);
  url.searchParams.delete(SHARE_PARAM);
  window.history.replaceState(null, '', url.toString());
};
