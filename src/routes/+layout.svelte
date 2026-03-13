<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import MusicRoom from '$lib/components/MusicRoom.svelte';
	import LogoYokoKanno from '$lib/components/LogoYokoKanno.svelte';
	import { page } from '$app/stores';
	import { setInstrumentFocus } from '$lib/stores/instrumentFocus';

	let { children } = $props();

	$effect(() => {
		const path = $page.url.pathname;

		if (path.startsWith('/personal-manager')) {
			setInstrumentFocus('piano');
		} else if (path.startsWith('/news')) {
			setInstrumentFocus('violin');
		} else if (path.startsWith('/works')) {
			setInstrumentFocus('guitar');
		} else if (path.startsWith('/photo-gallery')) {
			setInstrumentFocus('saxophone');
		} else if (path.startsWith('/discography')) {
			setInstrumentFocus('piano');
		} else if (path.startsWith('/live')) {
			setInstrumentFocus('drums');
		} else if (path.startsWith('/collaborations')) {
			setInstrumentFocus('saxophone');
		} else if (path.startsWith('/soundtracks')) {
			setInstrumentFocus('piano');
		} else if (path.startsWith('/contact')) {
			setInstrumentFocus('room');
		} else {
			setInstrumentFocus('room');
		}
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Yoko Kanno – Musical Universe</title>
</svelte:head>

<div class="app-root">
	<MusicRoom />

	<div class="overlay">
		<header class="top-bar">
			<a href="/" class="logo-wrap" aria-label="Yoko Kanno home">
				<LogoYokoKanno />
			</a>

			<nav class="main-nav" aria-label="Main navigation">
				<a href="/personal-manager">Personal Manager</a>
				<a href="/news">News</a>
				<a href="/works">Works</a>
				<a href="/photo-gallery">Photo Gallery</a>
				<a href="/discography">Discography</a>
				<a href="/live">Live Performances</a>
				<a href="/collaborations">Collaborations</a>
				<a href="/soundtracks">Soundtracks</a>
				<a href="/contact">Contact</a>
			</nav>
		</header>

		<main class="page-shell">
			{@render children()}
		</main>
	</div>
</div>

<style>
	:global(body) {
		margin: 0;
		font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
		background: radial-gradient(circle at top, #2b2117 0, #050405 55%, #000000 100%);
		color: #f5ede0;
		overflow-x: hidden;
	}

	.app-root {
		position: relative;
		min-height: 100vh;
		background: transparent;
		color: inherit;
	}

	.overlay {
		position: fixed;
		inset: 0;
		pointer-events: none;
		display: flex;
		flex-direction: column;
	}

	.top-bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1.2rem 3.5rem;
		backdrop-filter: blur(14px);
		background: linear-gradient(
			to bottom,
			rgba(9, 6, 5, 0.96),
			rgba(9, 6, 5, 0.88),
			transparent
		);
		border-bottom: 1px solid rgba(255, 255, 255, 0.04);
		pointer-events: auto;
		z-index: 10;
	}

	.logo-wrap {
		display: inline-flex;
		align-items: center;
		text-decoration: none;
		color: inherit;
	}

	.main-nav {
		display: flex;
		flex-wrap: wrap;
		gap: 1.2rem;
		font-size: 0.9rem;
		text-transform: uppercase;
		letter-spacing: 0.09em;
	}

	.main-nav a {
		position: relative;
		color: rgba(245, 237, 224, 0.82);
		text-decoration: none;
		padding-bottom: 0.2rem;
	}

	.main-nav a::after {
		content: '';
		position: absolute;
		left: 0;
		bottom: 0;
		width: 0%;
		height: 1px;
		background: linear-gradient(90deg, #f4d19a, #f58a3c);
		transition: width 0.25s ease-out;
	}

	.main-nav a:hover::after {
		width: 100%;
	}

	.page-shell {
		flex: 1;
		display: flex;
		align-items: flex-start;
		justify-content: center;
		padding: 7rem 3.5rem 3.5rem;
		pointer-events: auto;
	}

	@media (max-width: 900px) {
		.top-bar {
			padding-inline: 1.4rem;
			flex-direction: column;
			align-items: flex-start;
			gap: 0.75rem;
		}

		.page-shell {
			padding: 6.5rem 1.4rem 2.5rem;
		}

		.main-nav {
			row-gap: 0.4rem;
		}
	}
</style>
