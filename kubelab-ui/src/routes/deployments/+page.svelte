<script lang="ts">
  import TableViewSelector from "$lib/components/base/TableViewSelector.svelte";
  import DeploymentCard from "$lib/components/deployments/DeploymentCard.svelte";
  import { mockDeployments } from "$lib/mock-data";
  import tableView from "$lib/stores/tableView";
</script>

<TableViewSelector />

<div class="grid gap-6 {$tableView ? 'grid-cols-2' : ''}">
  {#each mockDeployments as deployment}
    <DeploymentCard {deployment} />
  {/each}
</div>
