<script lang="ts">
  import "../theme.postcss";
  import "@skeletonlabs/skeleton/styles/all.css";
  import "../app.postcss";
  import "../app.css";
  import { AppShell } from "@skeletonlabs/skeleton";
  import Nav from "$lib/components/base/Nav.svelte";
  import { page } from "$app/stores";
  import { FolderGit2, LayoutDashboard, FileCode, Layers, Package } from "lucide-svelte";
  import type { NavRoute } from "$lib/types";
  import { metadata } from "$lib/stores/metadata";
  import { site } from "$lib/config";
  import { beforeNavigate } from "$app/navigation";
  import { fly } from "svelte/transition";

  export let data: any;

  $: title = $metadata.title ? $metadata.title + " | " + site.name : site.name;
  $: description = $metadata.description ?? site.description;
  // reset metadata on navigation so that the new page inherits nothing from the old page
  beforeNavigate(() => {
    $metadata = {};
  });

  let routes: NavRoute[] = [
    {
      id: "1",
      name: "Dashboard",
      href: "/",
      icon: LayoutDashboard
    },
    {
      id: "2",
      name: "Deployments",
      href: "/deployments",
      icon: Package
    },
    {
      id: "3",
      name: "Stages",
      href: "/stages",
      icon: Layers
    },
    {
      id: "4",
      name: "Applications",
      href: "/applications",
      icon: FileCode
    },
    {
      id: "5",
      name: "Repositories",
      href: "/repositories",
      icon: FolderGit2
    }
  ];
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
</svelte:head>

<div class="h-full">
  <div class="h-32 bg-primary-500 absolute -z-10 w-full">
    <div class="absolute pr-4 pt-4 pb-4 left-64 right-0 top-12">
      {#each routes as route}
        {#if ($page.route.id && $page.route.id
            .split("/")[1]
            ?.includes(route.name.toLowerCase())) || ($page.route.id === "/" && route.name === "Dashboard")}
          <h1 class="h1 text-white font-bold mb-6">
            <svelte:component this={route.icon} class="w-14 h-14 inline -mt-2" />
            {route.name}
          </h1>
        {/if}
      {/each}
    </div>
  </div>
  <div class="bottom-0 top-32 bg-gray-100 absolute -z-10 w-full" />
  <AppShell>
    <svelte:fragment slot="sidebarLeft">
      <Nav {routes} />
    </svelte:fragment>
  </AppShell>
  <!-- <div
      class="absolute top-0 left-0 right-0 bottom-0 bg-white bg-opacity-0 flex justify-center items-center z-40 animate-pulse"
    />
    <div class="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center z-50">
      <div class="flex flex-col items-center">
        <Loader2 class="w-16 h-16 text-primary-500 animate-spin" />
        <p class="text-gray-500 font-bold text-2xl ml-4">Loading...</p>
      </div>
    </div>
  {:else} -->
  {#key data.pathname}
    <div
      class="absolute pr-4 pt-4 pb-4 left-64 right-0 top-32 bottom-0 overflow-y-scroll hide-scrollbar"
      in:fly={{ y: 50, duration: 100, delay: 100 }}
      out:fly={{ y: 50, duration: 100 }}
    >
      <slot />
    </div>
  {/key}
</div>
