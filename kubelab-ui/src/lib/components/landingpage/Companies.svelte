<script lang="ts">
  import type { CompaniesResponse } from "$lib/pocketbase/generated-types";

  export let companies: CompaniesResponse[] = [];

  function imagePath(record: CompaniesResponse) {
    return `/api/files/${record.collectionId}/${record.id}/${record.logo}`;
  }
</script>

<div class="mx-auto max-w-7xl px-6 lg:px-8">
  <div
    class="mx-auto grid max-w-lg grid-cols-4 items-center gap-x-8 gap-y-12 sm:max-w-xl sm:grid-cols-6 sm:gap-x-10 sm:gap-y-14 lg:mx-0 lg:max-w-none lg:grid-cols-5"
  >
    {#if companies.length > 0}
      {#each companies as company}
        <img
          class="col-span-2 max-h-14 w-full object-contain lg:col-span-1"
          src={imagePath(company)}
          alt={company.name}
          width="158"
          height="48"
        />
      {/each}
    {/if}
  </div>
  <div class="mt-16 flex justify-center">
    <p
      class="relative rounded-full px-4 py-1.5 text-sm leading-6  ring-1 ring-inset ring-gray-900/10 dark:ring-gray-100/10"
    >
      <span class="hidden md:inline"
        >Swisscom trains their employees on Kubernetes by working with us.</span
      >
      <a
        href="https://natron.io/blog/kubernetes-mastery-swisscom-kubelab-workshop"
        class="font-semibold"
        ><span class="absolute inset-0" aria-hidden="true" /> Read our blog
        <span aria-hidden="true">&rarr;</span></a
      >
    </p>
  </div>
</div>
