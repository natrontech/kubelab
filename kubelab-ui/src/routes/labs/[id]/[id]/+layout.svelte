<script lang="ts">
  import type {
    ExerciseSessionsResponse,
    ExercisesResponse
  } from "$lib/pocketbase/generated-types";
  import { marked } from "marked";
  import { metadata } from "$lib/stores/metadata";
  import { goto } from "$app/navigation";
    import { ArrowLeft } from "lucide-svelte";

  $metadata.title = "Exercises";

  export let data;

  $: lab_session_id = data.pathname.split("/")[2];

  $: exercise = data.exercise as ExercisesResponse;
  $: exercises = data.exercises as ExercisesResponse[];
  $: exercise_sessions = data.filtered_exercise_sessions as ExerciseSessionsResponse[];

  function handleSwitchExercise(exercise_session_id: string) {
    // TODO: implement with modal to confirm the switch
    console.log("switch exercise");
    goto("/labs/" + lab_session_id + "/" + exercise_session_id);
  }

  function getExerciseSession(exercise_id: string) {
    console.log(exercise_id);
    console.log(exercise_sessions);
    // TODO: fix this
    // if endTime exists at exercise_session, then it is completed
    const exercise_session = exercise_sessions.find(
      (exercise_session) => exercise_session.exercise === exercise_id
    );


    return false;
  }

</script>

<div class="">
  <div class="absolute top-0 bottom-16 left-0 right-0">
    <slot />
  </div>
  <div class="absolute h-16 bottom-0 left-0 right-0">
    <div class="mt-3 ml-3">
      <!-- add back button -->
      <button
        class="bg-gray-800 text-white px-3 py-2 rounded-md text-sm font-medium"
        on:click={() => goto("/labs/" + lab_session_id)}
      >
        <ArrowLeft class="inline-block w-4 h-4 mr-2" />
        Back
      </button>
      <ul class="steps">
        {#each exercises as exercise}
          <button on:click={() => handleSwitchExercise(exercise.id)} class="step
            {getExerciseSession(exercise.id) ? 'step-success': ''}
            ">
            <li  />
          </button>
        {/each}
      </ul>
    </div>
  </div>
</div>
