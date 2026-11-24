<script lang="ts">
  import { ExternalLink } from "@lucide/svelte";

  interface Props {
    href?: string;
    title?: string;
    children?: import("svelte").Snippet;
  }

  let { href = "", title = "", children }: Props = $props();
</script>

<a {href} {title} target="_blank">
  <div class="btn btn-sm btn-info">
    {@render children?.()}
    <ExternalLink class="inline ml-2" size={16} />
  </div>
</a>

<style>
  .btn {
    /* disable caps lock */
    text-transform: none;
  }
</style>
