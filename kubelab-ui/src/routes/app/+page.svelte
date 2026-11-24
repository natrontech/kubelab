<script lang="ts">
  import RunningExercises from "$lib/components/dashboard/RunningExercises.svelte";
  import { client } from "$lib/pocketbase";
  import { exercise_sessions, exercises, labs } from "$lib/stores/data.js";
  import { TerminalSquare, TrendingUp, Zap, Target, Clock, Award, ExternalLink } from "lucide-svelte";
  import { onMount } from "svelte";
  import { Card, CardContent, CardHeader, CardTitle } from "$lib/components/ui/card";
  import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "$lib/components/ui/table";
  import { Badge } from "$lib/components/ui/badge";
  import type { CompaniesResponse } from "$lib/pocketbase/generated-types";

  let companies: CompaniesResponse[] = [];

  async function getCompanies() {
    let response: CompaniesResponse[] = await client.collection("companies").getFullList();
    companies = response;
  }

  onMount(async () => {
    if (client.authStore.model?.role == "admin") {
      await getCompanies();
    }
  });

  function getDoneExercisesNumber() {
    let done_exercises = $exercise_sessions.filter((exercise_session) => exercise_session.endTime);
    return done_exercises.length;
  }

  function getAverageTimeToResolve() {
    let done_exercises = $exercise_sessions.filter((exercise_session) => exercise_session.endTime);
    let total_time = 0;
    done_exercises.forEach((exercise_session) => {
      let startTime = new Date(exercise_session.startTime);
      let endTime = new Date(exercise_session.endTime);
      let difference = (endTime.getTime() - startTime.getTime()) / 1000;
      total_time += difference;
    });

    let average_time = total_time / done_exercises.length;

    if (isNaN(average_time)) {
      return "N/A";
    }

    return `${Math.floor(average_time / 60)}m ${Math.floor(average_time % 60)}s`;
  }

  $: progressPercentage = $exercises.length !== 0
    ? Math.round((getDoneExercisesNumber() / $exercises.length) * 100)
    : 0;
</script>

