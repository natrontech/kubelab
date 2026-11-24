<script lang="ts">
  import { Copy } from "@lucide/svelte";
  import { getAstNode } from "svelte-exmarkdown";
  import { toast } from "svelte-sonner";

  const node = getAstNode();
  let text = $derived(node.current.children?.map((child) => child.value ?? "").join("") ?? "");

  function copyCode() {
    navigator.clipboard.writeText(text);
    toast.success("Code copied to clipboard");
  }
</script>

<button
  class="btn btn-sm btn-neutral dark:btn-primary dark:text-neutral normal-case"
  onclick={copyCode}
>
  <code>{text}</code>
  <Copy class="inline ml-2" size={16} />
</button>
