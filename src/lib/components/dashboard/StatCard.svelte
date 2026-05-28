<script lang="ts">
	let {
		label,
		value,
		icon = 'rooms',
		trend,
		color = 'indigo'
	}: {
		label: string;
		value: string | number;
		icon?: 'rooms' | 'occupancy' | 'reservations' | 'revenue';
		trend?: number;
		color?: 'indigo' | 'emerald' | 'amber' | 'rose';
	} = $props();

	let displayValue = $state(0);
	let numericTarget = $derived(typeof value === 'number' ? value : parseFloat(String(value).replace(/[^0-9.]/g, '')) || 0);
	let prefix = $derived(typeof value === 'string' ? value.replace(/[0-9.,]/g, '').trim().charAt(0) === '$' ? '$' : '' : '');
	let suffix = $derived(typeof value === 'string' && value.includes('%') ? '%' : '');

	$effect(() => {
		const target = numericTarget;
		displayValue = 0;
		const duration = 1200;
		const startTime = performance.now();

		function easeOutExpo(t: number): number {
			return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
		}

		function animate(currentTime: number) {
			const elapsed = currentTime - startTime;
			const progress = Math.min(elapsed / duration, 1);
			displayValue = Math.round(easeOutExpo(progress) * target);

			if (progress < 1) {
				requestAnimationFrame(animate);
			} else {
				displayValue = target;
			}
		}

		requestAnimationFrame(animate);
	});

	let formattedValue = $derived.by(() => {
		const formatted = displayValue.toLocaleString();
		return `${prefix}${formatted}${suffix}`;
	});

	let trendDirection = $derived(trend && trend > 0 ? 'up' : 'down');
	let trendClass = $derived(trend && trend > 0 ? 'trend--up' : 'trend--down');
</script>

<div class="stat-card stat-card--{color}">
	<div class="stat-card__glow"></div>
	<div class="stat-card__header">
		<div class="stat-card__icon stat-card__icon--{color}">
			{#if icon === 'rooms'}
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
					<path d="M3 21V7a2 2 0 012-2h14a2 2 0 012 2v14" />
					<rect x="7" y="9" width="4" height="4" rx="0.5" />
					<rect x="13" y="9" width="4" height="4" rx="0.5" />
					<rect x="7" y="15" width="4" height="6" rx="0.5" />
					<rect x="13" y="15" width="4" height="6" rx="0.5" />
				</svg>
			{:else if icon === 'occupancy'}
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
					<path d="M22 12h-4l-3 9L9 3l-3 9H2" />
				</svg>
			{:else if icon === 'reservations'}
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
					<rect x="3" y="4" width="18" height="18" rx="2" />
					<line x1="16" y1="2" x2="16" y2="6" />
					<line x1="8" y1="2" x2="8" y2="6" />
					<line x1="3" y1="10" x2="21" y2="10" />
					<path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" />
				</svg>
			{:else if icon === 'revenue'}
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
					<line x1="12" y1="1" x2="12" y2="23" />
					<path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
				</svg>
			{/if}
		</div>
		{#if trend !== undefined}
			<div class="stat-card__trend {trendClass}">
				<svg viewBox="0 0 16 16" fill="currentColor" width="12" height="12">
					{#if trendDirection === 'up'}
						<path d="M8 4l4 5H4l4-5z" />
					{:else}
						<path d="M8 12l-4-5h8l-4 5z" />
					{/if}
				</svg>
				<span>{Math.abs(trend)}%</span>
			</div>
		{/if}
	</div>
	<div class="stat-card__value">{formattedValue}</div>
	<div class="stat-card__label">{label}</div>
</div>

<style>
	.stat-card {
		position: relative;
		padding: var(--space-5, 1.25rem);
		background: var(--color-surface, rgba(255, 255, 255, 0.05));
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		border: 1px solid var(--color-border, rgba(255, 255, 255, 0.08));
		border-radius: var(--radius-lg, 0.75rem);
		overflow: hidden;
		transition: all 0.3s ease;
	}

	.stat-card:hover {
		border-color: var(--color-border-hover, rgba(255, 255, 255, 0.12));
		transform: translateY(-2px);
	}

	/* Glow effect */
	.stat-card__glow {
		position: absolute;
		top: -50%;
		right: -30%;
		width: 120px;
		height: 120px;
		border-radius: 50%;
		opacity: 0.08;
		filter: blur(40px);
		pointer-events: none;
		transition: opacity 0.3s ease;
	}

	.stat-card:hover .stat-card__glow {
		opacity: 0.15;
	}

	.stat-card--indigo .stat-card__glow {
		background: var(--color-indigo, #6366f1);
	}

	.stat-card--emerald .stat-card__glow {
		background: var(--color-emerald, #10b981);
	}

	.stat-card--amber .stat-card__glow {
		background: var(--color-amber, #f59e0b);
	}

	.stat-card--rose .stat-card__glow {
		background: var(--color-rose, #f43f5e);
	}

	/* Header */
	.stat-card__header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		margin-bottom: var(--space-4, 1rem);
	}

	/* Icon */
	.stat-card__icon {
		width: 2.75rem;
		height: 2.75rem;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: var(--radius-lg, 0.75rem);
	}

	.stat-card__icon svg {
		width: 1.375rem;
		height: 1.375rem;
	}

	.stat-card__icon--indigo {
		background: linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(99, 102, 241, 0.1));
		color: var(--color-indigo, #6366f1);
		box-shadow: 0 0 12px rgba(99, 102, 241, 0.15);
	}

	.stat-card__icon--emerald {
		background: linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(16, 185, 129, 0.1));
		color: var(--color-emerald, #10b981);
		box-shadow: 0 0 12px rgba(16, 185, 129, 0.15);
	}

	.stat-card__icon--amber {
		background: linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(245, 158, 11, 0.1));
		color: var(--color-amber, #f59e0b);
		box-shadow: 0 0 12px rgba(245, 158, 11, 0.15);
	}

	.stat-card__icon--rose {
		background: linear-gradient(135deg, rgba(244, 63, 94, 0.2), rgba(244, 63, 94, 0.1));
		color: var(--color-rose, #f43f5e);
		box-shadow: 0 0 12px rgba(244, 63, 94, 0.15);
	}

	/* Trend */
	.stat-card__trend {
		display: flex;
		align-items: center;
		gap: 2px;
		font-size: 0.75rem;
		font-weight: 600;
		padding: var(--space-1, 0.25rem) var(--space-2, 0.5rem);
		border-radius: var(--radius-full, 9999px);
	}

	.trend--up {
		color: var(--color-success, #10b981);
		background: var(--color-success-bg, rgba(16, 185, 129, 0.12));
	}

	.trend--down {
		color: var(--color-danger, #ef4444);
		background: var(--color-danger-bg, rgba(239, 68, 68, 0.12));
	}

	/* Value */
	.stat-card__value {
		font-size: 2rem;
		font-weight: 800;
		color: var(--color-text-primary, #e2e8f0);
		letter-spacing: -0.02em;
		line-height: 1.1;
		margin-bottom: var(--space-1, 0.25rem);
	}

	/* Label */
	.stat-card__label {
		font-size: 0.8125rem;
		color: var(--color-text-secondary, #94a3b8);
		font-weight: 500;
	}
</style>
