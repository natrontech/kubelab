<script lang="ts">
  import { navigating } from "$app/stores";
  import { client, logout } from "$lib/pocketbase";
    import { avatarUrl } from "$lib/stores/data";
  import darkTheme from "$lib/stores/theme";
  import type { NavRoute } from "$lib/types";
  import {
    TerminalSquare,
    Github,
    Presentation,
    Sun,
    Moon,
    BarChart2,
    Building2
  } from "lucide-svelte";

  $: if (client.authStore) {
    $avatarUrl =
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
      href: "/app/",
      icon: BarChart2
    },
    {
      id: "2",
      name: "Labs",
      href: "/labs/",
      icon: TerminalSquare
    },
    {
      id: "3",
      name: "Material",
      href: "/material/",
      icon: Presentation
    },
    {
      id: "4",
      name: "About",
      href: "https://github.com/natrontech/kubelab",
      icon: Github
    }
  ];

  if (client.authStore.model?.role != "admin") {
    routes = [
      {
        id: "1",
        name: "Dashboard",
        href: "/app/",
        icon: BarChart2
      },
      {
        id: "2",
        name: "Labs",
        href: "/labs/",
        icon: TerminalSquare
      },
      {
        id: "3",
        name: "Material",
        href: "/material/",
        icon: Presentation
      },
      {
        id: "4",
        name: "About",
        href: "https://github.com/natrontech/kubelab",
        icon: Github
      }
    ];
  } else {
    routes = [
      {
        id: "1",
        name: "Companies",
        href: "/app/",
        icon: Building2
      }
    ];
  }
</script>

<div class="navbar  h-16 pt-4">
  <div class="navbar-start z-10">
    <div class="dropdown">
      <!-- svelte-ignore a11y-label-has-associated-control -->
      <label tabindex="0" class="btn btn-ghost lg:hidden -mt-2">
        <img src="/images/kubelab-logo.png" alt="logo" class="w-8 h-8" />
      </label>
      <ul class="menu menu-sm dropdown-content mt-3 p-2 shadow bg-base-200 rounded-box w-52 ">
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
    <a class="btn btn-ghost normal-case text-xl hidden lg:flex -mt-2" href="/app">
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

  <div class="navbar-end sm:-mt-2 ">
    <button class="btn bg-transparent border-none" on:click={() => darkTheme.set(!$darkTheme)}>
      {#if $darkTheme === true}
        <Sun />
      {:else}
        <Moon />
      {/if}
    </button>

    <a href="https://natron.io" target="_blank" class="-mt-2 mx-2">
      <span class="text-xs font-semibold leading-6 text-gray-900 dark:text-white">Powered by</span>
      {#if $darkTheme === true}
        <img class="h-4 w-auto" src={"/images/natron-dark.png"} alt="Switzerland" />
      {:else}
        <img class="h-4 w-auto" src={"/images/natron.png"} alt="Switzerland" />
      {/if}
    </a>
    <div class="dropdown dropdown-end z-10">
      <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
      <!-- svelte-ignore a11y-label-has-associated-control -->
      <label tabindex="0" class="btn btn-ghost btn-circle avatar">
        <div class="w-10 rounded-full">
          <img src={$avatarUrl} />
        </div>
      </label>
      <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
      <ul
        tabindex="0"
        class="menu menu-sm dropdown-content mt-3 p-2 shadow bg-base-200 rounded-box w-52 "
      >
        <li>
          <a href="/app/profile"> Profile </a>
        </li>
        <li><button on:click={() => logout()}>Logout</button></li>
      </ul>
    </div>
  </div>
</div>
