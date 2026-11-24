<script lang="ts">
    import { ExternalLink } from "lucide-svelte";

  export let href: string = "";
  export let title: string = "";
</script>

<a {href} {title} target="_blank">
  <div class="btn btn-sm btn-info">
    <slot />
    <ExternalLink class="inline ml-2" size={16} />
  </div>
</a>

<style>
  .btn {
    /* disable caps lock */
    text-transform: none;
  }
</style>
