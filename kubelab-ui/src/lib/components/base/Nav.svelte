<script lang="ts">
  import { navigating } from "$app/stores";
  import { client, logout } from "$lib/pocketbase";
  import { avatarUrl } from "$lib/stores/data";
  import darkTheme from "$lib/stores/theme";
  import type { NavRoute } from "$lib/types";
  import {
    TerminalSquare,
    Github,
    Presentation,
    Sun,
    Moon,
    BarChart2,
    Building2,
    Menu
  } from "lucide-svelte";
  import { Button } from "$lib/components/ui/button";
  import Avatar from "$lib/components/ui/Avatar.svelte";

  let userDropdownOpen = false;
  let mobileMenuOpen = false;

  $: if (client.authStore && client.authStore.model?.avatar) {
    $avatarUrl = client.files.getUrl(client.authStore.model, client.authStore.model.avatar);
  } else {
    $avatarUrl = "";
  }

  let routes: NavRoute[] = [
    {
      id: "1",
      name: "Dashboard",
      href: "/app/",
      icon: BarChart2
    },
    {
      id: "2",
      name: "Labs",
      href: "/labs/",
      icon: TerminalSquare
    },
    {
      id: "3",
      name: "Material",
      href: "/material/",
      icon: Presentation
    },
    {
      id: "4",
      name: "About",
      href: "https://github.com/natrontech/kubelab",
      icon: Github
    }
  ];

  if (client.authStore.model?.role != "admin") {
    routes = [
      {
        id: "1",
        name: "Dashboard",
        href: "/app/",
        icon: BarChart2
      },
      {
        id: "2",
        name: "Labs",
        href: "/labs/",
        icon: TerminalSquare
      },
      {
        id: "3",
        name: "Material",
        href: "/material/",
        icon: Presentation
      },
      {
        id: "4",
        name: "About",
        href: "https://github.com/natrontech/kubelab",
        icon: Github
      }
    ];
  } else {
    routes = [
      {
        id: "1",
        name: "Companies",
        href: "/app/",
        icon: Building2
      }
    ];
  }
</script>

<nav class="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 shadow-sm">
  <div class="container flex h-16 items-center px-4 mx-auto">
    <!-- Mobile Menu Button -->
    <div class="lg:hidden relative">
      <Button
        variant="ghost"
        size="icon"
        class="hover:bg-primary/10"
        on:click={() => mobileMenuOpen = !mobileMenuOpen}
      >
        <Menu class="h-5 w-5" />
      </Button>

      {#if mobileMenuOpen}
        <div
          class="fixed inset-0 z-40"
          on:click={() => mobileMenuOpen = false}
          on:keydown={(e) => e.key === 'Escape' && (mobileMenuOpen = false)}
          role="button"
          tabindex="-1"
        ></div>
        <div class="absolute left-0 mt-2 w-56 bg-card border-2 rounded-xl shadow-xl z-50 py-2">
          {#each routes as route}
            <a
              href={route.href}
              class="flex items-center gap-3 px-4 py-3 text-sm font-medium hover:bg-primary/10 transition-all"
              on:click={() => mobileMenuOpen = false}
            >
              <svelte:component this={route.icon} class="w-5 h-5 text-primary" />
              <span>{route.name}</span>
            </a>
          {/each}
        </div>
      {/if}
    </div>

    <!-- Logo -->
    <div class="flex items-center gap-2 ml-4 lg:ml-0">
      <a href="/app" class="flex items-center gap-2 font-bold text-lg hover:opacity-80 transition-opacity">
        <img src="/images/kubelab-logo.png" alt="logo" class="w-8 h-8" />
        <span class="hidden sm:inline-block">KubeLab</span>
      </a>
    </div>

    <!-- Desktop Navigation -->
    <nav class="hidden lg:flex ml-8 gap-1">
      {#each routes as route}
        <a href={route.href}>
          <Button variant="ghost" class="gap-2 font-medium hover:bg-primary/10 hover:text-primary transition-all">
            <svelte:component this={route.icon} class="w-5 h-5" />
            {route.name}
          </Button>
        </a>
      {/each}
    </nav>

    <!-- Right Side -->
    <div class="flex items-center gap-3 ml-auto">
      <!-- Theme Toggle -->
      <button
        class="inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all hover:bg-primary/10 hover:text-primary h-10 w-10"
        on:click={() => {
          darkTheme.update(current => !current);
        }}
        type="button"
        aria-label="Toggle theme"
      >
        {#if $darkTheme === true}
          <Sun class="h-5 w-5" />
        {:else}
          <Moon class="h-5 w-5" />
        {/if}
      </button>

      <!-- Powered By -->
      <a
        href="https://natron.io"
        target="_blank"
        class="hidden md:flex flex-col items-end mx-2 hover:opacity-80 transition-opacity"
      >
        <span class="text-xs font-semibold text-muted-foreground">Powered by</span>
        {#if $darkTheme === true}
          <img class="h-3 w-auto" src={"/images/natron-dark.png"} alt="Natron Tech" />
        {:else}
          <img class="h-3 w-auto" src={"/images/natron.png"} alt="Natron Tech" />
        {/if}
      </a>

      <!-- User Dropdown -->
      <div class="relative">
        <button
          class="hover:opacity-80 transition-all hover:ring-2 hover:ring-primary/20 rounded-full w-9 h-9 overflow-hidden"
          on:click={() => userDropdownOpen = !userDropdownOpen}
          type="button"
          aria-label="User menu"
        >
          <div class="w-full h-full">
            <Avatar
              src={$avatarUrl}
              alt={client.authStore.model?.username || "User"}
              email={client.authStore.model?.email || ""}
              size="sm"
            />
          </div>
        </button>

        {#if userDropdownOpen}
          <!-- Backdrop -->
          <div
            class="fixed inset-0 z-40"
            on:click={() => userDropdownOpen = false}
            on:keydown={(e) => e.key === 'Escape' && (userDropdownOpen = false)}
            role="button"
            tabindex="-1"
          ></div>
          <!-- Dropdown Menu -->
          <div class="absolute right-0 mt-2 w-56 bg-card border-2 rounded-xl shadow-xl z-50 py-2">
            <div class="px-4 py-3 border-b">
              <p class="text-sm font-medium">{client.authStore.model?.name || "User"}</p>
              <p class="text-xs text-muted-foreground truncate">{client.authStore.model?.email}</p>
            </div>
            <a
              href="/app/profile"
              class="flex items-center gap-2 px-4 py-3 text-sm font-medium hover:bg-primary/10 transition-all"
              on:click={() => userDropdownOpen = false}
            >
              Profile Settings
            </a>
            <button
              on:click={() => { logout(); userDropdownOpen = false; }}
              class="w-full flex items-center gap-2 text-left px-4 py-3 text-sm font-medium hover:bg-red-50 dark:hover:bg-red-950 transition-all text-red-600 dark:text-red-400 border-t"
              type="button"
            >
              Logout
            </button>
          </div>
        {/if}
      </div>
    </div>
  </div>
</nav>
