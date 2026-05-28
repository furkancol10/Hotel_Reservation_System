<script lang="ts">
  import { enhance } from '$app/forms';
  import Header from '$lib/components/layout/Header.svelte';
  import Badge from '$lib/components/ui/Badge.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import Modal from '$lib/components/ui/Modal.svelte';
  import Input from '$lib/components/ui/Input.svelte';
  import Select from '$lib/components/ui/Select.svelte';
  import Card from '$lib/components/ui/Card.svelte';
  import { ROOM_STATUS_MAP } from '$lib/utils/constants';
  import { formatCurrency } from '$lib/utils/formatters';

  let { data, form } = $props();

  let showModal = $state(false);
  let editingRoom = $state<any>(null);
  let statusFilter = $state('');
  let floorFilter = $state('');

  const filteredRooms = $derived(
    data.rooms.filter((r: any) => {
      if (statusFilter && r.status !== statusFilter) return false;
      if (floorFilter && r.floor !== parseInt(floorFilter)) return false;
      return true;
    })
  );

  const floors = $derived([...new Set(data.rooms.map((r: any) => r.floor))].sort());

  function openCreate() {
    editingRoom = null;
    showModal = true;
  }

  function openEdit(room: any) {
    editingRoom = room;
    showModal = true;
  }

  function closeModal() {
    showModal = false;
    editingRoom = null;
  }
</script>

<svelte:head>
  <title>Rooms — Hotel Reservation System</title>
</svelte:head>

{#snippet actions()}
  <Button variant="primary" onclick={openCreate}>
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
    Add Room
  </Button>
{/snippet}

<Header title="Rooms" subtitle="Manage all hotel rooms" {actions} />

<Card padding="md">
  <div class="filters">
    <div class="filter-group">
      <label class="filter-label">Status</label>
      <select class="select" bind:value={statusFilter}>
        <option value="">All Status</option>
        <option value="AVAILABLE">Available</option>
        <option value="OCCUPIED">Occupied</option>
        <option value="MAINTENANCE">Maintenance</option>
      </select>
    </div>
    <div class="filter-group">
      <label class="filter-label">Floor</label>
      <select class="select" bind:value={floorFilter}>
        <option value="">All Floors</option>
        {#each floors as floor}
          <option value={floor}>Floor {floor}</option>
        {/each}
      </select>
    </div>
    <div class="filter-count">
      <span class="text-muted">{filteredRooms.length} rooms</span>
    </div>
  </div>

  {#if form?.error}
    <div class="error-banner">{form.error}</div>
  {/if}

  <div class="table-wrapper">
    <table>
      <thead>
        <tr>
          <th>Room #</th>
          <th>Floor</th>
          <th>Type</th>
          <th>Capacity</th>
          <th>Price/Night</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {#each filteredRooms as room}
          <tr>
            <td><span class="room-number">{room.roomNumber}</span></td>
            <td>Floor {room.floor}</td>
            <td>{room.roomType}</td>
            <td>{room.capacity} guests</td>
            <td>{formatCurrency(room.price, room.currency)}</td>
            <td>
              <Badge
                variant={ROOM_STATUS_MAP[room.status]?.variant || 'neutral'}
                label={ROOM_STATUS_MAP[room.status]?.label || room.status}
              />
            </td>
            <td>
              <div class="action-buttons">
                <button class="btn btn-ghost btn-sm" onclick={() => openEdit(room)}>Edit</button>
                {#if room.status === 'AVAILABLE'}
                  <form method="POST" action="?/updateStatus" use:enhance>
                    <input type="hidden" name="id" value={room.id} />
                    <input type="hidden" name="status" value="MAINTENANCE" />
                    <button type="submit" class="btn btn-ghost btn-sm" style="color: var(--color-warning)">→ Maint.</button>
                  </form>
                {:else if room.status === 'MAINTENANCE'}
                  <form method="POST" action="?/updateStatus" use:enhance>
                    <input type="hidden" name="id" value={room.id} />
                    <input type="hidden" name="status" value="AVAILABLE" />
                    <button type="submit" class="btn btn-ghost btn-sm" style="color: var(--color-success)">→ Available</button>
                  </form>
                {/if}
              </div>
            </td>
          </tr>
        {/each}
        {#if filteredRooms.length === 0}
          <tr><td colspan="7" class="empty-cell">No rooms found</td></tr>
        {/if}
      </tbody>
    </table>
  </div>
</Card>

<Modal open={showModal} title={editingRoom ? `Edit Room ${editingRoom.roomNumber}` : 'Add New Room'} onclose={closeModal}>
  <form method="POST" action={editingRoom ? '?/update' : '?/create'} use:enhance={() => {
    return async ({ update }) => {
      await update();
      closeModal();
    };
  }}>
    {#if editingRoom}
      <input type="hidden" name="id" value={editingRoom.id} />
    {/if}

    <div class="form-grid">
      <Input label="Room Number" name="roomNumber" value={editingRoom?.roomNumber || ''} required placeholder="e.g. 101" />
      <Input label="Floor" name="floor" type="number" value={editingRoom?.floor?.toString() || ''} required placeholder="e.g. 1" />
      <Select
        label="Room Type"
        name="roomTypeId"
        value={editingRoom?.roomTypeId || ''}
        options={data.roomTypes.map((rt: any) => ({ value: rt.id, label: rt.name }))}
        required
      />
      {#if editingRoom}
        <Select
          label="Status"
          name="status"
          value={editingRoom?.status || 'AVAILABLE'}
          options={[
            { value: 'AVAILABLE', label: 'Available' },
            { value: 'OCCUPIED', label: 'Occupied' },
            { value: 'MAINTENANCE', label: 'Maintenance' },
          ]}
        />
      {/if}
      <div class="full-width">
        <Input label="Notes" name="notes" value={editingRoom?.notes || ''} placeholder="Optional notes..." />
      </div>
    </div>

    <div class="modal-actions">
      <Button variant="ghost" onclick={closeModal}>Cancel</Button>
      <Button variant="primary" type="submit">{editingRoom ? 'Update Room' : 'Create Room'}</Button>
    </div>
  </form>
</Modal>

<style>
  .filters {
    display: flex;
    gap: var(--space-4);
    align-items: flex-end;
    margin-bottom: var(--space-4);
    flex-wrap: wrap;
  }

  .filter-group {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
  }

  .filter-label {
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--color-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .filter-count {
    margin-left: auto;
    display: flex;
    align-items: center;
  }

  .room-number {
    font-weight: 700;
    color: var(--color-accent-light);
    font-size: 1rem;
  }

  .action-buttons {
    display: flex;
    gap: var(--space-2);
    align-items: center;
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

  .form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-4);
    margin-bottom: var(--space-6);
  }

  .full-width {
    grid-column: 1 / -1;
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
