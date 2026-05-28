<script lang="ts">
	let {
		label,
		name,
		type = 'text',
		value = $bindable(''),
		placeholder = '',
		error = '',
		required = false,
		disabled = false
	}: {
		label: string;
		name: string;
		type?: string;
		value?: string;
		placeholder?: string;
		error?: string;
		required?: boolean;
		disabled?: boolean;
	} = $props();

	let focused = $state(false);
	let hasValue = $derived(value.length > 0);
	let floated = $derived(focused || hasValue);
</script>

<div class="input-group" class:input-group--error={!!error} class:input-group--disabled={disabled}>
	<div class="input-wrapper">
		<input
			class="input"
			class:input--floated={floated}
			{type}
			{name}
			id={name}
			bind:value
			{placeholder}
			{required}
			{disabled}
			onfocus={() => (focused = true)}
			onblur={() => (focused = false)}
		/>
		<label class="input-label" class:input-label--floated={floated} for={name}>
			{label}{#if required}<span class="input-label__required">*</span>{/if}
		</label>
		<div class="input-focus-ring" class:input-focus-ring--active={focused}></div>
	</div>
	{#if error}
		<p class="input-error">{error}</p>
	{/if}
</div>

<style>
	.input-group {
		display: flex;
		flex-direction: column;
		gap: var(--space-1, 0.25rem);
	}

	.input-wrapper {
		position: relative;
	}

	.input {
		width: 100%;
		padding: var(--space-4, 1rem) var(--space-4, 1rem) var(--space-2, 0.5rem);
		font-family: inherit;
		font-size: 0.9375rem;
		color: var(--color-text-primary, #e2e8f0);
		background: var(--color-surface, rgba(255, 255, 255, 0.05));
		border: 1px solid var(--color-border, rgba(255, 255, 255, 0.1));
		border-radius: var(--radius-md, 0.5rem);
		outline: none;
		transition: border-color 0.2s ease, background 0.2s ease;
		box-sizing: border-box;
	}

	.input::placeholder {
		color: transparent;
	}

	.input--floated::placeholder {
		color: var(--color-text-muted, rgba(148, 163, 184, 0.5));
	}

	.input:hover:not(:disabled) {
		border-color: var(--color-border-hover, rgba(255, 255, 255, 0.2));
	}

	.input:focus {
		border-color: var(--color-primary, #6366f1);
		background: var(--color-surface-elevated, rgba(255, 255, 255, 0.07));
	}

	.input:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.input-label {
		position: absolute;
		top: 50%;
		left: var(--space-4, 1rem);
		transform: translateY(-50%);
		font-size: 0.9375rem;
		color: var(--color-text-secondary, #94a3b8);
		pointer-events: none;
		transition: all 0.2s ease;
		transform-origin: left center;
	}

	.input-label--floated {
		top: 0.5rem;
		transform: translateY(0);
		font-size: 0.6875rem;
		color: var(--color-primary, #6366f1);
		letter-spacing: 0.02em;
	}

	.input-label__required {
		color: var(--color-danger, #ef4444);
		margin-left: 2px;
	}

	.input-focus-ring {
		position: absolute;
		inset: -2px;
		border-radius: calc(var(--radius-md, 0.5rem) + 2px);
		border: 2px solid transparent;
		pointer-events: none;
		transition: border-color 0.2s ease, box-shadow 0.2s ease;
	}

	.input-focus-ring--active {
		border-color: var(--color-primary, #6366f1);
		box-shadow: 0 0 0 3px var(--color-primary-glow, rgba(99, 102, 241, 0.15));
	}

	.input-group--error .input {
		border-color: var(--color-danger, #ef4444);
	}

	.input-group--error .input-label--floated {
		color: var(--color-danger, #ef4444);
	}

	.input-group--error .input-focus-ring--active {
		border-color: var(--color-danger, #ef4444);
		box-shadow: 0 0 0 3px var(--color-danger-glow, rgba(239, 68, 68, 0.15));
	}

	.input-error {
		margin: 0;
		padding-left: var(--space-1, 0.25rem);
		font-size: 0.75rem;
		color: var(--color-danger, #ef4444);
	}
</style>
