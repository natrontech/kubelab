import { client } from "$lib/pocketbase";
import type { ExerciseSessionsResponse, ExercisesResponse, LabSessionsResponse, LabsResponse } from "$lib/pocketbase/generated-types";
import type { PageLoad } from "../$types";

export const load: PageLoad = async () => {
    const labs: LabsResponse[] = await client.collection("labs").getFullList();
    const labsSessions: LabSessionsResponse[] = await client
        .collection("lab_sessions")
        .getFullList()

    // if lab_sessions is empty, create lab_sessions for each lab
    if (labsSessions.length === 0) {
        for (const lab of labs) {
            const data = {
                "user": client.authStore.model?.id,
                "startTime": new Date().toISOString(),
                "lab": lab.id,
                "clusterRunning": false
            };
            const record: LabSessionsResponse = await client.collection('lab_sessions').create(data);
            // update lab_sessions
            labsSessions.push(record);

        }
    }

    const exercises: ExercisesResponse[] = await client.collection("exercises").getFullList();
    const exercise_sessions: ExerciseSessionsResponse[] = await client.collection("exercise_sessions").getFullList();
    return {
        labs,
        labsSessions,
        exercises,
        exercise_sessions
    };
};
