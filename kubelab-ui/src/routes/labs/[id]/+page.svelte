<script lang="ts">
  import type {
    ExerciseSessionsResponse,
    ExercisesResponse,
    LabSessionsResponse,
    LabsResponse
  } from "$lib/pocketbase/generated-types";
  import type { PageData } from "./$types";
  import { Pane, Splitpanes } from "svelte-splitpanes";
  import PlaceholderComponent from "$lib/components/base/PlaceholderComponent.svelte";
  import { onMount, type ComponentType, type SvelteComponentTyped } from "svelte";
  import { marked } from "marked";
  import Desktop from "$lib/components/base/Desktop.svelte";
  import { metadata } from "$lib/stores/metadata";
  let Console: ComponentType<SvelteComponentTyped> = PlaceholderComponent;

  onMount(async () => {
    Console = (await import("$lib/components/Console.svelte")).default;
  });

  $metadata.title = "Labs";

  export let data: PageData;

  $: lab = data.lab as LabsResponse;
  $: lab_session = data.filtered_lab_sessions as LabSessionsResponse;
  $: exercises = data.filtered_exercises as ExercisesResponse[];
  $: exercise_sessions = data.filtered_exercise_sessions as ExerciseSessionsResponse[];

  function handdleSwitchExercise(exercise_session_id: string) {
    // TODO: implement with modal to confirm the switch
    console.log("switch exercise");
  }
</script>

<div class="absolute top-16 bottom-0 right-0 left-0 overflow-hidden">
  <div class="absolute top-0 bottom-16 left-0 right-0">
    <Splitpanes>
      <Pane size={55}>
        <!-- TODO: fit the whole pane -->
        <Desktop {Console} />
      </Pane>
      <Pane>
        <Splitpanes horizontal>
          <Pane size={75}>Docs</Pane>
          <Pane>Hints / Solutions</Pane>
        </Splitpanes>
      </Pane>
    </Splitpanes>
  </div>
  <!-- <div class="absolute top-0 bottom-16 left-0 right-1/2">Terminal</div>
  <div class="absolute top-0 bottom-16 left-1/2 right-0">Docs</div>
  -->
  <div class="absolute h-16 bottom-0 left-0 right-0">
    <div class="mt-3">
      <ul class="steps">
        {#each exercise_sessions as exercise_session, i}
          <button on:click={() => handdleSwitchExercise(exercise_session.id)}>
            <li
              class="step cursor-pointer hover:scale-105 {exercise_session.endTime
                ? 'step-success'
                : ''}"
            />
          </button>
        {/each}
      </ul>
    </div>
  </div>
</div>
