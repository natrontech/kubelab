<script lang="ts">
  import Companies from "$lib/components/landingpage/Companies.svelte";
  import Cta from "$lib/components/landingpage/Cta.svelte";
  import Faq from "$lib/components/landingpage/Faq.svelte";
  import Features from "$lib/components/landingpage/Features.svelte";
  import Footer from "$lib/components/landingpage/Footer.svelte";
  import Header from "$lib/components/landingpage/Header.svelte";
  import Hero from "$lib/components/landingpage/Hero.svelte";
  import Pricing from "$lib/components/landingpage/Pricing.svelte";
  import type { CompaniesResponse, FaqsResponse, PlansResponse } from "$lib/pocketbase/generated-types";

  export let data: any;

  let plans: PlansResponse[] = data?.plans ?? [];
  let faqs: FaqsResponse[] = data?.faqs ?? [];
  let companies: CompaniesResponse[] = data?.companies ?? [];

</script>

<div>
  <Header />
  <Hero />
  <Companies companies={companies} />
  <Features />
  <!-- <Pricing plans={plans} /> -->
  <Faq faqs={faqs} />
  <!-- <Cta /> -->
  <!-- <Footer /> -->
</div>
