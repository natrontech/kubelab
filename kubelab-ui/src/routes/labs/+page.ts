import { client } from "$lib/pocketbase";
import type { ExerciseSessionsResponse, ExercisesResponse, LabSessionsResponse, LabsResponse } from "$lib/pocketbase/generated-types";
import type { PageLoad } from "../$types";

export const load: PageLoad = async () => {
    const labs: LabsResponse[] = await client.collection("labs").getFullList();
    const labsSessions: LabSessionsResponse[] = await client
        .collection("lab_sessions")
        .getFullList();
    const exercises: ExercisesResponse[] = await client.collection("exercises").getFullList();
    const exercise_sessions: ExerciseSessionsResponse[] = await client.collection("exercise_sessions").getFullList();
    return {
        labs,
        labsSessions,
        exercises,
        exercise_sessions
    };
};
