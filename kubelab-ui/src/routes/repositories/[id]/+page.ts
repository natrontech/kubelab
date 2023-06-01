import { client } from "$lib/pocketbase";
import type { RepositoriesResponse } from "$lib/pocketbase/generated-types";
import type { PageLoad } from "../$types";

export const load: PageLoad = async ({ params }: any) => {
    const { id } = params;

    const record: RepositoriesResponse = await client.collection("repositories").getOne(id);
    return {
        record
    };
};
