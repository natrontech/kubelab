<script lang="ts">
  import { Copy } from "@lucide/svelte";
  import Prism from "prismjs";
  import { getAstNode } from "svelte-exmarkdown";
  import { toast } from "svelte-sonner";

  const node = getAstNode();
  let code = $derived(node.current.children?.[0]);
  let text = $derived(code?.children?.[0]?.value ?? "");
  let language = $derived(String(code?.properties?.className ?? "").replace("language-", ""));
  let grammar = $derived(Prism.languages[language]);

  function copyCode() {
    navigator.clipboard.writeText(text);
    toast.success("Code copied to clipboard");
  }
</script>

<div class="code bg-base-200 p-2 my-2 rounded-md relative">
  {#if grammar}
    {@html Prism.highlight(text, grammar, language)}
  {:else}
    {text}
  {/if}
  <button class="absolute top-2 right-2" onclick={copyCode} aria-label="Copy code">
    <Copy size={16} />
  </button>
</div>

<style>
  .code {
    white-space: pre-wrap;
  }
</style>
