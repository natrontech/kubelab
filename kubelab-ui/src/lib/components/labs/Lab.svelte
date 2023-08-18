<script lang="ts">
  import type {
    ExerciseSessionsResponse,
    ExercisesResponse,
    LabSessionsResponse,
    LabsResponse
  } from "$lib/pocketbase/generated-types";
  import {
    sidebarOpen,
    sidebar_exercise_sessions,
    sidebar_exercises,
    sidebar_lab,
    sidebar_lab_session
  } from "$lib/stores/sidebar";
  import { getTimeAgo } from "$lib/utils/time";
  import { CheckCircle, Inspect, Pause, Play, XCircle } from "lucide-svelte";

  export let this_lab: LabsResponse = $sidebar_lab || {};
  export let this_lab_session: LabSessionsResponse = $sidebar_lab_session || {};
  export let this_exercises: ExercisesResponse[] = $sidebar_exercises || [];
  export let this_exercise_sessions: ExerciseSessionsResponse[] = $sidebar_exercise_sessions || [];

  function getDoneExercises() {
    let done_exercises: ExercisesResponse[] = [];
    // each exercise_session which has an endTimestamp is done
    this_exercise_sessions.forEach((exercise_session) => {
      if (exercise_session.endTime) {
        let exercise = this_exercises.find((exercise) => exercise.id === exercise_session.exercise);
        if (exercise) {
          done_exercises.push(exercise);
        }
      }
    });
    return done_exercises;
  }

  async function handleSideBar() {
    if ($sidebarOpen) {
      sidebarOpen.set(false);
      // sleep 1s and then print lol
      await new Promise((r) => setTimeout(r, 200)).then(() => {
        sidebar_lab.set(this_lab);
        sidebar_lab_session.set(this_lab_session);
        sidebar_exercises.set(this_exercises);
        sidebar_exercise_sessions.set(this_exercise_sessions);
        sidebarOpen.set(true);
      });
      return;
    }
    sidebar_lab.set(this_lab);
    sidebar_lab_session.set(this_lab_session);
    sidebar_exercises.set(this_exercises);
    sidebar_exercise_sessions.set(this_exercise_sessions);
    sidebarOpen.set(true);
  }

</script>

<!-- <div class="border-neutral border-4 bg-base-200 collapse-arrow relative h-32">
  <div class="collapse-title text-xl font-medium">
    {this_lab.title}
    <span class="badge badge-outline {this_lab_session.clusterRunning ? 'badge-accent' : ''} ml-2"
      >{this_lab_session.clusterRunning ? "Running" : "Stopped"}
      <span class="ml-1 text-gray-500 text-xs">
        {#if this_lab_session.clusterRunning && this_lab_session.startTime}
          ( since
          {getTimeAgo(this_lab_session.startTime)}
          )
        {:else if this_lab_session.endTime && !this_lab_session.clusterRunning}
          (
          {getTimeAgo(this_lab_session.endTime)}
          ago )
        {/if}
      </span>
    </span>
  </div>
  <div
    class="absolute bottom-2 left-4 {getDoneExercises().length === this_exercises.length
      ? 'text-success'
      : 'text-orange-500'}"
  >
    {getDoneExercises().length} / {this_exercises.length} exercises finished
  </div>
  <div class="justify-end content-end flex">
    <div class="grid grid-cols-1 gap-2 mb-2 mr-2">
      <div class="">
        <input id="my-drawer-4" type="checkbox" class="drawer-toggle" />
        <div class="tooltip" data-tip="lab info">
          <button class="btn btn-info" on:click={() => (open = !open)}>
            <Info />
          </button>
        </div>
      </div>
      {#if this_lab_session.clusterRunning}
        <div class="tooltip" data-tip="stop lab">
          <button class="btn btn-error" on:click={() => stopLab()}>
            {#if $loadingLabs.includes(this_lab_session.id)}
              <span class="loading loading-dots loading-md" />
            {:else}
              <StopCircle />
            {/if}
          </button>
        </div>
      {:else}
        <div class="tooltip" data-tip="start lab">
          {#key $lab_sessions}
            <button
              class="btn
            {$lab_sessions.filter((lab_session) => lab_session.clusterRunning).length > 1
                ? 'btn-disabled'
                : 'btn-success'}"
              on:click={() => startLab()}
            >
              {#if $loadingLabs.includes(this_lab_session.id)}
                <span class="loading loading-dots loading-md" />
              {:else}
                <Play />
              {/if}
            </button>
          {/key}
        </div>
      {/if}
      {#if this_lab_session.clusterRunning}
        <div class="tooltip" data-tip="exercises">
          <a href={this_lab.id}>
            <button class="btn btn-neutral"><Inspect /></button>
          </a>
        </div>
      {/if}
    </div>
  </div>
</div> -->
{#key this_lab_session}
  <div class="rounded-xl border-2 relative">
    <div class="flex items-center gap-x-4 border-b-2 p-6">
      <!-- <div
        class="h-12 w-12 flex items-center justify-center rounded-lg object-cover ring-2 ring-primary relative"
      >
        <TestTube2 class="h-5 w-5" />
      </div> -->
      <!-- <img src="https://tailwindui.com/img/logos/48x48/tuple.svg" alt="Tuple" class="h-12 w-12 flex-none rounded-lg bg-white object-cover ring-1 ring-gray-900/10"> -->
      <div class="text-sm font-medium leading-6">{this_lab.title}</div>
      <div class="relative ml-auto">
        <button class="btn btn-outline" on:click={() => handleSideBar()}>
          <Inspect />
        </button>

        {#if this_lab_session.clusterRunning}
          <span class="absolute flex h-4 w-4 -top-1 -right-1">
            <span
              class="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"
            />
            <span class="relative inline-flex rounded-full h-4 w-4 bg-success" />
          </span>
        {/if}
      </div>
    </div>
    <dl class="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
      <div class="flex justify-between gap-x-4 py-3">
        <dt class="">Status</dt>
        <dd
          class="badge badge-outline {this_lab_session.clusterRunning
            ? 'badge-success'
            : 'badge-neutral'}"
        >
          {#if this_lab_session.clusterRunning}
            <Play class="w-4 h-4 mr-1 inline-block" />
          {:else}
            <Pause class="w-4 h-4 mr-1 inline-block" />
          {/if}
          {this_lab_session.clusterRunning ? "Running" : "Stopped"}
        </dd>
      </div>
      <div class="flex justify-between gap-x-4 py-3">
        <dt class="">Time</dt>
        <dd class={this_lab_session.clusterRunning ? "text-success" : "text-gray-400"}>
          <span class="ml-1 text-xs text-primary">
            {#if this_lab_session.clusterRunning && this_lab_session.startTime}
              since
              {getTimeAgo(this_lab_session.startTime)}
            {:else if this_lab_session.endTime && !this_lab_session.clusterRunning}
              {getTimeAgo(this_lab_session.endTime)}
              ago
            {/if}
          </span>
        </dd>
      </div>
      <div class="flex justify-between gap-x-4 py-3">
        <dt class="">Done Exercises</dt>
        <dd class="flex items-start gap-x-2">
          {#if getDoneExercises().length == this_exercises.length}
            <div class="text-success">
              <CheckCircle />
            </div>
          {:else}
            <div class="text-red-500">
              <XCircle />
            </div>
          {/if}
          <div
            class="font-medium
            {getDoneExercises().length == this_exercises.length ? 'text-success' : 'text-red-500'}
          "
          >
            {getDoneExercises().length} / {this_exercises.length}
          </div>
        </dd>
      </div>
    </dl>
  </div>
{/key}
