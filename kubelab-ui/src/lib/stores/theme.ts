import { writable } from "svelte/store";

const defaultValue = false;
const initialDarkThemeValue =
    localStorage.getItem("darkTheme") === null
        ? defaultValue
        : localStorage.getItem("darkTheme") === "true";

const darkTheme = writable<boolean>(initialDarkThemeValue);

darkTheme.subscribe((value) => {
    localStorage.setItem("darkTheme", value.toString());
});

export default darkTheme;
