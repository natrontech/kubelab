<script lang="ts">
  import { generateGradient, getInitials } from "$lib/utils/avatar";

  export let src: string | undefined = undefined;
  export let alt: string = "";
  export let email: string = "";
  export let size: "sm" | "md" | "lg" = "md";
  
  let imgError = false;
  
  $: gradient = generateGradient(email || alt);
  $: initials = getInitials(email || alt);
  $: sizeClass = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-20 h-20 text-xl"
  }[size];
  
  function handleError() {
    imgError = true;
  }
</script>

{#if src && !imgError}
  <img 
    {src} 
    {alt} 
    class="rounded-full object-cover {sizeClass} ring-2 ring-border"
    on:error={handleError}
  />
{:else}
  <div 
    class="rounded-full flex items-center justify-center font-bold text-white {sizeClass} ring-2 ring-border"
    style="background: {gradient}"
  >
    {initials}
  </div>
{/if}

