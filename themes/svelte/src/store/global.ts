import { writable } from 'svelte/store';

export const gStore = writable<any>({});

export const gLoading = writable(false);
