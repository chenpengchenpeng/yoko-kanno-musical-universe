<script lang="ts">
	import { onMount } from 'svelte';
	import gsap from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';
	import { ScrollSmoother } from 'gsap/ScrollSmoother';
	import favicon from '$lib/assets/favicon.svg';
	import MusicRoom from '$lib/components/MusicRoom.svelte';
	import LogoYokoKanno from '$lib/components/LogoYokoKanno.svelte';
	import { page } from '$app/stores';
	import { setInstrumentFocus } from '$lib/stores/instrumentFocus';

	gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

	let { children } = $props();
	let headerHidden = $state(false);
	let lastScrollY = 0;
	const scrollThreshold = 120;
	onMount(() => {
		const createSmoother = () => {
			window.scrollTo(0, 0);
			try {
				ScrollSmoother.create({
					wrapper: '#smooth-wrapper',
					content: '#smooth-content',
					smooth: 1,
					effects: true,
					smoothTouch: 0.1
				});
			} catch (_) {
				// If create fails (e.g. ScrollTrigger not ready), page still works without smooth scroll
			}
		};
		requestAnimationFrame(() => {
			requestAnimationFrame(createSmoother);
		});

		const handleScroll = () => {
			const y = window.scrollY;
			if (y > lastScrollY && y > scrollThreshold) {
				headerHidden = true;
			} else if (y < lastScrollY) {
				headerHidden = false;
			}
			lastScrollY = y;
		};
		window.addEventListener('scroll', handleScroll, { passive: true });
		return () => {
			window.removeEventListener('scroll', handleScroll);
			const smoother = ScrollSmoother.get();
			if (smoother) smoother.kill();
		};
	});

	$effect(() => {
		const path = $page.url.pathname;
		// Refresh scroll length when route/content changes (only when DOM and ScrollSmoother are ready)
		const t = setTimeout(() => {
			if (typeof window === 'undefined') return;
			const wrapper = document.getElementById('smooth-wrapper');
			if (!wrapper) return;
			try {
				ScrollTrigger.refresh();
			} catch (_) {
				// Guard: avoid "reading 'end' of undefined" when refresh runs before triggers are ready
			}
		}, 100);

		if (path.startsWith('/journey')) {
			setInstrumentFocus('piano');
		} else if (path.startsWith('/news')) {
			setInstrumentFocus('cello');
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

		return () => clearTimeout(t);
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Yoko Kanno – Musical Universe</title>
</svelte:head>

<div class="app-root">
	<MusicRoom />

	<div class="overlay">
		<header class="top-bar" class:hidden={headerHidden}>
			<a href="/" class="logo-wrap" aria-label="Yoko Kanno home">
				<LogoYokoKanno />
			</a>

			<nav class="main-nav" aria-label="Main navigation">
				<a href="/journey">Journey</a>
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

		<div id="smooth-wrapper" class="smooth-wrapper">
			<div id="smooth-content" class="smooth-content">
				<main class="page-shell">
					{@render children()}
				</main>
			</div>
		</div>
	</div>
</div>

<style>
	:global(body) {
		margin: 0;
		font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
		background: radial-gradient(circle at top, #2b2117 0, #050405 55%, #000000 100%);
		color: #f5ede0;
		overflow-x: hidden;
		scrollbar-width: thin;
		scrollbar-color: #f58a3c #2b2117;
	}

	:global(::-webkit-scrollbar) {
		width: 10px;
		height: 10px;
	}

	:global(::-webkit-scrollbar-track) {
		background: #2b2117;
	}

	:global(::-webkit-scrollbar-thumb) {
		background: #f58a3c;
	}

	:global(::-webkit-scrollbar-corner) {
		background: #2b2117;
	}

	.app-root {
		position: relative;
		min-height: 100vh;
		background: transparent;
		color: inherit;
	}

	.overlay {
		position: relative;
		min-height: 100vh;
		pointer-events: none;
	}

	.smooth-wrapper {
		position: relative;
	}

	.smooth-content {
		position: relative;
	}

	.top-bar {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.6rem 2.5rem;
		background: linear-gradient(
			to bottom,
			rgba(9, 6, 5, 0.65),
			rgba(9, 6, 5, 0.5),
			transparent
		);
		border-bottom: 1px solid rgba(255, 255, 255, 0.06);
		pointer-events: auto;
		z-index: 10;
		transition: transform 0.3s ease-out;
		transform: translateZ(0);
		backface-visibility: hidden;
	}

	.top-bar.hidden {
		transform: translateY(-100%) translateZ(0);
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
		gap: 0.9rem;
		font-size: 0.8rem;
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
		display: flex;
		align-items: flex-start;
		justify-content: center;
		padding: 4.5rem 2.5rem 2.5rem;
		pointer-events: auto;
	}

	@media (max-width: 900px) {
		.top-bar {
			padding: 0.5rem 1.2rem;
			flex-direction: column;
			align-items: flex-start;
			gap: 0.5rem;
		}

		.page-shell {
			padding: 4rem 1.2rem 2rem;
		}

		.main-nav {
			row-gap: 0.35rem;
		}
	}
</style>
