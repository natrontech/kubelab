<script lang="ts">
  import { generateGradient, getInitials } from "$lib/utils/avatar";

  export let src: string | undefined = undefined;
  export let alt: string = "";
  export let email: string = "";
  export let size: "sm" | "md" | "lg" = "md";

  let imgError = false;

  $: gradient = generateGradient(email || alt);
  $: initials = getInitials(email || alt);
  $: textSize = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-xl"
  }[size];
  $: sizeClass = {
    sm: "w-full h-full",
    md: "w-10 h-10",
    lg: "w-full h-full"
  }[size];

  function handleError() {
    imgError = true;
  }
</script>

{#if src && !imgError}
  <img
    {src}
    {alt}
    class="w-full h-full rounded-full object-cover"
    on:error={handleError}
  />
{:else}
  <div
    class="rounded-full flex items-center justify-center font-bold text-white {sizeClass} {textSize}"
    style="background: {gradient}"
  >
    {initials}
  </div>
{/if}

