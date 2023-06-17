import {
    UpdateFilterEnum,
    filterExerciseSessionsByLab,
    filterExercisesByLab,
    updateDataStores
} from "$lib/stores/data";
import toast from "svelte-french-toast";
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
