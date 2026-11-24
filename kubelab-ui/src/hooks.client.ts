import { client, currentUser } from "$lib/pocketbase";

client.authStore.loadFromCookie(document.cookie);
client.authStore.onChange(() => {
    currentUser.set(client.authStore.model);
    document.cookie = client.authStore.exportToCookie({ httpOnly: false });
});
