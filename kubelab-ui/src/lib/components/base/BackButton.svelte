<script lang="ts">
  import Icon from "svelte-icons-pack";
  import { ArrowBigLeft } from "lucide-svelte";

  function onClick() {
    window.history.back();
  }
</script>

<button
  on:click={onClick}
  class="hover:text-gray-700 hover:bg-gray-300 text-gray-500 bg-gray-200 p-2"
>
  <ArrowBigLeft class="inline" />
  Back
</button>
