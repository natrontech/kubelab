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
  import { Button } from "$lib/components/ui/button";
  import { Badge } from "$lib/components/ui/badge";

  let docs: string;
  export let drawerHidden = true;
  let confirmation = false;
  let aboutExpanded = false;

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
        <Badge 
          variant={$sidebar_lab_session.clusterRunning ? "default" : "outline"}
          class={$sidebar_lab_session.clusterRunning ? "bg-green-600 gap-1" : "gap-1"}
        >
          {#if $sidebar_lab_session.clusterRunning}
            <Play class="w-3 h-3" />
          {:else}
            <Pause class="w-3 h-3" />
          {/if}
          {$sidebar_lab_session.clusterRunning ? "Running" : "Stopped"}
        </Badge>
        <div class="grid grid-cols-1 gap-2 mt-4">
          {#if !$sidebar_lab_session.clusterRunning}
            <Button
              variant="outline"
              class="text-green-600 border-green-600 hover:bg-green-600 hover:text-white"
              on:click={() => startLab($sidebar_lab_session.id)}
              disabled={$loadingLabs.has($sidebar_lab_session.id)}
            >
              {#if $loadingLabs.has($sidebar_lab_session.id)}
                <span class="loading loading-dots loading-sm mr-2"></span>
                Starting...
              {:else}
                <Play class="w-5 h-5 mr-2" />
                Start lab
              {/if}
            </Button>
          {:else if $loadingLabs.has($sidebar_lab_session.id)}
            <Button variant="outline" disabled>
              <span class="loading loading-dots loading-sm mr-2"></span>
              Stopping lab
            </Button>
          {:else if confirmation}
            <Button
              variant="outline"
              class="text-yellow-600 border-yellow-600 hover:bg-yellow-600 hover:text-white"
              on:click={() => stopLab($sidebar_lab_session.id)}
            >
              <AlertTriangle class="w-5 h-5 mr-2" />
              Are you sure?
            </Button>
          {:else}
            <Button
              variant="outline"
              class="text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
              on:click={() => (confirmation = true)}
            >
              <Pause class="w-5 h-5 mr-2" />
              Stop lab
            </Button>
          {/if}
        </div>
        <div class="border-2 border-primary rounded-lg my-4 shadow-sm overflow-hidden">
          <button
            class="w-full px-4 py-3 text-left font-medium hover:bg-accent transition-colors flex items-center justify-between"
            on:click={() => {
              aboutExpanded = !aboutExpanded;
              if (!docs) getMarkdown();
            }}
          >
            <span>About the lab</span>
            <span class="transform transition-transform {aboutExpanded ? 'rotate-180' : ''}">
              ▼
            </span>
          </button>
          {#if aboutExpanded}
            <div class="px-4 py-3 border-t">
              <SvelteMarkdown
                source={docs}
                renderers={{
                  codespan: CodeSpanComponent,
                  code: CodeComponent,
                  link: LinkComponent
                }}
              />
            </div>
          {/if}
        </div>
        <div class="absolute top-5 right-6">
          <Button
            variant="ghost"
            size="icon"
            on:click={() => {
              drawerHidden = !drawerHidden;
            }}
          >
            <X class="h-5 w-5" />
          </Button>
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
