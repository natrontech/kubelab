<script lang="ts">
  import { DeploymentStatus, type Deployment } from "$lib/types";
  import { HeartPulse, HeartCrack, Loader2, CloudOff } from "lucide-svelte";
  export let deployment: Deployment;
</script>

<a class="card rounded-md" href={"/deployments/" + deployment.id}>
  <div class="px-4 py-5 sm:px-6 relative">
    <h3 class="text-lg leading-6 font-medium text-gray-900 text-center mt-6">
      {deployment.name}
    </h3>
    <div class="absolute left-0 right-0 w-full top-0">
      {#if deployment.status === DeploymentStatus.Running}
        <span class="badge variant-filled bg-green-400 w-full rounded-t-md">
          <HeartPulse />{@html "&nbsp;"}
          {deployment.status}
        </span>
      {:else if deployment.status === DeploymentStatus.Failed}
        <span class="badge variant-filled bg-red-400 w-full rounded-t-md">
          <HeartCrack />{@html "&nbsp;"}
          {deployment.status}
        </span>
      {:else if deployment.status === DeploymentStatus.Pending}
        <span class="badge variant-filled bg-yellow-400 w-full rounded-t-md">
          <Loader2 class="animate-spin" />{@html "&nbsp;"}
          {deployment.status}
        </span>
      {:else if deployment.status === DeploymentStatus.Unknown}
        <span class="badge variant-filled bg-gray-400 w-full rounded-t-md">
          <CloudOff />{@html "&nbsp;"}
          {deployment.status}
        </span>
      {/if}
    </div>
  </div>
</a>
