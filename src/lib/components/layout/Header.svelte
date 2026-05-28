<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		title,
		subtitle = '',
		actions
	}: {
		title: string;
		subtitle?: string;
		actions?: Snippet;
	} = $props();
</script>

<header class="page-header">
	<div class="page-header__text">
		<h1 class="page-header__title">{title}</h1>
		{#if subtitle}
			<p class="page-header__subtitle">{subtitle}</p>
		{/if}
	</div>
	{#if actions}
		<div class="page-header__actions">
			{@render actions()}
		</div>
	{/if}
</header>

<style>
	.page-header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: var(--space-4, 1rem);
		padding-bottom: var(--space-6, 1.5rem);
		border-bottom: 1px solid var(--color-border, rgba(255, 255, 255, 0.06));
		margin-bottom: var(--space-6, 1.5rem);
	}

	.page-header__text {
		display: flex;
		flex-direction: column;
		gap: var(--space-1, 0.25rem);
	}

	.page-header__title {
		margin: 0;
		font-size: 1.75rem;
		font-weight: 800;
		color: var(--color-text-primary, #e2e8f0);
		letter-spacing: -0.02em;
		line-height: 1.2;
	}

	.page-header__subtitle {
		margin: 0;
		font-size: 0.9375rem;
		color: var(--color-text-secondary, #94a3b8);
	}

	.page-header__actions {
		display: flex;
		align-items: center;
		gap: var(--space-3, 0.75rem);
		flex-shrink: 0;
	}

	@media (max-width: 640px) {
		.page-header {
			flex-direction: column;
		}

		.page-header__actions {
			width: 100%;
		}
	}
</style>
