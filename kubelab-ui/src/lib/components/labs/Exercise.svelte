<script lang="ts">
  import { goto } from "$app/navigation";
  import { client } from "$lib/pocketbase";
  import {
    ExerciseSessionLogsTypeOptions,
    type ExerciseSessionLogsRecord,
    type ExerciseSessionsRecord,
    type ExerciseSessionsResponse,
    type ExercisesResponse
  } from "$lib/pocketbase/generated-types";
  import {
    exercise,
    exercise_sessions,
    exercises,
    getExerciseSessionByExercise
  } from "$lib/stores/data";
  import { loadingExercises } from "$lib/stores/loading";
  import {
    sidebarOpen,
    sidebar_exercise_sessions,
    sidebar_exercises,
    sidebar_lab,
    sidebar_lab_session
  } from "$lib/stores/sidebar";
  import { getDeltaTime } from "$lib/utils/time";
  import {
    AlertTriangle,
    CheckCircle,
    Info,
    MoreHorizontal,
    Pause,
    Play,
    Terminal
  } from "lucide-svelte";
  import { onMount } from "svelte";
  import toast from "svelte-french-toast";
  import { Card, CardContent, CardHeader } from "$lib/components/ui/card";
  import { Button } from "$lib/components/ui/button";
  import { Badge } from "$lib/components/ui/badge";
  export let this_exercise_session: ExerciseSessionsResponse;
  let this_exercise: ExercisesResponse;
  let confirmation = false;

  onMount(() => {
    let exercise = $sidebar_exercises.find(
      (exercise) => exercise.id === this_exercise_session.exercise
    );
    if (exercise) {
      this_exercise = exercise;
    }
  });

  async function stopExercise(exercise_id: string) {
    const data: ExerciseSessionsRecord = {
      // @ts-ignore
      user: client.authStore.model?.id,
      exercise: exercise_id,
      startTime: new Date().toISOString(),
      endTime: "",
      agentRunning: false
    };

    loadingExercises.update((exercises) => {
      exercises.add(exercise_id);
      return new Set(exercises); // Required for Svelte's reactivity
    });

    // const labId = window.location.pathname.split("/")[2];

    const exercise_session_id = getExerciseSessionByExercise(exercise_id)?.id;

    if (exercise_session_id) {
      await client
        .collection("exercise_sessions")
        .update(exercise_session_id, data)
        // @ts-ignore
        .then((response: any) => {
          // goto(`/labs/${labId}/${exercise_id}`);
          toast.success("Exercise stopped");
          this_exercise_session = response;
          $sidebar_exercise_sessions = $sidebar_exercise_sessions.map((exercise_session) => {
            if (exercise_session.id === exercise_session_id) {
              return response;
            }
            return exercise_session;
          });

          exercise_sessions.update((exercise_sessions) => {
            return exercise_sessions.map((exercise_session) => {
              if (exercise_session.id === exercise_session_id) {
                return response;
              }
              return exercise_session;
            });
          });
        })
        .catch((error) => {
          toast.error(error.message);
        })
        .finally(() => {
          loadingExercises.update((exercises) => {
            exercises.delete(exercise_id);
            return new Set(exercises); // Required for Svelte's reactivity
          });
          confirmation = false;
        });
    }
  }

  async function startExercise(exercise_id: string) {
    const data: ExerciseSessionsRecord = {
      // @ts-ignore
      user: client.authStore.model?.id,
      exercise: exercise_id,
      startTime: new Date().toISOString(),
      endTime: "",
      agentRunning: true
    };

    loadingExercises.update((exercises) => {
      exercises.add(exercise_id);
      return new Set(exercises); // Required for Svelte's reactivity
    });

    // const labId = window.location.pathname.split("/")[2];

    const exercise_session_id = getExerciseSessionByExercise(exercise_id)?.id;
    if (exercise_session_id) {
      await client
        .collection("exercise_sessions")
        .update(exercise_session_id, data)
        // @ts-ignore
        .then((response: any) => {
          toast.success("Exercise started");
          this_exercise_session = response;
          $sidebar_exercise_sessions = $sidebar_exercise_sessions.map((exercise_session) => {
            if (exercise_session.id === exercise_session_id) {
              return response;
            }
            return exercise_session;
          });

          exercise_sessions.update((exercise_sessions) => {
            return exercise_sessions.map((exercise_session) => {
              if (exercise_session.id === exercise_session_id) {
                return response;
              }
              return exercise_session;
            });
          });

          // make an entry in the exercise_session_logs collection

          const exercise_session_log_data: ExerciseSessionLogsRecord = {
            // @ts-ignore
            user: client.authStore.model?.id,
            exercise_session: exercise_session_id,
            type: ExerciseSessionLogsTypeOptions.start,
            timestamp: new Date().toISOString()
          };

          client
            .collection("exercise_session_logs")
            .create(exercise_session_log_data)
            .then((response) => {})
            .catch((error) => {
              console.log(error);
            });
        })
        .catch((error) => {
          toast.error(error.message);
        })
        .finally(() => {
          loadingExercises.update((exercises) => {
            exercises.delete(exercise_id);
            return new Set(exercises); // Required for Svelte's reactivity
          });
        });
    }
  }
