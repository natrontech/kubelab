import { mockDeployments } from "$lib/mock-data";
import { error } from "@sveltejs/kit";

/** @type {import('./$types').PageLoad} */
export function load({ params }: any) {
    const { id } = params;
    const deployment = mockDeployments.find((d) => d.id === id);
    if (deployment) {
        return {
            props: {
                deployment
            }
        };
    }

    throw error(404, "Not found");
}
