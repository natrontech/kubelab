import { updateDataStores } from "#lib/stores/data.ts";
import { browser } from "$app/env";
import { client } from "#lib/pocketbase/index.ts";
import type { PageLoad } from "./$types";
import { goto } from "$app/navigation";

export const load: PageLoad = async () => {
    if (browser) {
        if (client.authStore.record) {
            await updateDataStores().catch((error) => {
                console.error(error);
            });
        } else {
            goto("/login/");
        }
    }
};
