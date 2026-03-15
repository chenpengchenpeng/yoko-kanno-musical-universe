<script lang="ts">
	import { onMount } from 'svelte';
	import { fadeInOnScroll } from '$lib/animations/scroll';
	import { setInstrumentFocus } from '$lib/stores/instrumentFocus';

	let rootEl: HTMLElement | null = null;

	onMount(() => {
		setInstrumentFocus('cello');
		fadeInOnScroll(rootEl);
	});
</script>

<section class="page" bind:this={rootEl}>
	<header class="heading" data-animate="fade-in-up">
		<p class="eyebrow">News</p>
		<h1>Current projects &amp; announcements.</h1>
		<p class="intro">
			Stay up to date on premieres, concert dates, soundtrack releases, and special appearances.
		</p>
	</header>

	<div class="news-grid">
		<article class="card" data-animate="fade-in-up">
			<p class="meta">Coming soon</p>
			<h2>New soundtrack</h2>
			<p>
				A new universe of sound is in production. Check back soon for official details, artwork,
				and release dates.
			</p>
		</article>

		<article class="card" data-animate="fade-in-up">
			<p class="meta">Ongoing</p>
			<h2>Recording sessions</h2>
			<p>
				Studio sessions with string soloists, jazz rhythm sections, and choir are currently underway
				for multiple upcoming scores.
			</p>
		</article>
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

	.news-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
		gap: 1.8rem;
	}

	.card {
		padding: 1.4rem 1.5rem;
		border-radius: 1rem;
		background: radial-gradient(circle at top, rgba(245, 193, 119, 0.15), rgba(9, 6, 5, 0.92));
		border: 1px solid rgba(245, 237, 224, 0.09);
		box-shadow: 0 18px 40px rgba(0, 0, 0, 0.78);
	}

	.card h2 {
		margin: 0.4rem 0 0.7rem;
		font-size: 1.1rem;
	}

	.card p {
		margin: 0;
		color: rgba(245, 237, 224, 0.86);
		line-height: 1.6;
	}

	.meta {
		font-size: 0.78rem;
		text-transform: uppercase;
		letter-spacing: 0.18em;
		color: rgba(245, 237, 224, 0.6);
	}
</style>

