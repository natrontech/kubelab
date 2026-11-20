<script lang="ts">
  import { client } from "$lib/pocketbase";
  import { avatarUrl } from "$lib/stores/data";
  import Avatar from "$lib/components/ui/Avatar.svelte";
  import toast from "svelte-french-toast";
  import { Upload, User, Mail, Shield } from "lucide-svelte";
  import { onMount } from "svelte";

  let selectedFile: File | null = null;
  let fileInput: HTMLInputElement;
  let uploading = false;
  let previewUrl: string | null = null;

  onMount(() => {
    updateAvatarUrl();
  });

  function updateAvatarUrl() {
    if (client.authStore.model?.avatar) {
      $avatarUrl = client.files.getUrl(client.authStore.model, client.authStore.model.avatar);
      console.log("Avatar URL:", $avatarUrl);
    } else {
      $avatarUrl = "";
      console.log("No avatar set");
    }
  }

  function handleFileSelect(event: Event) {
    console.log("=== File select triggered ===");
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      selectedFile = target.files[0];
      console.log("File selected:", {
        name: selectedFile.name,
        size: selectedFile.size,
        type: selectedFile.type
      });

      const reader = new FileReader();
      reader.onload = (e) => {
        previewUrl = e.target?.result as string;
        console.log("Preview URL created");
      };
      reader.readAsDataURL(selectedFile);
    }
  }

  async function updateProfile() {
    console.log("=== Update profile called ===");
    console.log("Selected file:", selectedFile);
    console.log("User ID:", client.authStore.model?.id);
    console.log("Collection ID:", client.authStore.model?.collectionId);

    if (!selectedFile) {
      toast.error("Please select a file first");
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    uploading = true;

    try {
      if (!client.authStore.model) {
        throw new Error("No user found");
      }

      console.log("Creating FormData...");
      const formData = new FormData();
      formData.append("avatar", selectedFile);

      console.log("Sending update request...");
      const updatedUser = await client.collection("users").update(
        client.authStore.model.id,
        formData
      );

      console.log("Upload successful! Updated user:", updatedUser);
      console.log("New avatar filename:", updatedUser.avatar);

      console.log("Refreshing auth...");
      await client.collection("users").authRefresh();

      console.log("Auth refreshed. New model:", client.authStore.model);

      updateAvatarUrl();

      toast.success("Profile picture updated!");

      fileInput.value = "";
      selectedFile = null;
      previewUrl = null;

    } catch (error: any) {
      console.error("=== Upload error ===");
      console.error("Error object:", error);
      console.error("Error data:", error?.data);
      console.error("Error response:", error?.response);

      let errorMessage = "Failed to update profile picture";

      if (error?.data?.data) {
        const fieldErrors = Object.values(error.data.data).join(", ");
        errorMessage = `Upload failed: ${fieldErrors}`;
      } else if (error?.data?.message) {
        errorMessage = error.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    } finally {
      uploading = false;
    }
  }

  function formatDate(dateString: string | undefined) {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  }
</script>

<div class="container mx-auto py-6 px-4 max-w-6xl">
  <!-- Header -->
  <div class="mb-6">
    <h1 class="text-3xl font-bold text-foreground mb-1">
      Profile Settings
    </h1>
    <p class="text-sm text-muted-foreground">
      Manage your account and profile information
    </p>
  </div>

  <!-- Profile Header Card -->
  <div class="mb-6 bg-card border-2 rounded-xl shadow-lg overflow-hidden">
    <div class="h-24 bg-gradient-to-r from-primary via-primary/80 to-primary/60"></div>
    <div class="px-6 py-6">
      <div class="flex flex-col sm:flex-row items-center sm:items-start gap-6 -mt-16 sm:-mt-14">
        <div class="relative flex-shrink-0">
          <div class="w-28 h-28 border-4 border-background rounded-full overflow-hidden shadow-lg bg-background">
            <div class="w-full h-full">
              <Avatar
                src={$avatarUrl}
                alt={client.authStore.model?.username || "User"}
                email={client.authStore.model?.email || ""}
                size="lg"
              />
            </div>
          </div>
        </div>
        <div class="flex-1 text-center sm:text-left pt-0 sm:pt-6">
          <h2 class="text-2xl font-bold mb-1">{client.authStore.model?.name || "User"}</h2>
          <p class="text-sm text-muted-foreground mb-3">{client.authStore.model?.email}</p>
          <div class="flex flex-wrap gap-2 justify-center sm:justify-start">
            <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary text-white text-xs font-medium">
              <Shield class="w-3.5 h-3.5" />
              {client.authStore.model?.role || "user"}
            </span>
            <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-muted text-foreground text-xs font-medium">
              Member since {formatDate(client.authStore.model?.created)}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
    <!-- Account Details -->
    <div class="bg-card border-2 rounded-xl shadow-lg p-4">
      <h3 class="text-lg font-bold mb-3 flex items-center gap-2 pb-2 border-b">
        <User class="w-4 h-4 text-primary" />
        Account Details
      </h3>

      <div class="space-y-2.5">
        <div class="flex items-center gap-3 p-2.5 rounded-lg bg-muted/30 hover:bg-muted/50 transition-all">
          <div class="p-1.5 rounded-lg bg-primary/10">
            <User class="w-3.5 h-3.5 text-primary" />
          </div>
          <div class="flex-1">
            <p class="text-xs font-medium text-muted-foreground">Full Name</p>
            <p class="text-sm font-semibold">{client.authStore.model?.name || "Not set"}</p>
          </div>
        </div>

        <div class="flex items-center gap-3 p-2.5 rounded-lg bg-muted/30 hover:bg-muted/50 transition-all">
          <div class="p-1.5 rounded-lg bg-primary/10">
            <Mail class="w-3.5 h-3.5 text-primary" />
          </div>
          <div class="flex-1">
            <p class="text-xs font-medium text-muted-foreground">Email Address</p>
            <p class="text-sm font-semibold">{client.authStore.model?.email}</p>
          </div>
        </div>

        <div class="flex items-center gap-3 p-2.5 rounded-lg bg-muted/30 hover:bg-muted/50 transition-all">
          <div class="p-1.5 rounded-lg bg-primary/10">
            <Shield class="w-3.5 h-3.5 text-primary" />
          </div>
          <div class="flex-1">
            <p class="text-xs font-medium text-muted-foreground">Account Role</p>
            <p class="text-sm font-semibold capitalize">{client.authStore.model?.role || "user"}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Upload Profile Picture -->
    <div class="bg-card border-2 rounded-xl shadow-lg p-4">
      <h3 class="text-lg font-bold mb-3 flex items-center gap-2 pb-2 border-b">
        <Upload class="w-4 h-4 text-primary" />
        Profile Picture
      </h3>

      <div class="space-y-3">
        <!-- Preview -->
        <div class="w-full max-w-[200px] mx-auto">
          {#if previewUrl}
            <div class="aspect-square rounded-lg overflow-hidden border-2 border-primary shadow-md">
              <img src={previewUrl} alt="Preview" class="w-full h-full object-cover" />
            </div>
          {:else}
            <div class="aspect-square rounded-lg border-2 border-dashed border-muted-foreground/30 flex items-center justify-center bg-muted/20">
              <div class="text-center p-3">
                <Upload class="w-8 h-8 text-muted-foreground mx-auto mb-1" />
                <p class="text-xs text-muted-foreground">No image</p>
              </div>
            </div>
          {/if}
        </div>

        <!-- File Input -->
        <div>
          <label for="user_avatar" class="block">
            <div class="cursor-pointer rounded-lg border-2 border-dashed border-primary/30 bg-primary/5 hover:bg-primary/10 hover:border-primary transition-all p-3 text-center">
              <Upload class="w-5 h-5 text-primary mx-auto mb-1" />
              <p class="text-xs font-medium text-primary">Click to choose</p>
              <p class="text-xs text-muted-foreground">PNG, JPG up to 5MB</p>
            </div>
          </label>
          <input
            bind:this={fileInput}
            on:change={handleFileSelect}
            id="user_avatar"
            name="user_avatar"
            type="file"
            accept="image/*"
            class="hidden"
          />
        </div>

        <!-- File Info -->
        {#if selectedFile}
          <div class="p-2.5 rounded-lg bg-primary/10 border border-primary/30">
            <p class="text-xs font-medium text-primary uppercase mb-1">Selected</p>
            <p class="text-xs font-bold truncate">{selectedFile.name}</p>
            <p class="text-xs text-muted-foreground">
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        {/if}

        <!-- Upload Button -->
        <button
          on:click={updateProfile}
          disabled={!selectedFile || uploading}
          type="button"
          class="w-full h-10 rounded-lg font-medium text-sm text-white transition-all shadow-md
            {selectedFile && !uploading
              ? 'bg-primary hover:bg-primary/90 hover:shadow-lg cursor-pointer'
              : 'bg-muted-foreground/30 cursor-not-allowed'}"
        >
          {#if uploading}
            <span class="flex items-center justify-center gap-1.5">
              <span class="animate-spin">⟳</span>
              Uploading...
            </span>
          {:else if selectedFile}
            <span class="flex items-center justify-center gap-1.5">
              <Upload class="w-3.5 h-3.5" />
              Upload
            </span>
          {:else}
            Select image first
          {/if}
        </button>
      </div>
    </div>
  </div>
</div>
