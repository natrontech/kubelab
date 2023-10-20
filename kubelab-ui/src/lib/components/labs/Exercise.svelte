<script lang="ts">
  import { goto } from "$app/navigation";
  import { client } from "$lib/pocketbase";
  import type {
    ExerciseSessionsRecord,
    ExerciseSessionsResponse,
    ExercisesResponse
  } from "$lib/pocketbase/generated-types";
  import {
    exercise,
    exercise_sessions,
    exercises,
    getExerciseSessionByExercise
  } from "$lib/stores/data";
  import { loadingExercises } from "$lib/stores/loading";
  import {
    sidebarOpen,
    sidebar_exercise_sessions,
    sidebar_exercises,
    sidebar_lab,
    sidebar_lab_session
  } from "$lib/stores/sidebar";
  import { getDeltaTime, getTimeAgo } from "$lib/utils/time";
  import {
    CheckCircle,
    MoreHorizontal,
    Pause,
    Play,
    Terminal,
    TerminalSquare
  } from "lucide-svelte";
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

    // const labId = window.location.pathname.split("/")[2];

    const exercise_session_id = getExerciseSessionByExercise(exercise_id)?.id;

    if (exercise_session_id) {
      await client
        .collection("exercise_sessions")
        .update(exercise_session_id, data)
        // @ts-ignore
        .then((response: any) => {
          // goto(`/labs/${labId}/${exercise_id}`);
          toast.success("Exercise stopped");
          this_exercise_session = response;
          $sidebar_exercise_sessions = $sidebar_exercise_sessions.map((exercise_session) => {
            if (exercise_session.id === exercise_session_id) {
              return response;
            }
            return exercise_session;
          });

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
          this_exercise_session = response;
          $sidebar_exercise_sessions = $sidebar_exercise_sessions.map((exercise_session) => {
            if (exercise_session.id === exercise_session_id) {
              return response;
            }
            return exercise_session;
          });

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
  <div class="overflow-hidden rounded-xl border-2 h-auto">
    <div class="flex items-center gap-x-4 border-b-2 p-6">
      <div class="text-sm font-medium leading-6 ">
        {this_exercise.title}
      </div>
      {#if $sidebar_lab_session.clusterRunning}
        <div class="relative ml-auto dropdown dropdown-end dropdown-bottom">
          <button class="btn flex justify-center items-center  relative">
            {#if $loadingExercises.includes(this_exercise.id)}
              Actions <span class="loading loading-dots loading-xs inline-block p-2.5" />
            {:else}
              <button class="-m-3 block p-2.5">
                Actions <MoreHorizontal class="w-6 h-6 inline-block" strokeWidth={3} />
              </button>
              <ul class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                <li>
                  <button
                    on:click={() => {
                      sidebarOpen.set(false);
                      exercise.set(this_exercise);
                      exercises.set($sidebar_exercises);
                      new Promise((resolve) => setTimeout(resolve, 100)).then(() =>
                        goto(`/labs/${$sidebar_lab.id}/${this_exercise.id}`)
                      );
                    }}
                    class="border-2 text-primary"
                  >
                    <Terminal class="w-4 h-4 mr-1 inline-block" />
                    Shell</button
                  >
                </li>
                {#if this_exercise_session.agentRunning}
                  <li>
                    <button class="border-2 text-error border-error hover:bg-error hover:text-primary" on:click={() => stopExercise(this_exercise.id)}>
                      <Pause class="w-4 h-4 mr-1 inline-block" />
                      Stop Exercise</button
                    >
                  </li>
                {:else}
                  <li>
                    <button class="border-2 text-success border-success hover:bg-success hover:text-primary" on:click={() => startExercise(this_exercise.id)}>
                      <Play class="w-4 h-4 mr-1 inline-block" />
                      Start Exercise</button
                    >
                  </li>
                {/if}
              </ul>
            {/if}
            {#if this_exercise_session.agentRunning}
              <span class="absolute flex h-4 w-4 -top-2 -right-2">
                <span
                  class="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"
                />
                <span class="relative inline-flex rounded-full h-4 w-4 bg-success" />
              </span>
            {/if}
          </button>
        </div>
      {:else}
        <p class="text-error text-sm relative ml-auto">Lab not running</p>
      {/if}
    </div>
    <dl class="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
      <div class="flex justify-between gap-x-4 py-3">
        <dt class="">Status</dt>
        <dd
          class="badge badge-outline {this_exercise_session.agentRunning
            ? 'badge-success'
            : ''}"
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
        <dt class="">Done</dt>
        <dd class={this_exercise_session.agentRunning ? "text-success" : "text-gray-400"}>
          <span class="ml-1 text-xs">
            {#if this_exercise_session.endTime && !this_exercise_session.agentRunning}
              <span class="text-success">
                <CheckCircle class="w-5 h-5 inline-block" />
                {getDeltaTime(this_exercise_session.startTime, this_exercise_session.endTime)}
              </span>
            {:else}
              <span class="text-gray-400">not yet</span>
            {/if}
          </span>
        </dd>
      </div>
    </dl>
  </div>
{/if}
