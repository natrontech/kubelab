<script lang="ts">
  import type { PlansResponse } from "$lib/pocketbase/generated-types";
  import { Building2, Check, DoorOpen, GraduationCap, Plus, User2 } from "lucide-svelte";

  export let plans: PlansResponse[] = [];
</script>

<div class="py-24 sm:pt-48">
  <div class="mx-auto max-w-7xl px-6 lg:px-8">
    <div class="mx-auto max-w-4xl text-center">
      <h2 class="text-base font-semibold leading-7 text-neutral">Pricing</h2>
      <p class="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
        Pricing Plans Tailored to Your Needs
      </p>
    </div>
    <p class="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-600">
      From individual learners to large enterprises, choose a plan that best aligns with your
      Kubernetes learning objectives and organizational goals.
    </p>
    <div
      class="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-y-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-2"
    >
      {#each plans as plan, i}
        <div
          class="flex flex-col justify-between rounded-3xl bg-white p-8 ring-1 ring-gray-200 xl:p-10 lg:mt-8
            {i % 2 == 0 ? 'lg:rounded-r-none' : 'lg:rounded-l-none'}
          "
        >
          <div>
            <div class="flex items-center justify-between gap-x-4">
              <h3 id="tier-freelancer" class="text-lg font-semibold leading-8 text-gray-900">
                {#if plan.name === "Free"}
                  <DoorOpen class="h-6 w-5 flex-none inline-block" />
                {/if}
                {#if plan.name === "Individual Plan"}
                  <User2 class="h-6 w-5 flex-none inline-block" />
                {/if}
                {#if plan.name === "Education Plan"}
                  <GraduationCap class="h-6 w-5 flex-none inline-block" />
                {/if}
                {#if plan.name === "Enterprise Plan"}
                  <Building2 class="h-6 w-5 flex-none inline-block" />
                {/if}
                {plan.name}
              </h3>
            </div>
            <p class="mt-4 text-sm leading-6 text-gray-600 sm:h-20">
              {plan.description}
            </p>
            <p class="mt-6 flex items-baseline gap-x-1">
              <span class="text-4xl font-bold tracking-tight text-gray-900">{plan.price} CHF</span>
              <span class="text-sm font-semibold leading-6 text-gray-600">/month</span>
            </p>
            <ul role="list" class="my-8 space-y-3 text-sm leading-6 text-gray-600">
              <!-- @ts-ignore -->
              {#each plan.expand.features as feature}
                <li class="flex gap-x-3">
                  <Check class="h-6 w-5 flex-none text-green-500" />
                  {feature.feature}
                </li>
              {/each}
            </ul>
            <ul role="list" class="my-8 space-y-3 text-sm leading-6 text-gray-600">
              <!-- @ts-ignore -->
              {#if plan.expand.optionalFeatures}
                {#each plan.expand.optionalFeatures as feature}
                  <li class="flex gap-x-3">
                    <Plus class="h-6 w-5 flex-none text-gray-500" />
                    {feature.feature}
                  </li>
                {/each}
              {/if}
            </ul>
          </div>
          <a
            href={plan.name === "Free" ? "mailto:info@natron.io" : "mailto:info@natron.io"}
            aria-describedby="tier-freelancer"
            class="btn w-full {plan.name == 'Free' ? 'btn-outline' : 'btn-neutral'}"
            >{plan.name === "Free" ? "Get started" : "Contact us"}</a
          >
        </div>
      {/each}

      <!-- <div
        class="flex flex-col justify-between rounded-3xl bg-white p-8 ring-1 ring-gray-200 xl:p-10 lg:mt-8 lg:rounded-r-none"
      >
        <div>
          <div class="flex items-center justify-between gap-x-4">
            <h3 id="tier-freelancer" class="text-lg font-semibold leading-8 text-gray-900">
              Individual Plan
            </h3>
          </div>
          <p class="mt-4 text-sm leading-6 text-gray-600">
            Perfect for solo enthusiasts eager to master Kubernetes. This plan is tailored for
            individuals not affiliated with any organization.
          </p>
          <p class="mt-6 flex items-baseline gap-x-1">
            <span class="text-4xl font-bold tracking-tight text-gray-900">20.00 CHF</span>
            <span class="text-sm font-semibold leading-6 text-gray-600">/month</span>
          </p>
          <ul role="list" class="mt-8 space-y-3 text-sm leading-6 text-gray-600">
            <li class="flex gap-x-3">
              <Check class="h-6 w-5 flex-none text-green-500" />
              5 products
            </li>
            <li class="flex gap-x-3">Up to 1,000 subscribers</li>
            <li class="flex gap-x-3">
              <svg
                class="h-6 w-5 flex-none text-indigo-600"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                  clip-rule="evenodd"
                />
              </svg>
              Basic analytics
            </li>
            <li class="flex gap-x-3">
              <svg
                class="h-6 w-5 flex-none text-indigo-600"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                  clip-rule="evenodd"
                />
              </svg>
              48-hour support response time
            </li>
          </ul>
        </div>
        <a
          href="#"
          aria-describedby="tier-freelancer"
          class="mt-8 block rounded-md py-2 px-3 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 text-indigo-600 ring-1 ring-inset ring-indigo-200 hover:ring-indigo-300"
          >Buy plan</a
        >
      </div>
      <div
        class="flex flex-col justify-between rounded-3xl bg-white p-8 ring-1 ring-gray-200 xl:p-10 lg:z-10 lg:rounded-b-none"
      >
        <div>
          <div class="flex items-center justify-between gap-x-4">
            <h3 id="tier-startup" class="text-lg font-semibold leading-8 text-indigo-600">
              Education Plan
            </h3>
            <p
              class="rounded-full bg-indigo-600/10 px-2.5 py-1 text-xs font-semibold leading-5 text-indigo-600"
            >
              Most popular
            </p>
          </div>
          <p class="mt-4 text-sm leading-6 text-gray-600">
            Designed specifically for educational institutions like universities, schools, NGOs, and
            other non-profit groups. Equip your learners with the tools they need to understand and
            apply Kubernetes in real-world scenarios.
          </p>
          <p class="mt-6 flex items-baseline gap-x-1">
            <span class="text-4xl font-bold tracking-tight text-gray-900">$32</span>
            <span class="text-sm font-semibold leading-6 text-gray-600">/month</span>
          </p>
          <ul role="list" class="mt-8 space-y-3 text-sm leading-6 text-gray-600">
            <li class="flex gap-x-3">
              <svg
                class="h-6 w-5 flex-none text-indigo-600"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                  clip-rule="evenodd"
                />
              </svg>
              25 products
            </li>
            <li class="flex gap-x-3">
              <svg
                class="h-6 w-5 flex-none text-indigo-600"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                  clip-rule="evenodd"
                />
              </svg>
              Up to 10,000 subscribers
            </li>
            <li class="flex gap-x-3">
              <svg
                class="h-6 w-5 flex-none text-indigo-600"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                  clip-rule="evenodd"
                />
              </svg>
              Advanced analytics
            </li>
            <li class="flex gap-x-3">
              <svg
                class="h-6 w-5 flex-none text-indigo-600"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                  clip-rule="evenodd"
                />
              </svg>
              24-hour support response time
            </li>
            <li class="flex gap-x-3">
              <svg
                class="h-6 w-5 flex-none text-indigo-600"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                  clip-rule="evenodd"
                />
              </svg>
              Marketing automations
            </li>
          </ul>
        </div>
        <a
          href="#"
          aria-describedby="tier-startup"
          class="mt-8 block rounded-md py-2 px-3 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 bg-indigo-600 text-white shadow-sm hover:bg-indigo-500"
          >Buy plan</a
        >
      </div>
      <div
        class="flex flex-col justify-between rounded-3xl bg-white p-8 ring-1 ring-gray-200 xl:p-10 lg:mt-8 lg:rounded-l-none"
      >
        <div>
          <div class="flex items-center justify-between gap-x-4">
            <h3 id="tier-enterprise" class="text-lg font-semibold leading-8 text-gray-900">
              Enterprise Plan
            </h3>
          </div>
          <p class="mt-4 text-sm leading-6 text-gray-600">
            Built for businesses aiming to upscale their tech teams with Kubernetes proficiency. Our
            enterprise plan ensures that your team gets the most comprehensive learning experience.
          </p>
          <p class="mt-6 flex items-baseline gap-x-1">
            <span class="text-4xl font-bold tracking-tight text-gray-900">$48</span>
            <span class="text-sm font-semibold leading-6 text-gray-600">/month</span>
          </p>
          <ul role="list" class="mt-8 space-y-3 text-sm leading-6 text-gray-600">
            <li class="flex gap-x-3">
              <svg
                class="h-6 w-5 flex-none text-indigo-600"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                  clip-rule="evenodd"
                />
              </svg>
              Unlimited products
            </li>
            <li class="flex gap-x-3">
              <svg
                class="h-6 w-5 flex-none text-indigo-600"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                  clip-rule="evenodd"
                />
              </svg>
              Unlimited subscribers
            </li>
            <li class="flex gap-x-3">
              <svg
                class="h-6 w-5 flex-none text-indigo-600"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                  clip-rule="evenodd"
                />
              </svg>
              Advanced analytics
            </li>
            <li class="flex gap-x-3">
              <svg
                class="h-6 w-5 flex-none text-indigo-600"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                  clip-rule="evenodd"
                />
              </svg>
              1-hour, dedicated support response time
            </li>
            <li class="flex gap-x-3">
              <svg
                class="h-6 w-5 flex-none text-indigo-600"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                  clip-rule="evenodd"
                />
              </svg>
              Marketing automations
            </li>
          </ul>
        </div>
        <a
          href="#"
          aria-describedby="tier-enterprise"
          class="mt-8 block rounded-md py-2 px-3 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 text-indigo-600 ring-1 ring-inset ring-indigo-200 hover:ring-indigo-300"
          >Buy plan</a
        >
      </div> -->
    </div>
  </div>
</div>
