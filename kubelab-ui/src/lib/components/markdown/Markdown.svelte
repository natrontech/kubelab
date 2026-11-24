<script lang="ts">
  import Markdown from "svelte-exmarkdown";
  import { gfmPlugin } from "svelte-exmarkdown/gfm";
  import CodeComponent from "./CodeComponent.svelte";
  import CodeSpanComponent from "./CodeSpanComponent.svelte";
  import LinkComponent from "./LinkComponent.svelte";

  let { source = "" }: { source?: string } = $props();
  const plugins = [
    gfmPlugin(),
    { renderer: { pre: CodeComponent, code: CodeSpanComponent, a: LinkComponent } }
  ];
</script>

<Markdown md={source} {plugins} />
