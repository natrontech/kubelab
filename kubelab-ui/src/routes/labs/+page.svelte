<script lang="ts">
  import Lab from "$lib/components/labs/Lab.svelte";
  import type { LabSessionsResponse, LabsResponse } from "$lib/pocketbase/generated-types";
  import { metadata } from "$lib/stores/metadata";
  import type { PageData } from "./$types";

  export let data: PageData;

  $metadata.title = "Labs";

  // parse the data from the server
  $: labs = data.labs as LabsResponse[];
  $: lab_sessions = data.labsSessions as LabSessionsResponse[];

  function getLabSessions(lab_id: string): LabSessionsResponse {
    let lab_session = lab_sessions.find((lab_session) => lab_session.lab === lab_id);
    // only return the lab session if it exists
    // @ts-ignore
    return lab_session;
  }
</script>

<div class="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4 p-4">
  {#each labs as lab}
    <Lab {lab} lab_session={getLabSessions(lab.id)} />
  {/each}
</div>
