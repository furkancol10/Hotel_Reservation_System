<script lang="ts">
	import type { Snippet } from 'svelte';

	type Column = {
		key: string;
		label: string;
		sortable?: boolean;
	};

	let {
		columns,
		data,
		onrowclick,
		renderCell
	}: {
		columns: Column[];
		data: Array<Record<string, any>>;
		onrowclick?: (row: Record<string, any>) => void;
		renderCell?: Snippet<[{ row: Record<string, any>; column: Column; value: any }]>;
	} = $props();

	let sortKey = $state('');
	let sortDir = $state<'asc' | 'desc'>('asc');
	let currentPage = $state(1);
	const perPage = 10;

	let sortedData = $derived.by(() => {
		if (!sortKey) return data;
		const dir = sortDir === 'asc' ? 1 : -1;
		return [...data].sort((a, b) => {
			const aVal = a[sortKey];
			const bVal = b[sortKey];
			if (aVal == null && bVal == null) return 0;
			if (aVal == null) return 1;
			if (bVal == null) return -1;
			if (typeof aVal === 'number' && typeof bVal === 'number') return (aVal - bVal) * dir;
			return String(aVal).localeCompare(String(bVal)) * dir;
		});
	});

	let totalPages = $derived(Math.max(1, Math.ceil(sortedData.length / perPage)));
	let pagedData = $derived(sortedData.slice((currentPage - 1) * perPage, currentPage * perPage));
	let startIndex = $derived((currentPage - 1) * perPage + 1);
	let endIndex = $derived(Math.min(currentPage * perPage, sortedData.length));

	function handleSort(col: Column) {
		if (!col.sortable) return;
		if (sortKey === col.key) {
			sortDir = sortDir === 'asc' ? 'desc' : 'asc';
		} else {
			sortKey = col.key;
			sortDir = 'asc';
		}
		currentPage = 1;
	}

	function goToPage(page: number) {
		if (page >= 1 && page <= totalPages) {
			currentPage = page;
		}
	}

	// Reset to page 1 when data changes
	$effect(() => {
		data;
		currentPage = 1;
	});
</script>

