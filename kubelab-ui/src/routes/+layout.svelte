<script lang="ts">
  import "../app.postcss";
  import "../app.css";
  import "../styles/xterm.css";
  import "../styles/prism.css";
  import { metadata } from "$lib/stores/metadata";
  import { site } from "$lib/config";
  import { beforeNavigate } from "$app/navigation";
  import Nav from "$lib/components/base/Nav.svelte";
  import { page } from "$app/stores";
  import { Toaster } from "svelte-french-toast";
  import darkTheme from "$lib/stores/theme";

  // export let data: any;

  $: title = $metadata.title ? $metadata.title + " | " + site.name : site.name;
  $: description = $metadata.description ?? site.description;

  // reset metadata on navigation so that the new page inherits nothing from the old page
  beforeNavigate(() => {
    $metadata = {};
  });

  // add  class="dark" data-theme="dark" to <html> if dark mode is enabled
  $: if ($darkTheme) {
    document.documentElement.classList.add("dark");
    document.documentElement.setAttribute("data-theme", "dark");
  } else {
    document.documentElement.classList.remove("dark");
    document.documentElement.setAttribute("data-theme", "light");
  }
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
</svelte:head>

<div>
  <Toaster position="bottom-center" />
  <!-- only display nav when not on /login -->
  {#if $page.route.id !== "/login" && $page.route.id !== "/" && $page.route.id !== "/signup" && $page.route.id !== "/admin/%5Bid%5D"}
    <!-- also not display nav when any subpath of /admin with regex /admin\/.*$/ -->
    {#if !$page.route.id.match(/\/admin\/.*$/)}
      <Nav />
    {/if}
  {/if}
  <slot />
</div>
