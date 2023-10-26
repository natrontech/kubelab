<script lang="ts">
  import Companies from "$lib/components/landingpage/Companies.svelte";
  import Faq from "$lib/components/landingpage/Faq.svelte";
  import Features from "$lib/components/landingpage/Features.svelte";
  import Header from "$lib/components/landingpage/Header.svelte";
  import Hero from "$lib/components/landingpage/Hero.svelte";
  import type {
    CompaniesResponse,
    FaqsResponse,
    PlansResponse
  } from "$lib/pocketbase/generated-types";

  export let data: any;

  let faqs: FaqsResponse[] = data?.faqs ?? [];
  let companies: CompaniesResponse[] = data?.companies ?? [];
</script>

<div>
  <Header />
  <Hero />
  <Companies {companies} />
  <Features />
  <!-- <Pricing plans={plans} /> -->
  <Faq {faqs} />
  <!-- <Cta /> -->
  <!-- <Footer /> -->
</div>
