<script lang="ts">
  import { goto } from "$app/navigation";
  import { client } from "$lib/pocketbase";
  import type { PlansResponse, FeaturesResponse } from "$lib/pocketbase/generated-types";
  import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "$lib/components/ui/card";
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import { Badge } from "$lib/components/ui/badge";
  import { CheckCircle2, ArrowLeft } from "lucide-svelte";
  import { onMount } from "svelte";
  import toast from "svelte-french-toast";

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
  let planFeatures: { [key: string]: FeaturesResponse[] } = {};
  let selectedPlan: any = defaultPlans[0];
  let isYearly = false;
  let loading = false;
  let submitted = false;

  const FORMSPREE_ENDPOINT = "https://formspree.io/f/xgvpbebj";

  let formData = {
    name: "",
    email: "",
    company: "",
    message: ""
  };

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

  async function handleSubmit() {
    if (!formData.name || !formData.email) {
      toast.error("Please fill in all required fields");
      return;
    }

    loading = true;

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          company: formData.company,
          message: formData.message,
          plan: selectedPlan?.name || 'Individual',
          billing: isYearly ? 'Yearly' : 'Monthly',
          price: selectedPlan?.contactSales
            ? 'Contact Sales'
            : `$${isYearly ? selectedPlan?.yearlyPrice : selectedPlan?.monthlyPrice}/month`
        }),
      });

      if (response.ok) {
        submitted = true;
        toast.success("Request submitted successfully!");
      } else {
        throw new Error("Failed to submit form");
      }
    } catch (error: any) {
      console.error("Form submission error:", error);
      toast.error("Failed to submit request. Please try again.");
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>Sign Up - KubeLab</title>
</svelte:head>

<div class="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
  <!-- Animated Background -->
  <div class="absolute inset-0 overflow-hidden pointer-events-none opacity-60 dark:opacity-30">
    <div class="absolute top-20 left-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
    <div class="absolute bottom-20 right-10 w-[600px] h-[600px] bg-primary/3 rounded-full blur-3xl"></div>
  </div>

  <div class="container mx-auto relative z-10">
    <!-- Header -->
    <div class="text-center mb-8">
      <a href="/" class="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft class="w-4 h-4" />
        Back to home
      </a>
      <div class="flex justify-center mb-4">
        <div class="p-3 rounded-xl bg-primary/10 border border-primary/20">
          <img src="/images/kubelab-logo.png" alt="KubeLab" class="w-12 h-12" />
        </div>
      </div>
      <h1 class="text-4xl font-bold mb-2">
        {submitted ? 'Thank You!' : 'Get Started with KubeLab'}
      </h1>
      <p class="text-muted-foreground">
        {submitted ? "We'll be in touch shortly to help you get started" : "Fill out the form below and we'll contact you to set up your account"}
      </p>
    </div>

    {#if !submitted}
      <!-- Plan Selection Compact -->
      <div class="max-w-2xl mx-auto mb-8">
        <Card class="border-2">
          <CardContent class="p-6">
            <div class="space-y-4">
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

              <!-- Plan Cards Compact -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                {#each plans as plan, index}
                  <button
                    type="button"
                    on:click={() => selectedPlan = plan}
                    class="relative p-4 rounded-lg border-2 transition-all text-left {selectedPlan?.id === plan.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}"
                  >
                    {#if index === 0}
                      <Badge class="absolute -top-2 -right-2 bg-primary text-white px-2 py-0.5 text-xs">Most Popular</Badge>
                    {/if}
                    <div class="space-y-2">
                      <h3 class="font-bold text-lg">{plan.name}</h3>
                      {#if plan.contactSales}
                        <p class="text-xl font-bold">Contact Sales</p>
                      {:else}
                        <div class="flex items-baseline gap-1">
                          <span class="text-2xl font-bold">
                            ${isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                          </span>
                          <span class="text-sm text-muted-foreground">/month</span>
                        </div>
                        {#if isYearly}
                          <p class="text-xs text-muted-foreground">
                            Billed at ${plan.yearlyPrice * 12}/year
                          </p>
                        {/if}
                      {/if}
                    </div>
                    {#if selectedPlan?.id === plan.id}
                      <CheckCircle2 class="absolute top-4 right-4 w-5 h-5 text-primary" />
                    {/if}
                  </button>
                {/each}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Contact Form -->
      <div class="max-w-2xl mx-auto">
        <Card class="border-2">
          <CardHeader>
            <CardTitle class="text-2xl">Your Information</CardTitle>
            <CardDescription>
              Fill out the form below and we'll contact you to set up your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form on:submit|preventDefault={handleSubmit} class="space-y-4">
              <div class="space-y-2">
                <Label for="name">Full Name *</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  required
                  bind:value={formData.name}
                  class="h-11"
                />
              </div>

              <div class="space-y-2">
                <Label for="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  required
                  bind:value={formData.email}
                  class="h-11"
                />
              </div>

              <div class="space-y-2">
                <Label for="company">Company</Label>
                <Input
                  id="company"
                  type="text"
                  placeholder="Your Company"
                  bind:value={formData.company}
                  class="h-11"
                />
              </div>

              <div class="space-y-2">
                <Label for="message">Additional Details</Label>
                <textarea
                  id="message"
                  placeholder="Tell us about your use case or any questions you have..."
                  bind:value={formData.message}
                  class="min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                ></textarea>
              </div>

              <div class="pt-4">
                <Button
                  type="submit"
                  class="w-full h-12 bg-primary hover:bg-primary/90 text-base"
                  disabled={loading}
                >
                  {#if loading}
                    <span class="loading loading-dots loading-sm mr-2"></span>
                    Submitting...
                  {:else}
                    Submit Request
                  {/if}
                </Button>
              </div>

              <p class="text-xs text-center text-muted-foreground pt-2">
                Selected Plan: <span class="font-semibold">{selectedPlan?.name}</span>
                {#if !selectedPlan?.contactSales}
                  - ${isYearly ? selectedPlan?.yearlyPrice : selectedPlan?.monthlyPrice}/month {isYearly ? '(billed annually)' : ''}
                {/if}
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    {:else}
      <!-- Success Message -->
      <div class="max-w-2xl mx-auto">
        <Card class="border-2 border-primary/20 bg-primary/5">
          <CardContent class="p-12 text-center">
            <div class="flex justify-center mb-6">
              <div class="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                <CheckCircle2 class="w-10 h-10 text-primary" />
              </div>
            </div>
            <h2 class="text-2xl font-bold mb-4">Request Submitted Successfully!</h2>
            <p class="text-muted-foreground mb-6">
              Thank you for your interest in KubeLab. Our team will review your request and contact you at <span class="font-semibold">{formData.email}</span> within 1 business day to complete your setup.
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/">
                <Button variant="outline">
                  Back to Home
                </Button>
              </a>
              <a href="https://github.com/natrontech/kubelab" target="_blank">
                <Button variant="outline">
                  View Documentation
                </Button>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    {/if}
  </div>
</div>