<div class="datatable">
	<div class="datatable__scroll">
		<table class="datatable__table">
			<thead>
				<tr>
					{#each columns as col}
						<th
							class="datatable__th"
							class:datatable__th--sortable={col.sortable}
							onclick={() => handleSort(col)}
						>
							<span class="datatable__th-content">
								{col.label}
								{#if col.sortable}
									<span class="datatable__sort-icon" class:datatable__sort-icon--active={sortKey === col.key}>
										{#if sortKey === col.key && sortDir === 'desc'}
											<svg viewBox="0 0 16 16" fill="currentColor" width="14" height="14">
												<path d="M8 4l4 5H4l4-5z" />
											</svg>
										{:else}
											<svg viewBox="0 0 16 16" fill="currentColor" width="14" height="14">
												<path d="M8 12l-4-5h8l-4 5z" />
											</svg>
										{/if}
									</span>
								{/if}
							</span>
						</th>
					{/each}
				</tr>
			</thead>
			<tbody>
				{#if pagedData.length === 0}
					<tr>
						<td class="datatable__empty" colspan={columns.length}>
							No data available
						</td>
					</tr>
				{:else}
					{#each pagedData as row, i}
						<tr
							class="datatable__row"
							class:datatable__row--clickable={!!onrowclick}
							class:datatable__row--striped={i % 2 === 1}
							onclick={() => onrowclick?.(row)}
						>
							{#each columns as col}
								<td class="datatable__td">
									{#if renderCell}
										{@render renderCell({ row, column: col, value: row[col.key] })}
									{:else}
										{row[col.key] ?? '—'}
									{/if}
								</td>
							{/each}
						</tr>
					{/each}
				{/if}
			</tbody>
		</table>
	</div>

	{#if sortedData.length > perPage}
		<div class="datatable__pagination">
			<span class="datatable__info">
				{startIndex}–{endIndex} of {sortedData.length}
			</span>
			<div class="datatable__page-buttons">
				<button
					class="datatable__page-btn"
					disabled={currentPage === 1}
					onclick={() => goToPage(1)}
					aria-label="First page"
				>
					<svg viewBox="0 0 16 16" fill="currentColor" width="14" height="14">
						<path d="M11.354 2.646a.5.5 0 010 .708L6.707 8l4.647 4.646a.5.5 0 01-.708.708l-5-5a.5.5 0 010-.708l5-5a.5.5 0 01.708 0z" />
						<path d="M4.5 2.5v11a.5.5 0 01-1 0v-11a.5.5 0 011 0z" />
					</svg>
				</button>
				<button
					class="datatable__page-btn"
					disabled={currentPage === 1}
					onclick={() => goToPage(currentPage - 1)}
					aria-label="Previous page"
				>
					<svg viewBox="0 0 16 16" fill="currentColor" width="14" height="14">
						<path d="M11.354 2.646a.5.5 0 010 .708L6.707 8l4.647 4.646a.5.5 0 01-.708.708l-5-5a.5.5 0 010-.708l5-5a.5.5 0 01.708 0z" />
					</svg>
				</button>
				<span class="datatable__page-current">{currentPage} / {totalPages}</span>
				<button
					class="datatable__page-btn"
					disabled={currentPage === totalPages}
					onclick={() => goToPage(currentPage + 1)}
					aria-label="Next page"
				>
					<svg viewBox="0 0 16 16" fill="currentColor" width="14" height="14">
						<path d="M4.646 13.354a.5.5 0 010-.708L9.293 8 4.646 3.354a.5.5 0 11.708-.708l5 5a.5.5 0 010 .708l-5 5a.5.5 0 01-.708 0z" />
					</svg>
				</button>
				<button
					class="datatable__page-btn"
					disabled={currentPage === totalPages}
					onclick={() => goToPage(totalPages)}
					aria-label="Last page"
				>
					<svg viewBox="0 0 16 16" fill="currentColor" width="14" height="14">
						<path d="M4.646 13.354a.5.5 0 010-.708L9.293 8 4.646 3.354a.5.5 0 11.708-.708l5 5a.5.5 0 010 .708l-5 5a.5.5 0 01-.708 0z" />
						<path d="M11.5 2.5v11a.5.5 0 001 0v-11a.5.5 0 00-1 0z" />
					</svg>
				</button>
			</div>
		</div>
	{/if}
</div>

<style>
	.datatable {
		background: var(--color-surface, rgba(255, 255, 255, 0.05));
		border: 1px solid var(--color-border, rgba(255, 255, 255, 0.08));
		border-radius: var(--radius-lg, 0.75rem);
		overflow: hidden;
	}

	.datatable__scroll {
		overflow-x: auto;
	}

	.datatable__table {
		width: 100%;
		border-collapse: collapse;
	}

	.datatable__th {
		padding: var(--space-3, 0.75rem) var(--space-4, 1rem);
		text-align: left;
		font-size: 0.75rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--color-text-secondary, #94a3b8);
		background: var(--color-surface-elevated, rgba(255, 255, 255, 0.03));
		border-bottom: 1px solid var(--color-border, rgba(255, 255, 255, 0.08));
		white-space: nowrap;
		user-select: none;
	}

	.datatable__th--sortable {
		cursor: pointer;
		transition: color 0.15s ease;
	}

	.datatable__th--sortable:hover {
		color: var(--color-text-primary, #e2e8f0);
	}

	.datatable__th-content {
		display: inline-flex;
		align-items: center;
		gap: var(--space-1, 0.25rem);
	}

	.datatable__sort-icon {
		opacity: 0.3;
		transition: opacity 0.15s ease;
	}

	.datatable__sort-icon--active {
		opacity: 1;
		color: var(--color-primary, #6366f1);
	}

	.datatable__row {
		transition: background 0.15s ease;
	}

	.datatable__row--clickable {
		cursor: pointer;
	}

	.datatable__row:hover {
		background: var(--color-surface-hover, rgba(255, 255, 255, 0.04));
	}

	.datatable__row--striped {
		background: var(--color-surface-elevated, rgba(255, 255, 255, 0.02));
	}

	.datatable__row--striped:hover {
		background: var(--color-surface-hover, rgba(255, 255, 255, 0.06));
	}

	.datatable__td {
		padding: var(--space-3, 0.75rem) var(--space-4, 1rem);
		font-size: 0.875rem;
		color: var(--color-text-primary, #e2e8f0);
		border-bottom: 1px solid var(--color-border, rgba(255, 255, 255, 0.04));
	}

	.datatable__empty {
		padding: var(--space-12, 3rem) var(--space-4, 1rem);
		text-align: center;
		font-size: 0.875rem;
		color: var(--color-text-muted, rgba(148, 163, 184, 0.6));
	}

	/* Pagination */
	.datatable__pagination {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: var(--space-3, 0.75rem) var(--space-4, 1rem);
		border-top: 1px solid var(--color-border, rgba(255, 255, 255, 0.06));
		background: var(--color-surface-elevated, rgba(255, 255, 255, 0.02));
	}

	.datatable__info {
		font-size: 0.8125rem;
		color: var(--color-text-secondary, #94a3b8);
	}

	.datatable__page-buttons {
		display: flex;
		align-items: center;
		gap: var(--space-1, 0.25rem);
	}

	.datatable__page-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2rem;
		height: 2rem;
		padding: 0;
		background: transparent;
		border: 1px solid var(--color-border, rgba(255, 255, 255, 0.1));
		border-radius: var(--radius-sm, 0.375rem);
		color: var(--color-text-secondary, #94a3b8);
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.datatable__page-btn:hover:not(:disabled) {
		background: var(--color-surface-hover, rgba(255, 255, 255, 0.08));
		color: var(--color-text-primary, #e2e8f0);
		border-color: var(--color-border-hover, rgba(255, 255, 255, 0.2));
	}

	.datatable__page-btn:disabled {
		opacity: 0.3;
		cursor: not-allowed;
	}

	.datatable__page-current {
		padding: 0 var(--space-3, 0.75rem);
		font-size: 0.8125rem;
		font-weight: 600;
		color: var(--color-text-primary, #e2e8f0);
	}
</style>
