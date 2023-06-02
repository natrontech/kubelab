<script lang="ts">
  import "../app.postcss";
  import "../app.css";
  import "../styles/xterm.css";
  import { page } from "$app/stores";
  import { FolderGit2, LayoutDashboard, FileCode, Layers, Package } from "lucide-svelte";
  import type { NavRoute } from "$lib/types";
  import { metadata } from "$lib/stores/metadata";
  import { site } from "$lib/config";
  import { beforeNavigate } from "$app/navigation";
  import { fly } from "svelte/transition";
    import Nav from "$lib/components/base/Nav.svelte";

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

<div>
  <Nav routes={routes} />
  <slot />
</div>
