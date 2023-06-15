import { writable } from "svelte/store";

export const terminal_size = writable({ height: 65 });

// get pathnames from url
export const pathname = writable(window.location.pathname);
