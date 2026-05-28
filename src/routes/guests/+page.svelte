<script lang="ts">
  import { enhance } from '$app/forms';
  import Header from '$lib/components/layout/Header.svelte';
  import Card from '$lib/components/ui/Card.svelte';
  import Badge from '$lib/components/ui/Badge.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import Modal from '$lib/components/ui/Modal.svelte';
  import Input from '$lib/components/ui/Input.svelte';
  import { formatDate } from '$lib/utils/formatters';
  import { RESERVATION_STATUS_MAP } from '$lib/utils/constants';

  let { data, form } = $props();

  let showModal = $state(false);
  let editingGuest = $state<any>(null);
  let searchQuery = $state('');

  const filteredGuests = $derived(
    data.guests.filter((g: any) => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return g.fullName.toLowerCase().includes(q) || g.email.toLowerCase().includes(q);
    })
  );

  function openCreate() {
    editingGuest = null;
    showModal = true;
  }

  function openEdit(guest: any) {
    editingGuest = guest;
    showModal = true;
  }

  function closeModal() {
    showModal = false;
    editingGuest = null;
  }
</script>

<svelte:head>
  <title>Guests — Hotel Reservation System</title>
</svelte:head>

{#snippet actions()}
  <Button variant="primary" onclick={openCreate}>
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
    Add Guest
  </Button>
{/snippet}

<Header title="Guests" subtitle="Manage hotel guests" {actions} />

<Card padding="md">
  <div class="search-bar">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
    <input type="text" class="search-input" placeholder="Search guests..." bind:value={searchQuery} />
    <span class="search-count">{filteredGuests.length} guest{filteredGuests.length !== 1 ? 's' : ''}</span>
  </div>

  {#if form?.error}
    <div class="error-banner">{form.error}</div>
  {/if}

  <div class="table-wrapper">
    <table>
      <thead>
        <tr>
          <th>Guest</th>
          <th>Phone</th>
          <th>Reservations</th>
          <th>Last Visit</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {#each filteredGuests as guest}
          <tr>
            <td>
              <div class="guest-info">
                <span class="guest-avatar">{guest.fullName.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}</span>
                <div>
                  <div class="font-medium">{guest.fullName}</div>
                  <div class="text-sm text-muted">{guest.email}</div>
                </div>
              </div>
            </td>
            <td>{guest.phone || '—'}</td>
            <td>
              <span class="reservation-count">{guest.reservationCount}</span>
              <span class="text-sm text-muted">booking{guest.reservationCount !== 1 ? 's' : ''}</span>
            </td>
            <td>
              {#if guest.lastReservation}
                <div>{formatDate(guest.lastReservation.checkIn, 'short')}</div>
                <Badge
                  variant={RESERVATION_STATUS_MAP[guest.lastReservation.status]?.variant || 'neutral'}
                  label={RESERVATION_STATUS_MAP[guest.lastReservation.status]?.label || guest.lastReservation.status}
                />
              {:else}
                <span class="text-muted">No visits</span>
              {/if}
            </td>
            <td>
              <div class="action-buttons">
                <button class="btn btn-ghost btn-sm" onclick={() => openEdit(guest)}>Edit</button>
                <form method="POST" action="?/delete" use:enhance>
                  <input type="hidden" name="id" value={guest.id} />
                  <button type="submit" class="btn btn-ghost btn-sm" style="color: var(--color-danger)">Delete</button>
                </form>
              </div>
            </td>
          </tr>
        {/each}
        {#if filteredGuests.length === 0}
          <tr><td colspan="5" class="empty-cell">No guests found</td></tr>
        {/if}
      </tbody>
    </table>
  </div>
</Card>

<Modal open={showModal} title={editingGuest ? `Edit ${editingGuest.fullName}` : 'Add New Guest'} onclose={closeModal}>
  <form method="POST" action={editingGuest ? '?/update' : '?/create'} use:enhance={() => {
    return async ({ update }) => {
      await update();
      closeModal();
    };
  }}>
    {#if editingGuest}
      <input type="hidden" name="id" value={editingGuest.id} />
    {/if}

    <div class="form-stack">
      <Input label="Full Name" name="fullName" value={editingGuest?.fullName || ''} required placeholder="John Doe" />
      <Input label="Email" name="email" type="email" value={editingGuest?.email || ''} required placeholder="john@example.com" />
      <Input label="Phone" name="phone" value={editingGuest?.phone || ''} placeholder="+1 555 123 4567" />
    </div>

    <div class="modal-actions">
      <Button variant="ghost" onclick={closeModal}>Cancel</Button>
      <Button variant="primary" type="submit">{editingGuest ? 'Update Guest' : 'Add Guest'}</Button>
    </div>
  </form>
</Modal>

<style>
  .search-bar {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    padding: var(--space-3) var(--space-4);
    background: var(--color-bg-tertiary);
    border-radius: var(--radius-md);
    margin-bottom: var(--space-4);
    border: 1px solid var(--color-border);
  }

  .search-bar svg {
    color: var(--color-text-muted);
    flex-shrink: 0;
  }

  .search-input {
    flex: 1;
    background: none;
    border: none;
    color: var(--color-text-primary);
    font-size: 0.875rem;
    outline: none;
  }

  .search-input::placeholder {
    color: var(--color-text-muted);
  }

  .search-count {
    font-size: 0.75rem;
    color: var(--color-text-muted);
    flex-shrink: 0;
  }

  .guest-info {
    display: flex;
    align-items: center;
    gap: var(--space-3);
  }

  .guest-avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--color-accent), var(--color-accent-light));
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
    font-weight: 700;
    color: white;
    flex-shrink: 0;
  }

  .reservation-count {
    font-weight: 700;
    color: var(--color-accent-light);
    margin-right: var(--space-1);
  }

  .action-buttons {
    display: flex;
    gap: var(--space-2);
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

  .form-stack {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
    margin-bottom: var(--space-6);
  }

  .modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: var(--space-3);
    padding-top: var(--space-4);
    border-top: 1px solid var(--color-border);
  }

  .empty-cell {
    text-align: center;
    padding: var(--space-8) !important;
    color: var(--color-text-muted);
  }
</style>
