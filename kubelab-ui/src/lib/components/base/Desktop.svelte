<script lang="ts">
  import type { ComponentType, SvelteComponentTyped } from "svelte";

  // eslint-disable-next-line @typescript-eslint/naming-convention
  export let Console: ComponentType<SvelteComponentTyped>;
</script>

<div>
  <svelte:component this={Console} />
</div>
