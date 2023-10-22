import { client } from "$lib/pocketbase";
import type {
    ExerciseSessionLogsResponse,
    ExerciseSessionsResponse,
    ExercisesResponse,
    LabSessionsResponse,
    LabsResponse
} from "$lib/pocketbase/generated-types";
import { get, writable, type Writable } from "svelte/store";

export const lab: Writable<LabsResponse> = writable<LabsResponse>();
export const labs: Writable<LabsResponse[]> = writable<LabsResponse[]>();
export const lab_session: Writable<LabSessionsResponse> = writable<LabSessionsResponse>();
export const lab_sessions: Writable<LabSessionsResponse[]> = writable<LabSessionsResponse[]>();
export const exercise: Writable<ExercisesResponse> = writable<ExercisesResponse>();
export const exercises: Writable<ExercisesResponse[]> = writable<ExercisesResponse[]>();
export const exercise_session: Writable<ExerciseSessionsResponse> =
    writable<ExerciseSessionsResponse>();
export const exercise_sessions: Writable<ExerciseSessionsResponse[]> =
    writable<ExerciseSessionsResponse[]>();
export const exercise_session_logs: Writable<ExerciseSessionLogsResponse[]> = writable<ExerciseSessionLogsResponse[]>();

export async function getLabSession(labId: string) {
    return get(labs).find((lab) => lab.id === labId);
}

export async function getLabSessionsByLab(labId: string) {
    return get(lab_sessions).filter((lab_session) => lab_session.lab === labId);
}

export function filterExerciseSessionsByLab(labId: string) {
    const filtered_exercises = get(exercises).filter((exercise) => exercise.lab === labId);
    // exercise_sessions.exercise is a reference to the exercise id, by filtered exercises
    const filtered_exercise_sessions = get(exercise_sessions).filter((exercise_session) =>
        filtered_exercises.find((exercise) => exercise.id == exercise_session.exercise)
    );

    exercise_sessions.set(filtered_exercise_sessions);
}

export function filterExercisesByLab(labId: string) {
    const filtered_exercises = get(exercises).filter((exercise) => exercise.lab === labId);
    exercises.set(filtered_exercises);
}

export function getExerciseSessionByExercise(exerciseId: string) {
    return get(exercise_sessions).find(
        (exercise_session) => exercise_session.exercise === exerciseId
    );
}

export function checkIfExerciseIsDone(exercise_id: string) {
    const temp_exercise_session = getExerciseSessionByExercise(exercise_id);
    if (temp_exercise_session) {
        return temp_exercise_session.endTime;
    }
    return false;
}

export async function setExerciseByExerciseSession(exerciseSessionId: string) {
    if (exercises === undefined) {
        return;
    }
    // set exercise by exercise_session
    const filtered_exercise = get(exercises).find(
        (exercise_session) => exercise_session.id === exerciseSessionId
    );

    if (filtered_exercise === undefined) {
        return;
    }

    exercise.set(filtered_exercise as ExercisesResponse);
}

export async function setExerciseSessionByExercise(exerciseId: string) {
    if (exercise_sessions === undefined) {
        return;
    }
    // set exercise_session by exercise
    const filtered_exercise_session = get(exercise_sessions).find(
        (exercise_session) => exercise_session.exercise === exerciseId
    );

    if (filtered_exercise_session === undefined) {
        return;
    }

    exercise_session.set(filtered_exercise_session as ExerciseSessionsResponse);
}

export enum UpdateFilterEnum {
    ALL = "all",
    ExercisesByLab = "exercises_by_lab"
}

export interface UpdateFilter {
    filter: UpdateFilterEnum;
    labId?: string;
}

