<script lang="ts">
  interface Props {
    children?: import("svelte").Snippet;
  }

  let { children }: Props = $props();
</script>

<div class="absolute top-[78px] bottom-0 right-0 left-0 overflow-y-scroll p-2">
  {@render children?.()}
</div>
