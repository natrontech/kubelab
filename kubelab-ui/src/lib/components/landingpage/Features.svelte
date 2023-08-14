<script>
  import { PocketKnife, RefreshCcw, ShipWheel, Terminal } from "lucide-svelte";
</script>

<div class="mx-auto mt-32 max-w-7xl px-6  lg:px-8">
  <div class="mx-auto max-w-2xl lg:text-center">
    <h2 class="text-base font-semibold leading-7">Learn faster</h2>
    <p class="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
      Discover KubeLab's Cutting-Edge Features
    </p>
    <p class="mt-6 text-lg leading-8 text-gray-600">
      Delve deep into KubeLab's suite of tools and functionalities tailored to enhance your
      Kubernetes learning journey.
    </p>
  </div>
  <div class="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
    <dl class="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
      <div class="relative pl-16">
        <dt class="text-base font-semibold leading-7 text-gray-900">
          <div
            class="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-neutral"
          >
            <Terminal class="h-6 w-6 text-white" />
          </div>
          Web Terminal
        </dt>
        <dd class="mt-2 text-base leading-7 text-gray-600">
          KubeLab offers a state-of-the-art in-browser terminal, enabling users to execute commands
          and interact directly with Kubernetes clusters. This seamless experience means there's no
          need for any additional software or setup - just dive right in!
        </dd>
      </div>
      <div class="relative pl-16">
        <dt class="text-base font-semibold leading-7 text-gray-900">
          <div
            class="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-neutral"
          >
            <ShipWheel class="h-6 w-6 text-white" />
          </div>
          Dedicated Cluster Per Session
        </dt>
        <dd class="mt-2 text-base leading-7 text-gray-600">
          For each learning session on KubeLab, users receive their own isolated Kubernetes cluster.
          This ensures a private, secure, and uninterrupted learning space where you can explore and
          experiment with Kubernetes functionalities without affecting or being affected by other
          learners.
        </dd>
      </div>
      <div class="relative pl-16">
        <dt class="text-base font-semibold leading-7 text-gray-900">
          <div
            class="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-neutral"
          >
            <RefreshCcw class="h-6 w-6 text-white" />
          </div>
          Regularly Updated Lab Exercises
        </dt>
        <dd class="mt-2 text-base leading-7 text-gray-600">
          Staying updated is crucial in the fast-evolving tech world. At KubeLab, our labs are not
          just comprehensive but are also updated regularly. As Kubernetes continues to evolve, so
          do our exercises, ensuring you always have the latest knowledge and best practices at
          hand.
        </dd>
      </div>
      <div class="relative pl-16">
        <dt class="text-base font-semibold leading-7 text-gray-900">
          <div
            class="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-neutral"
          >
            <PocketKnife class="h-6 w-6 text-white" />
          </div>
          Swiss Hosted
        </dt>
        <dd class="mt-2 text-base leading-7 text-gray-600">
          Security and data protection are our top priorities. KubeLab is hosted in Switzerland at <a
            class=" font-bold"
            href="https://natron.io">Natron Tech</a
          >'s Cloud, known for its stringent data protection laws and top-tier infrastructure. This
          guarantees both high performance and peace of mind for our users, knowing that their data
          and learning environment are hosted in one of the world's most secure locations.
        </dd>
      </div>
    </dl>
  </div>
</div>
