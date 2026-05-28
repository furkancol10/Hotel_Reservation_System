<script lang="ts">
	let {
		label,
		name,
		value = $bindable(''),
		options = [],
		error = '',
		required = false
	}: {
		label: string;
		name: string;
		value?: string;
		options: Array<{ value: string; label: string }>;
		error?: string;
		required?: boolean;
	} = $props();

	let focused = $state(false);
	let hasValue = $derived(value.length > 0);
	let floated = $derived(focused || hasValue);
</script>

<div class="select-group" class:select-group--error={!!error}>
	<div class="select-wrapper">
		<select
			class="select"
			class:select--floated={floated}
			{name}
			id={name}
			bind:value
			{required}
			onfocus={() => (focused = true)}
			onblur={() => (focused = false)}
		>
			<option value="" disabled hidden></option>
			{#each options as opt}
				<option value={opt.value}>{opt.label}</option>
			{/each}
		</select>
		<label class="select-label" class:select-label--floated={floated} for={name}>
			{label}{#if required}<span class="select-label__required">*</span>{/if}
		</label>
		<svg class="select-chevron" viewBox="0 0 20 20" fill="currentColor">
			<path
				fill-rule="evenodd"
				d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
				clip-rule="evenodd"
			/>
		</svg>
		<div class="select-focus-ring" class:select-focus-ring--active={focused}></div>
	</div>
	{#if error}
		<p class="select-error">{error}</p>
	{/if}
</div>

<style>
	.select-group {
		display: flex;
		flex-direction: column;
		gap: var(--space-1, 0.25rem);
	}

	.select-wrapper {
		position: relative;
	}

	.select {
		width: 100%;
		padding: var(--space-4, 1rem) var(--space-8, 2rem) var(--space-2, 0.5rem) var(--space-4, 1rem);
		font-family: inherit;
		font-size: 0.9375rem;
		color: var(--color-text-primary, #e2e8f0);
		background: var(--color-surface, rgba(255, 255, 255, 0.05));
		border: 1px solid var(--color-border, rgba(255, 255, 255, 0.1));
		border-radius: var(--radius-md, 0.5rem);
		outline: none;
		appearance: none;
		cursor: pointer;
		transition: border-color 0.2s ease, background 0.2s ease;
		box-sizing: border-box;
	}

	.select option {
		background: var(--color-bg, #0f172a);
		color: var(--color-text-primary, #e2e8f0);
	}

	.select:hover {
		border-color: var(--color-border-hover, rgba(255, 255, 255, 0.2));
	}

	.select:focus {
		border-color: var(--color-primary, #6366f1);
		background: var(--color-surface-elevated, rgba(255, 255, 255, 0.07));
	}

	.select-label {
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

	.select-label--floated {
		top: 0.5rem;
		transform: translateY(0);
		font-size: 0.6875rem;
		color: var(--color-primary, #6366f1);
		letter-spacing: 0.02em;
	}

	.select-label__required {
		color: var(--color-danger, #ef4444);
		margin-left: 2px;
	}

	.select-chevron {
		position: absolute;
		right: var(--space-3, 0.75rem);
		top: 50%;
		transform: translateY(-50%);
		width: 1.25rem;
		height: 1.25rem;
		color: var(--color-text-secondary, #94a3b8);
		pointer-events: none;
		transition: transform 0.2s ease;
	}

	.select:focus ~ .select-chevron {
		transform: translateY(-50%) rotate(180deg);
		color: var(--color-primary, #6366f1);
	}

	.select-focus-ring {
		position: absolute;
		inset: -2px;
		border-radius: calc(var(--radius-md, 0.5rem) + 2px);
		border: 2px solid transparent;
		pointer-events: none;
		transition: border-color 0.2s ease, box-shadow 0.2s ease;
	}

	.select-focus-ring--active {
		border-color: var(--color-primary, #6366f1);
		box-shadow: 0 0 0 3px var(--color-primary-glow, rgba(99, 102, 241, 0.15));
	}

	.select-group--error .select {
		border-color: var(--color-danger, #ef4444);
	}

	.select-group--error .select-label--floated {
		color: var(--color-danger, #ef4444);
	}

	.select-error {
		margin: 0;
		padding-left: var(--space-1, 0.25rem);
		font-size: 0.75rem;
		color: var(--color-danger, #ef4444);
	}
</style>