export async function updateDataStores(filter: UpdateFilter = { filter: UpdateFilterEnum.ALL }) {
    // get labs and set labs store
    await client
        .collection("labs")
        .getFullList()
        .then((response: unknown) => {
            labs.set(response as LabsResponse[]);
            return response;
        })
        .catch((error: unknown) => {
            console.log(error);
        });

    // get lab_sessions and set lab_sessions store
    await client
        .collection("lab_sessions")
        .getFullList(200, {
            expand: "lab"
        })
        .then((response: unknown) => {
            lab_sessions.set(response as LabSessionsResponse[]);
            return response;
        })
        .catch((error: unknown) => {
            console.log(error);
        });

    if (get(lab_sessions).length < get(labs).length) {
        // only create lab_sessions for labs that are not already in lab_sessions
        const filtered_labs = get(labs).filter(
            (lab) => !get(lab_sessions).find((lab_session) => lab_session.lab === lab.id)
        );

        for (const lab of filtered_labs) {
            const data = {
                user: client.authStore.model?.id,
                lab: lab.id,
                clusterRunning: false
            };
            const record: LabSessionsResponse = await client
                .collection("lab_sessions")
                .create(data);
            // update lab_sessions
            lab_sessions.update((lab_sessions) => [...lab_sessions, record]);
        }
    }

    // get exercises and set exercises store
    await client
        .collection("exercises")
        .getFullList()
        .then((response: unknown) => {
            if (filter.filter === UpdateFilterEnum.ExercisesByLab) {
                const filtered_exercises = (response as ExercisesResponse[]).filter(
                    (exercise) => exercise.lab === filter.labId
                );
                exercises.set(filtered_exercises);
            }
            if (filter.filter === UpdateFilterEnum.ALL) {
                exercises.set(response as ExercisesResponse[]);
            }
            return response;
        })
        .catch((error: unknown) => {
            console.log(error);
        });

    // get exercise_sessions and set exercise_sessions store
    await client
        .collection("exercise_sessions")
        .getFullList(200, {
            expand: "exercise,exercise.lab"
        })
        .then((response: unknown) => {
            exercise_sessions.set(response as ExerciseSessionsResponse[]);
            return response;
        })
        .catch((error: unknown) => {
            console.log(error);
        });

    // if exercise_sessions is empty, create exercise_sessions for each exercise
    if (get(exercise_sessions).length < get(exercises).length) {
        // only create exercise_sessions for exercises that are not already in exercise_sessions
        const filtered_exercises = get(exercises).filter(
            (exercise) =>
                !get(exercise_sessions).find(
                    (exercise_session) => exercise_session.exercise === exercise.id
                )
        );

        for (const exercise of filtered_exercises) {
            const data = {
                user: client.authStore.model?.id,
                exercise: exercise.id,
                clusterRunning: false
            };
            const record: ExerciseSessionsResponse = await client
                .collection("exercise_sessions")
                .create(data);
            // update exercise_sessions
            exercise_sessions.update((exercise_sessions) => [...exercise_sessions, record]);
        }
    }
}

export async function setLabStartTime(labSessionId: string) {
    const data = {
        startTime: new Date().toISOString()
    };
    await client
        .collection("lab_sessions")
        .update(labSessionId, data)
        .then((response: unknown) => {
            return response;
        })
        .catch((error: unknown) => {
            console.log(error);
        });

    updateDataStores();
}

export async function setLabEndTime(labSessionId: string) {
    const data = {
        endTime: new Date().toISOString()
    };
    await client
        .collection("lab_sessions")
        .update(labSessionId, data)
        .then((response: unknown) => {
            return response;
        })
        .catch((error: unknown) => {
            console.log(error);
        });

    updateDataStores();
}

export async function setExerciseStartTime(exerciseSessionId: string) {
    const data = {
        startTime: new Date().toISOString()
    };
    await client
        .collection("exercise_sessions")
        .update(exerciseSessionId, data)
        .then((response: unknown) => {
            return response;
        })
        .catch((error: unknown) => {
            console.log(error);
        });

    updateDataStores();
}

export async function setExerciseEndTime(exerciseSessionId: string) {
    const data = {
        endTime: new Date().toISOString()
    };
    await client
        .collection("exercise_sessions")
        .update(exerciseSessionId, data)
        .then((response: unknown) => {
            return response;
        })
        .catch((error: unknown) => {
            console.log(error);
        });

    updateDataStores();
}
