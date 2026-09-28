<script lang="ts">
	import { cn } from "$lib/utils.js";
	import type { HTMLAttributes } from "svelte/elements";

	type $$Props = HTMLAttributes<HTMLDivElement>;

	let className: $$Props["class"] = undefined;
	export { className as class };
</script>

<div
	class={cn(
		"rounded-lg border bg-card text-card-foreground shadow-sm",
		className
	)}
	{...$$restProps}
>
	<slot />
</div>

