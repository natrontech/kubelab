<script lang="ts">
  import { run } from "svelte/legacy";

  import "../app.css";
  import "@xterm/xterm/css/xterm.css";
  import "../styles/prism.css";
  import { metadata } from "#lib/stores/metadata.ts";
  import { site } from "#lib/config.ts";
  import { beforeNavigate } from "$app/navigation";
  import Nav from "#lib/components/base/Nav.svelte";
  import { page } from "$app/state";
  import { Toaster } from "svelte-sonner";
  import darkTheme from "#lib/stores/theme.ts";
  interface Props {
    children?: import("svelte").Snippet;
  }

  let { children }: Props = $props();

  // export let data: any;

  let title = $derived($metadata.title ? $metadata.title + " | " + site.name : site.name);
  let description = $derived($metadata.description ?? site.description);

  // reset metadata on navigation so that the new page inherits nothing from the old page
  beforeNavigate(({ shallow, type }) => {
    if (shallow && type === "goto") return;

    $metadata = {};
  });

  // add  class="dark" data-theme="dark" to <html> if dark mode is enabled
  run(() => {
    if ($darkTheme) {
      document.documentElement.classList.add("dark");
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.setAttribute("data-theme", "light");
    }
  });
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
</svelte:head>

<div>
  <Toaster position="bottom-center" />
  {#if page.route.id && !["/", "/login"].includes(page.route.id) && !page.route.id.startsWith("/admin")}
    <Nav />
  {/if}
  {@render children?.()}
</div>
