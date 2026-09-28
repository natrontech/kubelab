<script lang="ts">
  import { goto } from "$app/navigation";
  import ToggleConfetti from "$lib/components/base/ToggleConfetti.svelte";
  import { login } from "$lib/pocketbase";
  import { alertOnFailure } from "$lib/pocketbase/ui";
  import darkTheme from "$lib/stores/theme";
  import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "$lib/components/ui/card";
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import { Terminal, Rocket, Zap, Target } from "lucide-svelte";

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

<div class="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
  <!-- Animated Background Elements -->
  <div class="absolute inset-0 overflow-hidden pointer-events-none opacity-60 dark:opacity-30">
    <div class="absolute top-20 left-10 w-72 h-72 bg-primary/8 rounded-full blur-3xl"></div>
    <div class="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
  </div>

  <div class="w-full max-w-6xl relative z-10">
    <div class="grid lg:grid-cols-2 gap-12 items-center">
      <!-- Left Side - Hero -->
      <div class="hidden lg:block space-y-8">
        <!-- Logo & Title -->
        <div class="space-y-4">
          <div class="flex items-center gap-3">
            <div class="p-3 rounded-xl bg-primary">
              <img src="/images/kubelab-logo.png" alt="logo" class="w-10 h-10" />
            </div>
            <div>
              <h1 class="text-4xl font-bold text-foreground">KubeLab</h1>
              <p class="text-muted-foreground">Master Kubernetes Through Practice</p>
            </div>
          </div>
        </div>

        <!-- Feature Cards -->
        <div class="space-y-4">
          <div class="flex items-start gap-4 p-4 rounded-lg bg-card border hover:shadow-md transition-all">
            <div class="p-2 rounded-lg bg-primary/10">
              <Terminal class="h-6 w-6 text-primary" />
            </div>
            <div class="flex-1">
              <h3 class="font-semibold text-foreground mb-1">Interactive Labs</h3>
              <p class="text-sm text-muted-foreground">
                Hands-on Kubernetes exercises in real isolated environments
              </p>
            </div>
          </div>

          <div class="flex items-start gap-4 p-4 rounded-lg bg-card border hover:shadow-md transition-all">
            <div class="p-2 rounded-lg bg-primary/10">
              <Rocket class="h-6 w-6 text-primary" />
            </div>
            <div class="flex-1">
              <h3 class="font-semibold text-foreground mb-1">Progressive Learning</h3>
              <p class="text-sm text-muted-foreground">
                From basics to advanced topics with guided challenges
              </p>
            </div>
          </div>

          <div class="flex items-start gap-4 p-4 rounded-lg bg-card border hover:shadow-md transition-all">
            <div class="p-2 rounded-lg bg-primary/10">
              <Zap class="h-6 w-6 text-primary" />
            </div>
            <div class="flex-1">
              <h3 class="font-semibold text-foreground mb-1">Instant Feedback</h3>
              <p class="text-sm text-muted-foreground">
                Get real-time validation and hints as you progress
              </p>
            </div>
          </div>

          <div class="flex items-start gap-4 p-4 rounded-lg bg-card border hover:shadow-md transition-all">
            <div class="p-2 rounded-lg bg-primary/10">
              <Target class="h-6 w-6 text-primary" />
            </div>
            <div class="flex-1">
              <h3 class="font-semibold text-foreground mb-1">Track Progress</h3>
              <p class="text-sm text-muted-foreground">
                Monitor your learning journey with detailed analytics
              </p>
            </div>
          </div>
        </div>

        <!-- Powered By -->
        <div class="pt-4">
          <a href="https://natron.io" target="_blank" class="inline-block group">
            <p class="text-xs font-semibold text-muted-foreground mb-2">Powered by</p>
            {#if $darkTheme === true}
              <img class="h-5 w-auto group-hover:opacity-80 transition-opacity" src={"/images/natron.png"} alt="Natron Tech" />
            {:else}
              <img class="h-5 w-auto group-hover:opacity-80 transition-opacity" src={"/images/natron-dark.png"} alt="Natron Tech" />
            {/if}
          </a>
        </div>
      </div>

      <!-- Right Side - Login Form -->
      <div class="flex justify-center">
        <form
          class="w-full max-w-md"
          method="POST"
          on:submit|preventDefault={submit}
        >
          <Card class="border-2 shadow-xl">
            <CardHeader class="space-y-4 text-center">
              <!-- Mobile Logo -->
              <div class="lg:hidden flex justify-center mb-2">
                <div class="p-3 rounded-xl bg-primary">
                  <img src="/images/kubelab-logo.png" alt="logo" class="w-10 h-10" />
                </div>
              </div>

              <div>
                <CardTitle class="text-3xl font-bold">Welcome Back</CardTitle>
                <CardDescription class="mt-2">
                  Sign in to continue your Kubernetes journey
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent class="space-y-6">
              <div class="space-y-4">
                <div class="space-y-2">
                  <Label for="email" class="text-sm font-medium">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    required
                    bind:value={user.email}
                    class="h-11"
                  />
                </div>

                <div class="space-y-2">
                  <Label for="password" class="text-sm font-medium">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    required
                    bind:value={user.password}
                    class="h-11"
                  />
                </div>
              </div>

              <Button
                type="submit"
                class="w-full h-11 bg-primary hover:bg-primary/90"
                disabled={loading}
              >
                {#if loading}
                  <span class="loading loading-dots loading-sm mr-2"></span>
                  Signing in...
                {:else}
                  Sign In
                {/if}
              </Button>

              <!-- Divider -->
              <div class="relative">
                <div class="absolute inset-0 flex items-center">
                  <span class="w-full border-t"></span>
                </div>
                <div class="relative flex justify-center text-xs uppercase">
                  <span class="bg-card px-2 text-muted-foreground">
                    Secure Login
                  </span>
                </div>
              </div>

              <!-- Footer -->
              <div class="text-center space-y-2">
                <p class="text-xs text-muted-foreground">
                  By signing in, you agree to our Terms of Service and Privacy Policy
                </p>
                <p class="text-xs text-muted-foreground">
                  © {new Date().getFullYear()}
                  <a
                    href="https://natron.io"
                    target="_blank"
                    class="text-primary hover:underline font-medium"
                  >
                    Natron Tech
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>

          <!-- Mobile Features (shown below form on mobile) -->
          <div class="lg:hidden mt-8 space-y-3">
            <div class="flex items-center gap-3 p-3 rounded-lg bg-card border text-sm">
              <Terminal class="h-5 w-5 text-primary shrink-0" />
              <span class="text-muted-foreground">Interactive Kubernetes Labs</span>
            </div>
            <div class="flex items-center gap-3 p-3 rounded-lg bg-card border text-sm">
              <Zap class="h-5 w-5 text-primary shrink-0" />
              <span class="text-muted-foreground">Real-time Feedback</span>
            </div>
            <div class="flex items-center gap-3 p-3 rounded-lg bg-card border text-sm">
              <Target class="h-5 w-5 text-primary shrink-0" />
              <span class="text-muted-foreground">Track Your Progress</span>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</div>
