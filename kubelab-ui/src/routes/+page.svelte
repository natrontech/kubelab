<script lang="ts">
  import Chart from "$lib/components/dashboard/Chart.svelte";
  import type {
    ExerciseSessionsResponse,
    ExercisesResponse,
    LabSessionsResponse,
    LabsResponse
  } from "$lib/pocketbase/generated-types.js";
  import { FlaskConical, TerminalSquare } from "lucide-svelte";

  export let data;
  $: labs = data.labs as LabsResponse[];
  $: lab_sessions = data.labsSessions as LabSessionsResponse[];
  $: exercises = data.exercises as ExercisesResponse[];
  $: exercise_sessions = data.exercise_sessions as ExerciseSessionsResponse[];

  function getDoneExercisesNumber() {
    let done_exercises = exercise_sessions.filter((exercise_session) => exercise_session.endTime);
    return done_exercises.length;
  }

  function getAverageTimeToResolve() {
    let done_exercises = exercise_sessions.filter((exercise_session) => exercise_session.endTime);
    let total_time = 0;
    done_exercises.forEach((exercise_session) => {
      // convert starTime and endTime to Date objects
      let startTime = new Date(exercise_session.startTime);
      let endTime = new Date(exercise_session.endTime);
      // get the difference in seconds
      let difference = (endTime.getTime() - startTime.getTime()) / 1000;
      total_time += difference;
    });

    let average_time = total_time / done_exercises.length;

    if (isNaN(average_time)) {
      return "N/A";
    }

    // return a string with the average time in minutes and seconds
    return `${Math.floor(average_time / 60)}m ${Math.floor(average_time % 60)}s`;
  }
</script>

<div
  class="absolute top-16 bottom-0 left-0 right-0 p-4 bg-no-repeat bg-cover bg-center"
  style="background-image: url(/images/bg.svg);"
>
  <h1 class="text-center text-4xl font-bold mt-4 mb-8 text-white">Dashboard</h1>
  <div
    class="stats shadow w-full hover:shadow-md transition-all duration-150 ease-in-out border-4 border-black"
  >
    <div class="stat">
      <div class="stat-figure text-blue-500">
        <TerminalSquare class="w-8 h-8" />
      </div>
      <div class="stat-title">Total Labs</div>
      <div class="stat-value text-blue-500">{labs.length}</div>
      <div class="stat-desc">Git related labs</div>
    </div>

    <div class="stat">
      <div class="stat-figure text-accent">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          class="inline-block w-8 h-8 stroke-current"
          ><path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13 10V3L4 14h7v7l9-11h-7z"
          /></svg
        >
      </div>
      <div class="stat-title">Total Exercises</div>
      <div class="stat-value text-accent">{exercises.length}</div>
      <div class="stat-desc">21% more than last month</div>
    </div>

    <div class="stat">
      <div class="stat-figure text-secondary">
        <progress
          class="progress w-56"
          value={Math.round((getDoneExercisesNumber() / exercises.length) * 100)}
          max="100"
        />
      </div>
      <div class="stat-value">
        {Math.round((getDoneExercisesNumber() / exercises.length) * 100)}%
      </div>
      <div class="stat-title">Exercises done</div>
      <div class="stat-desc text-blue-500">
        {exercises.length - getDoneExercisesNumber()} exercise(s) remaining
      </div>
    </div>
  </div>

  <div
    class="stats mt-4 shadow border-4 border-black hover:shadow-md transition-all duration-150 ease-in-out"
  >
    <div class="stat">
      <div class="stat-title">Your <strong>average</strong> time to resolution</div>
      <div class="stat-value">{getAverageTimeToResolve()}</div>
    </div>
  </div>
</div>
