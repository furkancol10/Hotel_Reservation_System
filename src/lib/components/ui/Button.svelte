<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		variant = 'primary',
		size = 'md',
		loading = false,
		disabled = false,
		type = 'button',
		onclick,
		children
	}: {
		variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
		size?: 'sm' | 'md' | 'lg';
		loading?: boolean;
		disabled?: boolean;
		type?: 'button' | 'submit';
		onclick?: (e: MouseEvent) => void;
		children?: Snippet;
	} = $props();

	let isDisabled = $derived(disabled || loading);
</script>

<button
	class="btn btn--{variant} btn--{size}"
	class:btn--loading={loading}
	{type}
	disabled={isDisabled}
	onclick={onclick}
>
	{#if loading}
		<svg class="spinner" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
			<circle class="spinner__track" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" />
			<path
				class="spinner__arc"
				d="M12 2a10 10 0 0 1 10 10"
				stroke="currentColor"
				stroke-width="3"
				stroke-linecap="round"
			/>
		</svg>
	{/if}
	<span class="btn__content" class:btn__content--hidden={loading}>
		{#if children}
			{@render children()}
		{/if}
	</span>
</button>

<style>
	.btn {
		position: relative;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-2, 0.5rem);
		font-family: inherit;
		font-weight: 600;
		border: 1px solid transparent;
		border-radius: var(--radius-md, 0.5rem);
		cursor: pointer;
		transition: all 0.2s ease;
		white-space: nowrap;
		line-height: 1;
	}

	.btn:focus-visible {
		outline: 2px solid var(--color-primary, #6366f1);
		outline-offset: 2px;
	}

	.btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	/* Sizes */
	.btn--sm {
		padding: var(--space-1, 0.25rem) var(--space-3, 0.75rem);
		font-size: 0.8125rem;
		height: 2rem;
	}

	.btn--md {
		padding: var(--space-2, 0.5rem) var(--space-4, 1rem);
		font-size: 0.875rem;
		height: 2.5rem;
	}

	.btn--lg {
		padding: var(--space-3, 0.75rem) var(--space-6, 1.5rem);
		font-size: 1rem;
		height: 3rem;
	}

	/* Variants */
	.btn--primary {
		background: var(--color-primary, #6366f1);
		color: var(--color-on-primary, #ffffff);
		border-color: var(--color-primary, #6366f1);
		box-shadow: var(--shadow-sm, 0 1px 2px rgba(0, 0, 0, 0.3));
	}

	.btn--primary:hover:not(:disabled) {
		background: var(--color-primary-hover, #4f46e5);
		border-color: var(--color-primary-hover, #4f46e5);
		box-shadow: var(--shadow-md, 0 4px 12px rgba(99, 102, 241, 0.3));
	}

	.btn--secondary {
		background: var(--color-surface-elevated, rgba(255, 255, 255, 0.08));
		color: var(--color-text-primary, #e2e8f0);
		border-color: var(--color-border, rgba(255, 255, 255, 0.12));
	}

	.btn--secondary:hover:not(:disabled) {
		background: var(--color-surface-hover, rgba(255, 255, 255, 0.12));
		border-color: var(--color-border-hover, rgba(255, 255, 255, 0.2));
	}

	.btn--danger {
		background: var(--color-danger, #ef4444);
		color: var(--color-on-danger, #ffffff);
		border-color: var(--color-danger, #ef4444);
	}

	.btn--danger:hover:not(:disabled) {
		background: var(--color-danger-hover, #dc2626);
		border-color: var(--color-danger-hover, #dc2626);
		box-shadow: var(--shadow-md, 0 4px 12px rgba(239, 68, 68, 0.3));
	}

	.btn--ghost {
		background: transparent;
		color: var(--color-text-secondary, #94a3b8);
		border-color: transparent;
	}

	.btn--ghost:hover:not(:disabled) {
		background: var(--color-surface-hover, rgba(255, 255, 255, 0.06));
		color: var(--color-text-primary, #e2e8f0);
	}

	/* Loading */
	.spinner {
		position: absolute;
		width: 1.25em;
		height: 1.25em;
		animation: spin 0.8s linear infinite;
	}

	.spinner__track {
		opacity: 0.2;
	}

	.spinner__arc {
		opacity: 0.8;
	}

	.btn__content {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2, 0.5rem);
		transition: opacity 0.15s ease;
	}

	.btn__content--hidden {
		opacity: 0;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
</style>
