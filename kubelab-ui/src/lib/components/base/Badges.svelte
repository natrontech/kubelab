<script lang="ts">
  import { Color } from "$lib/utils/enums";

  export let color: Color = Color.Gray;
  export let size: "xs" | "sm" | "md" | "lg" = "md";
  export let rounded: boolean = true;
  export let text: string = "Badge";

  let bgColorClass: string = "bg-" + color + "-100";
  let textColorClass: string = "text-" + color + "-800";
  let roundedClass: string = rounded ? "rounded-full" : "";
  let sizeClass: string = "text-" + size;

  let cssClasses: string =
    "px-2.5 py-0.5 inline-flex items-center " +
    sizeClass +
    " font-medium " +
    bgColorClass +
    " " +
    textColorClass +
    " " +
    roundedClass;
</script>

<div>
  <span class={cssClasses}>{text}</span>
</div>
