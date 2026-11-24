<script lang="ts">
  import { Color } from "#lib/utils/enums.ts";

  interface Props {
    color?: Color;
    size?: "xs" | "sm" | "md" | "lg";
    rounded?: boolean;
    text?: string;
  }

  let { color = Color.Gray, size = "md", rounded = true, text = "Badge" }: Props = $props();

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
