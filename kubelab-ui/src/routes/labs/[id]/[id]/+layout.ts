import {
    UpdateFilterEnum,
    setExerciseByExerciseSession,
    setExerciseSessionByExercise,
    updateDataStores
} from "$lib/stores/data";
import toast from "svelte-french-toast";
import type { PageLoad } from "../$types";

export const load: PageLoad = async ({ params }: any) => {
    const { id } = params;
    const labId = window.location.pathname.split("/")[2];

    await updateDataStores({
        filter: UpdateFilterEnum.ExercisesByLab,
        labId: labId
    }).catch((error) => {
        toast.error(error);
    });

    await setExerciseByExerciseSession(id).catch((error) => {
        toast.error(error);
    });

    await setExerciseSessionByExercise(id).catch((error) => {
        toast.error(error);
    });
};
