<script lang="ts">
  import type {
    ExerciseSessionsResponse,
    ExercisesResponse
  } from "$lib/pocketbase/generated-types";
  import { marked } from "marked";
  import { metadata } from "$lib/stores/metadata";
  import { goto } from "$app/navigation";
  import { ArrowLeft, Check, MapPin, RotateCcw, RotateCw, StopCircle } from "lucide-svelte";
  import { client } from "$lib/pocketbase/index.js";
  import toast from "svelte-french-toast";
  import { page } from "$app/stores";

  $metadata.title = "Exercises";

  export let data;
  let restartLoading = false;

  $: exercise = data.exercise as ExercisesResponse;
  $: exercises = data.exercises as ExercisesResponse[];
  $: exercise_sessions = data.filtered_exercise_sessions as ExerciseSessionsResponse[];
  $: every_exercise_sessions = data.exercise_sessions as ExerciseSessionsResponse[];

  function handleSwitchExercise(exercise_session_id: string) {
    let lab_session_id = data.pathname.split("/")[2];
    goto("/labs/" + lab_session_id + "/" + exercise_session_id);
  }

  async function handleCheckExercise() {
    // fetch get https://agentUrl/check
    // if 200, then exercise is completed
    // if 500, then exercise is not completed
    let lab_session_id = data.pathname.split("/")[2];
    let exercise_id = window.location.pathname.split("/")[3];
    let agentUrl =
      "kubelab.swisscom.k8s.natron.cloud/kubelab-" +
      lab_session_id +
      "-" +
      exercise_id +
      "-" +
      client.authStore.model?.id;

    await fetch("https://" + agentUrl + "/check")
      .then((response) => {
        if (response.status === 200) {
          client.collection("exercise_sessions").update(exercise_sessions[0].id, {
            endTime: new Date().toISOString(),
            agentRunning: false
          });
          toast.success("Exercise completed");
        } else {
          toast.error("Exercise not completed");
        }
      })
      .catch((error) => {
        console.error(error);
        toast.error("Exercise not completed");
      });
  }

  async function handleRestartExercise() {
    // fetch POST https://agentUrl/bootstrap
    // if 200, then exercise is restarted
    // if 500, then exercise is not restarted
    restartLoading = true;
    let lab_session_id = data.pathname.split("/")[2];
    let exercise_id = window.location.pathname.split("/")[3];
    let agentUrl =
      "kubelab.swisscom.k8s.natron.cloud/kubelab-" +
      lab_session_id +
      "-" +
      exercise_id +
      "-" +
      client.authStore.model?.id;

    await fetch("https://" + agentUrl + "/bootstrap", {
      method: "POST"
    })
      .then((response) => {
        if (response.status === 200) {
          toast.success("Exercise restarted");
        } else {
          toast.error("Exercise not restarted");
        }
      })
      .catch((error) => {
        console.error(error);
        toast.error("Exercise not restarted");
      })
      .finally(() => {
        restartLoading = false;
      });
  }

  async function handleStopExercise() {
    await client
      .collection("exercise_sessions")
      .update(exercise_sessions[0].id, {
        agentRunning: false
      })
      .then((record: any) => {
        toast.success("Exercise stopped");
        exercise_sessions[0] = record;
      })
      .catch((error) => {
        console.error(error);
        toast.error("Exercise failed to stop");
      });
  }

  function getExerciseSession(exercise_id: string) {
    let exercise_session = every_exercise_sessions.find((exercise_session) => {
      return exercise_session.exercise === exercise_id;
    });

    if (exercise_session) {
      return exercise_session.endTime;
    }

    return false;
  }

  function isCurrentExercise(exercise_id: string) {
    return exercise.id === exercise_id;
  }
</script>

<div class="">
  <div class="absolute top-0 h-16 left-0 right-0">
    <div class="mt-4 flex justify-between px-2">
      <!-- add back button -->
      <button class="btn btn-neutral" on:click={() => goto("/labs/" + data.pathname.split("/")[2])}>
        <ArrowLeft class="inline-block w-4 h-4 mr-2" />
        Back
      </button>

      <div class="">
        <ul class="steps mt-1">
          {#each exercises as exercise, i}
            <button
              on:click={() => handleSwitchExercise(exercise.id)}
              data-content={isCurrentExercise(exercise.id) ? "●" : getExerciseSession(exercise.id) ? "✓" : i + 1}
              class="step
          {getExerciseSession(exercise.id) ? 'step-success' : ''}
          "
            >
              <li />
            </button>
          {/each}
        </ul>
      </div>
    </div>
  </div>
  <div class="absolute top-16 bottom-16 left-0 right-0">
    <slot />
  </div>
  <div class="absolute h-16 bottom-0 left-0 right-0">
    <div class="mt-2 flex justify-between px-2">
      <button class="btn btn-error" on:click={() => handleStopExercise()}>
        <StopCircle class="inline-block mr-2" />
        Stop
      </button>
      <button class="btn btn-warning" on:click={() => handleRestartExercise()}>
        {#if restartLoading}
          <RotateCw class="inline-block mr-2 animate-spin" />
          Restart
        {:else}
          <RotateCw class="inline-block mr-2" />
          Restart
        {/if}
      </button>
      <button class="btn btn-success" on:click={() => handleCheckExercise()}>
        <Check class="inline-block mr-2" />
        Check
      </button>
    </div>
  </div>
</div>
