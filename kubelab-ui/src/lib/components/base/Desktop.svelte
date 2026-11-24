<script lang="ts">
  import darkTheme from "$lib/stores/theme";
  import type { ComponentType, SvelteComponentTyped } from "svelte";
  export let Console: ComponentType<SvelteComponentTyped>;
</script>

{#key $darkTheme}
  <div class="h-full overflow-y-auto">
    <svelte:component this={Console} />
  </div>
{/key}
