<script lang="ts">
  import { Pane, Splitpanes } from "svelte-splitpanes";
  import PlaceholderComponent from "$lib/components/base/PlaceholderComponent.svelte";
  import { onMount, type ComponentType, type SvelteComponentTyped, onDestroy } from "svelte";
  import { marked } from "marked";
  import Desktop from "$lib/components/base/Desktop.svelte";
  import { metadata } from "$lib/stores/metadata";
  import { terminal_size } from "$lib/stores/terminal";
  import SvelteMarkdown from "svelte-markdown";
  import { page } from "$app/stores";
  import type {
    ExerciseSessionsRecord,
    ExerciseSessionsResponse,
    ExercisesResponse
  } from "$lib/pocketbase/generated-types.js";
  import { client } from "$lib/pocketbase/index.js";
  import toast from "svelte-french-toast";
  import { Info, Play } from "lucide-svelte";
  let Console: ComponentType<SvelteComponentTyped> = PlaceholderComponent;

  export let data;
  let loading = false;
  let showSolution = false;

  $: exercise = data.exercise as ExercisesResponse;
  $: exercise_sessions = data.filtered_exercise_sessions as ExerciseSessionsResponse[];
  $: exercise_session = data.filtered_exercise_sessions[0] as ExerciseSessionsResponse;

  let docs: string;
  let hint: string;
  let solution: string;

  async function getMarkdown() {
    await fetch(exercise.docs)
      .then((response) => response.text())
      .then((text) => {
        docs = text;
      });

    await fetch(exercise.hint)
      .then((response) => response.text())
      .then((text) => {
        hint = text;
      });

    await fetch(exercise.solution)
      .then((response) => response.text())
      .then((text) => {
        solution = text;
      });
  }

  let clear: any;

  $: {
    $page.params.id;
    if (exercise) {
      getMarkdown();
    }
    clearInterval(clear);
    clear = setInterval(() => {
      if (isRecentlyStarted(exercise_sessions[0].startTime)) {
        showSolution = true;
      }
    }, 5000);
  }

  onMount(async () => {
    Console = (await import("$lib/components/Console.svelte")).default;
  });

  onDestroy(() => {
    Console = PlaceholderComponent;
    clearInterval(clear);
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
        let lab_session_id = window.location.pathname.split("/")[2];
        let exercise_id = window.location.pathname.split("/")[3];
        let agentUrl =
          "kubelab.swisscom.k8s.natron.cloud/kubelab-" +
          lab_session_id +
          "-" +
          exercise_id +
          "-" +
          client.authStore.model?.id;

        fetch("https://" + agentUrl + "/bootstrap", {
          method: "POST"
        })
          .then((response) => {
            if (response.status === 200) {
              toast.success("Exercise started");
              exercise_sessions[0] = record;
            } else {
              toast.error("Exercise not started");
            }
          })
          .catch((error) => {
            console.error(error);
            toast.error("Exercise not started");
          });
      })
      .catch((error) => {
        console.error(error);
        toast.error("Exercise failed to start. Lab is probably still starting.");
      })
      .finally(() => {
        loading = false;
      });
  }

  function isRecentlyStarted(startTime: string) {
    let now = new Date();
    let start = new Date(startTime);
    let diff = Math.abs(now.getTime() - start.getTime());
    let minutes = Math.floor(diff / 1000 / 60);
    return minutes > 1;
  }
</script>

<Splitpanes horizontal class="p-2">
  <Pane>
    <Splitpanes>
      <Pane size={65}>
        <div class="p-2">
          {#key $page.params}
            <SvelteMarkdown source={docs} />
          {/key}
        </div>
      </Pane>
      <Pane>
        <div class="p-2">
          {#key $page.params}
            <SvelteMarkdown source={hint} />
            <div class="flex justify-center">
              <button
                class="btn mt-4 {showSolution ? 'btn-neutral' : 'btn-disabled'}"
                onclick="my_modal_1.showModal()"
              >
                <Info size={16} />
                Show Solution</button
              >
              <dialog id="my_modal_1" class="modal">
                <form method="dialog" class="modal-box">
                  <h3 class="font-bold text-lg">Solution</h3>

                  <SvelteMarkdown source={solution} />
                  <div class="modal-action">
                    <!-- if there is a button in form, it will close the modal -->
                    <button class="btn">Close</button>
                  </div>
                </form>
              </dialog>
            </div>
          {/key}
        </div>
      </Pane>
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
          <button class="btn btn-neutral mt-4" on:click={() => handleStartExercise()}>
            {#if loading}
              <span class="loading loading-dots loading-md" /> Start Terminal
            {:else}
              <Play /> Start Terminal
            {/if}
          </button>
        </div>
      </div>
    {/if}
  </Pane>
</Splitpanes>
