<script lang="ts">
  import { Copy } from "lucide-svelte";
  import Prism from "prismjs";
    import toast from "svelte-french-toast";
  export let text: string;
  export let lang: string;

  let language = "javascript";

  function copyCode() {
    navigator.clipboard.writeText(text);
    toast.success("Code copied to clipboard");
  }
</script>

<div class="code bg-base-200 p-2 my-2 rounded-md relative">
  {@html Prism.highlight(text, Prism.languages[language], language)}
  <button
    class="btn btn-neutral absolute top-0 right-0"
    on:click={copyCode}
  >
    <Copy class="" size={16} />
  </button>
</div>

<style>
  .code {
    white-space: pre-wrap;
  }
</style>
