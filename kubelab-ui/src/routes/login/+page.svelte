<script lang="ts">
  import { goto } from "$app/navigation";
  import ToggleConfetti from "$lib/components/base/ToggleConfetti.svelte";
  import { login } from "$lib/pocketbase";
  import { alertOnFailure } from "$lib/pocketbase/ui";
  import darkTheme from "$lib/stores/theme";

  // @ts-ignore
  import { Confetti } from "svelte-confetti";
  import toast from "svelte-french-toast";

  const DEFAULTS = {
    email: "",
    password: ""
  };
  let user = { ...DEFAULTS };
  let loading = false;

  async function submit() {
    loading = true;
    await alertOnFailure(async function () {
      await login(user.email, user.password);
      toast.success("Logged in successfully!");
      goto("/app");
    }).finally(() => {
      loading = false;
    });
  }
</script>

<!-- component -->
<div
  class="bg-no-repeat bg-cover bg-center relative
  bg-gradient-to-r from-blue-500 to-purple-500 dark:from-base-100 dark:to-base-100
  "
>
  <div class="absolute sm:inset-0 z-0" />
  <div class="min-h-screen sm:flex sm:flex-row mx-0 justify-center">
    <div class="flex-col flex self-center p-10 sm:max-w-5xl xl:max-w-2xl  z-10">
      <div class="self-start hidden lg:flex flex-col text-white">
        <h1 class="mb-3 font-bold text-5xl">
          Hi, Welcome to <span class="font-bold text-5xl"> KubeLab</span>
        </h1>
        <p class="pr-3">Experience Kubernetes Mastery Through Practice.</p>
        <a href="https://natron.io" target="_blank" class="mt-10">
          <span class="text-xs font-semibold leading-6 dark:text-gray-900 text-white">Powered by</span>
          {#if $darkTheme === false}
            <img class="h-4 w-auto" src={"/images/natron-dark.png"} alt="Switzerland" />
          {:else}
            <img class="h-4 w-auto" src={"/images/natron.png"} alt="Switzerland" />
          {/if}
        </a>
      </div>
    </div>
    <form
      class="flex justify-center self-center z-10 "
      method="POST"
      on:submit|preventDefault={submit}
    >
      <div class="p-12 bg-white dark:bg-neutral mx-auto rounded-2xl w-100">
        <div class="mb-4">
          <ToggleConfetti>
            <div class="btn btn-block btn-ghost normal-case text-xl mb-10" slot="label">
              <img src="/images/kubelab-logo.png" alt="logo" class="w-8 h-8 mr-2" /> KubeLab
            </div>
            <Confetti />
          </ToggleConfetti>
          <h3 class="font-semibold text-2xl ">Sign In</h3>
          <p class="text-gray-500">Please sign in to your account.</p>
        </div>
        <div class="space-y-5">
          <div class="space-y-2">
            <label class="text-sm font-medium tracking-wide">Email</label>
            <input
              type="text"
              placeholder="your@email.com"
              class="input input-bordered w-full max-w-xs"
              required
              bind:value={user.email}
            />
          </div>
          <div class="space-y-2">
            <label class="mb-5 text-sm font-medium tracking-wide"> Password </label>
            <input
              type="password"
              placeholder="Password"
              class="input input-bordered w-full max-w-xs"
              required
              bind:value={user.password}
            />
          </div>
          <div>
            <button type="submit" class="btn btn-neutral btn-block">
              {#if loading}
                <span class="loading loading-dots loading-md" /> Loading
              {:else}
                Sign in
              {/if}
            </button>
          </div>
        </div>
        <div class="pt-5 text-center text-gray-400 text-xs">
          <span>
            Copyright © {new Date().getFullYear()}
            <a
              href="https://natron.io"
              rel=""
              target="_blank"
              title="Natron Tech"
              class="text-blue hover:text-blue-500 ">Natron Tech</a
            ></span
          >
        </div>
      </div>
    </form>
  </div>
</div>
