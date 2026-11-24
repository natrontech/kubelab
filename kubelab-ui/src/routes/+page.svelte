<script lang="ts">
  import { client } from "$lib/pocketbase";
  import type { FeaturesResponse } from "$lib/pocketbase/generated-types";
  import {
    Terminal,
    Rocket,
    Zap,
    Target,
    Shield,
    Users,
    ChevronRight,
    CheckCircle2,
    ArrowRight,
    Building2,
    BookOpen,
    Trophy,
    Clock,
    Github
  } from "lucide-svelte";
  import { Button } from "$lib/components/ui/button";
  import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "$lib/components/ui/card";
  import { Badge } from "$lib/components/ui/badge";
  import { onMount } from "svelte";

  const faqs = [
    {
      question: "What is KubeLab?",
      answer: "KubeLab is an interactive Kubernetes learning platform that provides hands-on labs in real isolated environments. Each user gets their own virtual Kubernetes cluster to practice on."
    },
    {
      question: "How do the lab sessions work?",
      answer: "When you start a lab or exercise, KubeLab provisions a dedicated vcluster (virtual Kubernetes cluster) for you. This gives you a fully isolated, real Kubernetes environment to work with, complete with kubectl access and a web-based terminal."
    },
    {
      question: "Can I use KubeLab for team training?",
      answer: "Yes! KubeLab is perfect for team training. The Individual plan supports up to 3 concurrent sessions, and our Enterprise plan offers unlimited sessions with custom labs and team management features."
    },
    {
      question: "What happens if I get stuck during a lab?",
      answer: "Each lab includes detailed instructions and hints to guide you. Individual plan users have access to community support, while Enterprise customers get priority support with dedicated assistance."
    },
    {
      question: "Can I create my own custom labs?",
      answer: "Custom lab creation is available with our Enterprise plan. You can design labs tailored to your organization's specific needs and technologies."
    },
    {
      question: "Is my data secure?",
      answer: "Absolutely. Each lab session is completely isolated in its own vcluster, ensuring your work cannot interfere with others. Enterprise plans include additional compliance features like SOC2 and GDPR support."
    }
  ];
  const defaultPlans = [
    {
      id: 'individual',
      name: 'Individual',
      description: 'Perfect for developers and small teams learning Kubernetes',
      monthlyPrice: 49,
      yearlyPrice: 39,
      active: true,
      features: [
        'Access to all labs and exercises',
        'Up to 3 concurrent lab sessions',
        'Personal progress tracking',
        'Community support',
        'Analytics dashboard',
        'Certificate of completion',
        'Unlimited lab time'
      ]
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'Dedicated KubeLab instance for your organization',
      monthlyPrice: null,
      yearlyPrice: null,
      contactSales: true,
      active: true,
      features: [
        'Dedicated KubeLab instance',
        'Whitelabeling & custom branding',
        'Custom lab creation',
        'Unlimited concurrent sessions',
        'SSO integration',
        'Advanced analytics & reporting',
        'Priority support & SLA',
        'On-premise deployment option',
        'Compliance features (SOC2, GDPR)',
        'Training workshops included',
        'Custom certification program'
      ]
    }
  ];

  let plans: any[] = defaultPlans;
  let planFeatures: { [key: string]: any[] } = {};
  let isYearly = false;

  onMount(async () => {
    try {
      const dbPlans = await client.collection("plans").getFullList({
        filter: 'active = true',
        sort: 'price'
      });

      if (dbPlans && dbPlans.length > 0) {
        plans = dbPlans;

        const features = await client.collection("features").getFullList({
          expand: 'plan'
        });

        features.forEach((feature: any) => {
          if (feature.plan) {
            if (!planFeatures[feature.plan]) {
              planFeatures[feature.plan] = [];
            }
            planFeatures[feature.plan].push(feature);
          }
        });
      }
    } catch (error) {
      console.error("Error loading plans:", error);
      // Keep using default plans
    }
  });

  const mainFeatures = [
    {
      icon: Terminal,
      title: "Interactive Kubernetes Labs",
      description: "Hands-on exercises in real isolated K8s environments. Practice with actual clusters, not simulations."
    },
    {
      icon: Rocket,
      title: "Progressive Learning Path",
      description: "From basics to advanced topics. Structured curriculum designed by Kubernetes experts."
    },
    {
      icon: Zap,
      title: "Instant Feedback",
      description: "Get real-time validation and hints as you work. Know immediately if you're on the right track."
    },
    {
      icon: Shield,
      title: "Isolated Environments",
      description: "Each user gets their own vcluster. Safe experimentation without breaking production."
    },
    {
      icon: Users,
      title: "Team Management",
      description: "Track team progress, compare performance, and identify areas for improvement."
    },
    {
      icon: Trophy,
      title: "Achievement System",
      description: "Earn badges and track your progress. See how you stack up against other learners."
    }
  ];

  let activeFaq = -1;

  function handleGetStarted() {
    console.log("Get Started clicked");
    window.location.href = "/signup";
  }
