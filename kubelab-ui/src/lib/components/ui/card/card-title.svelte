<script lang="ts">
	import { cn } from "$lib/utils.js";
	import type { HTMLAttributes } from "svelte/elements";

	type $$Props = HTMLAttributes<HTMLHeadingElement>;

	let className: $$Props["class"] = undefined;
	export { className as class };
</script>

<h3
	class={cn(
		"text-2xl font-semibold leading-none tracking-tight",
		className
	)}
	{...$$restProps}
>
	<slot />
</h3>

