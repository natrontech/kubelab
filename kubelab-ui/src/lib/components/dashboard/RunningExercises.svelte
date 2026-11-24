<script lang="ts">
  import { goto } from "$app/navigation";
  import { client } from "#lib/pocketbase/index.ts";
  import type {
    ExerciseSessionsRecord,
    ExerciseSessionsResponse
  } from "#lib/pocketbase/generated-types.ts";
  import {
    exercise,
    exercise_sessions,
    getExerciseSessionByExercise,
    exercises
  } from "#lib/stores/data.ts";
  import { loadingExercises } from "#lib/stores/loading.ts";
  import { Card } from "flowbite-svelte";
  import { Pause, Terminal } from "@lucide/svelte";
  import { toast } from "svelte-sonner";

  let running_exercises = $derived(
    $exercise_sessions.filter((exercise_session) => exercise_session.agentRunning)
  );

  function openExercise(local_exercise_session: ExerciseSessionsResponse) {
    // Resolve the exercise from the loaded records so missing expansions do not break navigation
    const currentExercise = $exercises.find((item) => item.id === local_exercise_session.exercise);
    if (!currentExercise) return;
    exercise.set(currentExercise);
    exercises.set($exercises.filter((item) => item.lab === currentExercise.lab));
    goto(`/labs/${currentExercise.lab}/${currentExercise.id}`);
  }

  async function stopExercise(exercise_id: string) {
    const data: ExerciseSessionsRecord = {
      // @ts-ignore
      user: client.authStore.record?.id,
      exercise: exercise_id,
      startTime: new Date().toISOString(),
      endTime: "",
      agentRunning: false
    };

    $loadingExercises = new Set($loadingExercises).add(exercise_id);

    const exercise_session_id = getExerciseSessionByExercise(exercise_id)?.id;

    if (exercise_session_id) {
      await client
        .collection("exercise_sessions")
        .update(exercise_session_id, data)
        // @ts-ignore
        .then((response: any) => {
          toast.success("Exercise stopped");

          $exercise_sessions = $exercise_sessions.map((exercise_session) => {
            if (exercise_session.id === exercise_session_id) {
              return response;
            }
            return exercise_session;
          });
        })
        .catch((error) => {
          toast.error(error.message);
        })
        .finally(() => {
          $loadingExercises.delete(exercise_id);
          $loadingExercises = new Set($loadingExercises);
        });
    }
  }
</script>

<Card
  class="p-8 bg-white dark:bg-base-100 rounded-xl mt-4 shadow hover:shadow-md transition-all duration-150 ease-in-out overflow-x-hidden"
>
  <div class="flex justify-between items-center mb-4">
    <h5 class="text-xl font-bold leading-none">Running Exercises</h5>
    <a href="/labs" class="text-sm font-medium"> View all </a>
  </div>
  {#if running_exercises.length === 0}
    <div class="text-center text-sm font-medium leading-6">No running exercises</div>
  {/if}
  <div class="overflow-y-auto max-h-96 space-y-2">
    {#each running_exercises as running_exercise}
      <div class="flex items-center">
        <div class="text-sm font-medium leading-6">
          {$exercises.find((item) => item.id === running_exercise.exercise)?.title}
        </div>
        <div class="relative ml-auto gap-2">
          <button class="btn-sm btn btn-outline" onclick={() => openExercise(running_exercise)}>
            <Terminal class="w-4 h-4 mr-1 inline-block" />
            Shell
          </button>
          <button
            class="btn-sm btn btn-outline btn-error"
            onclick={() => stopExercise(running_exercise.exercise)}
          >
            <Pause class="w-4 h-4 mr-1 inline-block" />
            Stop Exercise
          </button>
        </div>
      </div>
    {/each}
  </div>
</Card>