</script>

<svelte:head>
  <title>KubeLab - Master Kubernetes Through Practice</title>
  <meta name="description" content="Learn Kubernetes hands-on with interactive labs in real isolated environments. From basics to advanced topics." />
</svelte:head>

<!-- Hero Section -->
<section class="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
  <!-- Animated Background -->
  <div class="absolute inset-0 overflow-hidden pointer-events-none opacity-60 dark:opacity-30">
    <div class="absolute top-20 left-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
    <div class="absolute bottom-20 right-10 w-[600px] h-[600px] bg-primary/3 rounded-full blur-3xl"></div>
  </div>

  <div class="container mx-auto px-4 py-20 relative z-10">
    <div class="max-w-4xl mx-auto text-center space-y-8">
      <!-- Logo -->
      <div class="flex justify-center">
        <div class="p-4 rounded-2xl bg-primary/10 border border-primary/20">
          <img src="/images/kubelab-logo.png" alt="KubeLab" class="w-16 h-16" />
        </div>
      </div>

      <!-- Title -->
      <h1 class="text-5xl md:text-7xl font-bold leading-tight">
        Master Kubernetes
        <span class="block text-primary mt-2">Through Practice</span>
      </h1>

      <!-- Subtitle -->
      <p class="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
        Learn Kubernetes hands-on with interactive labs in real isolated environments.
        From basics to advanced topics.
      </p>

      <!-- CTA Buttons -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
        <a href="/signup">
          <Button
            size="lg"
            class="bg-primary hover:bg-primary/90 text-lg px-8 h-14 gap-2 group"
          >
            Get Started
            <ArrowRight class="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </a>
        <a href="https://github.com/natrontech/kubelab" target="_blank">
          <Button
            size="lg"
            variant="outline"
            class="text-lg px-8 h-14 gap-2"
          >
            <Github class="w-5 h-5" />
            Learn More
          </Button>
        </a>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-12">
        <div class="space-y-1">
          <p class="text-3xl font-bold text-primary">10+</p>
          <p class="text-sm text-muted-foreground">Interactive Labs</p>
        </div>
        <div class="space-y-1">
          <p class="text-3xl font-bold text-primary">50+</p>
          <p class="text-sm text-muted-foreground">Exercises</p>
        </div>
        <div class="space-y-1">
          <p class="text-3xl font-bold text-primary">100%</p>
          <p class="text-sm text-muted-foreground">Hands-on</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Scroll Indicator -->
  <div class="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
    <ChevronRight class="w-6 h-6 text-muted-foreground rotate-90" />
  </div>
</section>

