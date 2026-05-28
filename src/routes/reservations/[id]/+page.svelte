<script lang="ts">
  import { enhance } from '$app/forms';
  import Header from '$lib/components/layout/Header.svelte';
  import Card from '$lib/components/ui/Card.svelte';
  import Badge from '$lib/components/ui/Badge.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import { formatCurrency, formatDate, calculateNights } from '$lib/utils/formatters';
  import { RESERVATION_STATUS_MAP } from '$lib/utils/constants';

  let { data, form } = $props();

  const r = $derived(data.reservation);
  const nights = $derived(calculateNights(r.checkIn, r.checkOut));

  const statusSteps = ['PENDING', 'CONFIRMED', 'CHECKED_IN', 'CHECKED_OUT'];
  const currentStepIndex = $derived(
    r.status === 'CANCELLED' ? -1 : statusSteps.indexOf(r.status)
  );
</script>

<svelte:head>
  <title>Reservation #{r.id.slice(0, 8)} — Hotel Reservation System</title>
</svelte:head>

{#snippet actions()}
  <a href="/reservations" class="btn btn-ghost">← Back</a>
{/snippet}

<Header title="Reservation #{r.id.slice(0, 8)}" subtitle="Created {formatDate(r.createdAt, 'long')}" {actions} />

{#if form?.error}
  <div class="error-banner">{form.error}</div>
{/if}

<!-- Status Timeline -->
<Card padding="md">
  <div class="timeline">
    {#each statusSteps as step, i}
      <div class="timeline-step" class:completed={i <= currentStepIndex} class:active={i === currentStepIndex} class:cancelled={r.status === 'CANCELLED'}>
        <div class="timeline-dot">
          {#if i <= currentStepIndex}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
          {:else}
            <span>{i + 1}</span>
          {/if}
        </div>
        <span class="timeline-label">{RESERVATION_STATUS_MAP[step]?.label || step}</span>
        {#if i < statusSteps.length - 1}
          <div class="timeline-line" class:filled={i < currentStepIndex}></div>
        {/if}
      </div>
    {/each}
    {#if r.status === 'CANCELLED'}
      <div class="timeline-step cancelled active">
        <div class="timeline-dot">✕</div>
        <span class="timeline-label">Cancelled</span>
      </div>
    {/if}
  </div>
</Card>

<!-- Details Grid -->
<div class="detail-grid">
  <Card padding="md">
    <h3 class="detail-title">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
      Guest Information
    </h3>
    <div class="detail-list">
      <div class="detail-row">
        <span class="detail-label">Name</span>
        <span class="detail-value">{r.guestName}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Email</span>
        <span class="detail-value">{r.guestEmail}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Phone</span>
        <span class="detail-value">{r.guestPhone || '—'}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Guests</span>
        <span class="detail-value">{r.guestCount} guest{r.guestCount > 1 ? 's' : ''}</span>
      </div>
    </div>

    {#if r.specialRequests}
      <div class="special-requests">
        <h4>Special Requests</h4>
        <p>{r.specialRequests}</p>
      </div>
    {/if}
  </Card>

  <Card padding="md">
    <h3 class="detail-title">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
      Room & Stay
    </h3>
    <div class="detail-list">
      <div class="detail-row">
        <span class="detail-label">Room</span>
        <span class="detail-value font-semibold">{r.roomNumber}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Type</span>
        <span class="detail-value">{r.roomType}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Floor</span>
        <span class="detail-value">Floor {r.roomFloor}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Check-in</span>
        <span class="detail-value">{formatDate(r.checkIn, 'long')}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Check-out</span>
        <span class="detail-value">{formatDate(r.checkOut, 'long')}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Duration</span>
        <span class="detail-value">{nights} night{nights > 1 ? 's' : ''}</span>
      </div>
    </div>

    <div class="price-summary">
      <div class="price-row">
        <span>Total Price</span>
        <span class="total-amount">{formatCurrency(r.totalPrice, r.currency)}</span>
      </div>
      <div class="price-row sub">
        <span>Status</span>
        <Badge
          variant={RESERVATION_STATUS_MAP[r.status]?.variant || 'neutral'}
          label={RESERVATION_STATUS_MAP[r.status]?.label || r.status}
        />
      </div>
    </div>
  </Card>
</div>

<!-- Action Buttons -->
{#if r.status !== 'CHECKED_OUT' && r.status !== 'CANCELLED'}
  <Card padding="md">
    <div class="action-bar">
      {#if r.status === 'PENDING'}
        <form method="POST" action="?/updateStatus" use:enhance>
          <input type="hidden" name="id" value={r.id} />
          <input type="hidden" name="status" value="CONFIRMED" />
          <Button variant="primary" type="submit">✓ Confirm Reservation</Button>
        </form>
      {/if}
      {#if r.status === 'CONFIRMED'}
        <form method="POST" action="?/updateStatus" use:enhance>
          <input type="hidden" name="id" value={r.id} />
          <input type="hidden" name="status" value="CHECKED_IN" />
          <Button variant="primary" type="submit">→ Check In Guest</Button>
        </form>
      {/if}
      {#if r.status === 'CHECKED_IN'}
        <form method="POST" action="?/updateStatus" use:enhance>
          <input type="hidden" name="id" value={r.id} />
          <input type="hidden" name="status" value="CHECKED_OUT" />
          <Button variant="secondary" type="submit">← Check Out Guest</Button>
        </form>
      {/if}
      {#if r.status === 'PENDING' || r.status === 'CONFIRMED'}
        <form method="POST" action="?/cancel" use:enhance>
          <input type="hidden" name="id" value={r.id} />
          <Button variant="danger" type="submit">✕ Cancel Reservation</Button>
        </form>
      {/if}
    </div>
  </Card>
{/if}

<style>
  .timeline {
    display: flex;
    align-items: center;
    gap: 0;
    padding: var(--space-2) 0;
    overflow-x: auto;
  }

  .timeline-step {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    flex-shrink: 0;
  }

  .timeline-dot {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
    font-weight: 600;
    background: var(--color-bg-tertiary);
    color: var(--color-text-muted);
    border: 2px solid var(--color-border);
    transition: all var(--transition-normal);
  }

  .timeline-step.completed .timeline-dot,
  .timeline-step.active .timeline-dot {
    background: var(--color-accent);
    border-color: var(--color-accent);
    color: white;
  }

  .timeline-step.cancelled .timeline-dot {
    background: var(--color-danger);
    border-color: var(--color-danger);
    color: white;
  }

  .timeline-label {
    font-size: 0.8125rem;
    font-weight: 500;
    color: var(--color-text-muted);
    white-space: nowrap;
  }

  .timeline-step.active .timeline-label {
    color: var(--color-accent-light);
  }

  .timeline-step.cancelled .timeline-label {
    color: var(--color-danger);
  }

  .timeline-line {
    width: 60px;
    height: 2px;
    background: var(--color-border);
    margin: 0 var(--space-2);
    flex-shrink: 0;
  }

  .timeline-line.filled {
    background: var(--color-accent);
  }

  .detail-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-6);
    margin-top: var(--space-6);
  }

  .detail-title {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    font-size: 1rem;
    font-weight: 600;
    color: var(--color-text-primary);
    margin-bottom: var(--space-4);
    padding-bottom: var(--space-3);
    border-bottom: 1px solid var(--color-border);
  }

  .detail-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
  }

  .detail-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .detail-label {
    font-size: 0.875rem;
    color: var(--color-text-muted);
  }

  .detail-value {
    font-size: 0.875rem;
    color: var(--color-text-primary);
  }

  .special-requests {
    margin-top: var(--space-4);
    padding-top: var(--space-4);
    border-top: 1px solid var(--color-border);
  }

  .special-requests h4 {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--color-text-secondary);
    margin-bottom: var(--space-2);
  }

  .special-requests p {
    font-size: 0.875rem;
    color: var(--color-text-muted);
    line-height: 1.5;
    font-style: italic;
  }

  .price-summary {
    margin-top: var(--space-4);
    padding-top: var(--space-4);
    border-top: 1px solid var(--color-border);
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
  }

  .price-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.875rem;
    color: var(--color-text-secondary);
  }

  .price-row.sub {
    font-size: 0.8125rem;
  }

  .total-amount {
    font-size: 1.5rem;
    font-weight: 800;
    background: linear-gradient(135deg, var(--color-accent), var(--color-accent-light));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .action-bar {
    display: flex;
    gap: var(--space-3);
    justify-content: flex-end;
  }

  .error-banner {
    background: rgba(244, 63, 94, 0.1);
    border: 1px solid rgba(244, 63, 94, 0.3);
    color: var(--color-danger);
    padding: var(--space-3) var(--space-4);
    border-radius: var(--radius-md);
    margin-bottom: var(--space-4);
    font-size: 0.875rem;
  }

  @media (max-width: 768px) {
    .detail-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
