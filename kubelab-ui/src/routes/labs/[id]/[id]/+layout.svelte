<script lang="ts">
  import { metadata } from "$lib/stores/metadata";
  import { goto } from "$app/navigation";
  import { ArrowLeft, Check, RotateCw, StopCircle } from "lucide-svelte";
  import { client } from "$lib/pocketbase/index.js";
  import toast from "svelte-french-toast";
  import {
    exercise,
    exercise_session,
    exercise_sessions,
    exercises,
    filterExerciseSessionsByLab,
    filterExercisesByLab,
    getExerciseSessionByExercise,
    updateDataStores
  } from "$lib/stores/data.js";

  $metadata.title = "Exercises";

  export let data;
  let restartLoading = false;

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
          client
            .collection("exercise_sessions")
            .update($exercise_session.id, {
              endTime: new Date().toISOString(),
              agentRunning: false
            })
            .then((record: any) => {
              let duration =
                new Date(record.endTime).getTime() - new Date(record.startTime).getTime();
              // show in m and s
              let diffString = Math.floor(duration / 1000 / 60) + "m ";
              diffString += Math.floor((duration / 1000) % 60) + "s";
              toast.success("Exercise completed in " + diffString);
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

              filterExercisesByLab(labId)
            });
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
      .update($exercise_session.id, {
        agentRunning: false
      })
      .then((record: any) => {
        toast.success("Exercise stopped");
        exercise_session.set(record);
      })
      .catch((error) => {
        console.error(error);
        toast.error("Exercise failed to stop");
      });
  }

  function checkIfExerciseIsDone(exercise_id: string) {
    console.log("checkIfExerciseIsDone");
    let temp_exercise_session = getExerciseSessionByExercise(exercise_id);
    if (temp_exercise_session) {
      return temp_exercise_session.endTime;
    }
    return false;
  }

  function isCurrentExercise(exercise_id: string) {
    return $exercise.id === exercise_id;
  }
</script>

<div class="">
  <div class="absolute top-0 h-16 left-0 right-0 bg-neutral">
    <div class="mt-2 flex justify-between px-2">
      <!-- add back button -->
      <button class="btn btn-neutral" on:click={() => goto("/labs/" + data.pathname.split("/")[2])}>
        <ArrowLeft class="inline-block w-4 h-4 mr-2" />
        Back
      </button>
      <button
        class="btn {!$exercise_session.agentRunning ? 'btn-disabled' : 'btn-success'}"
        on:click={() => handleCheckExercise()}
      >
        <Check class="inline-block mr-2" />
        {$exercise_session.endTime ? "Check (already done)" : "Check"}
      </button>
    </div>
  </div>
  <div class="absolute top-16 bottom-16 left-0 right-0">
    <slot />
  </div>
  <div class="absolute h-16 bottom-0 left-0 right-0 bg-neutral">
    <div class="mt-2 flex justify-between px-2">
      <div>
        <button
          class="btn {!$exercise_session.agentRunning ? 'btn-disabled' : 'btn-error'}"
          on:click={() => handleStopExercise()}
        >
          <StopCircle class="inline-block mr-2" />
          Stop
        </button>

        <button
          class="btn {!$exercise_session.agentRunning ? 'btn-disabled' : 'btn-warning'}"
          on:click={() => handleRestartExercise()}
        >
          {#if restartLoading}
            <RotateCw class="inline-block mr-2 animate-spin" />
            Restart
          {:else}
            <RotateCw class="inline-block mr-2" />
            Restart
          {/if}
        </button>
      </div>
      <div class="">
        <ul class="steps mt-1">
          {#key ($exercise.id, $exercise_session.id)}
            {#key ($exercise_session.endTime, $exercise_session.agentRunning)}
              {#each $exercises as currentExercise, i}
                <button
                  on:click={() => handleSwitchExercise(currentExercise.id)}
                  data-content={isCurrentExercise(currentExercise.id) ? "●" : i + 1}
                  class="step
          {checkIfExerciseIsDone(currentExercise.id) ? 'step-success' : ''}
          "
                >
                  <li />
                </button>
              {/each}
            {/key}
          {/key}
        </ul>
      </div>
    </div>
  </div>
</div>
