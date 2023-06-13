<script lang="ts">
  import type { ComponentType, SvelteComponentTyped } from "svelte";

  // eslint-disable-next-line @typescript-eslint/naming-convention
  export let Console: ComponentType<SvelteComponentTyped>;
</script>

<div class="h-full overflow-y-auto">
  <svelte:component this={Console} />
</div>
