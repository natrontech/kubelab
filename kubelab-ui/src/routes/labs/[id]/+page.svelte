<script lang="ts">
  import { metadata } from "$lib/stores/metadata";
  import { ArrowLeft, Play, TerminalSquare } from "lucide-svelte";
  import {
    exercise_sessions,
    exercises,
    getExerciseSessionByExercise,
    lab
  } from "$lib/stores/data";
  import { goto } from "$app/navigation";
  import type { ExerciseSessionsRecord } from "$lib/pocketbase/generated-types";
  import { client } from "$lib/pocketbase";
  import toast from "svelte-french-toast";
  import { loadingExercises } from "$lib/stores/loading";

  $metadata.title = "Exercises";

  function isExerciseRunning(exercise_id: string) {
    return getExerciseSessionByExercise(exercise_id)?.agentRunning;
  }

  async function startExercise(exercise_id: string) {
    const data: ExerciseSessionsRecord = {
      // @ts-ignore
      user: client.authStore.model?.id,
      exercise: exercise_id,
      startTime: new Date().toISOString(),
      endTime: "",
      agentRunning: true
    };

    $loadingExercises = $loadingExercises.concat(exercise_id);

    // const labId = window.location.pathname.split("/")[2];

    const exercise_session_id = getExerciseSessionByExercise(exercise_id)?.id;
    if (exercise_session_id) {
      await client
        .collection("exercise_sessions")
        .update(exercise_session_id, data)
        // @ts-ignore
        .then((response: any) => {
          // goto(`/labs/${labId}/${exercise_id}`);
          toast.success("Exercise started");

          exercise_sessions.update((exercise_sessions) => {
            return exercise_sessions.map((exercise_session) => {
              if (exercise_session.id === exercise_session_id) {
                return response;
              }
              return exercise_session;
            });
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

<a class="btn top-5 absolute" href="/labs/">
  <ArrowLeft class="inline-block w-4 h-4 mr-2" />
  Labs
</a>
<h1 class="text-center text-4xl font-bold my-4">Exercises</h1>
<div class="grid grid-cols-3 gap-4">
  {#key $exercise_sessions}
    {#each $exercises as exercise, i}
      <div
        class="card w-full {getExerciseSessionByExercise(exercise.id)?.endTime
          ? 'bg-green-200'
          : 'bg-base-200'} border-4 border-black"
      >
        <div class="card-body">
          <p class="badge badge-neutral absolute top-2 right-2">#{i + 1}</p>
          <p
            class="badge {getExerciseSessionByExercise(exercise.id)?.agentRunning
              ? 'badge-success'
              : 'badge-error'} absolute top-2 left-2"
          >
            {getExerciseSessionByExercise(exercise.id)?.agentRunning ? "Running" : "Stopped"}
          </p>
          <p
            class="badge badge-outline {getExerciseSessionByExercise(exercise.id)?.endTime
              ? 'badge-neutral'
              : 'badge-error'} absolute bottom-2 left-2"
          >
            {getExerciseSessionByExercise(exercise.id)?.endTime ? "Completed" : "Not Completed"}
          </p>
          <h2 class="card-title mt-2">{exercise.title}</h2>
          <p>{exercise.description}</p>
          <div class="flex gap-2 justify-end">
            <div class="tooltip" data-tip="start exercise">
              <button
                class="btn {isExerciseRunning(exercise.id) ? 'btn-disabled' : 'btn-neutral'}"
                on:click={() => startExercise(exercise.id)}
              >
                {#if $loadingExercises.includes(exercise.id)}
                  <span class="loading loading-dots loading-md" />
                {:else}
                  <Play />
                {/if}
              </button>
            </div>
            <a href={exercise.id} class="card-actions justify-end cursor-pointer">
              <div class="tooltip" data-tip="open console">
                <button class="btn btn-neutral"><TerminalSquare /></button>
              </div>
            </a>
          </div>
        </div>
      </div>
    {/each}
  {/key}
</div>
