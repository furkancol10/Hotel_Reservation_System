<script lang="ts">
  import { enhance } from '$app/forms';
  import { goto } from '$app/navigation';
  import Header from '$lib/components/layout/Header.svelte';
  import Card from '$lib/components/ui/Card.svelte';
  import Badge from '$lib/components/ui/Badge.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import { formatCurrency, formatDate } from '$lib/utils/formatters';
  import { RESERVATION_STATUS_MAP } from '$lib/utils/constants';

  let { data, form } = $props();

  const statusTabs = [
    { value: '', label: 'All' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'CONFIRMED', label: 'Confirmed' },
    { value: 'CHECKED_IN', label: 'Checked In' },
    { value: 'CHECKED_OUT', label: 'Checked Out' },
    { value: 'CANCELLED', label: 'Cancelled' },
  ];

  function filterByStatus(status: string) {
    const url = new URL(window.location.href);
    if (status) {
      url.searchParams.set('status', status);
    } else {
      url.searchParams.delete('status');
    }
    goto(url.toString(), { replaceState: true, invalidateAll: true });
  }
</script>

<svelte:head>
  <title>Reservations — Hotel Reservation System</title>
</svelte:head>

{#snippet actions()}
  <a href="/reservations/new" class="btn btn-primary">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
    New Reservation
  </a>
{/snippet}

<Header title="Reservations" subtitle="Manage guest bookings" {actions} />

<Card padding="md">
  <div class="status-tabs">
    {#each statusTabs as tab}
      <button
        class="status-tab"
        class:active={data.currentFilter === tab.value}
        onclick={() => filterByStatus(tab.value)}
      >
        {tab.label}
      </button>
    {/each}
  </div>

  {#if form?.error}
    <div class="error-banner">{form.error}</div>
  {/if}

  <div class="table-wrapper">
    <table>
      <thead>
        <tr>
          <th>Guest</th>
          <th>Room</th>
          <th>Check-in</th>
          <th>Check-out</th>
          <th>Guests</th>
          <th>Total</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {#each data.reservations as reservation}
          <tr class="clickable-row" onclick={() => goto(`/reservations/${reservation.id}`)}>
            <td>
              <div class="guest-info">
                <span class="guest-avatar">{reservation.guestName.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}</span>
                <div>
                  <div class="font-medium">{reservation.guestName}</div>
                  <div class="text-sm text-muted">{reservation.guestEmail}</div>
                </div>
              </div>
            </td>
            <td>
              <div class="font-medium">{reservation.roomNumber}</div>
              <div class="text-sm text-muted">{reservation.roomType}</div>
            </td>
            <td>{formatDate(reservation.checkIn, 'short')}</td>
            <td>{formatDate(reservation.checkOut, 'short')}</td>
            <td>{reservation.guestCount}</td>
            <td class="font-semibold">{formatCurrency(reservation.totalPrice, reservation.currency)}</td>
            <td>
              <Badge
                variant={RESERVATION_STATUS_MAP[reservation.status]?.variant || 'neutral'}
                label={RESERVATION_STATUS_MAP[reservation.status]?.label || reservation.status}
              />
            </td>
            <td onclick={(e) => e.stopPropagation()}>
              <div class="action-buttons">
                {#if reservation.status === 'PENDING'}
                  <form method="POST" action="?/updateStatus" use:enhance>
                    <input type="hidden" name="id" value={reservation.id} />
                    <input type="hidden" name="status" value="CONFIRMED" />
                    <button type="submit" class="btn btn-ghost btn-sm" style="color: var(--color-info)">Confirm</button>
                  </form>
                  <form method="POST" action="?/cancel" use:enhance>
                    <input type="hidden" name="id" value={reservation.id} />
                    <button type="submit" class="btn btn-ghost btn-sm" style="color: var(--color-danger)">Cancel</button>
                  </form>
                {:else if reservation.status === 'CONFIRMED'}
                  <form method="POST" action="?/updateStatus" use:enhance>
                    <input type="hidden" name="id" value={reservation.id} />
                    <input type="hidden" name="status" value="CHECKED_IN" />
                    <button type="submit" class="btn btn-ghost btn-sm" style="color: var(--color-success)">Check In</button>
                  </form>
                  <form method="POST" action="?/cancel" use:enhance>
                    <input type="hidden" name="id" value={reservation.id} />
                    <button type="submit" class="btn btn-ghost btn-sm" style="color: var(--color-danger)">Cancel</button>
                  </form>
                {:else if reservation.status === 'CHECKED_IN'}
                  <form method="POST" action="?/updateStatus" use:enhance>
                    <input type="hidden" name="id" value={reservation.id} />
                    <input type="hidden" name="status" value="CHECKED_OUT" />
                    <button type="submit" class="btn btn-ghost btn-sm" style="color: var(--color-warning)">Check Out</button>
                  </form>
                {/if}
              </div>
            </td>
          </tr>
        {/each}
        {#if data.reservations.length === 0}
          <tr><td colspan="8" class="empty-cell">No reservations found</td></tr>
        {/if}
      </tbody>
    </table>
  </div>
</Card>

<style>
  .status-tabs {
    display: flex;
    gap: var(--space-1);
    margin-bottom: var(--space-4);
    border-bottom: 1px solid var(--color-border);
    padding-bottom: var(--space-1);
    overflow-x: auto;
  }

  .status-tab {
    padding: var(--space-2) var(--space-4);
    border: none;
    background: none;
    color: var(--color-text-muted);
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    border-bottom: 2px solid transparent;
    transition: all var(--transition-fast);
    white-space: nowrap;
  }

  .status-tab:hover {
    color: var(--color-text-secondary);
  }

  .status-tab.active {
    color: var(--color-accent-light);
    border-bottom-color: var(--color-accent);
  }

  .guest-info {
    display: flex;
    align-items: center;
    gap: var(--space-3);
  }

  .guest-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--color-accent), var(--color-accent-light));
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.7rem;
    font-weight: 700;
    color: white;
    flex-shrink: 0;
  }

  .clickable-row {
    cursor: pointer;
  }

  .clickable-row:hover {
    background: var(--color-bg-tertiary) !important;
  }

  .action-buttons {
    display: flex;
    gap: var(--space-1);
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

  .empty-cell {
    text-align: center;
    padding: var(--space-8) !important;
    color: var(--color-text-muted);
  }
</style>