<!-- Product Showcase Section -->
<section class="py-20 bg-muted/30">
  <div class="container mx-auto px-4">
    <div class="text-center max-w-3xl mx-auto mb-12">
      <Badge class="mb-4">Platform Preview</Badge>
      <h2 class="text-4xl md:text-5xl font-bold mb-4">
        See KubeLab in action
      </h2>
      <p class="text-xl text-muted-foreground">
        A complete learning environment designed for Kubernetes mastery
      </p>
    </div>

    <div class="max-w-6xl mx-auto">
      <!-- Main Screenshot/Demo -->
      <div class="relative rounded-xl overflow-hidden shadow-2xl border-2 border-primary/20 bg-card">
        <div class="aspect-video bg-gradient-to-br from-primary/5 to-transparent flex items-center justify-center">
          <!-- Placeholder for screenshot/demo video -->
          <div class="text-center space-y-4 p-8">
            <div class="w-24 h-24 rounded-2xl bg-primary/10 border border-primary/20 mx-auto flex items-center justify-center">
              <Terminal class="w-12 h-12 text-primary" />
            </div>
            <p class="text-muted-foreground">
              Add your product screenshot or demo video here
              <br />
              <span class="text-sm">Path: /public/images/dashboard-screenshot.png</span>
            </p>
          </div>
        </div>
        <!-- Browser Chrome -->
        <div class="absolute top-0 left-0 right-0 h-10 bg-card/95 backdrop-blur-sm border-b flex items-center gap-2 px-4">
          <div class="flex gap-2">
            <div class="w-3 h-3 rounded-full bg-red-500"></div>
            <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div class="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <div class="flex-1 ml-4 text-sm text-muted-foreground flex items-center gap-2">
            <Shield class="w-4 h-4" />
            kubelab.ch/app
          </div>
        </div>
      </div>

      <!-- Feature Highlights Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        <Card class="border-2 border-primary/10">
          <CardContent class="p-6">
            <div class="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Terminal class="w-6 h-6 text-primary" />
            </div>
            <h3 class="font-semibold mb-2">Real Terminal Access</h3>
            <p class="text-sm text-muted-foreground">
              Direct kubectl access to your personal Kubernetes cluster
            </p>
          </CardContent>
        </Card>

        <Card class="border-2 border-primary/10">
          <CardContent class="p-6">
            <div class="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Target class="w-6 h-6 text-primary" />
            </div>
            <h3 class="font-semibold mb-2">Progress Tracking</h3>
            <p class="text-sm text-muted-foreground">
              Monitor your learning journey with detailed analytics
            </p>
          </CardContent>
        </Card>

        <Card class="border-2 border-primary/10">
          <CardContent class="p-6">
            <div class="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Zap class="w-6 h-6 text-primary" />
            </div>
            <h3 class="font-semibold mb-2">Instant Validation</h3>
            <p class="text-sm text-muted-foreground">
              Get immediate feedback on your solutions
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</section>

<!-- Companies Section -->
<section class="py-12 bg-background border-y">
  <div class="container mx-auto px-4">
    <p class="text-center text-muted-foreground mb-8 text-sm uppercase tracking-wider">
      Built by
    </p>
    <div class="flex items-center justify-center">
      <a href="https://natron.io" target="_blank" class="group">
        <img
          src="/images/natron.png"
          alt="Natron Tech"
          class="h-10 opacity-100 transition-all dark:hidden"
        />
        <img
          src="/images/natron-dark.png"
          alt="Natron Tech"
          class="h-10 opacity-100 transition-all hidden dark:block"
        />
      </a>
    </div>
  </div>
</section>

