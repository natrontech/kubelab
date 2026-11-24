import PocketBase from "pocketbase";
import { writable } from "svelte/store";
import { toast } from "svelte-sonner";
import { goto } from "$app/navigation";

export const client = new PocketBase();

export const currentUser = writable(client.authStore.record);

export async function login(
    email: string,
    password: string,
    register = false,
    rest: { [key: string]: any } = {}
) {
    if (register) {
        const user = { ...rest, email, password, passwordConfirm: password };
        await client.collection("users").create(user);
    }
    await client.collection("users").authWithPassword(email, password);
}

export function logout() {
    client.authStore.clear();
    currentUser.set(null);
    goto("/login/");
    toast.success("Successfully logged out.");
}
