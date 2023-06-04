<script lang="ts">
  import PlaceholderComponent from "$lib/components/base/PlaceholderComponent.svelte";
  import { onMount, type ComponentType, type SvelteComponentTyped } from "svelte";
  import Desktop from "./Desktop.svelte";
  import { marked } from "marked";
  let Console: ComponentType<SvelteComponentTyped> = PlaceholderComponent;

  onMount(async () => {
    Console = (await import("$lib/components/Console.svelte")).default;
  });

  const source = `
# This is a header

This is a paragraph.

* This is a list
* With two items
  1. And a sublist
  2. That is ordered
    * With another
    * Sublist inside

| And this is | A table |
|-------------|---------|
| With two    | columns |`;
</script>

<Desktop {Console} />
