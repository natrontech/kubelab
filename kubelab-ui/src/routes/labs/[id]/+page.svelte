<script lang="ts">
  import type {
    ExerciseSessionsResponse,
    ExercisesResponse,
    LabSessionsResponse,
    LabsResponse
  } from "$lib/pocketbase/generated-types";
  import type { PageData } from "./$types";
  import { metadata } from "$lib/stores/metadata";
  import { TerminalSquare } from "lucide-svelte";

  $metadata.title = "Exercises";

  export let data: PageData;

  $: lab = data.lab as LabsResponse;
  $: lab_session = data.filtered_lab_sessions as LabSessionsResponse;
  $: exercises = data.filtered_exercises as ExercisesResponse[];
  $: exercise_sessions = data.filtered_exercise_sessions as ExerciseSessionsResponse[];

  function getExerciseSession(exercise_id: string) {
    // @ts-ignore
    const exercise_session: ExerciseSessionsResponse = exercise_sessions.find(
      (exercise_session) => exercise_session.exercise === exercise_id
    );
    if (exercise_session) {
      return exercise_session;
    }
    return null;
  }

</script>

<h1 class="text-center text-4xl font-bold my-4">Exercises</h1>
<div class="grid grid-cols-3 gap-4">
  {#each exercises as exercise, i}
    <div class="card w-full {getExerciseSession(exercise.id)?.endTime ? 'bg-green-200': 'bg-base-200'} border-4 border-black">
      <div class="card-body">
        <p class="badge badge-neutral absolute top-2 right-2">#{i + 1}</p>
        <p class="badge {getExerciseSession(exercise.id)?.agentRunning ? 'badge-success' : 'badge-error'} absolute top-2 left-2">{getExerciseSession(exercise.id)?.agentRunning ? 'Running' : 'Stopped'}</p>
        <p class="badge badge-outline {getExerciseSession(exercise.id)?.endTime ? 'badge-neutral' : 'badge-error'} absolute bottom-2 left-2">{getExerciseSession(exercise.id)?.endTime ? 'Completed' : 'Not Completed'}</p>
        <h2 class="card-title mt-2">{exercise.title}</h2>
        <p>{exercise.description}</p>
        <a
          href={exercise.id}
          class="card-actions justify-end cursor-pointer"
        >
          <div class="tooltip" data-tip="open console">
            <button class="btn btn-neutral"><TerminalSquare /></button>
          </div>
        </a>
      </div>
    </div>
  {/each}
</div>
