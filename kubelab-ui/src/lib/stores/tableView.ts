import { writable } from "svelte/store";

const defaultValue = false;
const initialTableViewValue =
    localStorage.getItem("tableView") === null
        ? defaultValue
        : localStorage.getItem("tableView") === "true";

const tableView = writable<boolean>(initialTableViewValue);

tableView.subscribe((value) => {
    localStorage.setItem("tableView", value.toString());
});

export default tableView;
