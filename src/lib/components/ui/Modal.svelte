<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		open = false,
		title,
		onclose,
		children
	}: {
		open: boolean;
		title: string;
		onclose: () => void;
		children?: Snippet;
	} = $props();

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape' && open) {
			onclose();
		}
	}

	function handleOverlayClick(e: MouseEvent) {
		if (e.target === e.currentTarget) {
			onclose();
		}
	}

	$effect(() => {
		if (open) {
			document.body.style.overflow = 'hidden';
			document.addEventListener('keydown', handleKeydown);
		} else {
			document.body.style.overflow = '';
		}
		return () => {
			document.body.style.overflow = '';
			document.removeEventListener('keydown', handleKeydown);
		};
	});
</script>

{#if open}
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="overlay" class:overlay--open={open} onclick={handleOverlayClick}>
		<div class="modal" class:modal--open={open} role="dialog" aria-modal="true" aria-label={title}>
			<div class="modal__header">
				<h2 class="modal__title">{title}</h2>
				<button class="modal__close" onclick={onclose} aria-label="Close modal">
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
						<line x1="18" y1="6" x2="6" y2="18" />
						<line x1="6" y1="6" x2="18" y2="18" />
					</svg>
				</button>
			</div>
			<div class="modal__body">
				{#if children}
					{@render children()}
				{/if}
			</div>
		</div>
	</div>
{/if}

<style>
	.overlay {
		position: fixed;
		inset: 0;
		z-index: 1000;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: var(--space-4, 1rem);
		background: rgba(0, 0, 0, 0.6);
		backdrop-filter: blur(4px);
		-webkit-backdrop-filter: blur(4px);
		animation: fadeIn 0.2s ease;
	}

	.modal {
		width: 100%;
		max-width: 32rem;
		max-height: 85vh;
		display: flex;
		flex-direction: column;
		background: var(--color-surface-modal, rgba(30, 41, 59, 0.95));
		backdrop-filter: blur(16px);
		-webkit-backdrop-filter: blur(16px);
		border: 1px solid var(--color-border, rgba(255, 255, 255, 0.1));
		border-radius: var(--radius-xl, 1rem);
		box-shadow: var(--shadow-xl, 0 24px 64px rgba(0, 0, 0, 0.5));
		animation: slideUp 0.25s ease;
	}

	.modal__header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: var(--space-5, 1.25rem) var(--space-6, 1.5rem);
		border-bottom: 1px solid var(--color-border, rgba(255, 255, 255, 0.08));
	}

	.modal__title {
		margin: 0;
		font-size: 1.125rem;
		font-weight: 700;
		color: var(--color-text-primary, #e2e8f0);
	}

	.modal__close {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2rem;
		height: 2rem;
		padding: 0;
		background: transparent;
		border: none;
		border-radius: var(--radius-md, 0.5rem);
		color: var(--color-text-secondary, #94a3b8);
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.modal__close:hover {
		background: var(--color-surface-hover, rgba(255, 255, 255, 0.1));
		color: var(--color-text-primary, #e2e8f0);
	}

	.modal__close svg {
		width: 1.125rem;
		height: 1.125rem;
	}

	.modal__body {
		padding: var(--space-6, 1.5rem);
		overflow-y: auto;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	@keyframes slideUp {
		from {
			opacity: 0;
			transform: translateY(1rem) scale(0.97);
		}
		to {
			opacity: 1;
			transform: translateY(0) scale(1);
		}
	}
</style>
