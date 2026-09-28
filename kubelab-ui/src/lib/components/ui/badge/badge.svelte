<script lang="ts">
	import { type Variant, badgeVariants } from ".";
	import { cn } from "$lib/utils.js";
	import type { HTMLAttributes } from "svelte/elements";

	type $$Props = HTMLAttributes<HTMLDivElement> & {
		variant?: Variant["variant"];
	};

	let className: $$Props["class"] = undefined;
	export { className as class };
	export let variant: $$Props["variant"] = "default";
</script>

<div class={cn(badgeVariants({ variant }), className)} {...$$restProps}>
	<slot />
</div>

