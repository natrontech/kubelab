import { client } from "$lib/pocketbase";
import type { RepositoriesResponse } from "$lib/pocketbase/generated-types";
import type { PageLoad } from "../$types";

export const load: PageLoad = async () => {
    const records: RepositoriesResponse[] = await client.collection("repositories").getFullList();
    return {
        records
    };
};
