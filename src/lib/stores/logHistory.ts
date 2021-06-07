import { writable } from 'svelte/store';

function createLogHistoryStore() {
	const { subscribe, update } = writable(
		new Map<string, [modificationDurations: number[], lastModified: number]>()
	);

	return {
		subscribe,
		addKey: (key: string, val: [md: number[], lm: number]) => {
			update((map) => map.set(key, val));
		}
	};
}

export const logHistory = createLogHistoryStore();
