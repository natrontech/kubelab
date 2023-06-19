<script lang="ts">
  import { Pane, Splitpanes } from "svelte-splitpanes";
  import PlaceholderComponent from "$lib/components/base/PlaceholderComponent.svelte";
  import { onMount, type ComponentType, type SvelteComponentTyped, onDestroy } from "svelte";
  import Desktop from "$lib/components/base/Desktop.svelte";
  import { metadata } from "$lib/stores/metadata";
  import { terminal_size } from "$lib/stores/terminal";
  import SvelteMarkdown from "svelte-markdown";
  import { page } from "$app/stores";
  import type { ExerciseSessionsRecord } from "$lib/pocketbase/generated-types.js";
  import { client } from "$lib/pocketbase/index.js";
  import toast from "svelte-french-toast";
  import { Info, Play, Search } from "lucide-svelte";
  import {
    checkIfExerciseIsDone,
    exercise,
    exercise_session,
    exercise_sessions,
    filterExercisesByLab
  } from "$lib/stores/data";
  import CodeSpanComponent from "$lib/components/markdown/CodeSpanComponent.svelte";
  import CodeComponent from "$lib/components/markdown/CodeComponent.svelte";
  import LinkComponent from "$lib/components/markdown/LinkComponent.svelte";
  let Console: ComponentType<SvelteComponentTyped> = PlaceholderComponent;

  let loading = "";
  let loadingMD = "";
  let showSolution = "";

  let docs: string;
  let hint: string;
  let solution: string;

  async function getMarkdown() {
    loadingMD = window.location.pathname.split("/")[3];

    new Promise((resolve, reject) => {
      fetch($exercise.docs)
        .then((response) => response.text())
        .then((text) => {
          docs = text;
        })
        .catch((error) => {
          reject(error);
        });

      fetch($exercise.hint)
        .then((response) => response.text())
        .then((text) => {
          hint = text;
        })
        .catch((error) => {
          reject(error);
        });

      fetch($exercise.solution)
        .then((response) => response.text())
        .then((text) => {
          solution = text;
        })
        .catch((error) => {
          reject(error);
        });
    }).finally(() => {
      loadingMD = "";
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
      if (isRecentlyStarted($exercise_session.startTime)) {
        showSolution = window.location.pathname.split("/")[3];
      }
    }, 1000);
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
      exercise: $exercise.id,
      startTime: new Date().toISOString(),
      endTime: "",
      agentRunning: true
    };

    loading = window.location.pathname.split("/")[3];

    await client
      .collection("exercise_sessions")
      .update($exercise_session.id, data)
      // @ts-ignore
      .then((record: LabSessionsResponse) => {
        toast.success("Exercise started");
        exercise_session.set(record);

        let labId = window.location.pathname.split("/")[2];

        exercise_sessions.update((exercise_sessions) => {
          return exercise_sessions.map((exercise_session) => {
            if (exercise_session.id === record.id) {
              return record;
            }
            return exercise_session;
          });
        });

        filterExercisesByLab(labId);
      })
      .catch((error) => {
        console.error(error);
        toast.error("Exercise failed to start. Lab is probably still starting.");
      })
      .finally(() => {
        loading = "";
      });
  }

  function isRecentlyStarted(startTime: string) {
    let now = new Date();
    let start = new Date(startTime);
    let diff = Math.abs(now.getTime() - start.getTime());
    let minutes = Math.floor(diff / 1000 / 60);
    return minutes > 5;
  }

  function openModal() {
    // @ts-ignore
    window.my_modal_1.showModal();
  }

  function openModal2() {
    // @ts-ignore
    window.my_modal_2.showModal();
  }
</script>

<Splitpanes horizontal class="p-2 mt-2 pb-2 bg-neutral">
  <Pane class="rounded-md my-2">
    <Splitpanes>
      <Pane maxSize={75} size={65}>
        <div class="p-2 leading-8 h-full overflow-y-scroll bg-white">
          {#key $page.params}
            <SvelteMarkdown
              source={docs}
              renderers={{
                codespan: CodeSpanComponent,
                code: CodeComponent,
                link: LinkComponent
              }}
            />
          {/key}
        </div>
      </Pane>
      <Pane>
        <div class="p-2 leading-8 h-full overflow-y-scroll">
          {#key $page.params}
            <div class="flex justify-center">
              <!-- svelte-ignore missing-declaration -->
              <button
                class="btn mt-4 btn-neutral"
                on:click={() => openModal2()}
              >
                <Search class="mr-2" size={16} />
                Show Hint
              </button>
              <dialog id="my_modal_2" class="modal">
                <form method="dialog" class="modal-box">
                  <h3 class="font-bold text-lg">Hint</h3>
                  <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                  <SvelteMarkdown
                    source={hint}
                    renderers={{
                      codespan: CodeSpanComponent,
                      code: CodeComponent,
                      link: LinkComponent
                    }}
                  />
                </form>
              </dialog>
            </div>
            <div class="flex justify-center">
              <!-- svelte-ignore missing-declaration -->
              <button
                class="btn mt-4 {(showSolution === window.location.pathname.split('/')[3] &&
                $exercise_session.agentRunning) || $exercise_session.endTime
                  ? 'btn-neutral'
                  : 'btn-disabled'}"
                on:click={() => openModal()}
              >
                <Info size={16} />
                Show Solution
              </button>
              <dialog id="my_modal_1" class="modal">
                <form method="dialog" class="modal-box">
                  <h3 class="font-bold text-lg">Solution</h3>

                  <SvelteMarkdown
                    source={solution}
                    renderers={{
                      codespan: CodeSpanComponent,
                      code: CodeComponent,
                      link: LinkComponent
                    }}
                  />
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
    {#if $exercise_session.agentRunning}
      {#key $page.params}
        {#if $exercise_session.exercise === $exercise.id}
          <Desktop {Console} />
        {/if}
      {/key}
    {:else}
      <!-- button to start the agent -->
      {#key $page.params}
        <div
          class="flex justify-center items-center h-full {checkIfExerciseIsDone($exercise.id)
            ? 'bg-green-200'
            : ''}"
        >
          <div class="text-center">
            <h1 class="text-4xl font-bold">
              {checkIfExerciseIsDone($exercise.id) ? "Exercise done" : "Exercise not started"}
            </h1>
            <p class="text-xl">
              {checkIfExerciseIsDone($exercise.id)
                ? "Click the button below to restart the exercise. You must finish it again!"
                : "Click the button below to start the exercise"}
            </p>
            <button
              class="btn {checkIfExerciseIsDone($exercise.id) ? 'btn-warning' : 'btn-neutral'} mt-4"
              on:click={() => handleStartExercise()}
            >
              {#if loading === window.location.pathname.split("/")[3]}
                <span class="loading loading-dots loading-md" /> Start Terminal
              {:else}
                <Play /> Start Terminal
              {/if}
              {checkIfExerciseIsDone($exercise.id) ? " - Exercise already Done" : ""}
            </button>
          </div>
        </div>
      {/key}
    {/if}
  </Pane>
</Splitpanes>

<style>
  * {
    word-break: keep-all;
  }
</style>
