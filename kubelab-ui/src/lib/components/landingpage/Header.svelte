<script lang="ts">
  import darkTheme from "$lib/stores/theme";
  import { Moon, Sun } from "lucide-svelte";
</script>

<header class="absolute inset-x-0 top-0 z-50">
  <nav class="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
    <div class="flex lg:flex-1">
      <a href="https://kubelab.ch" class="-m-1.5 p-1.5">
        <span class="sr-only ">KubeLab</span>
        <img class="h-8 w-auto" src={"/images/kubelab-logo.png"} alt="" />
      </a>
      <p class="text-lg font-bold pt-1 pl-2 ">KubeLab</p>
    </div>
    <div class="flex items-center gap-x-6">
      <!-- powered by label -->
      <a href="https://natron.io" target="_blank">
        <span class="text-sm font-semibold leading-6">Powered by</span>
        {#if $darkTheme === true}
          <img class="h-8 w-auto" src={"/images/natron-dark.png"} alt="Switzerland" />
        {:else}
          <img class="h-8 w-auto" src={"/images/natron.png"} alt="Switzerland" />
        {/if}
      </a>
      <button class="btn bg-transparent border-none" on:click={() => darkTheme.set(!$darkTheme)}>
        {#if $darkTheme === true}
          <Sun />
        {:else}
          <Moon />
        {/if}
      </button>
    </div>
  </nav>
</header>
