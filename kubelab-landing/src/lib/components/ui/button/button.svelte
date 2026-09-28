<script lang="ts">
	import { Button as ButtonPrimitive } from "bits-ui";
	import { type Variant, buttonVariants } from ".";
	import { cn } from "$lib/utils.js";

	type $$Props = ButtonPrimitive.Props & {
		variant?: Variant["variant"];
		size?: Variant["size"];
	};
	type $$Events = ButtonPrimitive.Events;

	let className: $$Props["class"] = undefined;
	export { className as class };
	export let variant: $$Props["variant"] = "default";
	export let size: $$Props["size"] = "default";
	export let builders: $$Props["builders"] = [];
</script>

<ButtonPrimitive.Root
	{builders}
	class={cn(buttonVariants({ variant, size, className }))}
	type="button"
	{...$$restProps}
	on:click
	on:keydown
>
	<slot />
</ButtonPrimitive.Root>