</script>

{#if this_exercise}
  <Card class="hover:shadow-md transition-all">
    <CardHeader class="border-b">
      <div class="flex items-center gap-x-4">
        <h4 class="text-sm font-medium flex-1">{this_exercise.title}</h4>
        {#if $sidebar_lab_session.clusterRunning}
          <div class="relative dropdown dropdown-end dropdown-bottom">
            <Button
              variant="default"
              size="sm"
              class="relative"
              disabled={$loadingExercises.has(this_exercise.id)}
            >
              {#if $loadingExercises.has(this_exercise.id)}
                <span class="loading loading-dots loading-sm"></span>
                Actions
                <ul class="dropdown-content z-[1] menu p-2 shadow bg-card border rounded-lg w-52 gap-2 mt-2">
                  <li>
                    <Button variant="ghost" size="sm" class="justify-start gap-2 w-full" disabled>
                      <Info class="w-4 h-4" />
                      Starting Exercise
                    </Button>
                  </li>
                </ul>
              {:else}
                <button class="-m-3 block p-2.5">
                  Actions <MoreHorizontal class="w-5 h-5 inline-block" strokeWidth={3} />
                </button>
                <ul class="dropdown-content z-[1] menu p-2 shadow bg-card border rounded-lg w-52 gap-2 mt-2">
                  <li>
                    <Button
                      variant="ghost"
                      size="sm"
                      class="justify-start gap-2 w-full text-primary hover:text-primary"
                      on:click={() => {
                        sidebarOpen.set(false);
                        exercise.set(this_exercise);
                        exercises.set($sidebar_exercises);
                        new Promise((resolve) => setTimeout(resolve, 100)).then(() =>
                          goto(`/labs/${$sidebar_lab.id}/${this_exercise.id}`)
                        );
                      }}
                    >
                      <Terminal class="w-4 h-4" />
                      Shell
                    </Button>
                  </li>
                  {#if this_exercise_session.agentRunning}
                    <li>
                      {#if confirmation}
                        <Button
                          variant="ghost"
                          size="sm"
                          class="justify-start gap-2 w-full text-yellow-600 hover:text-yellow-600"
                          on:click={() => stopExercise(this_exercise.id)}
                        >
                          <AlertTriangle class="w-4 h-4" />
                          Are you sure?
                        </Button>
                      {:else}
                        <Button
                          variant="ghost"
                          size="sm"
                          class="justify-start gap-2 w-full text-red-600 hover:text-red-600"
                          on:click={() => (confirmation = true)}
                        >
                          <Pause class="w-4 h-4" />
                          Stop Exercise
                        </Button>
                      {/if}
                    </li>
                  {:else}
                    <li>
                      <Button
                        variant="ghost"
                        size="sm"
                        class="justify-start gap-2 w-full text-green-600 hover:text-green-600"
                        on:click={() => startExercise(this_exercise.id)}
                      >
                        <Play class="w-4 h-4" />
                        Start Exercise
                      </Button>
                    </li>
                  {/if}
                </ul>
              {/if}
              {#if this_exercise_session.agentRunning}
                <span class="absolute flex h-3 w-3 -top-1 -right-1">
                  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                  <span class="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
              {/if}
            </Button>
          </div>
        {:else}
          <p class="text-destructive text-sm">Lab not running</p>
        {/if}
      </div>
    </CardHeader>
    <CardContent class="pt-6">
      <dl class="space-y-4 text-sm">
        <div class="flex justify-between items-center">
          <dt class="text-muted-foreground">Status</dt>
          <dd>
            <Badge variant={this_exercise_session.agentRunning ? "default" : "outline"} class="gap-1">
              {#if this_exercise_session.agentRunning}
                <Play class="w-3 h-3" />
                Running
              {:else}
                <Pause class="w-3 h-3" />
                Stopped
              {/if}
            </Badge>
          </dd>
        </div>
        <div class="flex justify-between items-center">
          <dt class="text-muted-foreground">Done</dt>
          <dd>
            {#if this_exercise_session.endTime && !this_exercise_session.agentRunning}
              <span class="flex items-center gap-1 text-green-600 font-medium">
                <CheckCircle class="w-4 h-4" />
                {getDeltaTime(this_exercise_session.startTime, this_exercise_session.endTime)}
              </span>
            {:else}
              <span class="text-muted-foreground">not yet</span>
            {/if}
          </dd>
        </div>
      </dl>
    </CardContent>
  </Card>
{/if}
