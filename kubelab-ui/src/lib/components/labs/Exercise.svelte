<script lang="ts">
  import { client } from "$lib/pocketbase";
  import type {
    ExerciseSessionsRecord,
    ExerciseSessionsResponse,
    ExercisesResponse
  } from "$lib/pocketbase/generated-types";
  import { exercise_sessions, getExerciseSessionByExercise } from "$lib/stores/data";
  import { loadingExercises } from "$lib/stores/loading";
  import { sidebar_exercises } from "$lib/stores/sidebar";
  import { getTimeAgo } from "$lib/utils/time";
  import { MoreHorizontal, Pause, Play, Terminal, TerminalSquare } from "lucide-svelte";
  import { onMount } from "svelte";
  import toast from "svelte-french-toast";
  export let this_exercise_session: ExerciseSessionsResponse;
  export let index: number;
  let this_exercise: ExercisesResponse;

  onMount(() => {
    let exercise = $sidebar_exercises.find(
      (exercise) => exercise.id === this_exercise_session.exercise
    );
    if (exercise) {
      this_exercise = exercise;
    }
  });

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

{#if this_exercise}
  <div class="overflow-hidden rounded-xl border border-gray-200">
    <div class="flex items-center gap-x-4 border-b border-gray-900/5 bg-gray-50 p-6">
      <div
        class="h-12 w-12 flex justify-center items-center rounded-lg bg-white object-cover ring-1 ring-gray-900/10"
      >
        {index + 1}
      </div>
      <div class="text-sm font-medium leading-6 text-gray-900">
        {this_exercise.title}
      </div>
      <div class="relative ml-auto dropdown dropdown-end">
        {#if $loadingExercises.includes(this_exercise.id)}
          <span class="loading loading-dots loading-xs  block p-2.5 text-gray-500" />
        {:else}
          <button type="button" class="-m-3 block p-2.5 text-gray-400 hover:text-gray-500">
            <MoreHorizontal class="w-6 h-6 " strokeWidth={3} />
          </button>
          <ul class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
            {#if this_exercise_session.agentRunning}
              <li>
                <button>
                  <Terminal class="w-4 h-4 mr-1 inline-block" />
                  Shell</button
                >
              </li>
              <li>
                <button>
                  <Pause class="w-4 h-4 mr-1 inline-block" />
                  Stop Exercise</button
                >
              </li>
            {:else}
              <li>
                <button class="bg-success" on:click={() => startExercise(this_exercise.id)}>
                  <Play class="w-4 h-4 mr-1 inline-block" />
                  Start Exercise</button
                >
              </li>
            {/if}
          </ul>
        {/if}
      </div>
    </div>
    <dl class="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
      <div class="flex justify-between gap-x-4 py-3">
        <dt class="">Status</dt>
        <dd
          class="badge badge-outline {this_exercise_session.agentRunning
            ? 'badge-success'
            : 'badge-neutral'}"
        >
          {#if this_exercise_session.agentRunning}
            <Play class="w-4 h-4 mr-1 inline-block" />
          {:else}
            <Pause class="w-4 h-4 mr-1 inline-block" />
          {/if}
          {this_exercise_session.agentRunning ? "Running" : "Stopped"}
        </dd>
      </div>
      <div class="flex justify-between gap-x-4 py-3">
        <dt class="">Time</dt>
        <dd class={this_exercise_session.agentRunning ? "text-success" : "text-gray-400"}>
          <span class="ml-1 text-xs text-primary">
            {#if this_exercise_session.agentRunning && this_exercise_session.startTime}
              since
              {getTimeAgo(this_exercise_session.startTime)}
            {:else if this_exercise_session.endTime && !this_exercise_session.agentRunning}
              {getTimeAgo(this_exercise_session.endTime)}
              ago
            {/if}
          </span>
        </dd>
      </div>
    </dl>
  </div>
{/if}
