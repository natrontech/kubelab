import { writable } from "svelte/store";

const defaultValue = false;
const initialCodeViewValue =
    localStorage.getItem("codeView") === null
        ? defaultValue
        : localStorage.getItem("codeView") === "true";

const codeView = writable<boolean>(initialCodeViewValue);

codeView.subscribe((value) => {
    localStorage.setItem("codeView", value.toString());
});

export default codeView;
