<script lang="ts">
  import { client } from "$lib/pocketbase";
  import {
    NotificationsTypeOptions,
    type ExerciseSessionLogsResponse,
    type NotificationsResponse,
    type ExerciseSessionsResponse,
    type CompaniesResponse,
    type ExercisesResponse
  } from "$lib/pocketbase/generated-types";
  import { exercise_session_logs } from "$lib/stores/data";
  import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "$lib/components/ui/table";
  import { CheckCircle, HelpCircle, Play } from "lucide-svelte";
  import { onDestroy, onMount } from "svelte";
  import toast from "svelte-french-toast";
  import Avatar from "$lib/components/ui/Avatar.svelte";

  interface Activity {
    exercise_title: string;
    lab_title: string;
    timestamp: string;
    end_time: string;
    user_name: string;
    user_email: string;
    start_time: string;
    avatarUrl: string;
    type: "start" | "end";
  }

  let activities: Activity[] = [];
  let notifications: NotificationsResponse[] = [];
  export let data: any;
  let company_id = data.props.id || "";
  let all_exercise_sessions: ExerciseSessionsResponse[] = [];
  let all_exercises: ExercisesResponse[] = [];

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
    let exercises_response: ExercisesResponse[] = await client
      .collection("exercises")
      .getFullList(100, {
        expand: "lab",
        sort: "-lab"
      });

    all_exercises = exercises_response;

    // set all_exercise_sessions to the filtered exercise_sessions
    all_exercise_sessions = exercise_sessions_response;
    getRanking();
  }

  interface Ranking {
    user_name: string;
    user_email: string;
    avatarUrl: string;
    average_time: number;
    solved_exercises_percentage: number;
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
        user_email: user_exercise_sessions[0].expand.user.email,
        avatarUrl:
          "/api/files/" +
          user_exercise_sessions[0].expand.user?.collectionId +
          "/" +
          user_exercise_sessions[0].expand.user?.id +
          "/" +
          user_exercise_sessions[0].expand.user.avatar,
        average_time: average_time,
        solved_exercises_percentage: Math.round(
          (user_exercise_sessions.length / all_exercises.length) * 100
        )
      });
    });

    // first sort by the solved_exercises_percentage and then by the average_time
    ranking.sort((a, b) => {
      if (a.solved_exercises_percentage > b.solved_exercises_percentage) {
        return -1;
      } else if (a.solved_exercises_percentage < b.solved_exercises_percentage) {
        return 1;
      } else {
        if (a.average_time < b.average_time) {
          return -1;
        } else if (a.average_time > b.average_time) {
          return 1;
        } else {
          return 0;
        }
      }
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
      user_email: log.expand.user.email,
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

<div class="container mx-auto py-12 px-4">
  <div class="text-center space-y-4 mb-12">
    <h1 class="text-4xl md:text-5xl font-bold text-foreground">
      Workshop Dashboard
    </h1>
    <p class="text-xl text-muted-foreground">
      {company.name}
    </p>
  </div>
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
    <div class="lg:col-span-3 flex justify-center">
      <img class="w-48 object-contain" src={company.logo} alt={company.name} />
    </div>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <div class="lg:col-span-2">
      <div class="border-2 rounded-lg bg-card shadow-xl">
        <div class="p-6 border-b bg-muted/30">
          <h3 class="text-2xl font-bold text-foreground">Ranking</h3>
          <p class="text-sm text-muted-foreground mt-1">Average time to solution</p>
        </div>
        <div class="p-6">
          <Table>
            <TableHeader>
              <TableRow class="text-left">
                <TableHead>Rank</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Average Time</TableHead>
                <TableHead>Solved Exercises</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {#each all_ranking as item, idx}
                <TableRow>
                  <TableCell class="font-bold text-primary">{idx + 1}</TableCell>
                  <TableCell>
                    <div class="flex items-center gap-3">
                      <Avatar
                        src={item.avatarUrl}
                        alt={item.user_name}
                        email={item.user_email}
                        size="md"
                      />
                      <span class="font-medium">{item.user_name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{item.average_time}</TableCell>
                  <TableCell>{item.solved_exercises_percentage}%</TableCell>
                </TableRow>
              {/each}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>

    <div class="border-2 rounded-lg bg-card shadow-xl">
      <div class="p-6 border-b bg-muted/30">
        <h3 class="text-2xl font-bold text-foreground">Notifications</h3>
        <p class="text-sm text-muted-foreground mt-1">Latest updates and requests</p>
      </div>
      <div class="p-6">
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
                        ></span>
                        <span class="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                      </span>
                    {:else}
                      <span class="absolute -top-1.5 left-0">
                        <span class="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                      </span>
                    {/if}
                  </div>
                  <div class="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                    <div>
                      <span class="text-sm text-muted-foreground">
                        {#if notification.type == NotificationsTypeOptions.help}
                          <span class="font-medium text-foreground">
                            {(notification as any).expand?.user?.name}</span
                          >{" "}
                          requested help
                        {/if}
                        {#if notification.exercise}
                          {" "} for the exercise{" "}
                          <span class="font-medium text-foreground"
                            >{(notification as any).expand?.exercise?.title}</span
                          >
                          {" "}
                        {/if}
                      </span>
                    </div>

                    <div class="whitespace-nowrap">
                      <span class="text-right text-sm text-muted-foreground">
                        <time datetime={notification.created}>
                          {getRelativeTime(notification.created)} ago
                        </time>
                      </span>
                      {#if notification.done == false}
                        <button class="px-3 py-1 text-sm rounded-md bg-primary text-white hover:bg-primary/90 transition-colors" on:click={() => setDone(notification)}>
                          Mark as done
                        </button>
                      {:else}
                        <button class="px-3 py-1 text-sm rounded-md bg-green-600 text-white" disabled>Done</button>
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
    </div>

    <div class="border-2 rounded-lg bg-card shadow-xl">
      <div class="p-6 border-b bg-muted/30">
        <h3 class="text-2xl font-bold text-foreground">User Activities</h3>
        <p class="text-sm text-muted-foreground mt-1">Recent user actions</p>
      </div>
      <div class="p-6">
        <ul class="-mb-8">
        {#if activities.length > 0}
          {#each activities as activity, idx}
            <li>
              <div class="relative pb-8">
                {#if idx !== activities.length - 1}
                  <span
                    class="absolute left-5 top-5 -ml-px h-full w-0.5 bg-gray-200"
                    aria-hidden="true"
                  ></span>
                {/if}
                <div class="relative flex items-start space-x-3">
                  <div class="relative">
                    <Avatar
                      src={activity.avatarUrl}
                      alt={activity.user_name}
                      email={activity.user_email}
                      size="md"
                    />

                    <span class="absolute -bottom-0.5 -right-1 rounded-full bg-white dark:bg-background p-0.5 ring-2 ring-border">
                      {#if activity.type === "start"}
                        <Play class="h-4 w-4 text-gray-400" strokeWidth={2} />
                      {:else}
                        <CheckCircle class="h-4 w-4 text-green-500" />
                      {/if}
                    </span>
                  </div>
                  <div class="min-w-0 flex-1">
                    <div>
                      <div class="text-sm">
                        <span class="font-bold text-foreground">{activity.user_name}</span>
                      </div>
                      <p class="mt-0.5 text-sm text-muted-foreground">
                        <time datetime={activity.timestamp}>
                          {getRelativeTime(activity.timestamp)} ago
                        </time>
                      </p>
                    </div>
                    <div class="mt-2 text-sm text-muted-foreground">
                      <p>
                        {activity.type === "start" ? "Started" : "Finished"}
                        {#if activity.type === "end"}
                          {" "}
                          after{" "}
                          {getRelativeTimeDuration(activity.start_time, activity.end_time)}
                        {/if}
                        {" "}
                        <strong class="text-foreground">{activity.exercise_title}</strong>
                        in{" "}
                        <strong class="text-foreground">{activity.lab_title}</strong>
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
</div>
