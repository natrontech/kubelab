import { writable, type Writable } from "svelte/store";

export const loadingLabs: Writable<Set<string>> = writable<Set<string>>(new Set());
export const loadingExercises: Writable<Set<string>> = writable<Set<string>>(new Set());
