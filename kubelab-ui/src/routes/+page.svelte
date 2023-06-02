<script lang="ts">
  import PlaceholderComponent from "$lib/components/base/PlaceholderComponent.svelte";
  import { onMount, type ComponentType, type SvelteComponentTyped } from "svelte";
    import Desktop from "./Desktop.svelte";
  let Console: ComponentType<SvelteComponentTyped> = PlaceholderComponent;

  onMount(async () => {
    Console = (await import("$lib/components/Console.svelte")).default;
  });
</script>

<Desktop {Console} />
