<script lang="ts">
  import type { LabSessionsResponse, LabsResponse } from "$lib/pocketbase/generated-types";

  export let lab: LabsResponse;
  export let lab_session: LabSessionsResponse;

  // TODO: fetch all exercises and check if they are done by fetching also exercise sessions and comparing the end time (if it exist it is done)

  function getLabStatus() {
    let lab_status = "Start";
    if (lab_session.clusterRunning) {
      lab_status = "Stop";
    }
    return lab_status;
  }
</script>

<div tabindex="0" class="collapse collapse-arrow border border-base-300 bg-primary-200">
  <div class="collapse-title text-xl font-medium">
    {lab.title}
    <!-- show some stats -->
    <span class="badge badge-outline {lab_session.clusterRunning ? 'badge-accent' : ''} ml-2"
      >{lab_session.clusterRunning ? "Running" : "Stopped"}</span
    >
    <!-- show how many exercises are done already -->
  </div>
  <div class="collapse-content">
    <p>{lab.description}</p>
  </div>
  <div class="justify-end content-end flex">
    <button class="btn">{getLabStatus()}</button>
    {#if lab_session.clusterRunning}
      <button class="btn">Console</button>
    {/if}
  </div>
</div>
