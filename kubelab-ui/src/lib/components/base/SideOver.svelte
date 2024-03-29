<script lang="ts">
  import type {
    ExerciseSessionsRecord,
    ExerciseSessionsResponse,
    LabSessionsRecord,
    LabSessionsResponse
  } from "$lib/pocketbase/generated-types";
  import { exercise_sessions, lab_sessions, updateDataStores } from "$lib/stores/data";
  import { AlertTriangle, Pause, Play, TestTube2, X } from "lucide-svelte";
  import SvelteMarkdown from "svelte-markdown";
  import CodeSpanComponent from "$lib/components/markdown/CodeSpanComponent.svelte";
  import CodeComponent from "$lib/components/markdown/CodeComponent.svelte";
  import LinkComponent from "$lib/components/markdown/LinkComponent.svelte";
  import toast from "svelte-french-toast";
  import { loadingExercises, loadingLabs } from "$lib/stores/loading";
  import { client } from "$lib/pocketbase";
  import { sidebar_exercise_sessions, sidebar_lab, sidebar_lab_session } from "$lib/stores/sidebar";
  import Exercise from "../labs/Exercise.svelte";
  import { Button, Modal } from "flowbite-svelte";

  let docs: string;
  export let drawerHidden = true;
  let confirmation = false;

  async function getMarkdown() {
    fetch($sidebar_lab.docs)
      .then((response) => response.text())
      .then((text) => {
        docs = text;
      })
      .catch((error) => {
        console.error(error);
      });
  }

  async function startLab(lab_session_id: string) {
    // if there is more than one lab_session clusterRunning = true, fail
    if ($lab_sessions.filter((lab_session) => lab_session.clusterRunning).length > 1) {
      toast.error("There are already two lab running");
      return;
    }

    if ($loadingLabs.size > 1) {
      toast.error("There are already 2 labs starting/stopping");
      return;
    }

    loadingLabs.update((labs) => {
      labs.add(lab_session_id);
      return new Set(labs); // Required for Svelte's reactivity
    });

    const data: LabSessionsRecord = {
      clusterRunning: true,
      // @ts-ignore
      user: client.authStore.model?.id,
      lab: $sidebar_lab.id,
      startTime: new Date().toISOString()
    };

    await client
      .collection("lab_sessions")
      .update(lab_session_id, data)
      // @ts-ignore
      .then((record: LabSessionsResponse) => {
        toast.success("Lab started");

        $sidebar_lab_session = record;

        lab_sessions.update((lab_sessions) => {
          return lab_sessions.map((lab_session) => {
            if (lab_session.id === record.id) {
              return record;
            }
            return lab_session;
          });
        });
      })
      .catch((error) => {
        console.error(error);
        toast.error("Lab failed to start");
      })
      .finally(() => {
        updateDataStores().catch((error) => {
          toast.error(error);
        });
        loadingLabs.update((labs) => {
          labs.delete(lab_session_id);
          return new Set(labs); // Required for Svelte's reactivity
        });
      });
  }

  // TODO: add modal to confirm stop lab
  async function stopLab(lab_session_id: string) {
    loadingLabs.update((labs) => {
      labs.add(lab_session_id);
      return new Set(labs); // Required for Svelte's reactivity
    });

    const data: LabSessionsRecord = {
      clusterRunning: false,
      // @ts-ignore
      user: client.authStore.model?.id,
      lab: $sidebar_lab.id,
      endTime: new Date().toISOString()
    };

    // update each exercise session to stop agentRunning = false
    $sidebar_exercise_sessions.forEach(async (sidebar_exercise_session) => {
      const exercise_session_data: ExerciseSessionsRecord = {
        agentRunning: false,
        // @ts-ignore
        user: client.authStore.model?.id,
        exercise: sidebar_exercise_session.exercise
      };

      loadingExercises.update((exercises) => {
        exercises.add(sidebar_exercise_session.id);
        return new Set(exercises); // Required for Svelte's reactivity
      });

      await client
        .collection("exercise_sessions")
        .update(sidebar_exercise_session.id, exercise_session_data)
        // @ts-ignore
        .then((record: ExerciseSessionsResponse) => {
          sidebar_exercise_session = record;
          sidebar_exercise_sessions.update((sidebar_exercise_sessions) => {
            return sidebar_exercise_sessions.map((sidebar_exercise_session) => {
              if (sidebar_exercise_session.id === record.id) {
                return record;
              }
              return sidebar_exercise_session;
            });
          });
          exercise_sessions.update((exercise_sessions) => {
            return exercise_sessions.map((exercise_session) => {
              if (exercise_session.id === record.id) {
                return record;
              }
              return exercise_session;
            });
          });
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          updateDataStores().catch((error) => {
            toast.error(error);
          });
          loadingExercises.update((exercises) => {
            exercises.delete(sidebar_exercise_session.id);
            return new Set(exercises); // Required for Svelte's reactivity
          });
          confirmation = false;
        });
    });

    await client
      .collection("lab_sessions")
      .update($sidebar_lab_session.id, data)
      // @ts-ignore
      .then((record: LabSessionsResponse) => {
        toast.success("Lab stopped");

        $sidebar_lab_session = record;

        lab_sessions.update((lab_sessions) => {
          return lab_sessions.map((lab_session) => {
            if (lab_session.id === record.id) {
              return record;
            }
            return lab_session;
          });
        });
      })
      .catch((error) => {
        console.error(error);
        toast.error("Lab failed to stop");
      })
      .finally(() => {
        updateDataStores().catch((error) => {
          toast.error(error);
        });
        loadingLabs.update((labs) => {
          labs.delete(lab_session_id);
          return new Set(labs); // Required for Svelte's reactivity
        });
      });
  }