{#if client.authStore.model?.role != "admin"}
  <div class="container mx-auto py-12 px-4 space-y-8">
    <!-- Header -->
    <div class="text-center space-y-4 mb-12">
      <h1 class="text-4xl md:text-5xl font-bold text-foreground">
        Dashboard
      </h1>
      <p class="text-muted-foreground text-lg max-w-2xl mx-auto">
        Welcome back, <span class="font-semibold text-foreground">{client.authStore.model?.name || client.authStore.model?.email}</span>
      </p>
    </div>

    <!-- Main Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Total Labs Card -->
      <a href="/labs" class="block group">
        <Card class="h-full hover:shadow-xl transition-all duration-300 border-2 group-hover:border-primary">
          <CardHeader class="pb-3">
            <div class="flex items-center justify-between">
              <CardTitle class="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Labs
              </CardTitle>
              <div class="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <TerminalSquare class="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div class="text-4xl font-bold text-primary">{$labs.length}</div>
            <p class="text-sm text-muted-foreground mt-2">
              Available labs to explore
            </p>
          </CardContent>
        </Card>
      </a>

      <!-- Total Exercises Card -->
      <Card class="h-full hover:shadow-xl transition-all duration-300 border-2 hover:border-primary">
        <CardHeader class="pb-3">
          <div class="flex items-center justify-between">
            <CardTitle class="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Exercises
            </CardTitle>
            <div class="p-3 rounded-xl bg-primary/10">
              <Zap class="h-6 w-6 text-primary" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div class="text-4xl font-bold text-primary">{$exercises.length}</div>
          <p class="text-sm text-muted-foreground mt-2">
            Total challenges available
          </p>
        </CardContent>
      </Card>

      <!-- Completed Card -->
      <Card class="h-full hover:shadow-xl transition-all duration-300 border-2 hover:border-green-500">
        <CardHeader class="pb-3">
          <div class="flex items-center justify-between">
            <CardTitle class="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Completed
            </CardTitle>
            <div class="p-3 rounded-xl bg-green-100 dark:bg-green-950">
              <Target class="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div class="text-4xl font-bold text-green-600 dark:text-green-400">{getDoneExercisesNumber()}</div>
          <p class="text-sm text-muted-foreground mt-2">
            Exercises finished
          </p>
        </CardContent>
      </Card>

      <!-- Average Time Card -->
      <Card class="h-full hover:shadow-xl transition-all duration-300 border-2 hover:border-orange-500">
        <CardHeader class="pb-3">
          <div class="flex items-center justify-between">
            <CardTitle class="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Avg. Time
            </CardTitle>
            <div class="p-3 rounded-xl bg-orange-100 dark:bg-orange-950">
              <Clock class="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div class="text-4xl font-bold text-orange-600 dark:text-orange-400">{getAverageTimeToResolve()}</div>
          <p class="text-sm text-muted-foreground mt-2">
            Average completion time
          </p>
        </CardContent>
      </Card>
    </div>

    <!-- Progress Card -->
    <Card class="overflow-hidden border-2 hover:shadow-xl transition-all">
      <CardHeader class="border-b bg-muted/30">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="p-2 rounded-lg bg-primary">
              <Award class="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle class="text-xl">Your Progress</CardTitle>
              <p class="text-sm text-muted-foreground">Keep up the great work!</p>
            </div>
          </div>
          <Badge
            variant={progressPercentage === 100 ? "default" : "secondary"}
            class={progressPercentage === 100 ? "bg-green-600 text-white text-lg px-4 py-2" : "text-lg px-4 py-2"}
          >
            {progressPercentage}%
          </Badge>
        </div>
      </CardHeader>
      <CardContent class="space-y-4 pt-6">
        <div class="space-y-2">
          <div class="flex items-center justify-between text-sm">
            <span class="text-muted-foreground">Completed</span>
            <span class="font-semibold">
              {getDoneExercisesNumber()} / {$exercises.length} exercises
            </span>
          </div>
          <div class="w-full bg-secondary rounded-full h-4 overflow-hidden">
            <div
              class="h-4 rounded-full transition-all duration-500 ease-out bg-primary"
              style="width: {progressPercentage}%"
            ></div>
          </div>
        </div>

        {#if progressPercentage === 100}
          <div class="flex items-center gap-2 p-3 rounded-lg bg-green-100 dark:bg-green-950 border border-green-200 dark:border-green-800">
            <Award class="h-5 w-5 text-green-600 dark:text-green-400" />
            <p class="text-sm font-medium text-green-800 dark:text-green-300">
              Congratulations! You've completed all exercises! 🎉
            </p>
          </div>
        {:else if progressPercentage >= 75}
          <div class="flex items-center gap-2 p-3 rounded-lg bg-primary/10 border border-primary/20">
            <TrendingUp class="h-5 w-5 text-primary" />
            <p class="text-sm font-medium">
              Almost there! Just {$exercises.length - getDoneExercisesNumber()} more to go!
            </p>
          </div>
        {:else if progressPercentage >= 50}
          <div class="flex items-center gap-2 p-3 rounded-lg bg-primary/10 border border-primary/20">
            <Target class="h-5 w-5 text-primary" />
            <p class="text-sm font-medium">
              Great progress! You're halfway through!
            </p>
          </div>
        {:else if progressPercentage > 0}
          <div class="flex items-center gap-2 p-3 rounded-lg bg-primary/10 border border-primary/20">
            <Zap class="h-5 w-5 text-primary" />
            <p class="text-sm font-medium">
              Good start! Keep going to unlock more achievements!
            </p>
          </div>
        {/if}
      </CardContent>
    </Card>

    <!-- Running Exercises -->
    <div>
      <RunningExercises />
    </div>
  </div>
{:else}
  <!-- Admin Dashboard -->
  <div class="container mx-auto py-8 px-4">
    <div class="text-center space-y-2 mb-8">
      <h1 class="text-5xl font-bold text-foreground">
        Admin Dashboard
      </h1>
      <p class="text-muted-foreground text-lg">Manage companies and monitor activity</p>
    </div>

    <Card class="border-2 hover:shadow-xl transition-all">
      <CardHeader class="border-b bg-muted/30">
        <div class="flex items-center justify-between">
          <div>
            <CardTitle class="text-2xl">Companies</CardTitle>
            <p class="text-sm text-muted-foreground mt-1">
              {companies.length} {companies.length === 1 ? 'company' : 'companies'} registered
            </p>
          </div>
          <Badge variant="secondary" class="text-lg px-4 py-2">
            {companies.length}
          </Badge>
        </div>
      </CardHeader>
      <CardContent class="p-0">
        {#if companies.length == 0}
          <div class="text-center py-12">
            <div class="p-4 rounded-full bg-muted w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <TerminalSquare class="h-8 w-8 text-muted-foreground" />
            </div>
            <p class="text-muted-foreground">No companies yet</p>
          </div>
        {:else}
          <Table>
            <TableHeader>
              <TableRow class="hover:bg-transparent">
                <TableHead class="font-semibold">Company</TableHead>
                <TableHead class="font-semibold">Dashboard URL</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {#each companies as company}
                <TableRow class="hover:bg-accent/50">
                  <TableCell>
                    <div class="flex items-center gap-3">
                      <img
                        class="h-12 w-12 rounded-full object-cover ring-2 ring-border shadow-sm"
                        src={"/api/files/" +
                          company?.collectionId +
                          "/" +
                          company?.id +
                          "/" +
                          company?.logo}
                        alt={company.name}
                      />
                      <span class="font-semibold text-lg">{company.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <a
                      href={`https://kubelab.ch/admin/${company.id}`}
                      class="inline-flex items-center gap-2 text-primary hover:underline font-medium group"
                    >
                      kubelab.ch/admin/{company.id}
                      <ExternalLink class="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </a>
                  </TableCell>
                </TableRow>
              {/each}
            </TableBody>
          </Table>
        {/if}
      </CardContent>
    </Card>
  </div>
{/if}
