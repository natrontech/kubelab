<script lang="ts">
  import { client } from "$lib/pocketbase";
  import {
    NotificationsTypeOptions,
    type ExerciseSessionLogsResponse,
    type NotificationsResponse,
    type ExerciseSessionsResponse,
    type CompaniesResponse
  } from "$lib/pocketbase/generated-types";
  import { exercise_session_logs } from "$lib/stores/data";
  import {
    Table,
    TableBody,
    TableBodyCell,
    TableBodyRow,
    TableHead,
    TableHeadCell
  } from "flowbite-svelte";
  import { CheckCircle, HelpCircle, Play } from "lucide-svelte";
  import { onDestroy, onMount } from "svelte";
  import toast from "svelte-french-toast";

  interface Activity {
    exercise_title: string;
    lab_title: string;
    timestamp: string;
    end_time: string;
    user_name: string;
    start_time: string;
    avatarUrl: string;
    type: "start" | "end";
  }

  let activities: Activity[] = [];
  let notifications: NotificationsResponse[] = [];
  export let data: any;
  let company_id = data.props.id || "";
  let all_exercise_sessions: ExerciseSessionsResponse[] = [];

  interface Company {
    id: string;
    name: string;
    logo: string;
  }

  let company: Company = {
    id: "",
    name: "",
    logo: ""
  };

  async function getCompany() {
    let company_response: CompaniesResponse = await client
      .collection("companies")
      .getOne(company_id, {
        expand: "avatar"
      });

    company = {
      id: company_response.id,
      name: company_response.name,
      logo:
        "/api/files/" +
        company_response?.collectionId +
        "/" +
        company_response?.id +
        "/" +
        company_response?.logo
    };
  }

  async function getAllExerciseSessions() {
    let exercise_sessions_response: ExerciseSessionsResponse[] = await client
      .collection("exercise_sessions")
      .getFullList(100, {
        expand: "exercise,user",
        sort: "-user"
      });

    // filter exercise_sessions by company and only show the exercise_sessions where ther user exercise_sessions.expand.user.company.id == company_id
    exercise_sessions_response = exercise_sessions_response.filter(
      //@ts-ignore
      (exercise_session) => exercise_session.expand.user.company == company_id
    );

    // set all_exercise_sessions to the filtered exercise_sessions
    all_exercise_sessions = exercise_sessions_response;
    getRanking();
  }

  interface Ranking {
    user_name: string;
    avatarUrl: string;
    average_time: number;
  }

  let all_ranking: Ranking[] = [];

  function getRanking() {
    // in exercise_sessions, we have all the exercise_sessions of the company. We need to group them by user

    let users: any = {};

    all_exercise_sessions.forEach((exercise_session: any) => {
      if (users[exercise_session.expand.user.id]) {
        users[exercise_session.expand.user.id].push(exercise_session);
      } else {
        users[exercise_session.expand.user.id] = [exercise_session];
      }
    });

    // if users exercise_sessions have endTime = "", remove the exercise_session from the array

    Object.keys(users).forEach((user_id) => {
      let user_exercise_sessions = users[user_id];
      user_exercise_sessions = user_exercise_sessions.filter(
        (exercise_session: any) => exercise_session.endTime !== ""
      );
      users[user_id] = user_exercise_sessions;
    });

    // if the user has no exercise_sessions, remove it from the users object

    Object.keys(users).forEach((user_id) => {
      let user_exercise_sessions = users[user_id];
      if (user_exercise_sessions.length === 0) {
        delete users[user_id];
      }
    });

    // now we have an object with all the exercise_sessions grouped by user
    // we need to calculate the average time of each user, if there is no endTime, we don't count it

    let ranking: Ranking[] = [];

    Object.keys(users).forEach((user_id) => {
      let user_exercise_sessions = users[user_id];
      let total_time = 0;
      let total_exercise_sessions = 0;

      user_exercise_sessions.forEach((exercise_session: any) => {
        if (exercise_session.endTime) {
          total_time +=
            new Date(exercise_session.endTime).getTime() -
            new Date(exercise_session.startTime).getTime();
          total_exercise_sessions++;
        }
      });

      let average_time = total_time / total_exercise_sessions;

      ranking.push({
        user_name: user_exercise_sessions[0].expand.user.name,
        avatarUrl:
          "/api/files/" +
          user_exercise_sessions[0].expand.user?.collectionId +
          "/" +
          user_exercise_sessions[0].expand.user?.id +
          "/" +
          user_exercise_sessions[0].expand.user.avatar,
        average_time: average_time
      });
    });

    ranking.sort((a, b) => {
      return a.average_time - b.average_time;
    });

    // parse the average time to a human readable format -> minutes and seconds

    ranking.forEach((user: any) => {
      let minutes = Math.floor(user.average_time / 60000);
      let seconds = Math.floor((user.average_time % 60000) / 1000);

      user.average_time = minutes + "m " + seconds + "s";
    });

    ranking = ranking.slice(0, 3);

    all_ranking = ranking;
  }

  function getRelativeTime(timestamp: string) {
    let date = new Date(timestamp);
    let now = new Date();
    let difference = (now.getTime() - date.getTime()) / 1000;

    if (difference < 60) {
      return `${Math.floor(difference)}s`;
    } else if (difference < 3600) {
      return `${Math.floor(difference / 60)}m`;
    } else if (difference < 86400) {
      return `${Math.floor(difference / 3600)}h`;
    } else {
      return `${Math.floor(difference / 86400)}d`;
    }
  }

  function getRelativeTimeDuration(start_time: string, end_time: string) {
    let start_date = new Date(start_time);
    let end_date = new Date(end_time);
    let difference = (end_date.getTime() - start_date.getTime()) / 1000;

    if (difference < 60) {
      return `${Math.floor(difference)}s`;
    } else if (difference < 3600) {
      return `${Math.floor(difference / 60)}m`;
    } else if (difference < 86400) {
      return `${Math.floor(difference / 3600)}h`;
    } else {
      return `${Math.floor(difference / 86400)}d`;
    }
  }

  async function getExerciseSessionLogs() {
    let exercise_session_logs_response: ExerciseSessionLogsResponse[] = await client
      .collection("exercise_session_logs")
      .getFullList(10, {
        expand:
          "user,user.company,exercise_session,exercise_session.exercise,exercise_session.exercise.lab",
        sort: "-timestamp"
      });

    // filter exercise_session_logs by company and only show the exercise_session_logs where ther user exercise_session_logs.expand.user.company.id == company_id
    exercise_session_logs_response = exercise_session_logs_response.filter(
      //@ts-ignore
      (log) => log.expand.user.company == company_id
    );

    // filter only the last 10 exercise_session_logs
    exercise_session_logs_response = exercise_session_logs_response.slice(0, 10);

    exercise_session_logs.set(exercise_session_logs_response as ExerciseSessionLogsResponse[]);
    activities = parseLogsToActivities(exercise_session_logs_response);
  }

  async function getNotifications() {
    let notifications_response: NotificationsResponse[] = await client
      .collection("notifications")
      .getFullList(3, {
        expand: "user,user.company,exercise",
        sort: "-created"
      });
    // filter notifications by company and only show the notifications where ther user notifications_response.expand.user.company.id == company_id
    // filter only the notifications last 3 notifications
    notifications_response = notifications_response.filter(
      //@ts-ignore
      (notification) => notification.expand.user.company == company_id
    );
    notifications_response = notifications_response.slice(0, 10);

    notifications = notifications_response;
  }

  onMount(async () => {
    await getExerciseSessionLogs();
    await getNotifications();
    await getAllExerciseSessions();
    await getCompany();

    // set an interval to get the exercise_session_logs every 5 seconds
    setInterval(async () => {
      await getExerciseSessionLogs();
      await getNotifications();
      await getAllExerciseSessions();
    }, 10000);

    // watch for new notifications and post them to the notifications array
    client.collection("notifications").subscribe("*", function (e) {
      if (e.action === "create") {
        toast("New notification!", {
          icon: "👋",
          position: "top-right",
          duration: 10000
        });
      }
    });
  });

  onDestroy(() => {
    // clear the interval when the component is destroyed
    setInterval(() => {});
  });

  function parseLogToActivity(log: any) {
    let activity: Activity = {
      exercise_title: log.expand.exercise_session.expand.exercise.title,
      lab_title: log.expand.exercise_session.expand.exercise.expand.lab.title,
      timestamp: log.timestamp,
      start_time: log.expand.exercise_session.startTime,
      end_time: log.expand.exercise_session.endTime,
      user_name: log.expand.user.name,
      avatarUrl:
        "/api/files/" +
        log.expand.user?.collectionId +
        "/" +
        log.expand.user?.id +
        "/" +
        log.expand.user.avatar,
      type: log.type
    };

    return activity;
  }

  async function setDone(notification: NotificationsResponse) {
    await client.collection("notifications").update(notification.id, {
      done: true
    });
    await getNotifications();
  }

  function parseLogsToActivities(logs: any) {
    let activities: Activity[] = [];

    logs.forEach((log: any) => {
      activities.push(parseLogToActivity(log));
    });

    return activities;
  }
