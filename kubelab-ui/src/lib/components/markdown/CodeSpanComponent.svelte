<script lang="ts">
  import { Copy } from "lucide-svelte";
    import toast from "svelte-french-toast";

  export let raw: string;

  function copyCode() {
    navigator.clipboard.writeText(raw.replace(/`/g, ""));
    toast.success("Code copied to clipboard");
  }
</script>

<button
  class="btn btn-sm btn-neutral"
  on:click={copyCode}
>
  <code>{raw.replace(/`/g, "")}</code>
  <Copy class="inline ml-2" size={16} />
</button>

<style>
  .btn {
    /* disable caps lock */
    text-transform: none;
  }

</style>
