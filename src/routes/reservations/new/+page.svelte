<script lang="ts">
  import { enhance } from '$app/forms';
  import { goto } from '$app/navigation';
  import Header from '$lib/components/layout/Header.svelte';
  import Card from '$lib/components/ui/Card.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import Input from '$lib/components/ui/Input.svelte';
  import Select from '$lib/components/ui/Select.svelte';
  import { formatCurrency, calculateNights } from '$lib/utils/formatters';

  let { data, form } = $props();

  let checkInDate = $state(data.filters?.checkIn || '');
  let checkOutDate = $state(data.filters?.checkOut || '');
  let selectedRoomTypeId = $state(data.filters?.roomTypeId || '');
  let selectedRoomId = $state('');
  let guestCount = $state('1');
  let availableRooms = $state(data.availableRooms || []);
  let loadingRooms = $state(false);

  const nights = $derived(
    checkInDate && checkOutDate ? calculateNights(checkInDate, checkOutDate) : 0
  );

  const selectedRoom = $derived(
    availableRooms.find((r: any) => r.id === selectedRoomId)
  );

  const totalPrice = $derived(
    selectedRoom && nights > 0 ? selectedRoom.price * nights : 0
  );

  const selectedRoomType = $derived(
    data.roomTypes.find((rt: any) => rt.id === selectedRoomTypeId)
  );

  async function searchRooms() {
    if (!checkInDate || !checkOutDate) return;
    loadingRooms = true;
    try {
      const params = new URLSearchParams({
        available: 'true',
        checkIn: checkInDate,
        checkOut: checkOutDate,
      });
      if (selectedRoomTypeId) params.set('roomTypeId', selectedRoomTypeId);

      const res = await fetch(`/api/rooms?${params}`);
      const json = await res.json();
      availableRooms = json;
      selectedRoomId = '';
    } catch (e) {
      console.error('Failed to fetch rooms', e);
    } finally {
      loadingRooms = false;
    }
  }

  $effect(() => {
    if (checkInDate && checkOutDate) {
      searchRooms();
    }
  });
</script>

<svelte:head>
  <title>New Reservation — Hotel Reservation System</title>
</svelte:head>

