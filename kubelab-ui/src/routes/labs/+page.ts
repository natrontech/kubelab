import { updateDataStores } from "#lib/stores/data.ts";
import { toast } from "svelte-sonner";
import type { PageLoad } from "./$types";

export const load: PageLoad = async () => {
    await updateDataStores().catch((error) => {
        toast.error(error);
    });
};
