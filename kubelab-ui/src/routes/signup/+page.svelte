<script lang="ts">
  import { goto } from "$app/navigation";
  import ToggleConfetti from "$lib/components/base/ToggleConfetti.svelte";
  import { alertOnFailure } from "$lib/pocketbase/ui";
  import { Github, Megaphone } from "lucide-svelte";

  // @ts-ignore
  import { Confetti } from "svelte-confetti";
  import toast from "svelte-french-toast";

  let loading = false;

  async function authWithGithub() {
    loading = true;
    await alertOnFailure(async function () {
      // await client.collection("users").authWithOAuth2({ provider: "github" });
      toast.success("Logged in successfully!");
      goto("/app");
    }).finally(() => {
      loading = false;
    });
  }
</script>

<!-- component -->
<div
  class="bg-no-repeat bg-cover bg-center relative"
  style="background-image: url(/images/bg.svg);"
>
  <div class="absolute sm:inset-0 z-0" />
  <div class="min-h-screen sm:flex sm:flex-row mx-0 justify-center">
    <div class="flex-col flex self-center p-10 sm:max-w-5xl xl:max-w-2xl  z-10">
      <div class="self-start hidden lg:flex flex-col text-white">
        <h1 class="mb-3 font-bold text-5xl">
          Hi, Welcome to <span class="font-bold text-5xl"> KubeLab</span>
        </h1>
        <p class="pr-3">Experience Kubernetes Mastery Through Practice.</p>
      </div>
    </div>
    <div class="flex justify-center self-center z-10 ">
      <div class="p-12 bg-white mx-auto rounded-2xl w-100 border-4 border-neutral">
        <div class="mb-4">
          <ToggleConfetti>
            <div class="btn btn-block btn-ghost normal-case text-xl mb-10" slot="label">
              <img src="/images/kubelab-logo.png" alt="logo" class="w-8 h-8 mr-2" /> KubeLab
            </div>
            <Confetti />
          </ToggleConfetti>
          <h3 class="font-semibold text-2xl ">Sign Up</h3>
          <p class="text-gray-900 bg-blue-200 px-4 py-2 border-neutral border-2 rounded-lg">
            <Megaphone class="w-6 h-6 mr-2 inline-block" />
            If you want a <b>email / password</b> user,<br /> reach out to us via <b><a href="mailto:info@natron.io">email</a></b>!
          </p>
        </div>
        <div class="gap-4 grid grid-cols-2">
          <button
            class="btn btn-block btn-neutral btn-primary"
            on:click={authWithGithub}
            disabled={loading}
          >
            <Github class="w-6 h-6 mr-2" />
          </button>
          <button class="btn btn-block btn-neutral btn-primary" disabled={loading}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-google"
              viewBox="0 0 16 16"
            >
              <path
                d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z"
              />
            </svg>
          </button>
          <button class="btn btn-block btn-neutral btn-primary" disabled={loading}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-microsoft"
              viewBox="0 0 16 16"
            >
              <path
                d="M7.462 0H0v7.19h7.462V0zM16 0H8.538v7.19H16V0zM7.462 8.211H0V16h7.462V8.211zm8.538 0H8.538V16H16V8.211z"
              />
            </svg>
          </button>
          <button class="btn btn-block btn-neutral btn-primary" disabled={loading}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-apple"
              viewBox="0 0 16 16"
            >
              <path
                d="M11.182.008C11.148-.03 9.923.023 8.857 1.18c-1.066 1.156-.902 2.482-.878 2.516.024.034 1.52.087 2.475-1.258.955-1.345.762-2.391.728-2.43Zm3.314 11.733c-.048-.096-2.325-1.234-2.113-3.422.212-2.189 1.675-2.789 1.698-2.854.023-.065-.597-.79-1.254-1.157a3.692 3.692 0 0 0-1.563-.434c-.108-.003-.483-.095-1.254.116-.508.139-1.653.589-1.968.607-.316.018-1.256-.522-2.267-.665-.647-.125-1.333.131-1.824.328-.49.196-1.422.754-2.074 2.237-.652 1.482-.311 3.83-.067 4.56.244.729.625 1.924 1.273 2.796.576.984 1.34 1.667 1.659 1.899.319.232 1.219.386 1.843.067.502-.308 1.408-.485 1.766-.472.357.013 1.061.154 1.782.539.571.197 1.111.115 1.652-.105.541-.221 1.324-1.059 2.238-2.758.347-.79.505-1.217.473-1.282Z"
              />
              <path
                d="M11.182.008C11.148-.03 9.923.023 8.857 1.18c-1.066 1.156-.902 2.482-.878 2.516.024.034 1.52.087 2.475-1.258.955-1.345.762-2.391.728-2.43Zm3.314 11.733c-.048-.096-2.325-1.234-2.113-3.422.212-2.189 1.675-2.789 1.698-2.854.023-.065-.597-.79-1.254-1.157a3.692 3.692 0 0 0-1.563-.434c-.108-.003-.483-.095-1.254.116-.508.139-1.653.589-1.968.607-.316.018-1.256-.522-2.267-.665-.647-.125-1.333.131-1.824.328-.49.196-1.422.754-2.074 2.237-.652 1.482-.311 3.83-.067 4.56.244.729.625 1.924 1.273 2.796.576.984 1.34 1.667 1.659 1.899.319.232 1.219.386 1.843.067.502-.308 1.408-.485 1.766-.472.357.013 1.061.154 1.782.539.571.197 1.111.115 1.652-.105.541-.221 1.324-1.059 2.238-2.758.347-.79.505-1.217.473-1.282Z"
              />
            </svg>
          </button>
        </div>
        <div class="pt-5 text-center text-gray-400 text-xs">
          <span>
            Copyright © 2023
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
    </div>
  </div>
</div>
