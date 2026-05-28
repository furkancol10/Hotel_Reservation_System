<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		padding = 'md',
		hover = false,
		children
	}: {
		padding?: 'sm' | 'md' | 'lg';
		hover?: boolean;
		children?: Snippet;
	} = $props();
</script>

<div class="card card--pad-{padding}" class:card--hover={hover}>
	{#if children}
		{@render children()}
	{/if}
</div>

<style>
	.card {
		background: var(--color-surface, rgba(255, 255, 255, 0.05));
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		border: 1px solid var(--color-border, rgba(255, 255, 255, 0.08));
		border-radius: var(--radius-lg, 0.75rem);
		box-shadow: var(--shadow-card, 0 4px 24px rgba(0, 0, 0, 0.25));
		transition: all 0.25s ease;
	}

	.card--pad-sm {
		padding: var(--space-3, 0.75rem);
	}

	.card--pad-md {
		padding: var(--space-5, 1.25rem);
	}

	.card--pad-lg {
		padding: var(--space-8, 2rem);
	}

	.card--hover:hover {
		border-color: var(--color-border-hover, rgba(255, 255, 255, 0.15));
		box-shadow: var(--shadow-card-hover, 0 8px 32px rgba(0, 0, 0, 0.35));
		transform: translateY(-2px);
	}
</style>
