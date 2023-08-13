import { updateDataStores } from "$lib/stores/data";
import toast from "svelte-french-toast";
import { browser } from "$app/environment";
import { client } from "$lib/pocketbase";
import type { PageLoad } from "./$types";

export const load: PageLoad = async () => {

    if (browser) {
        if (client.authStore.model) {
            await updateDataStores().catch((error) => {
                toast.error(error);
            });
        }
    }
};
