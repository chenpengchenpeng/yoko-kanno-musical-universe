<script lang="ts">
	import { onMount } from 'svelte';
	import { fadeInOnScroll } from '$lib/animations/scroll';
	import { setInstrumentFocus } from '$lib/stores/instrumentFocus';

	let rootEl: HTMLElement | null = null;

	onMount(() => {
		setInstrumentFocus('drums');
		fadeInOnScroll(rootEl);
	});
</script>

<section class="page" bind:this={rootEl}>
	<header class="heading" data-animate="fade-in-up">
		<p class="eyebrow">Live Performances</p>
		<h1>Concerts, tours, and special stages.</h1>
		<p class="intro">
			Use this space to announce symphonic concerts, festival dates, and one‑off collaborations with
			ensembles around the world.
		</p>
	</header>

	<div class="placeholder" data-animate="fade-in-up">
		<p>No dates are listed yet. When you&apos;re ready, add upcoming shows and ticket links here.</p>
	</div>
</section>

<style>
	.page {
		max-width: 960px;
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 2.4rem;
	}

	.eyebrow {
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 0.2em;
		color: rgba(245, 215, 162, 0.88);
	}

	.heading h1 {
		margin: 0.5rem 0 0.9rem;
		font-size: clamp(1.9rem, 2.2vw + 1rem, 2.5rem);
	}

	.heading .intro {
		max-width: 36rem;
		color: rgba(245, 237, 224, 0.8);
		line-height: 1.7;
	}

	.placeholder {
		padding: 1.5rem 1.6rem;
		border-radius: 1rem;
		background: radial-gradient(circle at top, rgba(245, 193, 119, 0.16), rgba(9, 6, 5, 0.96));
		border: 1px dashed rgba(245, 237, 224, 0.25);
		color: rgba(245, 237, 224, 0.86);
		line-height: 1.7;
	}
</style>

