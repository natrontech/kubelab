import { client } from "$lib/pocketbase";
import type { ExerciseSessionsResponse, ExercisesResponse } from "$lib/pocketbase/generated-types";
import type { PageLoad } from "../$types";

export const load: PageLoad = async ({ params }: any) => {
    const { id } = params;
    const exercise: ExercisesResponse = await client.collection("exercises").getOne(id);
    const exercises: ExercisesResponse[] = await client.collection("exercises").getFullList();
    const exercise_sessions: ExerciseSessionsResponse[] = await client
        .collection("exercise_sessions")
        .getFullList();


    const filtered_exercise_sessions = exercise_sessions.filter(
        (exercise_session) => exercise.id == exercise_session.exercise
    );

    // if filtered_exercise_sessions is empty, create exercise_session for each exercise
    if (filtered_exercise_sessions.length === 0) {
        const data = {
            "user": client.authStore.model?.id,
            "startTime": new Date().toISOString(),
            "exercise": exercise.id,
            "agentRunning": false
        };

        const record: ExerciseSessionsResponse = await client.collection('exercise_sessions').create(data)
        // update exercise_sessions
        filtered_exercise_sessions.push(record);
    }

    return {
        exercise,
        exercises,
        filtered_exercise_sessions,
        exercise_sessions
    };
};
