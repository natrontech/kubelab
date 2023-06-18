import { writable, type Writable } from "svelte/store";

export const loadingLabs: Writable<string[]> = writable<string[]>([]);
export const loadingExercises: Writable<string[]> = writable<string[]>([]);
