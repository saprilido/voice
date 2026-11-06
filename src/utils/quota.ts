// Penghubung sederhana: komponen mana pun bisa memunculkan popup "Kuota habis".
export const QUOTA_EVENT = 'voice:quota-exhausted';

export function notifyQuotaExhausted(): void {
  window.dispatchEvent(new Event(QUOTA_EVENT));
}
