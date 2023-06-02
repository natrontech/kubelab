<script lang="ts">
  // @ts-nocheck
  import { page } from "$app/stores";
  import type { NavRoute } from "$lib/types";

  export let routes: NavRoute[] = [];
</script>

<!-- <div class="h-full p-4 bg-transparent">
  <div class="bg-white shadow-md h-full rounded-lg w-56 z-20 relative">
    <div class="flex flex-shrink-0 items-center pt-4 px-8 flex-col">
      <img class="h-12 w-auto" src="/images/kubelab-logo.png" alt="KubeLab Logo" />
      <p class="mt-2 text-xl font-bold text-primary-500 uppercase">KubeLab</p>
    </div>

    <nav class="mt-3 px-3 pt-6">
      <div class="space-y-4">
        {#each routes as route}
          <a
            href={route.href}
            class="text-gray-500 unstyled border-2 rounded-md group flex items-center hover:text-gray-600 pl-9 py-2 text-sm font-medium
						{$page.route.id.split('/')[1]?.includes(route.name.toLowerCase()) ||
            ($page.route.id === '/' && route.name === 'Dashboard')
              ? 'text-gray-700 border-gray-700'
              : ''}
"
            aria-current="page"
          >
            {#if $page.route.id
              .split("/")[1]
              ?.includes(route.name.toLowerCase()) || ($page.route.id === "/" && route.name === "Dashboard")}
              <svelte:component this={route.icon} class="w-5 h-5" />{@html "&nbsp;"}
              <div class="block">{route.name}</div>
            {:else}
              <svelte:component this={route.icon} class="w-5 h-5" />{@html "&nbsp;"}{route.name}
            {/if}
          </a>
        {/each}
      </div>
    </nav>
    <div class="bottom-6 absolute w-full flex items-center justify-center">
      <a
        href="/logout"
        class="text-gray-500 unstyled group flex items-center hover:text-gray-600 px-2 py-2 text-sm font-medium"
        aria-current="page"
      >
        <Icon className="w-5 h-5" src={HiOutlineLogout} />{@html "&nbsp;"}Sign-out
      </a>
    </div>
  </div>
</div> -->
<div class="navbar bg-base-100">
  <div class="navbar-start">
    <div class="dropdown">
      <label tabindex="0" class="btn btn-ghost lg:hidden">
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
            d="M4 6h16M4 12h8m-8 6h16"
          /></svg
        >
      </label>
      <ul
        tabindex="0"
        class="menu menu-sm dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
      >
        <li><a>Item 1</a></li>
        <li>
          <a>Parent</a>
          <ul class="p-2">
            <li><a>Submenu 1</a></li>
            <li><a>Submenu 2</a></li>
          </ul>
        </li>
        <li><a>Item 3</a></li>
      </ul>
    </div>
    <a class="btn btn-ghost normal-case text-xl">daisyUI</a>
  </div>
  <div class="navbar-center hidden lg:flex">
    <ul class="menu menu-horizontal px-1">
      <li><a>Item 1</a></li>
      <li tabindex="0">
        <details>
          <summary>Parent</summary>
          <ul class="p-2">
            <li><a>Submenu 1</a></li>
            <li><a>Submenu 2</a></li>
          </ul>
        </details>
      </li>
      <li><a>Item 3</a></li>
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
    <div class="dropdown dropdown-end">
      <label tabindex="0" class="btn btn-ghost btn-circle avatar">
        <div class="w-10 rounded-full">
          <!-- <img src="/images/stock/photo-1534528741775-53994a69daeb.jpg" /> -->
        </div>
      </label>
      <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
        <li>
          <a class="justify-between">
            Profile
            <span class="badge">New</span>
          </a>
        </li>
        <li><a>Settings</a></li>
        <li><a>Logout</a></li>
      </ul>
    </div>
  </div>
</div>
