<script>
  import { Download, ExternalLink, Presentation } from "lucide-svelte";
</script>

<h1 class="text-center text-4xl font-bold my-4">Material</h1>
<div class="p-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
  <div class="card card-compact col-span-1 w-96 shadow bg-blue-500 text-white mx-auto">
    <div class="card-body">
      <h2 class="card-title">Presentation Slides Day 1</h2>
      <p class="text-white">Here you can find the slides for the presentation of the first day.</p>
      <div class="card-actions justify-end">
        <button
          class="btn btn-neutral"
          on:click={() => window.open("/assets/slides_day_1.pdf")}
        >
          <Download /> Download
        </button>
      </div>
    </div>
  </div>
  <div class="card card-compact col-span-1 w-96 shadow bg-blue-500 text-white mx-auto">
    <div class="card-body">
      <h2 class="card-title">Presentation Slides Day 2</h2>
      <p class="text-white">Here you can find the slides for the presentation of the second day.</p>
      <div class="card-actions justify-end">
        <button
          class="btn btn-neutral"
          on:click={() => window.open("/assets/slides_day_2.pdf")}
        >
          <Download /> Download
        </button>
      </div>
    </div>
  </div>
  <div class="card card-compact col-span-1 w-96 shadow bg-neutral text-white mx-auto">
    <div class="card-body">
      <h2 class="card-title">Cheat Sheet</h2>
      <p class="text-white">Here you can find the cheat sheet for the exercises.</p>
      <div class="card-actions justify-end">
        <button
          class="btn btn-neutral"
          on:click={() => window.open("/assets/cheat-sheet-compressed.pdf")}
        >
          <Download /> Download
        </button>
      </div>
    </div>
  </div>
  <div class="divider col-span-3">AND</div>
  <h1 class="text-center text-4xl font-bold my-4 col-span-3">Links</h1>
  <div class="card card-compact w-96 shadow bg-orange-500 text-white mx-auto">
    <div class="card-body">
      <h2 class="card-title">Kubernetes Documentation</h2>
      <p class="text-white">Here you can find the official documentation for Kubernetes.</p>
      <div class="card-actions justify-end">
        <button
          class="btn btn-neutral"
          on:click={() => window.open("https://kubernetes.io/docs/home/")}
        >
          <ExternalLink /> Go to Docs
        </button>
      </div>
    </div>
  </div>
  <div class="card card-compact w-96 shadow bg-red-500 text-white mx-auto">
    <div class="card-body">
      <h2 class="card-title">Kubernetes API Reference</h2>
      <p class="text-white">Here you can find the official API reference for Kubernetes.</p>
      <div class="card-actions justify-end">
        <button
          class="btn btn-neutral"
          on:click={() =>
            window.open("https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.28/")}
        >
          <ExternalLink /> Go to Docs
        </button>
      </div>
    </div>
  </div>
  <div class="card card-compact w-96 shadow bg-purple-500 text-white mx-auto">
    <div class="card-body">
      <h2 class="card-title">Troubleshooting Kubernetes Deployments</h2>
      <p class="text-white">
        Here you can find a guide on how to troubleshoot Kubernetes deployments.
      </p>
      <div class="card-actions justify-end">
        <button
          class="btn btn-neutral"
          on:click={() =>
            window.open(
              "https://gandrille.github.io/tech-notes/Docker_and_Kubernetes/Kubernetes_Core/Security_and_monitoring/Monitoring,_Logging,_Troubleshooting/troubleshooting-kubernetes.pdf"
            )}
        >
          <ExternalLink /> Go to Docs
        </button>
      </div>
    </div>
  </div>
  <div class="divider col-span-3">AND</div>
  <h1 class="text-center text-4xl font-bold my-4 col-span-3">Tools</h1>
  <div class="card card-compact w-96 bg-base-100 shadow-xl mx-auto">
    <figure><img src="/assets/openlens.png" alt="Shoes" /></figure>
    <div class="card-body">
      <h2 class="card-title">Openlens</h2>
      <p>
        OpenLens is the official UI for Lens, the Kubernetes IDE. It is open source and free to use.
      </p>
      <div class="card-actions justify-end">
        <button
          class="btn btn-neutral"
          on:click={() => window.open("https://github.com/MuhammedKalkan/OpenLens")}
        >
          <ExternalLink /> Go to Website
        </button>
      </div>
    </div>
  </div>
  <div class="card card-compact w-96 bg-base-100 shadow-xl mx-auto">
    <figure><img src="/assets/k9s.png" alt="Shoes" /></figure>
    <div class="card-body">
      <h2 class="card-title">K9s</h2>
      <p>
        K9s provides a curses based terminal UI to interact with your Kubernetes clusters. The aim
        of this project is to make it easier to navigate, observe and manage your applications in
        the wild. K9s continually watches Kubernetes for changes and offers subsequent commands to
        interact with your observed resources.
      </p>
      <div class="card-actions justify-end">
        <button
          class="btn btn-neutral"
          on:click={() => window.open("https://k9scli.io/", "_blank")}
        >
          <ExternalLink /> Go to Website
        </button>
      </div>
    </div>
  </div>
  <div class="card card-compact w-96 bg-base-100 shadow-xl mx-auto">
    <figure><img src="/assets/kubeview.png" alt="Shoes" /></figure>
    <div class="card-body">
      <h2 class="card-title">Kubeview</h2>
      <p>
        KubeView is a Kubernetes cluster visualiser and graphical explorer. It provides a high-level
        view of Kubernetes clusters and the objects running inside them. This gives administrators
        and developers a better understanding of their Kubernetes clusters, as well as providing a
        visual way to interact with and diagnose their applications.
      </p>
      <div class="card-actions justify-end">
        <button
          class="btn btn-neutral"
          on:click={() => window.open("https://github.com/benc-uk/kubeview")}
        >
          <ExternalLink /> Go to Website
        </button>
      </div>
    </div>
  </div>
  <div class="card card-compact w-96 bg-base-100 shadow-xl mx-auto">
    <figure><img src="/assets/kubeshark.png" alt="Shoes" /></figure>
    <div class="card-body">
      <h2 class="card-title">Kubeshark</h2>
      <p>
        Kubeshark is a Kubernetes cluster visualiser and graphical explorer. It provides a
        high-level view of Kubernetes clusters and the objects running inside them. This gives
        administrators and developers a better understanding of their Kubernetes clusters, as well
        as providing a visual way to interact with and diagnose their applications.
      </p>
      <div class="card-actions justify-end">
        <button
          class="btn btn-neutral"
          on:click={() => window.open("https://kubeshark.co/")}
        >
          <ExternalLink /> Go to Website
        </button>
      </div>
    </div>
  </div>

</div>
