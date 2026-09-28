<script>
  import { ExternalLink, BookOpen, Wrench } from "lucide-svelte";
  import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "$lib/components/ui/card";
</script>

<div class="container mx-auto py-12 px-4">
  <div class="text-center space-y-4 mb-16">
    <h1 class="text-4xl md:text-5xl font-bold text-foreground">
      Learning Materials
    </h1>
    <p class="text-xl text-muted-foreground max-w-2xl mx-auto">
      Essential documentation and tools to enhance your Kubernetes learning journey
    </p>
  </div>

  <!-- Documentation Links Section -->
  <section class="mb-16">
    <div class="flex items-center gap-3 mb-8">
      <div class="p-2 rounded-lg bg-primary/10">
        <BookOpen class="h-6 w-6 text-primary" />
      </div>
      <h2 class="text-3xl font-bold">Documentation</h2>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card class="hover:shadow-xl transition-all duration-300 border-2 hover:border-primary">
        <CardHeader>
          <div class="flex items-center gap-2 mb-2">
            <div class="p-3 rounded-xl bg-primary/10">
              <BookOpen class="h-6 w-6 text-primary" />
            </div>
          </div>
          <CardTitle>Kubernetes Documentation</CardTitle>
          <CardDescription>
            Official Kubernetes documentation and guides
          </CardDescription>
        </CardHeader>
        <CardContent>
          <button
            type="button"
            class="w-full h-11 flex items-center justify-center gap-2 bg-primary text-white hover:bg-primary/90 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg"
            on:click={() => window.open("https://kubernetes.io/docs/home/", "_blank")}
          >
            <ExternalLink class="h-5 w-5" />
            Visit Docs
          </button>
        </CardContent>
      </Card>

      <Card class="hover:shadow-xl transition-all duration-300 border-2 hover:border-primary">
        <CardHeader>
          <div class="flex items-center gap-2 mb-2">
            <div class="p-3 rounded-xl bg-primary/10">
              <BookOpen class="h-6 w-6 text-primary" />
            </div>
          </div>
          <CardTitle>Kubernetes API Reference</CardTitle>
          <CardDescription>
            Complete API reference for Kubernetes v1.28
          </CardDescription>
        </CardHeader>
        <CardContent>
          <button
            type="button"
            class="w-full h-11 flex items-center justify-center gap-2 bg-primary text-white hover:bg-primary/90 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg"
            on:click={() => window.open("https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.28/", "_blank")}
          >
            <ExternalLink class="h-5 w-5" />
            Visit Docs
          </button>
        </CardContent>
      </Card>

      <Card class="hover:shadow-xl transition-all duration-300 border-2 hover:border-primary">
        <CardHeader>
          <div class="flex items-center gap-2 mb-2">
            <div class="p-3 rounded-xl bg-primary/10">
              <BookOpen class="h-6 w-6 text-primary" />
            </div>
          </div>
          <CardTitle>Troubleshooting Guide</CardTitle>
          <CardDescription>
            Guide for troubleshooting Kubernetes deployments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <button
            type="button"
            class="w-full h-11 flex items-center justify-center gap-2 bg-primary text-white hover:bg-primary/90 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg"
            on:click={() => window.open("https://gandrille.github.io/tech-notes/Docker_and_Kubernetes/Kubernetes_Core/Security_and_monitoring/Monitoring,_Logging,_Troubleshooting/troubleshooting-kubernetes.pdf", "_blank")}
          >
            <ExternalLink class="h-5 w-5" />
            Open Guide
          </button>
        </CardContent>
      </Card>
    </div>
  </section>

  <!-- Tools Section -->
  <section>
    <div class="flex items-center gap-3 mb-8">
      <div class="p-2 rounded-lg bg-primary/10">
        <Wrench class="h-6 w-6 text-primary" />
      </div>
      <h2 class="text-3xl font-bold">Recommended Tools</h2>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <Card class="hover:shadow-xl transition-all duration-300 border-2 hover:border-primary">
        <CardHeader class="p-0">
          <div class="w-full h-48 overflow-hidden rounded-t-lg bg-muted flex items-center justify-center">
            <img src="/assets/openlens.png" alt="OpenLens" class="w-full h-full object-cover" />
          </div>
        </CardHeader>
        <CardContent class="space-y-3 pt-4">
          <CardTitle>Freelens</CardTitle>
          <p class="text-sm text-muted-foreground">
            Official UI for Lens, the Kubernetes IDE. Open source and free to use.
          </p>
          <button
            type="button"
            class="w-full h-10 flex items-center justify-center gap-2 border-2 border-border hover:border-primary hover:bg-primary/10 rounded-lg font-medium text-sm transition-all"
            on:click={() => window.open("https://github.com/freelensapp/freelens", "_blank")}
          >
            <ExternalLink class="h-4 w-4" />
            Visit Website
          </button>
        </CardContent>
      </Card>

      <Card class="hover:shadow-lg transition-all">
        <CardHeader class="p-0">
          <div class="w-full h-48 overflow-hidden rounded-t-lg bg-muted flex items-center justify-center">
            <img src="/assets/k9s.png" alt="K9s" class="w-full h-full object-cover" />
          </div>
        </CardHeader>
        <CardContent class="space-y-3 pt-4">
          <CardTitle>K9s</CardTitle>
          <p class="text-sm text-muted-foreground">
            Terminal UI to interact with Kubernetes clusters. Navigate, observe and manage your applications easily.
          </p>
          <button
            type="button"
            class="w-full h-10 flex items-center justify-center gap-2 border-2 border-border hover:border-primary hover:bg-primary/10 rounded-lg font-medium text-sm transition-all"
            on:click={() => window.open("https://k9scli.io/", "_blank")}
          >
            <ExternalLink class="h-4 w-4" />
            Visit Website
          </button>
        </CardContent>
      </Card>

      <Card class="hover:shadow-lg transition-all">
        <CardHeader class="p-0">
          <div class="w-full h-48 overflow-hidden rounded-t-lg bg-muted flex items-center justify-center">
            <img src="/assets/kubeview.png" alt="KubeView" class="w-full h-full object-cover" />
          </div>
        </CardHeader>
        <CardContent class="space-y-3 pt-4">
          <CardTitle>KubeView</CardTitle>
          <p class="text-sm text-muted-foreground">
            Kubernetes cluster visualizer and graphical explorer. High-level view of clusters and running objects.
          </p>
          <button
            type="button"
            class="w-full h-10 flex items-center justify-center gap-2 border-2 border-border hover:border-primary hover:bg-primary/10 rounded-lg font-medium text-sm transition-all"
            on:click={() => window.open("https://github.com/benc-uk/kubeview", "_blank")}
          >
            <ExternalLink class="h-4 w-4" />
            Visit Website
          </button>
        </CardContent>
      </Card>

      <Card class="hover:shadow-lg transition-all">
        <CardHeader class="p-0">
          <div class="w-full h-48 overflow-hidden rounded-t-lg bg-muted flex items-center justify-center">
            <img src="/assets/kubeshark.png" alt="Kubeshark" class="w-full h-full object-cover" />
          </div>
        </CardHeader>
        <CardContent class="space-y-3 pt-4">
          <CardTitle>Kubeshark</CardTitle>
          <p class="text-sm text-muted-foreground">
            API traffic analyzer for Kubernetes. Real-time visibility into all API traffic and payloads.
          </p>
          <button
            type="button"
            class="w-full h-10 flex items-center justify-center gap-2 border-2 border-border hover:border-primary hover:bg-primary/10 rounded-lg font-medium text-sm transition-all"
            on:click={() => window.open("https://kubeshark.co/", "_blank")}
          >
            <ExternalLink class="h-4 w-4" />
            Visit Website
          </button>
        </CardContent>
      </Card>
    </div>
  </section>
</div>