<!-- Features Section -->
<section id="features" class="py-20 bg-muted/30">
  <div class="container mx-auto px-4">
    <div class="text-center max-w-3xl mx-auto mb-16">
      <Badge class="mb-4">Features</Badge>
      <h2 class="text-4xl md:text-5xl font-bold mb-4">
        Everything you need to master Kubernetes
      </h2>
      <p class="text-xl text-muted-foreground">
        Learn by doing with our comprehensive platform designed for real-world Kubernetes expertise
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
      {#each mainFeatures as feature}
        <Card class="hover:shadow-xl transition-all hover:border-primary/50 group">
          <CardHeader>
            <div class="p-3 rounded-lg bg-primary/10 w-fit mb-4 group-hover:bg-primary/20 transition-colors">
              <svelte:component this={feature.icon} class="w-6 h-6 text-primary" />
            </div>
            <CardTitle>{feature.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p class="text-muted-foreground">{feature.description}</p>
          </CardContent>
        </Card>
      {/each}
    </div>
  </div>
</section>

<!-- How It Works Section -->
<section class="py-20 bg-background">
  <div class="container mx-auto px-4">
    <div class="text-center max-w-3xl mx-auto mb-16">
      <Badge class="mb-4">Process</Badge>
      <h2 class="text-4xl md:text-5xl font-bold mb-4">
        Your learning journey
      </h2>
      <p class="text-xl text-muted-foreground">
        A structured path from Kubernetes novice to expert
      </p>
    </div>

    <div class="max-w-4xl mx-auto space-y-12">
      <div class="flex flex-col md:flex-row gap-8 items-start">
        <div class="flex-shrink-0">
          <div class="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xl">
            1
          </div>
        </div>
        <div class="flex-1">
          <h3 class="text-2xl font-bold mb-2">Choose Your Lab</h3>
          <p class="text-muted-foreground">
            Select from our curated collection of labs covering everything from basic concepts to advanced patterns
          </p>
        </div>
      </div>

      <div class="flex flex-col md:flex-row gap-8 items-start">
        <div class="flex-shrink-0">
          <div class="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xl">
            2
          </div>
        </div>
        <div class="flex-1">
          <h3 class="text-2xl font-bold mb-2">Get Your Environment</h3>
          <p class="text-muted-foreground">
            Instantly spin up an isolated Kubernetes cluster just for you. No setup, no installation required
          </p>
        </div>
      </div>

      <div class="flex flex-col md:flex-row gap-8 items-start">
        <div class="flex-shrink-0">
          <div class="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xl">
            3
          </div>
        </div>
        <div class="flex-1">
          <h3 class="text-2xl font-bold mb-2">Practice & Learn</h3>
          <p class="text-muted-foreground">
            Work through exercises with real-time feedback. Make mistakes safely and learn from them
          </p>
        </div>
      </div>

      <div class="flex flex-col md:flex-row gap-8 items-start">
        <div class="flex-shrink-0">
          <div class="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xl">
            4
          </div>
        </div>
        <div class="flex-1">
          <h3 class="text-2xl font-bold mb-2">Track Progress</h3>
          <p class="text-muted-foreground">
            Monitor your learning journey with detailed analytics and achievement tracking
          </p>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Pricing Section -->
<section id="pricing" class="py-20 bg-muted/30">
  <div class="container mx-auto px-4">
    <div class="text-center max-w-3xl mx-auto mb-12">
      <Badge class="mb-4">Pricing</Badge>
      <h2 class="text-4xl md:text-5xl font-bold mb-4">
        Simple, transparent pricing
      </h2>
      <p class="text-xl text-muted-foreground mb-8">
        Choose the plan that fits your needs. No hidden fees.
      </p>

      <!-- Billing Toggle -->
      <div class="flex items-center justify-center gap-4">
        <span class="text-sm font-medium {!isYearly ? 'text-foreground' : 'text-muted-foreground'}">
          Monthly
        </span>
        <button
          on:click={() => isYearly = !isYearly}
          class="relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 {isYearly ? 'bg-primary' : 'bg-muted-foreground/30'}"
          role="switch"
          aria-checked={isYearly}
          aria-label="Toggle billing cycle"
        >
          <span
            class="inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform {isYearly ? 'translate-x-7' : 'translate-x-1'}"
          ></span>
        </button>
        <span class="text-sm font-medium {isYearly ? 'text-foreground' : 'text-muted-foreground'}">
          Yearly
          <Badge class="ml-2 bg-green-100 text-green-700 hover:bg-green-100">Save 20%</Badge>
        </span>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
      {#each plans as plan, index}
        <div class="relative">
          {#if index === 0}
            <div class="absolute -top-4 left-0 right-0 flex justify-center z-10">
              <Badge class="bg-primary text-white px-4 py-1">Most Popular</Badge>
            </div>
          {/if}

          <Card class="h-full relative transition-all {index === 0 ? 'border-2 border-primary shadow-xl' : 'border hover:border-primary/50 hover:shadow-lg'}">
            <CardContent class="p-8 flex flex-col h-full">
              <!-- Plan Header -->
              <div class="mb-6">
                <h3 class="text-2xl font-bold mb-2">{plan.name}</h3>
                <p class="text-muted-foreground text-sm mb-4">{plan.description}</p>
                <div class="h-24 flex flex-col justify-center">
                  {#if plan.contactSales}
                    <span class="text-3xl font-bold">Contact Sales</span>
                  {:else}
                    <div class="flex items-baseline gap-1">
                      <span class="text-5xl font-bold">
                        ${isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                      </span>
                      <span class="text-muted-foreground">/month</span>
                    </div>
                    {#if isYearly}
                      <p class="text-sm text-muted-foreground mt-2">
                        Billed annually at ${plan.yearlyPrice * 12}
                      </p>
                    {/if}
                  {/if}
                </div>
              </div>

              <!-- CTA Button -->
              <div class="mb-6">
                {#if plan.contactSales}
                  <a href="mailto:sales@natron.io" class="block">
                    <Button
                      class="w-full h-12 text-base"
                      variant="outline"
                    >
                      Contact Sales
                    </Button>
                  </a>
                {:else}
                  <a href="/signup?plan={plan.id}&billing={isYearly ? 'yearly' : 'monthly'}" class="block">
                    <Button
                      class="w-full h-12 text-base {index === 0 ? 'bg-primary hover:bg-primary/90 text-white' : ''}"
                      variant={index === 0 ? 'default' : 'outline'}
                    >
                      Get Started
                    </Button>
                  </a>
                {/if}
              </div>

              <!-- Features -->
              <div class="space-y-3 pt-6 border-t flex-1">
                <p class="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
                  What's included
                </p>
                {#if plan.features}
                  {#each plan.features as feature}
                    <div class="flex items-start gap-3">
                      <CheckCircle2 class="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span class="text-sm text-foreground">{feature}</span>
                    </div>
                  {/each}
                {:else if planFeatures[plan.id]}
                  {#each planFeatures[plan.id] as feature}
                    <div class="flex items-start gap-3">
                      <CheckCircle2 class="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span class="text-sm text-foreground">{feature.name}</span>
                    </div>
                  {/each}
                {/if}
              </div>
            </CardContent>
          </Card>
        </div>
      {/each}
    </div>
  </div>
</section>

<!-- FAQ Section -->
<section class="py-20 bg-background">
  <div class="container mx-auto px-4">
    <div class="text-center max-w-3xl mx-auto mb-16">
      <Badge class="mb-4">FAQ</Badge>
      <h2 class="text-4xl md:text-5xl font-bold mb-4">
        Frequently asked questions
      </h2>
      <p class="text-xl text-muted-foreground">
        Everything you need to know about KubeLab
      </p>
    </div>

    <div class="max-w-3xl mx-auto space-y-4">
      {#each faqs as faq, index}
        <Card class="overflow-hidden hover:shadow-lg transition-all">
          <button
            class="w-full p-6 text-left flex items-center justify-between hover:bg-accent/50 transition-colors"
            on:click={() => activeFaq = activeFaq === index ? -1 : index}
          >
            <span class="font-semibold text-lg pr-8">{faq.question}</span>
            <ChevronRight class="w-5 h-5 flex-shrink-0 transition-transform {activeFaq === index ? 'rotate-90' : ''}" />
          </button>
          {#if activeFaq === index}
            <div class="px-6 pb-6 border-t">
              <p class="text-muted-foreground pt-4">{faq.answer}</p>
            </div>
          {/if}
        </Card>
      {/each}
    </div>
  </div>
</section>

<!-- Final CTA Section -->
<section class="py-20 bg-muted/30">
  <div class="container mx-auto px-4">
    <Card class="max-w-4xl mx-auto border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
      <CardContent class="p-12 text-center">
        <h2 class="text-4xl md:text-5xl font-bold mb-4">
          Ready to master Kubernetes?
        </h2>
        <p class="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Join hundreds of developers leveling up their Kubernetes skills through hands-on practice
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="/signup">
            <Button
              size="lg"
              class="bg-primary hover:bg-primary/90 text-lg px-8 h-14 gap-2 group"
            >
              Start Learning Today
              <ArrowRight class="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </a>
          <a href="https://github.com/natrontech/kubelab" target="_blank">
            <Button
              size="lg"
              variant="outline"
              class="text-lg px-8 h-14 gap-2"
            >
              <Github class="w-5 h-5" />
              View on GitHub
            </Button>
          </a>
        </div>
      </CardContent>
    </Card>
  </div>
</section>

<!-- Footer -->
<footer class="py-12 border-t bg-background">
  <div class="container mx-auto px-4">
    <div class="flex flex-col md:flex-row items-center justify-between gap-4">
      <div class="flex items-center gap-2">
        <img src="/images/kubelab-logo.png" alt="KubeLab" class="w-8 h-8" />
        <span class="font-semibold text-lg">KubeLab</span>
      </div>
      <p class="text-sm text-muted-foreground">
        © {new Date().getFullYear()} KubeLab by <a href="https://natron.io" target="_blank" class="text-primary hover:underline">Natron Tech</a>. All rights reserved.
      </p>
    </div>
  </div>
</footer>

<style>
  @keyframes pulse {
    0%, 100% {
      opacity: 0.3;
      transform: scale(1);
    }
    50% {
      opacity: 0.5;
      transform: scale(1.05);
    }
  }

  .animate-pulse {
    animation: pulse 6s ease-in-out infinite;
  }
</style>
