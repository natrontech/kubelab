<script lang="ts">
    import { client } from "$lib/pocketbase";
    import { avatarUrl } from "$lib/stores/data";
  import { Fileupload, Button, Label } from "flowbite-svelte";
    import toast from "svelte-french-toast";

  let fileuploadprops = {
    id: "user_avatar",
    name: "user_avatar",
    accept: "image/*",
    multiple: false,
    placeholder: "Choose file",
    class: "w-64 dark:text-white border-none",
    style: "width: 100%;"
  };

  async function updateProfile() {
    let fileupload: HTMLInputElement | null = document.getElementById("user_avatar") as HTMLInputElement;

    if (!fileupload.files?.length) {
      toast.error("No file selected");
      return;
    }

    if (fileupload && fileupload.files && fileupload.files.length > 0) {
      let file: File = fileupload.files[0];

      // Create FormData object and append the selected file to it
      const formData = new FormData();
      formData.append('avatar', file);

      // Perform the Pocketbase API call
      try {
        if (!client.authStore.model) {
          throw new Error("No user found");
        }
        await client.collection('users').update(client.authStore.model?.id, formData);

        // update authStore with the new avatar
        await client.collection("users").authRefresh();

        toast.success("Successfully updated profile")

        // reset the fileupload input
        fileupload.value = "";

        // update the avatarUrl
        $avatarUrl = "/api/files/" + client.authStore.model?.collectionId + "/" + client.authStore.model?.id + "/" + client.authStore.model?.avatar;

      } catch (error: any) {
        toast.error(error.message);
      }
    }
  }
</script>

<h1 class="text-center text-4xl text-white font-bold mb-8">Profile</h1>
<div
  class="bg-white dark:bg-base-100 shadow-md rounded-md flex flex-row justify-between items-center h-16 px-4"
>
  <div class="flex flex-row items-center">
    <img
      src={$avatarUrl}
      alt="avatar"
      class="rounded-full w-12 h-12 mr-4"
    />
    <div class="flex flex-col">
      <span class="font-bold text-lg">
        {client.authStore.model?.name}
      </span>
      <span class=" text-sm">
        {client.authStore.model?.email}
      </span>
    </div>
  </div>
  <div class="flex flex-row items-center">
    <Label for="user_avatar" class="mr-4">Max 5MB</Label>
    <Fileupload {...fileuploadprops} />
    <Button class="btn btn-neutral" on:click={updateProfile}>Upload</Button>
  </div>
</div>
