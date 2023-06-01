<script lang="ts">
  import { metadata } from "$lib/stores/metadata";
  import type { RepositoriesResponse } from "$lib/pocketbase/generated-types";
  import type { PageData } from "./$types";
  import RepositoryCard from "$lib/components/repositories/RepositoryCard.svelte";
  import tableView from "$lib/stores/tableView";
  import TableViewSelector from "$lib/components/base/TableViewSelector.svelte";
  import { client } from "$lib/pocketbase";
    import { onDestroy, onMount } from "svelte";

  $metadata.title = "Repositories";

  export let data: PageData;

  // // parse data to RepositoriesRecord[]
  $: repositories = data.records as RepositoriesResponse[];

  onMount(async () => {
    await client.collection("repositories").subscribe("*", function (e: any) {
      // update the repositories array and the repository record
      if (e.action === "update") {
        const index = repositories.findIndex((r) => r.id === e.record.id);
        repositories[index] = e.record;
      }
      if (e.action === "create") {
        repositories = [e.record, ...repositories];
      }
      if (e.action === "delete") {
        const index = repositories.findIndex((r) => r.id === e.record.id);
        repositories = [...repositories.slice(0, index), ...repositories.slice(index + 1)];
      }
    });
  });

  onDestroy(() => {
    client.collection("repositories").unsubscribe();
  });

</script>

<TableViewSelector />

<div class="grid gap-6 {$tableView ? 'grid-cols-2' : ''}">
  {#each repositories as repository}
    <RepositoryCard {repository} />
  {/each}
</div>
