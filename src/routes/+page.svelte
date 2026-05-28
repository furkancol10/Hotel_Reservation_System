<script lang="ts">
  import Header from '$lib/components/layout/Header.svelte';
  import StatCard from '$lib/components/dashboard/StatCard.svelte';
  import Badge from '$lib/components/ui/Badge.svelte';
  import Card from '$lib/components/ui/Card.svelte';
  import { formatCurrency, formatDate, timeAgo } from '$lib/utils/formatters';
  import { RESERVATION_STATUS_MAP } from '$lib/utils/constants';

  let { data } = $props();

  const stats = $derived([
    {
      label: 'Total Rooms',
      value: data.roomStats?.total ?? 0,
      icon: 'rooms' as const,
      color: 'indigo' as const,
      trend: undefined,
    },
    {
      label: 'Occupancy Rate',
      value: data.roomStats?.occupancyRate ?? 0,
      icon: 'occupancy' as const,
      color: 'emerald' as const,
      trend: 12,
    },
    {
      label: 'Active Reservations',
      value: data.reservationStats?.active ?? 0,
      icon: 'reservations' as const,
      color: 'amber' as const,
      trend: undefined,
    },
    {
      label: 'Monthly Revenue',
      value: data.reservationStats?.monthlyRevenue ?? 0,
      icon: 'revenue' as const,
      color: 'rose' as const,
      trend: 8,
    },
  ]);
</script>

<svelte:head>
  <title>Dashboard — Hotel Reservation System</title>
</svelte:head>

<Header title="Dashboard" subtitle="Welcome back! Here's your hotel overview." />

<div class="stat-grid animate-fade-in">
  {#each stats as stat, i}
    <div class="stagger-{i + 1}">
      <StatCard
        label={stat.label}
        value={stat.icon === 'revenue' ? formatCurrency(stat.value) : stat.icon === 'occupancy' ? `${stat.value}%` : String(stat.value)}
        icon={stat.icon}
        color={stat.color}
        trend={stat.trend}
      />
    </div>
  {/each}
</div>

<div class="dashboard-grid">
  <Card padding="lg">
    <div class="section-header">
      <h2>Recent Reservations</h2>
      <a href="/reservations" class="btn btn-ghost btn-sm">View All →</a>
    </div>

    {#if data.recentReservations.length === 0}
      <div class="empty-state">
        <p class="text-muted">No reservations yet.</p>
      </div>
    {:else}
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Guest</th>
              <th>Room</th>
              <th>Check-in</th>
              <th>Status</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {#each data.recentReservations as reservation}
              <tr>
                <td>
                  <div class="guest-cell">
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
                <td>
                  <div>{formatDate(reservation.checkIn, 'short')}</div>
                  <div class="text-sm text-muted">{timeAgo(reservation.createdAt)}</div>
                </td>
                <td>
                  <Badge
                    variant={RESERVATION_STATUS_MAP[reservation.status]?.variant || 'neutral'}
                    label={RESERVATION_STATUS_MAP[reservation.status]?.label || reservation.status}
                  />
                </td>
                <td>
                  <span class="font-semibold">{formatCurrency(reservation.totalPrice, reservation.currency)}</span>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/if}
  </Card>

  <div class="side-cards">
    <Card padding="md">
      <h3 class="card-title">Room Status</h3>
      <div class="room-stats">
        <div class="room-stat">
          <div class="room-stat-bar" style="--pct: {data.roomStats ? (data.roomStats.available / data.roomStats.total * 100) : 0}%; --bar-color: var(--color-success)"></div>
          <div class="room-stat-info">
            <span class="text-sm text-muted">Available</span>
            <span class="font-semibold text-success">{data.roomStats?.available ?? 0}</span>
          </div>
        </div>
        <div class="room-stat">
          <div class="room-stat-bar" style="--pct: {data.roomStats ? (data.roomStats.occupied / data.roomStats.total * 100) : 0}%; --bar-color: var(--color-danger)"></div>
          <div class="room-stat-info">
            <span class="text-sm text-muted">Occupied</span>
            <span class="font-semibold text-danger">{data.roomStats?.occupied ?? 0}</span>
          </div>
        </div>
        <div class="room-stat">
          <div class="room-stat-bar" style="--pct: {data.roomStats ? (data.roomStats.maintenance / data.roomStats.total * 100) : 0}%; --bar-color: var(--color-warning)"></div>
          <div class="room-stat-info">
            <span class="text-sm text-muted">Maintenance</span>
            <span class="font-semibold text-warning">{data.roomStats?.maintenance ?? 0}</span>
          </div>
        </div>
      </div>
    </Card>

    <Card padding="md">
      <h3 class="card-title">Quick Actions</h3>
      <div class="quick-actions">
        <a href="/reservations/new" class="quick-action-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="12" y1="14" x2="12" y2="18"/><line x1="10" y1="16" x2="14" y2="16"/></svg>
          New Reservation
        </a>
        <a href="/rooms" class="quick-action-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          Manage Rooms
        </a>
        <a href="/guests" class="quick-action-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          View Guests
        </a>
      </div>
    </Card>
  </div>
</div>

<style>
  .dashboard-grid {
    display: grid;
    grid-template-columns: 1fr 380px;
    gap: var(--space-6);
    margin-top: var(--space-6);
  }

  .side-cards {
    display: flex;
    flex-direction: column;
    gap: var(--space-6);
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--space-4);
  }

  .section-header h2 {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--color-text-primary);
  }

  .guest-cell {
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

  .card-title {
    font-size: 1rem;
    font-weight: 600;
    color: var(--color-text-primary);
    margin-bottom: var(--space-4);
  }

  .room-stats {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  .room-stat {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  .room-stat-bar {
    height: 8px;
    border-radius: 4px;
    background: var(--color-bg-tertiary);
    position: relative;
    overflow: hidden;
  }

  .room-stat-bar::after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: var(--pct);
    background: var(--bar-color);
    border-radius: 4px;
    transition: width 1s ease-out;
  }

  .room-stat-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .quick-actions {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  .quick-action-btn {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    padding: var(--space-3) var(--space-4);
    border-radius: var(--radius-md);
    color: var(--color-text-secondary);
    text-decoration: none;
    transition: all var(--transition-fast);
    font-size: 0.875rem;
    font-weight: 500;
  }

  .quick-action-btn:hover {
    background: var(--color-bg-tertiary);
    color: var(--color-accent-light);
    transform: translateX(4px);
  }

  .text-success { color: var(--color-success); }
  .text-danger { color: var(--color-danger); }
  .text-warning { color: var(--color-warning); }

  @media (max-width: 1200px) {
    .dashboard-grid {
      grid-template-columns: 1fr;
    }
    .side-cards {
      flex-direction: row;
    }
    .side-cards > :global(*) {
      flex: 1;
    }
  }

  @media (max-width: 768px) {
    .side-cards {
      flex-direction: column;
    }
  }
</style>
