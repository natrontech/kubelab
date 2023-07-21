import { writable } from "svelte/store";

const defaultValue = false;
const initialHorizontalViewValue =
    localStorage.getItem("horizontalView") === null
        ? defaultValue
        : localStorage.getItem("horizontalView") === "true";

const horizontalView = writable<boolean>(initialHorizontalViewValue);

horizontalView.subscribe((value) => {
    localStorage.setItem("horizontalView", value.toString());
});

export default horizontalView;
