<script lang="ts">
  import { page } from '$app/state';
  import Sidebar from '$lib/components/layout/Sidebar.svelte';
  import '$lib/styles/global.css';

  let { children, data } = $props();
</script>

<svelte:head>
  <title>{data.tenant?.name || 'Hotel Reservation System'}</title>
</svelte:head>

<div class="sidebar-layout">
  <Sidebar currentPath={page.url.pathname} />

  <main class="main-content">
    {@render children()}
  </main>
</div>

<style>
  .main-content {
    margin-left: var(--sidebar-width);
    padding: var(--space-6);
    min-height: 100vh;
    overflow-y: auto;
  }

  @media (max-width: 768px) {
    .main-content {
      margin-left: 0;
      padding: var(--space-4);
    }
  }
</style>
