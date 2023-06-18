import { updateDataStores } from "$lib/stores/data";
import toast from "svelte-french-toast";
import type { PageLoad } from "./$types";
import { browser } from "$app/environment";
import { client } from "$lib/pocketbase";

export const load: PageLoad = async () => {

    if (browser) {
        if (client.authStore.model) {
            await updateDataStores().catch((error) => {
                toast.error(error);
            });
        }
    }
};
