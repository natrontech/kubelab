<script lang="ts">
  import Lab from "$lib/components/labs/Lab.svelte";
  import type {
    ExerciseSessionsResponse,
    ExercisesResponse,
    LabSessionsResponse,
    LabsResponse
  } from "$lib/pocketbase/generated-types";
  import { exercise_sessions, exercises, lab_sessions, labs } from "$lib/stores/data";
  import { metadata } from "$lib/stores/metadata";
  import type { PageData } from "./$types";

  $metadata.title = "Labs";

  function getLabSessions(lab_id: string): LabSessionsResponse {
    let lab_session = $lab_sessions.find((lab_session) => lab_session.lab === lab_id);
    // only return the lab session if it exists
    // @ts-ignore
    return lab_session;
  }

  function getExercises(lab_id: string): ExercisesResponse[] {
    let lab_exercises = $exercises.filter((exercise) => exercise.lab === lab_id);
    // only return the lab session if it exists
    // @ts-ignore
    return lab_exercises;
  }

  function getExercisesSessions(lab_id: string): ExerciseSessionsResponse[] {
    let lab_exercises_sessions: ExerciseSessionsResponse[] = [];
    let lab_exercises = getExercises(lab_id);
    lab_exercises.forEach((exercise) => {
      let exercise_session = $exercise_sessions.find(
        (exercise_session) => exercise_session.exercise === exercise.id
      );
      if (exercise_session) {
        lab_exercises_sessions.push(exercise_session);
      }
    });
    return lab_exercises_sessions;
  }
</script>

{#if $lab_sessions.length > 1}
  <h1 class="text-center text-4xl font-bold my-4">Labs</h1>
  {#key $lab_sessions}
    <p class="text-center text-xl my-4">
      <!-- display number of running labs x/1 -->
      Running labs:
      <span class="font-bold"
        >{$lab_sessions.filter((lab_session) => lab_session.clusterRunning).length}</span
      > / 2
    </p>
  {/key}
  <div class="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4 p-4">
    {#each $labs as this_lab}
      <Lab
        {this_lab}
        this_lab_session={getLabSessions(this_lab.id)}
        this_exercises={getExercises(this_lab.id)}
        this_exercise_sessions={getExercisesSessions(this_lab.id)}
      />
    {/each}
  </div>
{/if}
