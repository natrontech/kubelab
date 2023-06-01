<script lang="ts">
  /** @type {import('./$types').PageData} */
  export let data: any;
  import BackButton from "$lib/components/base/BackButton.svelte";
  import { toastStore } from "@skeletonlabs/skeleton";
  import { InputChip } from "@skeletonlabs/skeleton";

  let filterList: any[] = [];

  function onInvalidHandler(event: any): void {
    toastStore.trigger({
      message: `"${event.detail.input}" is an invalid value. Please try again!`,
      background: "variant-filled-error"
    });
  }

  let tableArr: any[] = [];
  let totalWeight: number = 0;
</script>

<div class="">
  <BackButton />
  <h2 class="h2 text-primary-500 font-bold mb-6">
    {data.props.deployment.name}
  </h2>
</div>

<div class="my-6">
  <InputChip
    name="filterList"
    placeholder="Enter any filter key"
    whitelist={filterList}
    on:invalid={onInvalidHandler}
  />
</div>

<!-- Responsive Container (recommended) -->
<div class="table-container">
  <!-- Native Table Element -->
  <table class="table table-hover">
    <thead>
      <tr>
        <th>Key</th>
        <th>Value</th>
        <th>Stage</th>
      </tr>
    </thead>
    <tbody>
      {#each tableArr as row, i}
        <tr>
          <td>{row.key}</td>
          <td>{row.value}</td>
          <td>{row.stage}</td>
        </tr>
      {/each}
    </tbody>
    <!-- <tfoot>
			<tr>
				<th colspan="3">Calculated Total Weight</th>
				<td>{totalWeight}</td>
			</tr>
		</tfoot> -->
  </table>
</div>
