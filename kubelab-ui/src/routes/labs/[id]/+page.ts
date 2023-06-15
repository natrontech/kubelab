import { client } from "$lib/pocketbase";
import type { ExerciseSessionsResponse, ExercisesResponse, LabSessionsResponse, LabsResponse } from "$lib/pocketbase/generated-types";
import type { PageLoad } from "../$types";

export const load: PageLoad = async ({ params }: any) => {
    const { id } = params;

    const lab: LabsResponse = await client.collection("labs").getOne(id);
    const lab_sessions: LabSessionsResponse[] = await client.collection("lab_sessions").getFullList();
    const exercises: ExercisesResponse[] = await client.collection("exercises").getFullList();
    const exercise_sessions: ExerciseSessionsResponse[] = await client
        .collection("exercise_sessions")
        .getFullList();

    const filtered_lab_sessions = lab_sessions.find((lab_session) => lab_session.lab === id);

    const filtered_exercises = exercises.filter((exercise) => exercise.lab === id);
    // exercise_sessions.exercise is a reference to the exercise id, by filtered exercises
    const filtered_exercise_sessions = exercise_sessions.filter((exercise_session) =>
        filtered_exercises.find((exercise) => exercise.id == exercise_session.exercise)
    );

    return {
        lab,
        filtered_lab_sessions,
        filtered_exercises,
        filtered_exercise_sessions,
    };
};
