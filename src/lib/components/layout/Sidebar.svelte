<script lang="ts">
	let {
		currentPath = '/'
	}: {
		currentPath?: string;
	} = $props();

	let collapsed = $state(false);

	const navItems = [
		{
			label: 'Dashboard',
			href: '/',
			icon: 'dashboard'
		},
		{
			label: 'Rooms',
			href: '/rooms',
			icon: 'rooms'
		},
		{
			label: 'Room Types',
			href: '/room-types',
			icon: 'room-types'
		},
		{
			label: 'Reservations',
			href: '/reservations',
			icon: 'reservations'
		},
		{
			label: 'Guests',
			href: '/guests',
			icon: 'guests'
		}
	];

	function isActive(href: string): boolean {
		if (href === '/') return currentPath === '/';
		return currentPath.startsWith(href);
	}

	function toggleSidebar() {
		collapsed = !collapsed;
	}
</script>

<!-- Mobile hamburger -->
<button class="sidebar-toggle" onclick={toggleSidebar} aria-label="Toggle navigation">
	<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
		{#if collapsed}
			<line x1="18" y1="6" x2="6" y2="18" />
			<line x1="6" y1="6" x2="18" y2="18" />
		{:else}
			<line x1="3" y1="6" x2="21" y2="6" />
			<line x1="3" y1="12" x2="21" y2="12" />
			<line x1="3" y1="18" x2="21" y2="18" />
		{/if}
	</svg>
</button>

{#if collapsed}
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="sidebar-overlay" onclick={toggleSidebar}></div>
{/if}

<aside class="sidebar" class:sidebar--open={collapsed}>
	<!-- Logo -->
	<div class="sidebar__logo">
		<div class="sidebar__logo-icon">
			<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
				<rect x="3" y="14" width="26" height="14" rx="2" fill="var(--color-primary, #6366f1)" opacity="0.9" />
				<path d="M6 14V8a2 2 0 012-2h4a2 2 0 012 2v6" stroke="var(--color-primary-light, #818cf8)" stroke-width="1.5" fill="none" />
				<path d="M18 14V8a2 2 0 012-2h4a2 2 0 012 2v6" stroke="var(--color-primary-light, #818cf8)" stroke-width="1.5" fill="none" />
				<rect x="12" y="19" width="8" height="9" rx="1" fill="var(--color-bg, #0f172a)" />
				<circle cx="18" cy="23.5" r="0.75" fill="var(--color-primary-light, #818cf8)" />
				<path d="M5 14h22" stroke="var(--color-primary-light, #818cf8)" stroke-width="1.5" />
				<path d="M8 5L16 2l8 3" stroke="var(--color-primary-light, #818cf8)" stroke-width="1.5" stroke-linecap="round" fill="none" />
			</svg>
		</div>
		<div class="sidebar__logo-text">
			<span class="sidebar__logo-name">Grand Hotel</span>
			<span class="sidebar__logo-tagline">Admin Dashboard</span>
		</div>
	</div>

	<!-- Navigation -->
	<nav class="sidebar__nav">
		{#each navItems as item}
			<a
				class="sidebar__link"
				class:sidebar__link--active={isActive(item.href)}
				href={item.href}
				onclick={() => { collapsed = false; }}
			>
				<span class="sidebar__link-icon">
					{#if item.icon === 'dashboard'}
						<svg viewBox="0 0 20 20" fill="currentColor">
							<path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
						</svg>
					{:else if item.icon === 'rooms'}
						<svg viewBox="0 0 20 20" fill="currentColor">
							<path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3 1a1 1 0 000 2h3a1 1 0 000-2H5zm0 4a1 1 0 000 2h3a1 1 0 000-2H5zm5-4a1 1 0 011-1h3a1 1 0 110 2h-3a1 1 0 01-1-1zm1 3a1 1 0 000 2h3a1 1 0 000-2h-3z" />
						</svg>
					{:else if item.icon === 'room-types'}
						<svg viewBox="0 0 20 20" fill="currentColor">
							<path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
						</svg>
					{:else if item.icon === 'reservations'}
						<svg viewBox="0 0 20 20" fill="currentColor">
							<path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
						</svg>
					{:else if item.icon === 'guests'}
						<svg viewBox="0 0 20 20" fill="currentColor">
							<path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
						</svg>
					{/if}
				</span>
				<span class="sidebar__link-label">{item.label}</span>
			</a>
		{/each}
	</nav>

	<!-- Bottom -->
	<div class="sidebar__footer">
		<div class="sidebar__version">
			<span class="sidebar__version-dot"></span>
			v1.0.0 — Hotel Admin
		</div>
	</div>
</aside>

<style>
	.sidebar {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 100;
		width: 260px;
		height: 100vh;
		display: flex;
		flex-direction: column;
		background: linear-gradient(
			180deg,
			var(--color-sidebar-bg-start, rgba(15, 23, 42, 0.97)) 0%,
			var(--color-sidebar-bg-end, rgba(15, 23, 42, 1)) 100%
		);
		border-right: 1px solid var(--color-border, rgba(255, 255, 255, 0.06));
		backdrop-filter: blur(16px);
		-webkit-backdrop-filter: blur(16px);
		transition: transform 0.3s ease;
	}

	/* Logo */
	.sidebar__logo {
		display: flex;
		align-items: center;
		gap: var(--space-3, 0.75rem);
		padding: var(--space-6, 1.5rem) var(--space-5, 1.25rem);
		border-bottom: 1px solid var(--color-border, rgba(255, 255, 255, 0.06));
	}

	.sidebar__logo-icon {
		width: 2.5rem;
		height: 2.5rem;
		flex-shrink: 0;
	}

	.sidebar__logo-icon svg {
		width: 100%;
		height: 100%;
	}

	.sidebar__logo-text {
		display: flex;
		flex-direction: column;
	}

	.sidebar__logo-name {
		font-size: 1.0625rem;
		font-weight: 800;
		color: var(--color-text-primary, #e2e8f0);
		letter-spacing: -0.01em;
		line-height: 1.2;
	}

	.sidebar__logo-tagline {
		font-size: 0.6875rem;
		color: var(--color-text-muted, rgba(148, 163, 184, 0.6));
		letter-spacing: 0.03em;
	}

	/* Navigation */
	.sidebar__nav {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: var(--space-1, 0.25rem);
		padding: var(--space-4, 1rem) var(--space-3, 0.75rem);
		overflow-y: auto;
	}

	.sidebar__link {
		display: flex;
		align-items: center;
		gap: var(--space-3, 0.75rem);
		padding: var(--space-3, 0.75rem) var(--space-4, 1rem);
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--color-text-secondary, #94a3b8);
		text-decoration: none;
		border-radius: var(--radius-md, 0.5rem);
		transition: all 0.15s ease;
	}

	.sidebar__link:hover {
		color: var(--color-text-primary, #e2e8f0);
		background: var(--color-surface-hover, rgba(255, 255, 255, 0.05));
	}

	.sidebar__link--active {
		color: var(--color-primary-light, #818cf8);
		background: var(--color-primary-bg, rgba(99, 102, 241, 0.1));
		font-weight: 600;
	}

	.sidebar__link--active:hover {
		color: var(--color-primary-light, #818cf8);
		background: var(--color-primary-bg-hover, rgba(99, 102, 241, 0.15));
	}

	.sidebar__link-icon {
		width: 1.25rem;
		height: 1.25rem;
		flex-shrink: 0;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.sidebar__link-icon svg {
		width: 100%;
		height: 100%;
	}

	.sidebar__link-label {
		line-height: 1;
	}

	/* Footer */
	.sidebar__footer {
		padding: var(--space-4, 1rem) var(--space-5, 1.25rem);
		border-top: 1px solid var(--color-border, rgba(255, 255, 255, 0.06));
	}

	.sidebar__version {
		display: flex;
		align-items: center;
		gap: var(--space-2, 0.5rem);
		font-size: 0.6875rem;
		color: var(--color-text-muted, rgba(148, 163, 184, 0.5));
	}

	.sidebar__version-dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: var(--color-success, #10b981);
		box-shadow: 0 0 6px var(--color-success, #10b981);
	}

	/* Mobile toggle */
	.sidebar-toggle {
		display: none;
		position: fixed;
		top: var(--space-4, 1rem);
		left: var(--space-4, 1rem);
		z-index: 150;
		width: 2.5rem;
		height: 2.5rem;
		align-items: center;
		justify-content: center;
		padding: 0;
		background: var(--color-surface, rgba(255, 255, 255, 0.1));
		backdrop-filter: blur(8px);
		border: 1px solid var(--color-border, rgba(255, 255, 255, 0.1));
		border-radius: var(--radius-md, 0.5rem);
		color: var(--color-text-primary, #e2e8f0);
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.sidebar-toggle svg {
		width: 1.25rem;
		height: 1.25rem;
	}

	.sidebar-overlay {
		display: none;
		position: fixed;
		inset: 0;
		z-index: 90;
		background: rgba(0, 0, 0, 0.5);
	}

	@media (max-width: 768px) {
		.sidebar {
			transform: translateX(-100%);
		}

		.sidebar--open {
			transform: translateX(0);
		}

		.sidebar-toggle {
			display: flex;
		}

		.sidebar-overlay {
			display: block;
		}
	}
</style>