{#snippet actions()}
  <a href="/reservations" class="btn btn-ghost">← Back to Reservations</a>
{/snippet}

<Header title="New Reservation" subtitle="Create a new guest booking" {actions} />

<div class="reservation-form-layout">
  <Card padding="lg">
    {#if form?.error}
      <div class="error-banner">{form.error}</div>
    {/if}

    <form method="POST" use:enhance>
      <input type="hidden" name="totalPrice" value={totalPrice} />

      <div class="form-section">
        <h3 class="section-title">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          Stay Dates
        </h3>
        <div class="form-row">
          <div class="form-field">
            <label for="checkInDate">Check-in Date</label>
            <input type="date" id="checkInDate" name="checkInDate" class="input" bind:value={checkInDate} required />
          </div>
          <div class="form-field">
            <label for="checkOutDate">Check-out Date</label>
            <input type="date" id="checkOutDate" name="checkOutDate" class="input" bind:value={checkOutDate} required />
          </div>
        </div>
        {#if nights > 0}
          <p class="nights-info">{nights} night{nights > 1 ? 's' : ''}</p>
        {/if}
      </div>

      <div class="form-section">
        <h3 class="section-title">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
          Room Selection
        </h3>
        <Select
          label="Room Type (optional filter)"
          name="_roomType"
          value={selectedRoomTypeId}
          options={[
            { value: '', label: 'All Types' },
            ...data.roomTypes.map((rt: any) => ({ value: rt.id, label: `${rt.name} — ${formatCurrency(rt.basePricePerNight, rt.currency)}/night` }))
          ]}
        />

        {#if loadingRooms}
          <div class="loading-rooms">
            <div class="spinner"></div>
            Searching available rooms...
          </div>
        {:else if availableRooms.length > 0}
          <div class="rooms-grid">
            {#each availableRooms as room}
              <label class="room-option" class:selected={selectedRoomId === room.id}>
                <input type="radio" name="roomId" value={room.id} bind:group={selectedRoomId} required />
                <div class="room-option-content">
                  <span class="room-option-number">Room {room.roomNumber}</span>
                  <span class="room-option-type">{room.roomTypeName} • Floor {room.floor}</span>
                  <span class="room-option-price">{formatCurrency(room.price, room.currency)}/night</span>
                </div>
              </label>
            {/each}
          </div>
        {:else if checkInDate && checkOutDate}
          <p class="no-rooms">No available rooms for the selected dates.</p>
        {:else}
          <p class="no-rooms">Select dates to see available rooms.</p>
        {/if}
      </div>

      <div class="form-section">
        <h3 class="section-title">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
          Guest Details
        </h3>
        <Select
          label="Guest"
          name="guestId"
          value=""
          options={data.guests.map((g: any) => ({ value: g.id, label: `${g.fullName} (${g.email})` }))}
          required
        />
        <div class="form-row">
          <Input label="Number of Guests" name="guestCount" type="number" value={guestCount} required placeholder="1" />
        </div>
      </div>

      <div class="form-section">
        <h3 class="section-title">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          Additional Info
        </h3>
        <div class="form-field">
          <label for="specialRequests">Special Requests</label>
          <textarea id="specialRequests" name="specialRequests" class="input textarea" rows="3" placeholder="Any special requests..."></textarea>
        </div>
      </div>

      <div class="form-actions">
        <Button variant="ghost" onclick={() => goto('/reservations')}>Cancel</Button>
        <Button variant="primary" type="submit" disabled={!selectedRoomId || nights <= 0}>
          Create Reservation
        </Button>
      </div>
    </form>
  </Card>

  <div class="summary-sidebar">
    <Card padding="md">
      <h3 class="summary-title">Booking Summary</h3>

      {#if selectedRoom && nights > 0}
        <div class="summary-items">
          <div class="summary-item">
            <span class="text-muted">Room</span>
            <span class="font-medium">{selectedRoom.roomNumber} ({selectedRoom.roomTypeName})</span>
          </div>
          <div class="summary-item">
            <span class="text-muted">Duration</span>
            <span class="font-medium">{nights} night{nights > 1 ? 's' : ''}</span>
          </div>
          <div class="summary-item">
            <span class="text-muted">Rate</span>
            <span class="font-medium">{formatCurrency(selectedRoom.price, selectedRoom.currency)} / night</span>
          </div>
          <div class="summary-divider"></div>
          <div class="summary-item total">
            <span>Total</span>
            <span class="total-price">{formatCurrency(totalPrice, selectedRoom.currency)}</span>
          </div>
        </div>
      {:else}
        <p class="text-muted text-sm">Select dates and a room to see pricing.</p>
      {/if}
    </Card>
  </div>
</div>

<style>
  .reservation-form-layout {
    display: grid;
    grid-template-columns: 1fr 320px;
    gap: var(--space-6);
    align-items: start;
  }

  .form-section {
    margin-bottom: var(--space-6);
    padding-bottom: var(--space-6);
    border-bottom: 1px solid var(--color-border);
  }

  .form-section:last-of-type {
    border-bottom: none;
  }

  .section-title {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    font-size: 1rem;
    font-weight: 600;
    color: var(--color-text-primary);
    margin-bottom: var(--space-4);
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-4);
    margin-top: var(--space-3);
  }

  .form-field {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  .form-field label {
    font-size: 0.8125rem;
    font-weight: 500;
    color: var(--color-text-secondary);
  }

  .textarea {
    resize: vertical;
    min-height: 80px;
    font-family: inherit;
  }

  .nights-info {
    margin-top: var(--space-2);
    font-size: 0.875rem;
    color: var(--color-accent-light);
    font-weight: 500;
  }

  .rooms-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: var(--space-3);
    margin-top: var(--space-3);
  }

  .room-option {
    display: block;
    cursor: pointer;
    padding: var(--space-3);
    border: 2px solid var(--color-border);
    border-radius: var(--radius-md);
    transition: all var(--transition-fast);
    background: var(--color-bg-tertiary);
  }

  .room-option:hover {
    border-color: var(--color-accent);
  }

  .room-option.selected {
    border-color: var(--color-accent);
    background: rgba(99, 102, 241, 0.1);
    box-shadow: 0 0 0 1px var(--color-accent);
  }

  .room-option input[type="radio"] {
    display: none;
  }

  .room-option-content {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
  }

  .room-option-number {
    font-weight: 700;
    color: var(--color-text-primary);
  }

  .room-option-type {
    font-size: 0.75rem;
    color: var(--color-text-muted);
  }

  .room-option-price {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--color-accent-light);
  }

  .loading-rooms {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    padding: var(--space-4);
    color: var(--color-text-muted);
    font-size: 0.875rem;
  }

  .spinner {
    width: 20px;
    height: 20px;
    border: 2px solid var(--color-border);
    border-top-color: var(--color-accent);
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .no-rooms {
    padding: var(--space-4);
    text-align: center;
    color: var(--color-text-muted);
    font-size: 0.875rem;
  }

  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: var(--space-3);
    padding-top: var(--space-4);
  }

  .summary-sidebar {
    position: sticky;
    top: var(--space-6);
  }

  .summary-title {
    font-size: 1rem;
    font-weight: 600;
    color: var(--color-text-primary);
    margin-bottom: var(--space-4);
  }

  .summary-items {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
  }

  .summary-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.875rem;
  }

  .summary-divider {
    border-top: 1px solid var(--color-border);
    margin: var(--space-2) 0;
  }

  .summary-item.total {
    font-size: 1rem;
    font-weight: 600;
  }

  .total-price {
    font-size: 1.25rem;
    font-weight: 800;
    background: linear-gradient(135deg, var(--color-accent), var(--color-accent-light));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
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

  @media (max-width: 900px) {
    .reservation-form-layout {
      grid-template-columns: 1fr;
    }
    .summary-sidebar {
      position: static;
    }
  }
</style>
