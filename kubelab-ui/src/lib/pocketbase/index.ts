import PocketBase from "pocketbase";
import { writable } from "svelte/store";
import toast from "svelte-french-toast";
import { goto } from "$app/navigation";
import { browser } from "$app/environment";

// In browser, use relative URL (proxied by Vite)
// In SSR, use direct backend URL
const POCKETBASE_URL = browser ? "/" : "http://localhost:8090";

export const client = new PocketBase(POCKETBASE_URL);

export const currentUser = writable(client.authStore.model);

export async function login(
    email: string,
    password: string,
    register = false,
    rest: { [key: string]: any } = {}
) {
    if (register) {
        const user = { ...rest, email, password, confirmPassword: password };
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
