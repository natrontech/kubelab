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
  class="inline bg-gray-500 text-xs transition-all duration-150 ease-in-out cursor-pointer rounded-md p-2 hover:bg-white text-white hover:text-gray-500"
  on:click={copyCode}
>
  <code>{raw.replace(/`/g, "")}</code>
  <Copy class="inline ml-2" size={16} />
</button>

<style>
  .code {
    white-space: pre-wrap;
    overflow-x: auto;
    padding: 1rem;
    background-color: #f5f5f5;
    border-radius: 0.5rem;
  }
</style>
