import { writable } from 'svelte/store';

export const route = writable();
export const path = writable();
export const params = writable();
export const user = writable();
export const extra = writable();

