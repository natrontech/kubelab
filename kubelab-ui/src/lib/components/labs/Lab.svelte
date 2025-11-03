<script lang="ts">
  import type {
    ExerciseSessionsRecord,
    ExerciseSessionsResponse,
    ExercisesResponse,
    LabSessionsResponse,
    LabsResponse
  } from "$lib/pocketbase/generated-types";
  import { getExerciseSessionByExercise } from "$lib/stores/data";
  import { loadingExercises } from "$lib/stores/loading";
  import {
    sidebar_exercise_sessions,
    sidebar_exercises,
    sidebar_lab,
    sidebar_lab_session
  } from "$lib/stores/sidebar";
  import { getTimeAgo } from "$lib/utils/time";
  import { CheckCircle, Inspect, Pause, Play, XCircle } from "lucide-svelte";
  import { Card, CardContent, CardHeader } from "$lib/components/ui/card";
  import { Button } from "$lib/components/ui/button";
  import { Badge } from "$lib/components/ui/badge";

  export let this_lab: LabsResponse = $sidebar_lab || {};
  export let this_lab_session: LabSessionsResponse = $sidebar_lab_session || {};
  export let this_exercises: ExercisesResponse[] = $sidebar_exercises || [];
  export let this_exercise_sessions: ExerciseSessionsResponse[] = $sidebar_exercise_sessions || [];

  $: console.log(this_lab_session);

  function getDoneExercises() {
    let done_exercises: ExercisesResponse[] = [];
    // each exercise_session which has an endTimestamp is done
    this_exercise_sessions.forEach((exercise_session) => {
      if (exercise_session.endTime) {
        let exercise = this_exercises.find((exercise) => exercise.id === exercise_session.exercise);
        if (exercise) {
          done_exercises.push(exercise);
        }
      }
    });
    return done_exercises;
  }

  function handleSideBar() {
    drawerHidden = !drawerHidden;
    if (!drawerHidden) {
      sidebar_lab.set(this_lab);
      sidebar_lab_session.set(this_lab_session);
      sidebar_exercises.set(this_exercises);
      sidebar_exercise_sessions.set(this_exercise_sessions);
      return;
    }
    sidebar_lab.set(this_lab);
    sidebar_lab_session.set(this_lab_session);
    sidebar_exercises.set(this_exercises);
    sidebar_exercise_sessions.set(this_exercise_sessions);
  }

  export let drawerHidden = true;
</script>

{#if this_lab_session}
  {#key this_lab_session}
    <Card class="hover:shadow-xl transition-all duration-300 border-2 hover:border-primary">
      <CardHeader class="border-b bg-muted/30">
        <div class="flex items-center gap-x-4">
          <h3 class="text-lg font-bold leading-6 flex-1">{this_lab.title}</h3>
          <div class="relative">
            <Button variant="outline" size="sm" on:click={() => handleSideBar()} class="hover:bg-primary hover:text-white transition-colors">
              <Inspect class="w-4 h-4" />
            </Button>

            {#if this_lab_session.clusterRunning}
              <span class="absolute flex h-3 w-3 -top-1 -right-1">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
            {/if}
          </div>
        </div>
      </CardHeader>
      <CardContent class="pt-6">
        <dl class="space-y-4 text-sm">
          <div class="flex justify-between items-center">
            <dt class="text-muted-foreground">Status</dt>
            <dd>
              <Badge variant={this_lab_session.clusterRunning ? "default" : "outline"} class="gap-1">
                {#if this_lab_session.clusterRunning}
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
            <dt class="text-muted-foreground">Time</dt>
            <dd class={this_lab_session.clusterRunning ? "text-green-600 font-medium" : "text-muted-foreground"}>
              {#if this_lab_session.clusterRunning && this_lab_session.startTime}
                since {getTimeAgo(this_lab_session.startTime)}
              {:else if this_lab_session.endTime && !this_lab_session.clusterRunning}
                {getTimeAgo(this_lab_session.endTime)} ago
              {/if}
            </dd>
          </div>
          <div class="flex justify-between items-center">
            <dt class="text-muted-foreground">Done Exercises</dt>
            <dd class="flex items-center gap-x-2">
              {#if getDoneExercises().length == this_exercises.length}
                <CheckCircle class="w-5 h-5 text-green-600" />
                <span class="font-medium text-green-600">
                  {getDoneExercises().length} / {this_exercises.length}
                </span>
              {:else}
                <XCircle class="w-5 h-5 text-red-500" />
                <span class="font-medium text-red-500">
                  {getDoneExercises().length} / {this_exercises.length}
                </span>
              {/if}
            </dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  {/key}
{/if}
