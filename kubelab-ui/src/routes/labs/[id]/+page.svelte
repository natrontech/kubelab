<script lang="ts">
  import { metadata } from "$lib/stores/metadata";
  import { ArrowLeft, Play, TerminalSquare } from "lucide-svelte";
  import {
    exercise_sessions,
    exercises,
    getExerciseSessionByExercise,
    lab
  } from "$lib/stores/data";
  import {
    ExerciseSessionLogsTypeOptions,
    type ExerciseSessionLogsRecord,
    type ExerciseSessionsRecord
  } from "$lib/pocketbase/generated-types";
  import { client } from "$lib/pocketbase";
  import toast from "svelte-french-toast";
  import { loadingExercises } from "$lib/stores/loading";
  import { onDestroy, onMount } from "svelte";
  import { Button } from "$lib/components/ui/button";
  import { Card, CardContent, CardHeader, CardTitle } from "$lib/components/ui/card";
  import { Badge } from "$lib/components/ui/badge";

  $metadata.title = "Exercises";

  function isExerciseRunning(exercise_id: string) {
    return getExerciseSessionByExercise(exercise_id)?.agentRunning;
  }

  let show = false;

  onMount(() => {
    show = true;
  });

  onDestroy(() => {
    show = false;
  });

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
          // goto(`/labs/${labId}/${exercise_id}`);
          toast.success("Exercise started");

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

<div class="container mx-auto py-8 px-4">
  <div class="mb-6">
    <a href="/labs/" on:click={() => (show = false)}>
      <Button variant="outline">
        <ArrowLeft class="inline-block w-4 h-4 mr-2" />
        Back to Labs
      </Button>
    </a>
  </div>
  
  <h1 class="text-center text-4xl font-bold mb-8 text-foreground">
    Exercises
  </h1>
  
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {#if show}
      {#key $exercise_sessions}
        {#each $exercises as exercise, i}
          <Card class="hover:shadow-lg transition-all relative {getExerciseSessionByExercise(exercise.id)?.endTime ? 'border-green-500 border-2' : ''}">
            <CardHeader>
              <div class="flex items-start justify-between">
                <Badge variant="outline" class="absolute top-4 right-4">#{i + 1}</Badge>
                <div class="space-y-2">
                  <Badge 
                    variant={getExerciseSessionByExercise(exercise.id)?.agentRunning ? "default" : "outline"}
                    class={getExerciseSessionByExercise(exercise.id)?.agentRunning ? "bg-green-600" : ""}
                  >
                    {getExerciseSessionByExercise(exercise.id)?.agentRunning ? "Running" : "Stopped"}
                  </Badge>
                  {#if getExerciseSessionByExercise(exercise.id)?.endTime}
                    <Badge variant="default" class="bg-green-600">
                      ✓ Completed
                    </Badge>
                  {:else}
                    <Badge variant="outline" class="text-muted-foreground">
                      Not Completed
                    </Badge>
                  {/if}
                </div>
              </div>
              <CardTitle class="mt-4">{exercise.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div class="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isExerciseRunning(exercise.id)}
                  on:click={() => startExercise(exercise.id)}
                >
                  {#if $loadingExercises.has(exercise.id)}
                    <span class="loading loading-dots loading-sm mr-2"></span>
                    Starting...
                  {:else}
                    <Play class="h-4 w-4 mr-2" />
                    Start
                  {/if}
                </Button>
                <a href={exercise.id}>
                  <Button variant="default">
                    <TerminalSquare class="h-4 w-4 mr-2" />
                    Console
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>
        {/each}
      {/key}
    {/if}
  </div>
</div>
