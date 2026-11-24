<script lang="ts">
  import darkTheme from "#lib/stores/theme.ts";
  import type { Component } from "svelte";

  interface Props {
    Console: Component<Record<string, never>>;
  }

  let { Console }: Props = $props();
</script>

{#key $darkTheme}
  <div class="h-full overflow-y-auto">
    <Console />
  </div>
{/key}
