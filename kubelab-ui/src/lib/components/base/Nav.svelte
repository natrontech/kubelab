<script lang="ts">
  import { client, logout } from "$lib/pocketbase";
  import type { NavRoute } from "$lib/types";
  import { TerminalSquare, LayoutDashboard, Home, ScrollText } from "lucide-svelte";
  import ToggleConfetti from "./ToggleConfetti.svelte";

  // @ts-ignore
  import { Confetti } from "svelte-confetti";

  let avatarUrl: string = "";

  if (client.authStore) {
    avatarUrl =
      "/api/files/" +
      client.authStore.model?.collectionId +
      "/" +
      client.authStore.model?.id +
      "/" +
      client.authStore.model?.avatar;
  }

  let routes: NavRoute[] = [
    {
      id: "1",
      name: "Dashboard",
      href: "/",
      icon: LayoutDashboard
    },
    {
      id: "2",
      name: "Labs",
      href: "/labs",
      icon: TerminalSquare
    },
    {
      id: "3",
      name: "Docs",
      href: "/docs",
      icon: ScrollText
    }
  ];
</script>

<div class="navbar bg-base-100">
  <div class="navbar-start z-50">
    <div class="dropdown">
      <!-- svelte-ignore a11y-label-has-associated-control -->
      <label tabindex="0" class="btn btn-ghost lg:hidden">
        <img src="/images/kubelab-logo.png" alt="logo" class="w-8 h-8" />
      </label>
      <ul class="menu menu-sm dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
        <li>
          <a href="/">
            <svelte:component this={Home} class="w-5 h-5" />{@html "&nbsp;"}
            Home
          </a>
        </li>
        {#each routes as route}
          <li>
            <a href={route.href}>
              <svelte:component this={route.icon} class="w-5 h-5" />{@html "&nbsp;"}
              {route.name}
            </a>
          </li>
        {/each}
      </ul>
    </div>
    <a class="btn btn-ghost normal-case text-xl hidden lg:flex" href="/">
      <img src="/images/kubelab-logo.png" alt="logo" class="w-8 h-8 mr-2" /> KubeLab</a
    >
  </div>
  <div class="navbar-center hidden lg:flex">
    <ul class="menu menu-horizontal px-1">
      {#each routes as route}
        <li>
          <a href={route.href}>
            <svelte:component this={route.icon} class="w-5 h-5" />{@html "&nbsp;"}
            {route.name}
          </a>
        </li>
      {/each}
    </ul>
  </div>
  <div class="navbar-end">
    <button class="btn btn-ghost btn-circle">
      <div class="indicator">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          ><path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          /></svg
        >
        <span class="badge badge-xs badge-primary indicator-item" />
      </div>
    </button>
    <div class="dropdown dropdown-end z-50">
      <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
      <!-- svelte-ignore a11y-label-has-associated-control -->
      <label tabindex="0" class="btn btn-ghost btn-circle avatar">
        <div class="w-10 rounded-full">
          <img src={avatarUrl} />
        </div>
      </label>
      <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
      <ul
        tabindex="0"
        class="menu menu-sm dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
      >
        <li><a href="/settings">Settings</a></li>
        <li><button on:click={() => logout()}>Logout</button></li>
      </ul>
    </div>
  </div>
</div>
