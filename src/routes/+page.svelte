<script lang="ts">
	import { onMount } from 'svelte';
	import { fadeInOnScroll } from '$lib/animations/scroll';
	import { setInstrumentFocus } from '$lib/stores/instrumentFocus';

	let rootEl: HTMLElement | null = null;

	onMount(() => {
		setInstrumentFocus('room');
		fadeInOnScroll(rootEl);
	});
</script>

<section class="hero" bind:this={rootEl}>
	<div class="hero-copy" data-animate="fade-in-up">
		<p class="eyebrow">Composer / Arranger / Sound Architect</p>
		<h1>Welcome to Yoko Kanno&apos;s musical universe.</h1>
		<p class="lead">
			Step into a studio between worlds: where classical orchestration, jazz improvisation, and
			electronic galaxies collide.
		</p>

		<div class="cta-row" data-animate="fade-in-up">
			<a class="cta primary" href="/works">Explore works</a>
			<a class="cta ghost" href="/news">Latest news</a>
		</div>
	</div>

	<div class="hero-notes" data-animate="fade-in-up">
		<div class="card">
			<h2>Symphonies of story</h2>
			<p>
				From intimate piano sketches to full big-band explosions, each project is a new
				constellation of sound.
			</p>
		</div>
		<div class="card">
			<h2>Soundtracks that linger</h2>
			<p>
				Melodies woven into memory for anime, film, and games across generations of listeners.
			</p>
		</div>
	</div>
</section>

<style>
	.hero {
		max-width: 1120px;
		width: 100%;
		display: grid;
		grid-template-columns: minmax(0, 2.1fr) minmax(0, 1.6fr);
		gap: 3.5rem;
		background: radial-gradient(circle at top left, rgba(245, 193, 119, 0.14), transparent 55%);
		color: inherit;
	}

	.hero-copy h1 {
		font-size: clamp(2.4rem, 3.2vw + 1.1rem, 3.5rem);
		line-height: 1.03;
		margin: 0.4rem 0 1rem;
	}

	.hero-copy .lead {
		max-width: 34rem;
		font-size: 1rem;
		line-height: 1.7;
		color: rgba(245, 237, 224, 0.78);
	}

	.eyebrow {
		font-size: 0.82rem;
		text-transform: uppercase;
		letter-spacing: 0.22em;
		color: rgba(245, 215, 162, 0.9);
	}

	.cta-row {
		margin-top: 1.8rem;
		display: flex;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.cta {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0.75rem 1.6rem;
		border-radius: 999px;
		font-size: 0.9rem;
		text-transform: uppercase;
		letter-spacing: 0.18em;
		text-decoration: none;
		border: 1px solid transparent;
		cursor: pointer;
	}

	.cta.primary {
		background: radial-gradient(circle at top left, #f5d7a2, #f58a3c);
		color: #1a100a;
		box-shadow: 0 14px 34px rgba(0, 0, 0, 0.65);
	}

	.cta.ghost {
		background: transparent;
		color: rgba(245, 237, 224, 0.86);
		border-color: rgba(245, 237, 224, 0.35);
	}

	.cta.primary:hover {
		filter: brightness(1.05);
		transform: translateY(-1px);
	}

	.cta.ghost:hover {
		background: rgba(245, 237, 224, 0.04);
	}

	.hero-notes {
		display: grid;
		gap: 1.4rem;
		align-content: flex-start;
	}

	.card {
		padding: 1.2rem 1.4rem;
		border-radius: 1rem;
		background: radial-gradient(circle at top, rgba(245, 193, 119, 0.12), rgba(9, 6, 5, 0.9));
		border: 1px solid rgba(245, 237, 224, 0.08);
		box-shadow: 0 18px 40px rgba(0, 0, 0, 0.76);
	}

	.card h2 {
		font-size: 1rem;
		margin: 0 0 0.45rem;
	}

	.card p {
		margin: 0;
		font-size: 0.9rem;
		line-height: 1.6;
		color: rgba(245, 237, 224, 0.8);
	}

	@media (max-width: 900px) {
		.hero {
			grid-template-columns: minmax(0, 1fr);
			gap: 2.5rem;
		}
	}
</style>
