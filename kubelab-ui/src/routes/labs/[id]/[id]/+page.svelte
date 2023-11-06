<script lang="ts">
  import { Pane, Splitpanes } from "svelte-splitpanes";
  import PlaceholderComponent from "$lib/components/base/PlaceholderComponent.svelte";
  import { onMount, type ComponentType, type SvelteComponentTyped, onDestroy } from "svelte";
  import Desktop from "$lib/components/base/Desktop.svelte";
  import { metadata } from "$lib/stores/metadata";
  import { terminal_size } from "$lib/stores/terminal";
  import SvelteMarkdown from "svelte-markdown";
  import { page } from "$app/stores";
  import {
    ExerciseSessionLogsTypeOptions,
    type ExerciseSessionLogsRecord,
    type ExerciseSessionsRecord
  } from "$lib/pocketbase/generated-types.js";
  import { client } from "$lib/pocketbase/index.js";
  import toast from "svelte-french-toast";
  import { CheckCircle, InfoIcon, Lightbulb, Play } from "lucide-svelte";
  import {
    checkIfExerciseIsDone,
    exercise,
    exercise_session,
    exercise_sessions,
    filterExercisesByLab,
    loadingCodeEditor
  } from "$lib/stores/data";
  import CodeSpanComponent from "$lib/components/markdown/CodeSpanComponent.svelte";
  import CodeComponent from "$lib/components/markdown/CodeComponent.svelte";
  import LinkComponent from "$lib/components/markdown/LinkComponent.svelte";
  import ListComponent from "$lib/components/markdown/ListComponent.svelte";
  import horizontalView from "$lib/stores/tableView";
  import { loadingExercises } from "$lib/stores/loading";
  import codeView from "$lib/stores/codeView";
  let Console: ComponentType<SvelteComponentTyped> = PlaceholderComponent;

  let loadingMD = "";
  let showSolution = "";

  let docs: string;
  let hint: string;
  let solution: string;
  let clear: any;

  export let data: any;
  let codeUrl: string;

  function handleIframeLoad() {
    $loadingCodeEditor = false;
  }

  $: {
    // open target blank new tab with the url
    let lab_session_id = data.pathname.split("/")[2];
    let exercise_id = window.location.pathname.split("/")[3];
    let agentHost = window.location.host === "localhost:5173" ? "kubelab.ch" : window.location.host;
    codeUrl =
      "https://kubelab-" +
      lab_session_id +
      "-" +
      exercise_id +
      "-" +
      client.authStore.model?.id +
      "." +
      agentHost;
  }

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
    $loadingCodeEditor = true;
    Console = (await import("$lib/components/Console.svelte")).default;
  });

  onDestroy(() => {
    $loadingCodeEditor = false;
    Console = PlaceholderComponent;
    clearInterval(clear);
  });

  $metadata.title = "Exercise " + $exercise.title;

  async function handleStartExercise() {
    const data: ExerciseSessionsRecord = {
      // @ts-ignore
      user: client.authStore.model?.id,
      exercise: $exercise.id,
      startTime: new Date().toISOString(),
      endTime: "",
      agentRunning: true
    };

    loadingExercises.update((exercises) => {
      exercises.add($exercise.id);
      return new Set(exercises); // Required for Svelte's reactivity
    });

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

        // make an entry in the exercise_session_logs collection

        const exercise_session_log_data: ExerciseSessionLogsRecord = {
          // @ts-ignore
          user: client.authStore.model?.id,
          exercise_session: $exercise_session.id,
          type: ExerciseSessionLogsTypeOptions.start,
          timestamp: new Date().toISOString()
        };

        client
          .collection("exercise_session_logs")
          .create(exercise_session_log_data)
          .then((response) => {
            console.log(response);
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.error(error);
        toast.error("Exercise failed to start. Lab is probably still starting.");
      })
      .finally(() => {
        loadingExercises.update((exercises) => {
          exercises.delete($exercise.id);
          return new Set(exercises); // Required for Svelte's reactivity
        });
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

{#key ($page.params, $loadingExercises)}
  {#if $horizontalView}
    <Splitpanes horizontal class="p-2 mt-2 pb-2">
      <Pane class=" rounded-lg">
        <Splitpanes>
          <Pane class="relative">
            <div
              class="py-6 px-8 leading-8 h-full overflow-y-scroll dark:bg-base-100 bg-white scrollbar-none"
            >
              {#key $page.params}
                <SvelteMarkdown
                  source={docs}
                  renderers={{
                    codespan: CodeSpanComponent,
                    code: CodeComponent,
                    link: LinkComponent,
                    list: ListComponent
                  }}
                />
              {/key}
            </div>
            <div class="bottom-0 flex w-full justify-between absolute p-2">
              <div>
                <!-- svelte-ignore missing-declaration -->
                <div class="tooltip" data-tip="Hint">
                  <button
                    class="btn btn-circle btn-neutral dark:btn-primary dark:text-neutral"
                    on:click={() => openModal2()}
                  >
                    <InfoIcon size={16} />
                  </button>
                </div>
                <dialog id="my_modal_2" class="modal">
                  <form method="dialog" class="modal-box">
                    <h3 class="font-bold text-lg">Hint</h3>
                    <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button
                    >
                    <SvelteMarkdown
                      source={hint}
                      renderers={{
                        codespan: CodeSpanComponent,
                        code: CodeComponent,
                        link: LinkComponent,
                        list: ListComponent
                      }}
                    />
                  </form>
                </dialog>
              </div>
              <div>
                <!-- svelte-ignore missing-declaration -->
                <div class="tooltip" data-tip="Solution">
                  <button
                    class="btn btn-circle {(showSolution ===
                      window.location.pathname.split('/')[3] &&
                      $exercise_session.agentRunning) ||
                    $exercise_session.endTime
                      ? 'btn-neutral  dark:btn-primary dark:text-neutral'
                      : 'btn-disabled'}"
                    on:click={() => openModal()}
                  >
                    <Lightbulb size={16} />
                  </button>
                </div>
                <dialog id="my_modal_1" class="modal">
                  <form method="dialog" class="modal-box">
                    <h3 class="font-bold text-lg">Solution</h3>
                    <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button
                    >
                    <SvelteMarkdown
                      source={solution}
                      renderers={{
                        codespan: CodeSpanComponent,
                        code: CodeComponent,
                        link: LinkComponent,
                        list: ListComponent
                      }}
                    />
                  </form>
                </dialog>
              </div>
            </div>
          </Pane>
        </Splitpanes>
      </Pane>
      <Pane bind:size={$terminal_size.height} class="rounded-lg">
        {#if $exercise_session.agentRunning}
          {#key $page.params}
            {#if $exercise_session.exercise === $exercise.id}
              {#if $codeView}
                {#if $loadingCodeEditor}
                  <div class="flex justify-center items-center h-full dark:bg-neutral">
                    <span class="loading loading-dots loading-lg" />
                  </div>
                {/if}
                <iframe
                  src={codeUrl}
                  on:load={() => handleIframeLoad()}
                  title="Code Editor"
                  class="w-full h-full  bg-transparent"
                />
              {:else}
                <Desktop {Console} />
              {/if}
            {/if}
          {/key}
        {:else}
          <!-- button to start the agent -->
          {#key $page.params}
            <div
              class="flex justify-center items-center h-full dark:bg-neutral {checkIfExerciseIsDone(
                $exercise.id
              )
                ? 'bg-green-200'
                : ''}"
            >
              <div class="text-center">
                {#if checkIfExerciseIsDone($exercise.id)}
                  <h1 class="text-4xl font-bold">
                    <CheckCircle class="inline-block w-12 h-12" />
                    {checkIfExerciseIsDone($exercise.id) ? "Exercise done" : "Exercise not started"}
                  </h1>
                {:else}
                  <button
                    class="btn {checkIfExerciseIsDone($exercise.id)
                      ? 'btn-warning'
                      : 'btn-neutral  dark:btn-primary dark:text-neutral'} mt-4"
                    on:click={() => handleStartExercise()}
                  >
                    {#if $loadingExercises.has($exercise.id)}
                      <span class="loading loading-dots loading-md" /> starting...
                    {:else}
                      <Play /> Start Terminal
                    {/if}
                  </button>
                {/if}
              </div>
            </div>
          {/key}
        {/if}
      </Pane>
    </Splitpanes>
  {:else}
    <Splitpanes class="p-2 mt-2">
      <Pane bind:size={$terminal_size.height} class="rounded-lg">
        {#if $exercise_session.agentRunning}
          {#key $page.params}
            {#if $exercise_session.exercise === $exercise.id}
              {#if $codeView}
                {#if $loadingCodeEditor}
                  <div class="flex justify-center items-center h-full dark:bg-neutral">
                    <span class="loading loading-dots loading-lg" />
                  </div>
                {/if}
                {#key ($page.params, codeUrl)}
                  <iframe
                    src={codeUrl}
                    on:load={() => handleIframeLoad()}
                    title="Code Editor"
                    class="w-full h-full  bg-transparent"
                  />
                {/key}
              {:else}
                <Desktop {Console} />
              {/if}
            {/if}
          {/key}
        {:else}
          <!-- button to start the agent -->
          {#key $page.params}
            <div
              class="flex justify-center items-center h-full dark:bg-neutral {checkIfExerciseIsDone(
                $exercise.id
              )
                ? 'bg-green-200'
                : ''}"
            >
              <div class="text-center">
                {#if checkIfExerciseIsDone($exercise.id)}
                  <h1 class="text-4xl font-bold">
                    <CheckCircle class="inline-block w-12 h-12" />
                    {checkIfExerciseIsDone($exercise.id) ? "Exercise done" : "Exercise not started"}
                  </h1>
                {:else}
                  <button
                    class="btn {checkIfExerciseIsDone($exercise.id)
                      ? 'btn-warning'
                      : 'btn-neutral  dark:btn-primary dark:text-neutral'} mt-4"
                    on:click={() => handleStartExercise()}
                  >
                    {#if $loadingExercises.has($exercise.id)}
                      <span class="loading loading-dots loading-md" /> starting...
                    {:else}
                      <Play /> Start Terminal
                    {/if}
                  </button>
                {/if}
              </div>
            </div>
          {/key}
        {/if}
      </Pane>
      <Pane class="rounded-lg">
        <Splitpanes horizontal>
          <Pane class="relative">
            <div
              class="p-6 leading-8 h-full overflow-y-scroll dark:bg-base-100 bg-white scrollbar-none"
            >
              {#key $page.params}
                <SvelteMarkdown
                  source={docs}
                  renderers={{
                    codespan: CodeSpanComponent,
                    code: CodeComponent,
                    link: LinkComponent,
                    list: ListComponent
                  }}
                />
              {/key}
            </div>
            <div class="bottom-0 flex w-full justify-between absolute p-2">
              <div>
                <!-- svelte-ignore missing-declaration -->
                <div class="tooltip" data-tip="Hint">
                  <button
                    class="btn btn-circle btn-neutral dark:btn-primary dark:text-neutral"
                    on:click={() => openModal2()}
                  >
                    <InfoIcon size={16} />
                  </button>
                </div>
                <dialog id="my_modal_2" class="modal">
                  <form method="dialog" class="modal-box">
                    <h3 class="font-bold text-lg">Hint</h3>
                    <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button
                    >
                    <SvelteMarkdown
                      source={hint}
                      renderers={{
                        codespan: CodeSpanComponent,
                        code: CodeComponent,
                        link: LinkComponent,
                        list: ListComponent
                      }}
                    />
                  </form>
                </dialog>
              </div>
              <div>
                <!-- svelte-ignore missing-declaration -->
                <div class="tooltip" data-tip="Solution">
                  <button
                    class="btn btn-circle {(showSolution ===
                      window.location.pathname.split('/')[3] &&
                      $exercise_session.agentRunning) ||
                    $exercise_session.endTime
                      ? 'btn-neutral  dark:btn-primary dark:text-neutral'
                      : 'btn-disabled'}"
                    on:click={() => openModal()}
                  >
                    <Lightbulb size={16} />
                  </button>
                </div>
                <dialog id="my_modal_1" class="modal">
                  <form method="dialog" class="modal-box">
                    <h3 class="font-bold text-lg">Solution</h3>

                    <SvelteMarkdown
                      source={solution}
                      renderers={{
                        codespan: CodeSpanComponent,
                        code: CodeComponent,
                        link: LinkComponent,
                        list: ListComponent
                      }}
                    />
                    <div class="modal-action">
                      <!-- if there is a button in form, it will close the modal -->
                      <button class="btn">Close</button>
                    </div>
                  </form>
                </dialog>
              </div>
            </div>
          </Pane>
        </Splitpanes>
      </Pane>
    </Splitpanes>
  {/if}
{/key}

<style>
  * {
    word-break: keep-all;
    line-height: 2;
  }
</style>
