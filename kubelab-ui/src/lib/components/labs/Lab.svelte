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
  import { exercise, exercise_sessions, lab_sessions } from "$lib/stores/data";
  import { loadingLabs } from "$lib/stores/loading";
  import { Inspect, Play, StopCircle } from "lucide-svelte";
  import toast from "svelte-french-toast";
  import SvelteMarkdown from "svelte-markdown";
  import CodeSpanComponent from "$lib/components/markdown/CodeSpanComponent.svelte";
  import CodeComponent from "$lib/components/markdown/CodeComponent.svelte";
  import LinkComponent from "$lib/components/markdown/LinkComponent.svelte";
    import { onMount } from "svelte";

  export let this_lab: LabsResponse;
  export let this_lab_session: LabSessionsResponse;
  export let this_exercises: ExercisesResponse[];
  export let this_exercise_sessions: ExerciseSessionsResponse[];

  let docs: string;

  async function getMarkdown() {
    fetch(this_lab.docs)
      .then((response) => response.text())
      .then((text) => {
        docs = text;
      }).catch((error) => {
        console.error(error);
      });
  }

  onMount(() => {
    getMarkdown();
  });

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

  async function startLab() {
    // if there is more than one lab_session clusterRunning = true, fail
    if ($lab_sessions.filter((lab_session) => lab_session.clusterRunning).length > 1) {
      toast.error("There are already two lab running");
      return;
    }

    if ($loadingLabs.length > 0) {
      toast.error("There is already a lab starting");
      return;
    }

    const data: LabSessionsRecord = {
      clusterRunning: true,
      // @ts-ignore
      user: client.authStore.model?.id,
      lab: this_lab.id,
      startTime: new Date().toISOString()
    };

    $loadingLabs = $loadingLabs.concat(this_lab_session.id);

    await client
      .collection("lab_sessions")
      .update(this_lab_session.id, data)
      // @ts-ignore
      .then((record: LabSessionsResponse) => {
        toast.success("Lab started");
        this_lab_session = record;
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
        $loadingLabs = $loadingLabs.filter((id) => id !== this_lab_session.id);
      });
  }

  // TODO: add modal to confirm stop lab
  async function stopLab() {
    const data: LabSessionsRecord = {
      clusterRunning: false,
      // @ts-ignore
      user: client.authStore.model?.id,
      lab: this_lab.id,
      endTime: new Date().toISOString()
    };

    $loadingLabs = $loadingLabs.concat(this_lab_session.id);

    // update each exercise session to stop agentRunning = false
    this_exercise_sessions.forEach(async (this_exercise_session) => {
      const exercise_session_data: ExerciseSessionsRecord = {
        agentRunning: false,
        // @ts-ignore
        user: client.authStore.model?.id,
        exercise: this_exercise_session.exercise
      };
      await client
        .collection("exercise_sessions")
        .update(this_exercise_session.id, exercise_session_data)
        // @ts-ignore
        .then((record: ExerciseSessionsResponse) => {
          this_exercise_session = record;
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
        });
    });

    await client
      .collection("lab_sessions")
      .update(this_lab_session.id, data)
      // @ts-ignore
      .then((record: LabSessionsResponse) => {
        toast.success("Lab stopped");
        this_lab_session = record;
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
        $loadingLabs = $loadingLabs.filter((id) => id !== this_lab_session.id);
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

<div tabindex="0" class="collapse border-neutral border-4 bg-base-200 overflow-visible collapse-arrow">
  <div class="collapse-title text-xl font-medium">
    {this_lab.title}
    <!-- show some stats -->
    <span class="badge badge-outline {this_lab_session.clusterRunning ? 'badge-accent' : ''} ml-2"
      >{this_lab_session.clusterRunning ? "Running" : "Stopped"}
      <span class="ml-1 text-gray-500 text-xs">
        {#if this_lab_session.clusterRunning && this_lab_session.startTime}
          ( since
          {getTimeAgo(this_lab_session.startTime)}
          )
        {:else if this_lab_session.endTime && !this_lab_session.clusterRunning}
          (
          {getTimeAgo(this_lab_session.endTime)}
          ago )
        {/if}
      </span>
    </span>
    <!-- show how many exercises are done already -->
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
  <div class="justify-end content-end flex">
    <div
      class="absolute bottom-2 left-4 {getDoneExercises().length === this_exercises.length
        ? 'text-green-500'
        : 'text-orange-500'}"
    >
      {getDoneExercises().length} / {this_exercises.length} exercises finished
    </div>

    <div class="grid grid-cols-2 gap-2 mb-2 mr-2">
      {#if this_lab_session.clusterRunning}
        <div class="tooltip" data-tip="stop lab">
          <button class="btn btn-error" on:click={() => stopLab()}>
            {#if $loadingLabs.includes(this_lab_session.id)}
              <span class="loading loading-dots loading-md" />
            {:else}
              <StopCircle />
            {/if}
          </button>
        </div>
      {:else}
        <div />
        <div class="tooltip" data-tip="start lab">
          {#key $lab_sessions}
            <button
              class="btn
            {$lab_sessions.filter((lab_session) => lab_session.clusterRunning).length > 1
                ? 'btn-disabled'
                : 'btn-success'}"
              on:click={() => startLab()}
            >
              {#if $loadingLabs.includes(this_lab_session.id)}
                <span class="loading loading-dots loading-md" />
              {:else}
                <Play />
              {/if}
            </button>
          {/key}
        </div>
      {/if}
      {#if this_lab_session.clusterRunning}
        <div class="tooltip" data-tip="exercises">
          <a href={this_lab.id}>
            <button class="btn btn-neutral"><Inspect /></button>
          </a>
        </div>
      {/if}
    </div>
  </div>
</div>
