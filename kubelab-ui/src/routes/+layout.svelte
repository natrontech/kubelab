<script lang="ts">
  import "../app.postcss";
  import "../app.css";
  import "../styles/xterm.css";
  import { metadata } from "$lib/stores/metadata";
  import { site } from "$lib/config";
  import { beforeNavigate } from "$app/navigation";
  import Nav from "$lib/components/base/Nav.svelte";
  import { navigating, page } from "$app/stores";
  import { Toaster } from "svelte-french-toast";
  import { onMount } from "svelte";
  import { client } from "$lib/pocketbase";

  // export let data: any;

  $: title = $metadata.title ? $metadata.title + " | " + site.name : site.name;
  $: description = $metadata.description ?? site.description;
  // reset metadata on navigation so that the new page inherits nothing from the old page
  beforeNavigate(() => {
    $metadata = {};
  });
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
</svelte:head>

<div>
  <Toaster
    position="bottom-center"
  />
  <!-- only display nav when not on /login -->
  {#if $page.route.id !== "/login"}
    <Nav />
  {/if}
    <slot />
</div>
