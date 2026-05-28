<script lang="ts">
  import { enhance } from '$app/forms';
  import Header from '$lib/components/layout/Header.svelte';
  import Card from '$lib/components/ui/Card.svelte';
  import Badge from '$lib/components/ui/Badge.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import Modal from '$lib/components/ui/Modal.svelte';
  import Input from '$lib/components/ui/Input.svelte';
  import Select from '$lib/components/ui/Select.svelte';
  import { formatCurrency } from '$lib/utils/formatters';
  import { DEFAULT_AMENITIES, CURRENCIES } from '$lib/utils/constants';

  let { data, form } = $props();

  let showModal = $state(false);
  let editingType = $state<any>(null);
  let selectedAmenities = $state<string[]>([]);

  function openCreate() {
    editingType = null;
    selectedAmenities = [];
    showModal = true;
  }

  function openEdit(rt: any) {
    editingType = rt;
    selectedAmenities = [...(rt.amenities || [])];
    showModal = true;
  }

  function closeModal() {
    showModal = false;
    editingType = null;
    selectedAmenities = [];
  }

  function toggleAmenity(amenity: string) {
    if (selectedAmenities.includes(amenity)) {
      selectedAmenities = selectedAmenities.filter(a => a !== amenity);
    } else {
      selectedAmenities = [...selectedAmenities, amenity];
    }
  }
</script>

<svelte:head>
  <title>Room Types — Hotel Reservation System</title>
</svelte:head>

{#snippet actions()}
  <Button variant="primary" onclick={openCreate}>
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
    Add Room Type
  </Button>
{/snippet}

<Header title="Room Types" subtitle="Manage room categories and pricing" {actions} />

{#if form?.error}
  <div class="error-banner">{form.error}</div>
{/if}

<div class="type-grid">
  {#each data.roomTypes as rt, i}
    <div class="type-card glass-card animate-fade-in" style="animation-delay: {i * 80}ms">
      <div class="type-header">
        <div>
          <h3 class="type-name">{rt.name}</h3>
          <p class="type-desc">{rt.description || 'No description'}</p>
        </div>
        <div class="type-price">
          <span class="price-value">{formatCurrency(rt.basePricePerNight, rt.currency)}</span>
          <span class="price-label">/ night</span>
        </div>
      </div>

      <div class="type-meta">
        <div class="meta-item">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
          Up to {rt.capacity} guests
        </div>
        <div class="meta-item">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
          {rt.roomCount} rooms
        </div>
      </div>

      {#if rt.amenities && rt.amenities.length > 0}
        <div class="amenities">
          {#each rt.amenities.slice(0, 6) as amenity}
            <span class="amenity-tag">{amenity}</span>
          {/each}
          {#if rt.amenities.length > 6}
            <span class="amenity-tag more">+{rt.amenities.length - 6}</span>
          {/if}
        </div>
      {/if}

      <div class="type-actions">
        <button class="btn btn-ghost btn-sm" onclick={() => openEdit(rt)}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          Edit
        </button>
        <form method="POST" action="?/delete" use:enhance>
          <input type="hidden" name="id" value={rt.id} />
          <button type="submit" class="btn btn-ghost btn-sm" style="color: var(--color-danger)">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            Delete
          </button>
        </form>
      </div>
    </div>
  {/each}

  {#if data.roomTypes.length === 0}
    <div class="empty-state glass-card">
      <p class="text-muted">No room types yet. Create your first room type.</p>
    </div>
  {/if}
</div>

<Modal open={showModal} title={editingType ? `Edit ${editingType.name}` : 'Add New Room Type'} onclose={closeModal}>
  <form method="POST" action={editingType ? '?/update' : '?/create'} use:enhance={() => {
    return async ({ update }) => {
      await update();
      closeModal();
    };
  }}>
    {#if editingType}
      <input type="hidden" name="id" value={editingType.id} />
    {/if}

    <div class="form-stack">
      <Input label="Name" name="name" value={editingType?.name || ''} required placeholder="e.g. Deluxe Room" />
      <Input label="Description" name="description" value={editingType?.description || ''} placeholder="Room type description..." />

      <div class="form-row">
        <Input label="Capacity (guests)" name="capacity" type="number" value={editingType?.capacity?.toString() || ''} required placeholder="2" />
        <Input label="Price per Night" name="basePricePerNight" type="number" value={editingType?.basePricePerNight?.toString() || ''} required placeholder="200" />
        <Select label="Currency" name="currency" value={editingType?.currency || 'USD'} options={CURRENCIES} />
      </div>

      <div class="amenities-section">
        <label class="amenities-label">Amenities</label>
        <div class="amenities-grid">
          {#each DEFAULT_AMENITIES as amenity}
            <label class="amenity-checkbox">
              <input
                type="checkbox"
                name="amenities"
                value={amenity}
                checked={selectedAmenities.includes(amenity)}
                onchange={() => toggleAmenity(amenity)}
              />
              <span>{amenity}</span>
            </label>
          {/each}
        </div>
      </div>
    </div>

    <div class="modal-actions">
      <Button variant="ghost" onclick={closeModal}>Cancel</Button>
      <Button variant="primary" type="submit">{editingType ? 'Update' : 'Create'}</Button>
    </div>
  </form>
</Modal>

<style>
  .type-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
    gap: var(--space-6);
    margin-top: var(--space-2);
  }

  .type-card {
    padding: var(--space-6);
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  .type-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: var(--space-4);
  }

  .type-name {
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--color-text-primary);
    margin-bottom: var(--space-1);
  }

  .type-desc {
    font-size: 0.875rem;
    color: var(--color-text-muted);
    line-height: 1.5;
  }

  .type-price {
    text-align: right;
    flex-shrink: 0;
  }

  .price-value {
    display: block;
    font-size: 1.5rem;
    font-weight: 800;
    background: linear-gradient(135deg, var(--color-accent), var(--color-accent-light));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .price-label {
    font-size: 0.75rem;
    color: var(--color-text-muted);
  }

  .type-meta {
    display: flex;
    gap: var(--space-6);
  }

  .meta-item {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    font-size: 0.875rem;
    color: var(--color-text-secondary);
  }

  .amenities {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2);
  }

  .amenity-tag {
    padding: var(--space-1) var(--space-3);
    background: var(--color-bg-tertiary);
    border-radius: var(--radius-full);
    font-size: 0.75rem;
    color: var(--color-text-secondary);
    border: 1px solid var(--color-border);
  }

  .amenity-tag.more {
    background: var(--color-accent);
    color: white;
    border-color: transparent;
  }

  .type-actions {
    display: flex;
    gap: var(--space-2);
    padding-top: var(--space-3);
    border-top: 1px solid var(--color-border);
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

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: var(--space-4);
  }

  .amenities-section {
    margin-top: var(--space-2);
  }

  .amenities-label {
    display: block;
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--color-text-secondary);
    margin-bottom: var(--space-3);
  }

  .amenities-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-2);
  }

  .amenity-checkbox {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    font-size: 0.8125rem;
    color: var(--color-text-secondary);
    cursor: pointer;
    padding: var(--space-1) var(--space-2);
    border-radius: var(--radius-sm);
    transition: background var(--transition-fast);
  }

  .amenity-checkbox:hover {
    background: var(--color-bg-tertiary);
  }

  .amenity-checkbox input[type="checkbox"] {
    accent-color: var(--color-accent);
  }

  .modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: var(--space-3);
    padding-top: var(--space-4);
    border-top: 1px solid var(--color-border);
  }

  .empty-state {
    grid-column: 1 / -1;
    padding: var(--space-12);
    text-align: center;
  }
</style>
