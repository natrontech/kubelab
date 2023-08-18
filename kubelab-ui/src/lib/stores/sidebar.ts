import type { ExerciseSessionsResponse, ExercisesResponse, LabSessionsResponse, LabsResponse } from "$lib/pocketbase/generated-types";
import { writable, type Writable } from "svelte/store";

export const sidebarOpen: Writable<boolean> = writable<boolean>(false);
export const sidebar_lab: Writable<LabsResponse> = writable<LabsResponse>();
export const sidebar_lab_session: Writable<LabSessionsResponse> = writable<LabSessionsResponse>();
export const sidebar_exercises: Writable<ExercisesResponse[]> = writable<ExercisesResponse[]>([]);
export const sidebar_exercise_sessions: Writable<ExerciseSessionsResponse[]> = writable<ExerciseSessionsResponse[]>([]);
