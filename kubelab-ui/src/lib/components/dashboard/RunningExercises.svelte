<script lang="ts">
  import { goto } from "$app/navigation";
  import { client } from "$lib/pocketbase";
  import type {
    ExerciseSessionsRecord,
    ExerciseSessionsResponse
  } from "$lib/pocketbase/generated-types";
  import {
    exercise,
    exercise_sessions,
    exercise_session,
    getExerciseSessionByExercise,
    exercises,
    lab
  } from "$lib/stores/data";
  import { loadingExercises } from "$lib/stores/loading";
  import { Card } from "flowbite-svelte";
  import { Pause, Terminal } from "lucide-svelte";
  import toast from "svelte-french-toast";

  let running_exercises: ExerciseSessionsResponse[] = $exercise_sessions.filter(
    (exercise_session) => exercise_session.agentRunning
  );

  function openExercise(local_exercise_session: ExerciseSessionsResponse) {
    // TODO: fix roadmap
    let exercises_by_lab = $exercises.filter(
      (exercise) => exercise.lab === local_exercise_session.expand.exercise.lab
    );
    exercise.set(local_exercise_session.expand.exercise);
    exercises.set(exercises_by_lab);
    new Promise((resolve) => setTimeout(resolve, 100)).then(() =>
      goto(
        `/labs/${local_exercise_session.expand.exercise.lab}/${local_exercise_session.expand.exercise.id}`
      )
    );
  }

  async function stopExercise(exercise_id: string) {
    const data: ExerciseSessionsRecord = {
      // @ts-ignore
      user: client.authStore.model?.id,
      exercise: exercise_id,
      startTime: new Date().toISOString(),
      endTime: "",
      agentRunning: false
    };

    $loadingExercises = $loadingExercises.concat(exercise_id);

    const exercise_session_id = getExerciseSessionByExercise(exercise_id)?.id;

    if (exercise_session_id) {
      await client
        .collection("exercise_sessions")
        .update(exercise_session_id, data)
        // @ts-ignore
        .then((response: any) => {
          toast.success("Exercise stopped");

          // @ts-ignore
          // update running_exercises
          running_exercises = running_exercises.filter(
            (running_exercise) => running_exercise.id !== exercise_session_id
          );

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
          $loadingExercises = $loadingExercises.filter((id) => id !== exercise_id);
        });
    }
  }
</script>

<Card padding="xl" class="bg-white dark:bg-base-100">
  <div class="flex justify-between items-center mb-4">
    <h5 class="text-xl font-bold leading-none ">Running Exercises</h5>
    <a href="/labs" class="text-sm font-medium "> View all </a>
  </div>
  {#if running_exercises.length === 0}
    <div class="text-center text-sm font-medium leading-6 ">No running exercises</div>
  {/if}
  <div class="overflow-y-auto max-h-96 space-y-2">
    {#each running_exercises as running_exercise}
      <div class="flex items-center">
        <div class="text-sm font-medium leading-6 ">{running_exercise.expand.exercise.title}</div>
        <div class="relative ml-auto">
          <button class="btn-sm btn btn-outline" on:click={() => openExercise(running_exercise)}>
            <Terminal class="w-4 h-4 mr-1 inline-block" />
            Shell</button
          >
          <button
            class="btn-sm btn btn-outline btn-error"
            on:click={() => stopExercise(running_exercise.expand.exercise.id)}
          >
            <Pause class="w-4 h-4 mr-1 inline-block" />
            Stop Exercise</button
          >
        </div>
      </div>
    {/each}
  </div>
</Card>
