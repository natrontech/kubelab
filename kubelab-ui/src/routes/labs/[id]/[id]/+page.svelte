<script lang="ts">
  import { Pane, Splitpanes } from "svelte-splitpanes";
  import PlaceholderComponent from "$lib/components/base/PlaceholderComponent.svelte";
  import { onMount, type ComponentType, type SvelteComponentTyped, onDestroy } from "svelte";
  import { marked } from "marked";
  import Desktop from "$lib/components/base/Desktop.svelte";
  import { metadata } from "$lib/stores/metadata";
  import { terminal_size } from "$lib/stores/terminal";
  import { page } from "$app/stores";
  import type {
    ExerciseSessionsRecord,
    ExerciseSessionsResponse,
    ExercisesResponse
  } from "$lib/pocketbase/generated-types.js";
    import { client } from "$lib/pocketbase/index.js";
    import toast from "svelte-french-toast";
  let Console: ComponentType<SvelteComponentTyped> = PlaceholderComponent;

  export let data;
  let loading = false;

  $: exercise = data.exercise as ExercisesResponse;
  $: exercise_sessions = data.filtered_exercise_sessions as ExerciseSessionsResponse[];

  onMount(async () => {
    Console = (await import("$lib/components/Console.svelte")).default;
  });

  onDestroy(() => {
    Console = PlaceholderComponent;
  });

  $metadata.title = "Exercise";

  async function handleStartExercise() {
    const data: ExerciseSessionsRecord = {
      // @ts-ignore
      user: client.authStore.model?.id,
      exercise: exercise.id,
      startTime: new Date().toISOString(),
      agentRunning: true
    };

    loading = true;

    await client
      .collection("exercise_sessions")
      .update(exercise_sessions[0].id, data)
      // @ts-ignore
      .then((record: LabSessionsResponse) => {
        toast.success("Exercise started");
        exercise_sessions[0] = record;
      })
      .catch((error) => {
        console.error(error);
        toast.error("Exercise failed to start. Lab is probably still starting.");
      })
      .finally(() => {
        loading = false;
      });
  }

</script>

<Splitpanes horizontal>
  <Pane>
    <Splitpanes>
      <Pane size={75}>Docs</Pane>
      <Pane>Hints / Solutions</Pane>
    </Splitpanes>
  </Pane>
  <Pane bind:size={$terminal_size.height}>
    {#if exercise_sessions[0].agentRunning}
      {#key $page.params}
        <Desktop {Console} />
      {/key}
    {:else}
      <!-- button to start the agent -->
      <div class="flex justify-center items-center h-full">
        <div class="text-center">
          <h1 class="text-4xl font-bold">Exercise not started</h1>
          <p class="text-xl">Click the button below to start the exercise</p>
          <button class="btn btn-primary" on:click={() => handleStartExercise()}> Start </button>
        </div>
      </div>
    {/if}
  </Pane>
</Splitpanes>
