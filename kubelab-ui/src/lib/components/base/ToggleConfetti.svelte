<script lang="ts">
  import { onMount, tick } from "svelte";

  interface Props {
    toggleOnce?: boolean;
    relative?: boolean;
    label?: import("svelte").Snippet;
    children?: import("svelte").Snippet;
  }

  let { toggleOnce = false, relative = true, label, children }: Props = $props();

  let active = $state(false);

  async function click() {
    if (toggleOnce) {
      active = !active;
      return;
    }

    active = false;
    await tick();
    active = true;
  }

  onMount(() => {
    if (toggleOnce) {
      return;
    }

    click();
  });
</script>

<span onclick={click} class:relative>
  {@render label?.()}
  {#if active}
    <div class="confetti">
      {@render children?.()}
    </div>
  {/if}
</span>

<style>
  .relative {
    position: relative;
  }

  .relative .confetti {
    position: absolute;
    top: 50%;
    left: 50%;
  }

  .confetti {
    pointer-events: none;
  }
</style>
