<script lang="ts">
  import RunningExercises from "$lib/components/dashboard/RunningExercises.svelte";
  import { client } from "$lib/pocketbase";
  import { exercise_sessions, exercises, labs } from "$lib/stores/data.js";
  import { TerminalSquare } from "lucide-svelte";
  import { onMount } from "svelte";
  import {
    Table,
    TableBody,
    TableBodyCell,
    TableBodyRow,
    TableHead,
    TableHeadCell
  } from "flowbite-svelte";
  import type { CompaniesResponse } from "$lib/pocketbase/generated-types";
  import { page } from "$app/stores";

  interface Company {
    id: string;
    name: string;
    logo: string;
  }

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
      // convert starTime and endTime to Date objects
      let startTime = new Date(exercise_session.startTime);
      let endTime = new Date(exercise_session.endTime);
      // get the difference in seconds
      let difference = (endTime.getTime() - startTime.getTime()) / 1000;
      total_time += difference;
    });

    let average_time = total_time / done_exercises.length;

    if (isNaN(average_time)) {
      return "N/A";
    }

    // return a string with the average time in minutes and seconds
    return `${Math.floor(average_time / 60)}m ${Math.floor(average_time % 60)}s`;
  }
</script>

<div
  class="absolute top-16 bottom-0 left-0 right-0 p-4 bg-no-repeat bg-cover bg-center justify-center
bg-gradient-to-r from-blue-500 to-purple-500 dark:from-base-100 dark:to-base-100"
>
  {#if client.authStore.model?.role != "admin"}
    <h1 class="text-center text-4xl text-white font-bold mb-8">Dashboard</h1>
    <div class="grid grid-cols-3 gap-4 justify-center items-center">
      <div />
      <div
        class="stats w-full col-span-3 sm:col-span-1 shadow  hover:shadow-md transition-all duration-150 ease-in-out"
      >
        <div class="stat">
          <div class="stat-title">Your <strong>average</strong> time to resolution</div>
          <div class="stat-value">{getAverageTimeToResolve()}</div>
        </div>
      </div>

      <div
        class="stats col-span-3 mt-4 shadow w-full hover:shadow-md transition-all duration-150 ease-in-out"
      >
        <a href="/labs">
          <div class="stat">
            <div class="stat-figure text-blue-500">
              <TerminalSquare class="w-8 h-8" />
            </div>
            <div class="stat-title">Total Labs</div>
            <div class="stat-value text-blue-500">{$labs.length}</div>
            <div class="stat-desc">With <strong>{$exercises.length}</strong> exercises</div>
          </div>
        </a>

        <div class="stat">
          <div class="stat-figure text-accent">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              class="inline-block w-8 h-8 stroke-current"
              ><path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              /></svg
            >
          </div>
          <div class="stat-title">Total Exercises</div>
          <div class="stat-value text-accent">{$exercises.length}</div>
          <div class="stat-desc">Within <strong>{$labs.length}</strong> labs</div>
        </div>

        <div class="stat">
          <div class="stat-figure text-secondary">
            <progress
              class="progress w-56"
              value={$exercises.length !== 0
                ? Math.round((getDoneExercisesNumber() / $exercises.length) * 100)
                : 0}
              max="100"
            />
          </div>
          <div class="stat-value">
            {Math.round((getDoneExercisesNumber() / $exercises.length) * 100)}%
          </div>
          <div class="stat-title">Exercises done</div>
          <div class="stat-desc text-blue-500">
            {$exercises?.length - getDoneExercisesNumber()} exercise(s) remaining
          </div>
        </div>
      </div>
      <div class="col-span-3">
        <RunningExercises />
      </div>
    </div>
  {:else}
    <h1 class="text-center text-4xl text-white font-bold mb-8">Admin Dashboard</h1>
    <Table class="bg-gray-200 rounded-lg shadow-lg">
      <TableHead class="text-left">
        <TableHeadCell>Company</TableHeadCell>
        <TableHeadCell>Dashboard URL</TableHeadCell>
      </TableHead>
      <TableBody tableBodyClass="divide-y">
        {#if companies.length == 0}
          <TableBodyRow>
            <TableBodyCell colspan="2" class="text-center">No companies yet</TableBodyCell>
          </TableBodyRow>
        {:else}
          {#each companies as company}
            <TableBodyRow>
              <TableBodyCell>
                <img
                  class="h-10 w-10 items-center justify-center inline-block rounded-full bg-gray-400 ring-8 ring-white"
                  src={"/api/files/" +
                    company?.collectionId +
                    "/" +
                    company?.id +
                    "/" +
                    company?.logo}
                  alt=""
                />
                {" "}
                {company.name}</TableBodyCell
              >
              <TableBodyCell>
                <a
                  href={`https://kubelab.ch/admin
                /${company.id}`}>kubelab.ch/admin/{company.id}</a
                >
              </TableBodyCell>
            </TableBodyRow>
          {/each}
        {/if}
      </TableBody>
    </Table>
  {/if}
</div>
