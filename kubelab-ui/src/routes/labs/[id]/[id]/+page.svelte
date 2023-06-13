<script lang="ts">
  import { Pane, Splitpanes } from "svelte-splitpanes";
  import PlaceholderComponent from "$lib/components/base/PlaceholderComponent.svelte";
  import { onMount, type ComponentType, type SvelteComponentTyped, onDestroy } from "svelte";
  import { marked } from "marked";
  import Desktop from "$lib/components/base/Desktop.svelte";
  import { metadata } from "$lib/stores/metadata";
  import { terminal_size } from "$lib/stores/terminal";
  import { layout_store } from "$lib/stores/layout_store";
    import { page } from "$app/stores";
  let Console: ComponentType<SvelteComponentTyped> = PlaceholderComponent;

  onMount(async () => {
    Console = (await import("$lib/components/Console.svelte")).default;
  });

  console.log($page.params);

  onDestroy(() => {
    Console = PlaceholderComponent;
  });

  $metadata.title = "Exercise";
</script>

<Splitpanes horizontal>
  <Pane>
    <Splitpanes>
      <Pane size={75}>Docs</Pane>
      <Pane>Hints / Solutions</Pane>
    </Splitpanes>
  </Pane>
  <Pane bind:size={$terminal_size.height}>
    {#key $page.params}
      <Desktop {Console} />
    {/key}
  </Pane>
</Splitpanes>
