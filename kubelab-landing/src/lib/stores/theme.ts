import { writable } from "svelte/store";
import { browser } from "$app/environment";

const defaultValue = false;
const initialDarkThemeValue = browser
    ? localStorage.getItem("darkTheme") === null
        ? defaultValue
        : localStorage.getItem("darkTheme") === "true"
    : defaultValue;

const darkTheme = writable<boolean>(initialDarkThemeValue);

darkTheme.subscribe((value) => {
    if (browser) {
        localStorage.setItem("darkTheme", value.toString());
    }
});

export default darkTheme;
