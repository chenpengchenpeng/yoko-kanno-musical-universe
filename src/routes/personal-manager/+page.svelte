<script lang="ts">
	import { onMount } from 'svelte';
	import { fadeInOnScroll } from '$lib/animations/scroll';
	import { setInstrumentFocus } from '$lib/stores/instrumentFocus';

	let rootEl: HTMLElement | null = null;

	onMount(() => {
		setInstrumentFocus('piano');
		fadeInOnScroll(rootEl);
	});
</script>

<section class="page" bind:this={rootEl}>
	<header class="heading" data-animate="fade-in-up">
		<p class="eyebrow">Personal Manager</p>
		<h1>Your bridge to Yoko&apos;s studio.</h1>
		<p class="intro">
			For concert bookings, scoring enquiries, and creative collaborations, please reach out through
			the official management channels below.
		</p>
	</header>

	<div class="columns">
		<div class="panel" data-animate="fade-in-up">
			<h2>Representation</h2>
			<ul>
				<li>
					<span class="label">Live performances</span>
					<span class="value">Tour &amp; festival coordination</span>
				</li>
				<li>
					<span class="label">Scoring &amp; commissions</span>
					<span class="value">Anime, film, TV, game, and installation projects</span>
				</li>
				<li>
					<span class="label">Brand collaborations</span>
					<span class="value">Curated partnerships and special appearances</span>
				</li>
			</ul>
		</div>

		<div class="panel emphasis" data-animate="fade-in-up">
			<h2>Send a proposal</h2>
			<p>Share project details, timelines, and musical references to open a conversation.</p>
			<a class="cta" href="/contact">Open contact form</a>
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

	.heading h1 {
		margin: 0.5rem 0 0.9rem;
		font-size: clamp(1.9rem, 2.2vw + 1rem, 2.6rem);
	}

	.heading .intro {
		max-width: 36rem;
		color: rgba(245, 237, 224, 0.8);
		line-height: 1.7;
	}

	.eyebrow {
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 0.2em;
		color: rgba(245, 215, 162, 0.88);
	}

	.columns {
		display: grid;
		grid-template-columns: minmax(0, 1.7fr) minmax(0, 1.1fr);
		gap: 1.8rem;
	}

	.panel {
		padding: 1.4rem 1.6rem;
		border-radius: 1.1rem;
		background: radial-gradient(circle at top, rgba(245, 193, 119, 0.16), rgba(9, 6, 5, 0.92));
		border: 1px solid rgba(245, 237, 224, 0.09);
		box-shadow: 0 18px 40px rgba(0, 0, 0, 0.78);
	}

	.panel h2 {
		margin: 0 0 0.9rem;
		font-size: 1.1rem;
	}

	.panel ul {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 0.85rem;
	}

	.label {
		display: block;
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 0.18em;
		color: rgba(245, 237, 224, 0.65);
		margin-bottom: 0.18rem;
	}

	.value {
		font-size: 0.95rem;
		color: rgba(245, 237, 224, 0.9);
	}

	.panel.emphasis {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		background: radial-gradient(circle at top left, rgba(245, 193, 119, 0.26), rgba(9, 6, 5, 0.96));
	}

	.panel.emphasis p {
		margin: 0 0 1.2rem;
		color: rgba(245, 237, 224, 0.86);
	}

	.cta {
		align-self: flex-start;
		padding: 0.7rem 1.4rem;
		border-radius: 999px;
		text-decoration: none;
		text-transform: uppercase;
		letter-spacing: 0.18em;
		font-size: 0.85rem;
		background: radial-gradient(circle at top left, #f5d7a2, #f58a3c);
		color: #1a100a;
	}

	@media (max-width: 900px) {
		.columns {
			grid-template-columns: minmax(0, 1fr);
		}
	}
</style>

