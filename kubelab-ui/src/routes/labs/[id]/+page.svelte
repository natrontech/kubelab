<script lang="ts">
  import { metadata } from "$lib/stores/metadata";
  import { TerminalSquare } from "lucide-svelte";
  import { exercises, getExerciseSessionByExercise } from "$lib/stores/data";

  $metadata.title = "Exercises";
</script>

<h1 class="text-center text-4xl font-bold my-4">Exercises</h1>
<div class="grid grid-cols-3 gap-4">
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
        <a href={exercise.id} class="card-actions justify-end cursor-pointer">
          <div class="tooltip" data-tip="open console">
            <button class="btn btn-neutral"><TerminalSquare /></button>
          </div>
        </a>
      </div>
    </div>
  {/each}
</div>
