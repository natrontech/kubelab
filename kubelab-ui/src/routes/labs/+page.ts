import { updateDataStores } from "$lib/stores/data";
import toast from "svelte-french-toast";
import type { PageLoad } from "./$types";

export const load: PageLoad = async () => {
    await updateDataStores().catch((error) => {
        toast.error(error);
    });
};
