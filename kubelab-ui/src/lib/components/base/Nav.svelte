<script lang="ts">
  import { navigating } from "$app/stores";
  import { client, logout } from "$lib/pocketbase";
  import darkTheme from "$lib/stores/theme";
  import type { NavRoute } from "$lib/types";
  import { TerminalSquare, Github, Presentation, Sun, Moon, BarChart2 } from "lucide-svelte";

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
</script>

<div class="navbar shadow-md h-16 pt-4">
  <div class="navbar-start z-10">
    <div class="dropdown">
      <!-- svelte-ignore a11y-label-has-associated-control -->
      <label tabindex="0" class="btn btn-ghost lg:hidden -mt-2">
        <img src="/images/kubelab-logo.png" alt="logo" class="w-8 h-8" />
      </label>
      <ul
        class="menu menu-sm dropdown-content mt-3 p-2 shadow bg-base-200 rounded-box w-52 border-4 border-neutral"
      >
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
    <a class="btn btn-ghost normal-case text-xl hidden lg:flex -mt-2" href="/">
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
    <div class="dropdown dropdown-end z-10">
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
        class="menu menu-sm dropdown-content mt-3 p-2 shadow bg-base-200 rounded-box w-52 border-4 border-neutral"
      >
        <li><button on:click={() => logout()}>Logout</button></li>
      </ul>
    </div>
  </div>
</div>
