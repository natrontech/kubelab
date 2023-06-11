import { client } from "$lib/pocketbase";
import type { LabSessionsResponse, LabsResponse } from "$lib/pocketbase/generated-types";
import type { PageLoad } from "../$types";

export const load: PageLoad = async () => {
    const labs: LabsResponse[] = await client.collection("labs").getFullList();
    const labsSessions: LabSessionsResponse[] = await client
        .collection("lab_sessions")
        .getFullList();
    return {
        labs,
        labsSessions
    };
};
