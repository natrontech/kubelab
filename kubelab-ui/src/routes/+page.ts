import { client } from "#lib/pocketbase/index.ts";
import type { CompaniesResponse, FaqsResponse } from "#lib/pocketbase/generated-types.js";

export const load = async () => {
    const faqs: FaqsResponse[] = await client.collection("faqs").getFullList(200, {});

    const companies: CompaniesResponse[] = await client
        .collection("companies")
        .getFullList(200, {});

    return {
        faqs,
        companies
    };
};
