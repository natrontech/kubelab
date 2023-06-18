<script lang="ts">
  import { client } from "$lib/pocketbase";
  import type {
    ExerciseSessionsRecord,
    ExerciseSessionsResponse,
    ExercisesResponse,
    LabSessionsRecord,
    LabSessionsResponse,
    LabsResponse
  } from "$lib/pocketbase/generated-types";
    import { lab_sessions, updateDataStores } from "$lib/stores/data";
  import { Inspect, Play, StopCircle, TerminalSquare } from "lucide-svelte";
  import toast from "svelte-french-toast";

  export let lab: LabsResponse;
  export let lab_session: LabSessionsResponse;
  export let exercises: ExercisesResponse[];
  export let exercise_sessions: ExerciseSessionsResponse[];

  let loading = false;

  function getDoneExercises() {
    let done_exercises: ExercisesResponse[] = [];
    // each exercise_session which has an endTimestamp is done
    exercise_sessions.forEach((exercise_session) => {
      if (exercise_session.endTime) {
        let exercise = exercises.find((exercise) => exercise.id === exercise_session.exercise);
        if (exercise) {
          done_exercises.push(exercise);
        }
      }
    });
    return done_exercises;
  }

  async function startLab() {

    // if there is more than one lab_session clusterRunning = true, fail
    if ($lab_sessions.filter((lab_session) => lab_session.clusterRunning).length > 0) {
      toast.error("There is already a lab running");
      updateDataStores();
      return;
    }

    const data: LabSessionsRecord = {
      clusterRunning: true,
      // @ts-ignore
      user: client.authStore.model?.id,
      lab: lab.id,
      startTime: new Date().toISOString()
    };

    loading = true;

    await client
      .collection("lab_sessions")
      .update(lab_session.id, data)
      // @ts-ignore
      .then((record: LabSessionsResponse) => {
        toast.success("Lab started");
        lab_session = record;
      })
      .catch((error) => {
        console.error(error);
        toast.error("Lab failed to start");
      })
      .finally(() => {
        loading = false;
      });
  }

  // TODO: add modal to confirm stop lab
  async function stopLab() {
    const data: LabSessionsRecord = {
      clusterRunning: false,
      // @ts-ignore
      user: client.authStore.model?.id,
      lab: lab.id,
      endTime: new Date().toISOString()
    };

    loading = true;

    // update each exercise session to stop agentRunning = false
    exercise_sessions.forEach(async (exercise_session) => {
      const exercise_session_data: ExerciseSessionsRecord = {
        agentRunning: false,
        // @ts-ignore
        user: client.authStore.model?.id,
        exercise: exercise_session.exercise
      };
      await client
        .collection("exercise_sessions")
        .update(exercise_session.id, exercise_session_data)
        // @ts-ignore
        .then((record: ExerciseSessionsResponse) => {
          exercise_session = record;
        })
        .catch((error) => {
          console.error(error);
        });
    });

    await client
      .collection("lab_sessions")
      .update(lab_session.id, data)
      // @ts-ignore
      .then((record: LabSessionsResponse) => {
        setTimeout(() => {
          toast.success("Lab stopped");
          lab_session = record;
        }, 3000);
      })
      .catch((error) => {
        console.error(error);
        toast.error("Lab failed to stop");
      })
      .finally(() => {
        // wait 3 seconds before loading false
        setTimeout(() => {
          loading = false;
        }, 3000);
      });
  }

  function getTimeAgo(isoString: string) {
    const now = new Date(); // Current time
    const pastTime = new Date(isoString); // Time from ISO string

    const timeDiffMilliseconds = now.getTime() - pastTime.getTime();
    const timeDiffSeconds = Math.floor(timeDiffMilliseconds / 1000);

    // Calculate the time difference in seconds, minutes, hours, days, months, or years
    if (timeDiffSeconds < 60) {
      return timeDiffSeconds + " seconds";
    } else if (timeDiffSeconds < 3600) {
      const minutes = Math.floor(timeDiffSeconds / 60);
      return minutes + (minutes === 1 ? " minute" : " minutes");
    } else if (timeDiffSeconds < 86400) {
      const hours = Math.floor(timeDiffSeconds / 3600);
      return hours + (hours === 1 ? " hour" : " hours");
    } else if (timeDiffSeconds < 2592000) {
      const days = Math.floor(timeDiffSeconds / 86400);
      return days + (days === 1 ? " day" : " days");
    } else if (timeDiffSeconds < 31536000) {
      const months = Math.floor(timeDiffSeconds / 2592000);
      return months + (months === 1 ? " month" : " months");
    } else {
      const years = Math.floor(timeDiffSeconds / 31536000);
      return years + (years === 1 ? " year" : " years");
    }
  }
</script>

<div
  class="collapse border-black border-4 bg-base-200 overflow-visible"
>
  <div class="collapse-title text-xl font-medium">
    {lab.title}
    <!-- show some stats -->
    <span class="badge badge-outline {lab_session.clusterRunning ? 'badge-accent' : ''} ml-2"
      >{lab_session.clusterRunning ? "Running" : "Stopped"}
      <span class="ml-1 text-gray-500 text-xs">
        {#if lab_session.clusterRunning && lab_session.startTime}
          ( since
          {getTimeAgo(lab_session.startTime)}
          )
        {:else if lab_session.endTime && !lab_session.clusterRunning}
          (
          {getTimeAgo(lab_session.endTime)}
          ago )
        {/if}
      </span>
    </span>
    <!-- show how many exercises are done already -->
  </div>
  <div class="collapse-content">
    <p>{lab.description}</p>
  </div>
  <div class="justify-end content-end flex">
    <div
      class="absolute bottom-2 left-4 {getDoneExercises().length === exercises.length
        ? 'text-green-500'
        : 'text-orange-500'}"
    >
      {getDoneExercises().length} / {exercises.length} exercises finished
    </div>

    <div class="grid grid-cols-2 gap-2 mb-2 mr-2">
      {#if lab_session.clusterRunning}
        <div class="tooltip" data-tip="stop lab">
          <button class="btn btn-error" on:click={() => stopLab()}>
            {#if loading}
              <span class="loading loading-dots loading-md" />
            {:else}
              <StopCircle />
            {/if}
          </button>
        </div>
      {:else}
        <div />
        <div class="tooltip" data-tip="start lab">
          <button class="btn btn-success" on:click={() => startLab()}>
            {#if loading}
              <span class="loading loading-dots loading-md" />
            {:else}
              <Play />
            {/if}
          </button>
        </div>
      {/if}
      {#if lab_session.clusterRunning}
        <div class="tooltip" data-tip="exercises">
          <a href={lab.id}>
            <button class="btn btn-neutral"><Inspect /></button>
          </a>
        </div>
      {/if}
    </div>
  </div>
</div>
