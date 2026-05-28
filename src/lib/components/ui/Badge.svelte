<script lang="ts">
	let {
		variant = 'neutral',
		label
	}: {
		variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
		label: string;
	} = $props();
</script>

<span class="badge badge--{variant}">
	{label}
</span>

<style>
	.badge {
		display: inline-flex;
		align-items: center;
		padding: var(--space-1, 0.25rem) var(--space-3, 0.75rem);
		font-size: 0.75rem;
		font-weight: 600;
		line-height: 1;
		letter-spacing: 0.025em;
		border-radius: var(--radius-full, 9999px);
		white-space: nowrap;
		text-transform: uppercase;
	}

	.badge--success {
		background: var(--color-success-bg, rgba(16, 185, 129, 0.15));
		color: var(--color-success, #10b981);
		border: 1px solid var(--color-success-border, rgba(16, 185, 129, 0.25));
	}

	.badge--warning {
		background: var(--color-warning-bg, rgba(245, 158, 11, 0.15));
		color: var(--color-warning, #f59e0b);
		border: 1px solid var(--color-warning-border, rgba(245, 158, 11, 0.25));
	}

	.badge--danger {
		background: var(--color-danger-bg, rgba(239, 68, 68, 0.15));
		color: var(--color-danger, #ef4444);
		border: 1px solid var(--color-danger-border, rgba(239, 68, 68, 0.25));
	}

	.badge--info {
		background: var(--color-info-bg, rgba(59, 130, 246, 0.15));
		color: var(--color-info, #3b82f6);
		border: 1px solid var(--color-info-border, rgba(59, 130, 246, 0.25));
	}

	.badge--neutral {
		background: var(--color-neutral-bg, rgba(148, 163, 184, 0.15));
		color: var(--color-text-secondary, #94a3b8);
		border: 1px solid var(--color-neutral-border, rgba(148, 163, 184, 0.2));
	}
</style>
