import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ params }: any) => {
    const { id } = params;

    return {
        props: {
            id
        }
    };
};
