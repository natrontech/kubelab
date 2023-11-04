<script lang="ts">
  import { metadata } from "$lib/stores/metadata";
  import { goto } from "$app/navigation";
  import {
    ArrowLeft,
    CheckCircle,
    HelpCircle,
    LifeBuoy,
    RotateCw,
    StopCircle,
    StretchHorizontal,
    StretchVertical
  } from "lucide-svelte";
  import { client } from "$lib/pocketbase/index.js";
  import toast from "svelte-french-toast";
  import {
    checkIfExerciseIsDone,
    exercise,
    exercise_session,
    exercise_sessions,
    exercises,
    filterExercisesByLab
  } from "$lib/stores/data.js";

  // @ts-ignore
  import { Confetti } from "svelte-confetti";
  import ToggleConfetti from "$lib/components/base/ToggleConfetti.svelte";
  import horizontalView from "$lib/stores/tableView.js";
  import {
    sidebarOpen,
    sidebar_exercise_sessions,
    sidebar_exercises,
    sidebar_lab
  } from "$lib/stores/sidebar.js";
  import {
    ExerciseSessionLogsTypeOptions,
    type ExerciseSessionLogsRecord,
    type NotificationsRecord,
    NotificationsTypeOptions
  } from "$lib/pocketbase/generated-types.js";

  $metadata.title = "Exercises";

  export let data;
  let restartLoading = false;
  let helpRequested = false;

  function handleSwitchExercise(exercise_session_id: string) {
    let lab_session_id = data.pathname.split("/")[2];
    goto("/labs/" + lab_session_id + "/" + exercise_session_id);
  }

  function filterDuplicateLines(text: any) {
    const lines = text.split("\n"); // Split the text into lines
    const uniqueLines = [...new Set(lines)]; // Filter out duplicate lines
    return uniqueLines.join("\n").trim(); // Join the unique lines back into a single string
  }

  async function handleCheckExercise() {
    // fetch get https://agentUrl/check
    // if 200, then exercise is completed
    // if 500, then exercise is not completed
    let lab_session_id = data.pathname.split("/")[2];
    let exercise_id = window.location.pathname.split("/")[3];
    let agentHost = window.location.host === "localhost:5173" ? "kubelab.ch" : window.location.host;

    let agentUrl =
      agentHost +
      "/kubelab-" +
      lab_session_id +
      "-" +
      exercise_id +
      "-" +
      client.authStore.model?.id;

    await fetch("https://" + agentUrl + "/check")
      .then((response) =>
        response.text().then((text) => {
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
                toast.success("Exercise completed in " + diffString, {
                  style: "border: 1px solid #008000; padding: 16px; color: #008000;", // green-themed style
                  iconTheme: {
                    primary: "#008000",
                    secondary: "#F0FFF0" // light green background
                  }
                });

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

                sidebar_exercise_sessions.update((exercise_sessions) => {
                  return exercise_sessions.map((exercise_session) => {
                    if (exercise_session.id === record.id) {
                      return record;
                    }
                    return exercise_session;
                  });
                });

                filterExercisesByLab(labId);

                // make an entry in the exercise_session_logs collection

                const exercise_session_log_data: ExerciseSessionLogsRecord = {
                  // @ts-ignore
                  user: client.authStore.model?.id,
                  exercise_session: $exercise_session.id,
                  type: ExerciseSessionLogsTypeOptions.end,
                  timestamp: new Date().toISOString()
                };

                client
                  .collection("exercise_session_logs")
                  .create(exercise_session_log_data)
                  .then((response) => {
                    console.log(response);
                  })
                  .catch((error) => {
                    console.log(error);
                  });
              });
          } else {
            let filteredText = filterDuplicateLines(text);
            toast.error("❌ not completed: " + filteredText, {
              style: "border: 1px solid #B22222; padding: 16px; color: #B22222;", // red-themed style
              iconTheme: {
                primary: "#B22222",
                secondary: "#FFE4E1" // light red background
              }
            });
          }
        })
      )
      .catch((error) => {
        console.error(error);
        toast.error("Exercise not completed");
      });
  }

  async function askForHelp() {
    // help if last notification is older than 5 minutes
    let notification = await client
      .collection("notifications")
      .getFullList({
        sort: "-created"
      })
      .then((response) => {
        return response.find((notification) => {
          return (
            notification.user === client.authStore.model?.id &&
            notification.type === NotificationsTypeOptions.help
          );
        });
      })
      .catch((error) => {
        console.log(error);
      });

    if (notification) {
      let notificationDate = new Date(notification.created);
      let now = new Date();
      let diff = now.getTime() - notificationDate.getTime();
      let diffMinutes = Math.floor(diff / 1000 / 60);
      if (diffMinutes < 5) {
        toast.error("You can only ask for help every 5 minutes");
        return;
      }
    }

    const notification_data: NotificationsRecord = {
      // @ts-ignore
      user: client.authStore.model?.id,
      exercise: $exercise.id,
      type: NotificationsTypeOptions.help
    };

    client
      .collection("notifications")
      .create(notification_data)
      .then((response) => {
        toast.success("Help requested, please wait for your trainer.");
        helpRequested = true;
      })
      .catch((error) => {
        console.log(error);
        toast.error("Help request failed");
      });
  }

  async function handleRestartExercise() {
    // fetch POST https://agentUrl/bootstrap
    // if 200, then exercise is restarted
    // if 500, then exercise is not restarted
    restartLoading = true;
    let lab_session_id = data.pathname.split("/")[2];
    let exercise_id = window.location.pathname.split("/")[3];
    let agentHost = window.location.host === "localhost:5173" ? "kubelab.ch" : window.location.host;

    let agentUrl =
      agentHost +
      "/kubelab-" +
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

  function isCurrentExercise(exercise_id: string) {
    return $exercise.id === exercise_id;
  }
</script>

{#key $exercise}
  <div class="absolute top-0 h-20 left-0 right-0 ">
    <div class="mt-5 flex justify-between px-2">
      <button
        class="btn btn-neutral "
        on:click={() => {
          if ($sidebar_lab) {
            sidebarOpen.set(true);
          }
          goto("/labs/");
        }}
      >
        <ArrowLeft class="inline-block w-4 h-4 mr-2" />
        Labs
      </button>
      <ToggleConfetti>
        <button
          slot="label"
          class="btn {!$exercise_session.agentRunning ? 'hidden' : 'btn-success'}"
          on:click={() => handleCheckExercise()}
        >
          <CheckCircle class="inline-block mr-2" />
          <span> Check </span>
        </button>
        <div
          style="position: fixed; top: -10px; left: 0; height: 100vh; width: 100vw; display: flex; justify-content: center; overflow: hidden; z-index: 10;"
        >
          {#if $exercise_session.endTime}
            <Confetti
              x={[-5, 5]}
              y={[0, 0.1]}
              delay={[0, 2000]}
              duration="3000"
              amount="100"
              fallDistance="100vh"
            />
          {/if}
        </div>
      </ToggleConfetti>
      <div class="join grid grid-cols-2">
        <button
          on:click={() => {
            horizontalView.set(true);
          }}
          class="join-item btn {$horizontalView
            ? ' btn-neutral dark:btn-primary dark:text-neutral '
            : ''} "
        >
          <StretchHorizontal />
        </button>
        <button
          on:click={() => {
            horizontalView.set(false);
          }}
          class="join-item btn {$horizontalView
            ? ''
            : ' btn-neutral dark:btn-primary dark:text-neutral '}"
        >
          <StretchVertical />
        </button>
      </div>
    </div>
  </div>
  <div class="absolute top-16 bottom-16 left-0 right-0 z-0">
    <slot />
  </div>
  <div class="absolute h-16 bottom-0 left-0 right-0">
    <div class="mt-2 flex justify-between px-2">
      <div>
        {#if $exercise_session.agentRunning}
          <button class="btn  btn-error" on:click={() => handleStopExercise()}>
            <StopCircle class="inline-block mr-2" />
            Stop
          </button>

          <button
            class="btn  {!$exercise_session.agentRunning ? 'btn-disabled' : 'btn-warning'}"
            on:click={() => handleRestartExercise()}
          >
            {#if restartLoading}
              <RotateCw class="inline-block mr-2 animate-spin" />
              Reset Exercise
            {:else}
              <RotateCw class="inline-block mr-2" />
              Reset Exercise
            {/if}
          </button>
          {#if client.authStore.model?.workshop == true}
            <button
              class="btn btn-neutral dark:hover:text-base-200 {helpRequested
                ? 'btn-disabled'
                : 'btn-primary'}"
              on:click={() => {
                askForHelp();
              }}
            >
              <HelpCircle class="inline-block mr-2" />
              Call for Support
            </button>
          {/if}
        {/if}
      </div>
      <div class="">
        <ul class="steps mt-1">
          {#if ($sidebar_exercises && $sidebar_exercises.length > 0) || $exercises.length > 0}
            {#key ($exercise.id, $exercise_session.id, $sidebar_exercises)}
              {#key ($exercise_session.endTime, $exercise_session.agentRunning, $sidebar_exercises)}
                {#if $exercises.length > 0}
                  {#each $exercises as currentExercise, i}
                    <button
                      on:click={() => handleSwitchExercise(currentExercise.id)}
                      data-content={isCurrentExercise(currentExercise.id) ? "●" : i + 1}
                      class="step
      {checkIfExerciseIsDone(currentExercise.id) ? 'step-success' : ''}
      "
                    />
                  {/each}
                {:else if $sidebar_exercises}
                  {#each $sidebar_exercises as currentExercise, i}
                    <button
                      on:click={() => handleSwitchExercise(currentExercise.id)}
                      data-content={isCurrentExercise(currentExercise.id) ? "●" : i + 1}
                      class="step
          {checkIfExerciseIsDone(currentExercise.id) ? 'step-success' : ''}
          "
                    />
                  {/each}
                {/if}
              {/key}
            {/key}
          {/if}
        </ul>
      </div>
    </div>
  </div>
{/key}
