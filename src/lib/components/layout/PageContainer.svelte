<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		children
	}: {
		children?: Snippet;
	} = $props();
</script>

<main class="page-container">
	{#if children}
		{@render children()}
	{/if}
</main>

<style>
	.page-container {
		width: 100%;
		max-width: 1400px;
		margin: 0 auto;
		padding: var(--space-8, 2rem) var(--space-8, 2rem);
	}

	@media (max-width: 768px) {
		.page-container {
			padding: var(--space-4, 1rem) var(--space-4, 1rem);
		}
	}
</style>
