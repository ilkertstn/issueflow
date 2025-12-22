/**
 * firebase.ts
 *
 * Server / build-safe stub.
 * This file must NEVER initialize Firebase.
 * It exists only to prevent SSR / CI / prerender crashes.
 *
 * All real Firebase usage must come from `firebase.client.ts`.
 */

export const app = null;
export const auth = null;
export const db = null;
export const rtdb = null;
export const remoteConfig = null;