</script>

<aside class="">
  {#key $sidebar_lab_session}
    {#if !drawerHidden}
      <div
        class="{$sidebar_lab_session.clusterRunning
          ? ''
          : ''} px-4 py-6 sm:px-6 absolute w-full z-10"
      >
        <div class="flex items-center justify-between">
          <h2 class="text-base font-semibold leading-6 text-primary" id="slide-over-title">
            <TestTube2 class="w-5 h-5 mr-2 inline-block" />
            {$sidebar_lab.title}
          </h2>
        </div>
        <div
          class="badge badge-outline {$sidebar_lab_session.clusterRunning ? 'badge-success' : ''}"
        >
          {#if $sidebar_lab_session.clusterRunning}
            <Play class="w-4 h-4 mr-1 inline-block" />
          {:else}
            <Pause class="w-4 h-4 mr-1 inline-block" />
          {/if}
          {$sidebar_lab_session.clusterRunning ? "Running" : "Stopped"}
        </div>
        <div class="grid grid-cols-1 gap-2 mt-4">
          {#if !$sidebar_lab_session.clusterRunning}
            <button
              class="btn btn-outline btn-success"
              on:click={() => startLab($sidebar_lab_session.id)}
            >
              {#if $loadingLabs.has($sidebar_lab_session.id)}
                <span class="loading loading-dots loading-md" />
              {:else}
                <Play class="w-5 h-5 mr-2 inline-block" />
                Start lab
              {/if}
            </button>
          {:else}
            {#if $loadingLabs.has($sidebar_lab_session.id)}
              <button class="btn btn-outline btn-disabled">
                <span class="loading loading-dots loading-md" />
                Stopping lab
              </button>
            {:else if confirmation}
              <button
                class="btn btn-outline btn-warning"
                on:click={() => stopLab($sidebar_lab_session.id)}
              >
                <AlertTriangle class="w-5 h-5 mr-2 inline-block" />
                Are you sure?
              </button>
            {:else}
              <button class="btn btn-outline btn-error" on:click={() => (confirmation = true)}>
                <Pause class="w-5 h-5 mr-2 inline-block" />
                Stop lab
              </button>
            {/if}
          {/if}
        </div>
        <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
        <div
          tabindex="0"
          class="collapse collapse-arrow bg-white dark:bg-neutral border-primary border-2 my-4  rounded-lg shadow-md"
        >
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <div
            class="collapse-title text-md font-medium"
            on:click={() => {
              getMarkdown();
            }}
          >
            About the lab
          </div>
          <div class="collapse-content">
            <SvelteMarkdown
              source={docs}
              renderers={{
                codespan: CodeSpanComponent,
                code: CodeComponent,
                link: LinkComponent
              }}
            />
          </div>
        </div>
        <div class="absolute top-5 right-6">
          <div class="tooltip tooltip-left" data-tip="close">
            <button
              type="button"
              on:click={() => {
                drawerHidden = !drawerHidden;
              }}
              class="btn btn-outline border-none btn-sm btn-square"
            >
              <X />
            </button>
          </div>
        </div>
      </div>
      {#key $sidebar_exercise_sessions}
        <div
          class=" space-y-2 px-6 absolute w-full top-64 bottom-0 overflow-y-scroll scrollbar-none pb-4"
        >
          {#each $sidebar_exercise_sessions as exercise_session, idx}
            <Exercise this_exercise_session={exercise_session} index={idx} />
          {/each}
        </div>
      {/key}
    {/if}
  {/key}
</aside>

<style>
  aside {
    right: -100%;
    transition: right 0.3s ease-in-out;
  }
</style>
