<script lang="ts">
	import { onMount } from 'svelte';
	import { fadeInOnScroll } from '$lib/animations/scroll';
	import { setInstrumentFocus } from '$lib/stores/instrumentFocus';

	let rootEl: HTMLElement | null = null;

	onMount(() => {
		setInstrumentFocus('guitar');
		fadeInOnScroll(rootEl);
	});
</script>

<section class="page" bind:this={rootEl}>
	<header class="heading" data-animate="fade-in-up">
		<p class="eyebrow">Works</p>
		<h1>Selected musical universes.</h1>
		<p class="intro">
			A constellation of scores spanning anime, film, television, games, and concert works. This is a
			curated snapshot; a full discography lives in the Discography section.
		</p>
	</header>

	<div class="works-grid">
		<div class="column">
			<h2 data-animate="fade-in-up">Anime &amp; series</h2>
			<ul>
				<li data-animate="fade-in-up">Spacefaring jazz, noir, and trip-hop hybrids.</li>
				<li data-animate="fade-in-up">Expansive orchestral textures for sci‑fi worlds.</li>
				<li data-animate="fade-in-up">Intimate piano themes for character-driven dramas.</li>
			</ul>
		</div>

		<div class="column">
			<h2 data-animate="fade-in-up">Film &amp; beyond</h2>
			<ul>
				<li data-animate="fade-in-up">Hybrid scores blending chamber ensembles with electronics.</li>
				<li data-animate="fade-in-up">Jazz big band explosions for high‑energy set pieces.</li>
				<li data-animate="fade-in-up">Choral, vocal, and experimental sound design projects.</li>
			</ul>
		</div>
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

	.works-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
		gap: 1.8rem;
	}

	.column h2 {
		margin: 0 0 0.9rem;
		font-size: 1.05rem;
	}

	.column ul {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 0.8rem;
	}

	.column li {
		font-size: 0.95rem;
		color: rgba(245, 237, 224, 0.86);
		line-height: 1.6;
		position: relative;
		padding-left: 1.1rem;
	}

	.column li::before {
		content: '';
		position: absolute;
		left: 0;
		top: 0.45rem;
		width: 0.45rem;
		height: 0.45rem;
		border-radius: 999px;
		background: radial-gradient(circle, #f5d7a2, #f58a3c);
	}
</style>

