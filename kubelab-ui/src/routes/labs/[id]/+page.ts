import { UpdateFilterEnum, updateDataStores } from "#lib/stores/data.ts";
import { toast } from "svelte-sonner";
import type { PageLoad } from "../$types";

export const load: PageLoad = async ({ params }: any) => {
    const { id } = params;

    await updateDataStores({
        filter: UpdateFilterEnum.ExercisesByLab,
        labId: id
    }).catch((error) => {
        toast.error(error);
    });
};
