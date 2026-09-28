<script lang="ts">
  import SideOver from "$lib/components/base/SideOver.svelte";
  import Lab from "$lib/components/labs/Lab.svelte";
  import type {
    ExerciseSessionsResponse,
    ExercisesResponse,
    LabSessionsResponse
  } from "$lib/pocketbase/generated-types";
  import { exercise_sessions, exercises, lab_sessions, labs } from "$lib/stores/data";
  import { metadata } from "$lib/stores/metadata";

  $metadata.title = "Labs";

  function getLabSessions(lab_id: string): LabSessionsResponse {
    let lab_session = $lab_sessions.find((lab_session) => lab_session.lab === lab_id);
    // only return the lab session if it exists
    // @ts-ignore
    return lab_session;
  }

  function getExercises(lab_id: string): ExercisesResponse[] {
    let lab_exercises = $exercises.filter((exercise) => exercise.lab === lab_id);
    // only return the lab session if it exists
    // @ts-ignore
    return lab_exercises;
  }

  function getExercisesSessions(lab_id: string): ExerciseSessionsResponse[] {
    let lab_exercises_sessions: ExerciseSessionsResponse[] = [];
    let lab_exercises = getExercises(lab_id);
    lab_exercises.forEach((exercise) => {
      let exercise_session = $exercise_sessions.find(
        (exercise_session) => exercise_session.exercise === exercise.id
      );
      if (exercise_session) {
        lab_exercises_sessions.push(exercise_session);
      }
    });
    return lab_exercises_sessions;
  }

  let drawerHidden = true;
</script>

<!-- Backdrop -->
{#if !drawerHidden}
  <div
    class="fixed inset-0 bg-black/50 z-40 transition-opacity"
    on:click={() => drawerHidden = true}
    on:keydown={(e) => e.key === 'Escape' && (drawerHidden = true)}
    role="button"
    tabindex="-1"
  ></div>
{/if}

<!-- Drawer -->
<div
  class="fixed top-0 right-0 bottom-0 w-full sm:w-2/5 bg-background border-l shadow-lg z-50 overflow-y-auto transform transition-transform duration-200 {drawerHidden ? 'translate-x-full' : 'translate-x-0'}"
>
  <SideOver bind:drawerHidden />
</div>
    {#if $lab_sessions.length > 0}
      <div class="container mx-auto py-12 px-4">
        <div class="text-center space-y-4 mb-12">
          <h1 class="text-4xl md:text-5xl font-bold text-foreground">Labs</h1>
          {#key $lab_sessions}
            <p class="text-xl text-muted-foreground max-w-2xl mx-auto">
              Running labs:
              <span class="font-bold text-primary"
                >{$lab_sessions.filter((lab_session) => lab_session.clusterRunning).length}</span
              > / 2
            </p>
          {/key}
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {#each $labs as this_lab}
            <Lab
              {this_lab}
              this_lab_session={getLabSessions(this_lab.id)}
              this_exercises={getExercises(this_lab.id)}
              this_exercise_sessions={getExercisesSessions(this_lab.id)}
              bind:drawerHidden
            />
          {/each}
        </div>
      </div>
    {/if}
