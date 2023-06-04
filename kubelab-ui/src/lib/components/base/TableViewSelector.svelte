<script lang="ts">
  import tableView from "$lib/stores/tableView";
  import { RadioGroup, RadioItem } from "@skeletonlabs/skeleton";
  import { LayoutGrid, LayoutList } from "lucide-svelte";
</script>

<div class="flex justify-between items-center mb-6">
  <RadioGroup active="variant-filled-primary" hover="hover:variant-soft-primary">
    <RadioItem
      bind:group={$tableView}
      on:click={() => tableView.set(false)}
      name="justify"
      value={false}><LayoutList /></RadioItem
    >
    <RadioItem
      bind:group={$tableView}
      on:click={() => tableView.set(true)}
      name="justify"
      value={true}><LayoutGrid /></RadioItem
    >
  </RadioGroup>
</div>