</script>

<div
  class="absolute top-0 bottom-0 left-0 right-0 p-4 bg-no-repeat bg-cover bg-center justify-center
  bg-gradient-to-r from-blue-500 to-purple-500 dark:from-base-100 dark:to-base-100
  "
  style=""
>
  <div>
    <h1 class="text-center text-4xl font-bold mb-8 text-white">
      Workshop Dashboard
      {company.name}
    </h1>
  </div>
  <div
    class="justify-center items-center bg-white p-5 rounded-lg absolute top-20 bottom-10 overflow-y-scroll scrollbar-thin left-36 right-36 grid grid-cols-2 gap-4"
  >
  <img class="mx-auto mb-8 absolute top-4 left-4 w-36" src={company.logo} alt={company.name} />
    <div class="flow-root p-2 rounded-lg col-span-2">
      <!-- a centralized title with "User Activities" -->
      <div class="text-center mb-5">
        <h3 class="text-lg leading-6 font-medium text-gray-900">Ranking</h3>
        <p class="mt-1 text-sm text-gray-500">Average time to solution</p>
      </div>

      <Table class="bg-gray-200 rounded-lg shadow-lg">
        <TableHead class="text-left">
          <TableHeadCell>Rank</TableHeadCell>
          <TableHeadCell>User</TableHeadCell>
          <TableHeadCell>Average Time</TableHeadCell>
        </TableHead>
        <TableBody tableBodyClass="divide-y">
          {#each all_ranking as item, idx}
            <TableBodyRow>
              <TableBodyCell>{idx + 1}</TableBodyCell>
              <TableBodyCell>
                <img
                  class="h-10 w-10 items-center justify-center inline-block rounded-full bg-gray-400 ring-8 ring-white"
                  src={item.avatarUrl}
                  alt=""
                />
                {" "}
                {item.user_name}</TableBodyCell
              >
              <TableBodyCell>{item.average_time}</TableBodyCell>
            </TableBodyRow>
          {/each}
        </TableBody>
      </Table>
    </div>

    <div class="flow-root col-span-1 p-2 rounded-lg min-h-full">
      <!-- a centralized title with "User Activities" -->
      <div class="text-center mb-5">
        <h3 class="text-lg leading-6 font-medium text-gray-900">Notifications</h3>
        <p class="mt-1 text-sm text-gray-500">Last 10 notifications</p>
      </div>
      <ul class="-mb-8">
        {#if notifications.length > 0}
          {#each notifications as notification, idx}
            <li>
              <div class="relative pb-8">
                <div class="relative flex space-x-3">
                  <div class="relative">
                    <HelpCircle class="h-8 w-8 text-gray-400justify-center" />
                    {#if notification.done == false}
                      <span class="absolute -top-1.5 left-0">
                        <span
                          class="animate-ping absolute inline-flex h-4 w-4 rounded-full top-1 -left-0.5 bg-red-400 opacity-75"
                        />
                        <span class="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
                      </span>
                    {:else}
                      <span class="absolute -top-1.5 left-0">
                        <span class="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
                      </span>
                    {/if}
                  </div>
                  <div class="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                    <div>
                      <span class="text-sm text-gray-500">
                        {#if notification.type == NotificationsTypeOptions.help}
                          <span class="font-medium text-gray-900"
                            >{notification.expand.user.name}</span
                          >{" "}
                          requested help
                        {/if}
                        {#if notification.exercise}
                          {" "} for the exercise{" "}
                          <span class="font-medium text-gray-900"
                            >{notification.expand.exercise.title}</span
                          >
                          {" "}
                        {/if}
                      </span>
                    </div>

                    <div class="whitespace-nowrap">
                      <span class="text-right text-sm text-gray-500">
                        <time datetime={notification.created}>
                          {getRelativeTime(notification.created)} ago
                        </time>
                      </span>
                      {#if notification.done == false}
                        <button class="btn btn-sm" on:click={() => setDone(notification)}>
                          Mark as done
                        </button>
                      {:else}
                        <button class="btn btn-sm btn-success">Done</button>
                      {/if}
                    </div>
                  </div>
                </div>
              </div>
            </li>
          {/each}
        {/if}
      </ul>
    </div>

    <div class="flow-root p-2 rounded-lg col-span-1">
      <!-- a centralized title with "User Activities" -->
      <div class="text-center mb-5">
        <h3 class="text-lg leading-6 font-medium text-gray-900">User Activities</h3>
        <p class="mt-1 text-sm text-gray-500">Last 10 activities</p>
      </div>

      <ul class="-mb-8">
        {#if activities.length > 0}
          {#each activities as activity, idx}
            <li>
              <div class="relative pb-8">
                {#if idx !== activities.length - 1}
                  <span
                    class="absolute left-5 top-5 -ml-px h-full w-0.5 bg-gray-200"
                    aria-hidden="true"
                  />
                {/if}
                <div class="relative flex items-start space-x-3">
                  <div class="relative">
                    <img
                      class="flex h-10 w-10 items-center justify-center rounded-full bg-gray-400 ring-8 ring-white"
                      src={activity.avatarUrl}
                      alt=""
                    />

                    <span class="absolute -bottom-0.5 -right-1 rounded-tl bg-white px-0.5 py-px">
                      {#if activity.type === "start"}
                        <Play class="h-5 w-5 text-gray-400" strokeWidth={2} />
                      {:else}
                        <CheckCircle class="h-5 w-5 text-green-400" />
                      {/if}
                    </span>
                  </div>
                  <div class="min-w-0 flex-1">
                    <div>
                      <div class="text-sm">
                        <span class="font-bold">{activity.user_name}</span>
                      </div>
                      <p class="mt-0.5 text-sm text-gray-500">
                        <time datetime={activity.timestamp}>
                          {getRelativeTime(activity.timestamp)} ago
                        </time>
                      </p>
                    </div>
                    <div class="mt-2 text-sm ">
                      <p>
                        {activity.type === "start" ? "Started" : "Finished"}
                        {#if activity.type === "end"}
                          {" "}
                          after{" "}
                          {getRelativeTimeDuration(activity.start_time, activity.end_time)}
                        {/if}
                        {" "}
                        <strong>{activity.exercise_title}</strong>
                        in{" "}
                        <strong>{activity.lab_title}</strong>
                        <br />
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          {/each}
        {/if}
      </ul>
    </div>
  </div>
</div>
