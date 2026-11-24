import { fireEvent, render, screen, waitFor } from "@testing-library/svelte";
import { get } from "svelte/store";
import { expect, test, vi } from "vitest";
import type {
    ExercisesResponse,
    ExerciseSessionsResponse
} from "#lib/pocketbase/generated-types.ts";
import { exercises, exercise_sessions } from "#lib/stores/data.ts";
import { loadingExercises } from "#lib/stores/loading.ts";
import RunningExercises from "./RunningExercises.svelte";

const { update } = vi.hoisted(() => ({ update: vi.fn() }));
vi.mock("$app/navigation", () => ({ goto: vi.fn() }));
vi.mock("#lib/pocketbase/index.ts", () => ({
    client: { authStore: { record: { id: "user" } }, collection: () => ({ update }) }
}));
vi.mock("svelte-sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

test("stopping an exercise tracks loading in the Set and removes the stopped session", async () => {
    // Hold the response so the pending loading state can be observed
    let finish!: (record: ExerciseSessionsResponse) => void;
    update.mockReturnValue(
        new Promise<ExerciseSessionsResponse>((resolve) => {
            finish = resolve;
        })
    );
    const session = {
        id: "session",
        exercise: "exercise",
        agentRunning: true
    } as ExerciseSessionsResponse;
    exercises.set([{ id: "exercise", title: "Practice", lab: "lab" } as ExercisesResponse]);
    exercise_sessions.set([session]);
    loadingExercises.set(new Set());
    render(RunningExercises);

    // Complete the request and verify the loading state and dashboard both settle
    await fireEvent.click(screen.getByRole("button", { name: "Stop Exercise" }));
    expect(get(loadingExercises).has("exercise")).toBe(true);
    finish({ ...session, agentRunning: false });
    await waitFor(() => expect(screen.getByText("No running exercises")).toBeTruthy());
    expect(get(loadingExercises).size).toBe(0);
    expect(update).toHaveBeenCalledWith(
        "session",
        expect.objectContaining({ agentRunning: false })
    );
});
