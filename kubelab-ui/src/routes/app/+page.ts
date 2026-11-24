import { updateDataStores } from "$lib/stores/data";
import { browser } from "$app/environment";
import { client } from "$lib/pocketbase";
import type { PageLoad } from "./$types";
import { goto } from "$app/navigation";

export const load: PageLoad = async () => {

    if (browser) {

        if (client.authStore.model) {
            await updateDataStores().catch((error) => {
                console.error(error);
            });
        } else {
            goto("/login/");
        }
    }
};
