import { client } from "$lib/pocketbase";
import type {
    CompaniesResponse,
    FaqsResponse,
    PlansResponse
} from "$lib/pocketbase/generated-types.js";

export const load = async () => {
    const plans: PlansResponse[] = await client.collection("plans").getFullList(200, {
        expand: "features,optionalFeatures",
        sort: "price"
    })

    const faqs: FaqsResponse[] = await client.collection("faqs").getFullList(200, {});

    const companies: CompaniesResponse[] = await client
        .collection("companies")
        .getFullList(200, {});

    return {
        plans,
        faqs,
        companies
    };
};
