<script lang="ts">
	import { onMount } from 'svelte';
	import { fadeInOnScroll } from '$lib/animations/scroll';
	import { setInstrumentFocus } from '$lib/stores/instrumentFocus';

	let rootEl: HTMLElement | null = null;

	onMount(() => {
		setInstrumentFocus('saxophone');
		fadeInOnScroll(rootEl);
	});
</script>

<section class="page" bind:this={rootEl}>
	<header class="heading" data-animate="fade-in-up">
		<p class="eyebrow">Photo Gallery</p>
		<h1>Moments from the studio &amp; stage.</h1>
		<p class="intro">
			An intimate look behind the scores: rehearsals, studio sessions, orchestras, and quiet corners
			of composition.
		</p>
	</header>

	<div class="grid">
		{#each Array(6) as _, index}
			<figure class="frame" data-animate="fade-in-up">
				<div class="placeholder">
					<span>Image {index + 1}</span>
				</div>
				<figcaption>Upcoming photo from the archives.</figcaption>
			</figure>
		{/each}
	</div>
</section>

<style>
	.page {
		max-width: 1040px;
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

	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
		gap: 1.6rem;
	}

	.frame {
		margin: 0;
	}

	.placeholder {
		position: relative;
		border-radius: 1rem;
		aspect-ratio: 4 / 3;
		background:
			radial-gradient(circle at top left, rgba(245, 193, 119, 0.26), transparent 60%),
			radial-gradient(circle at bottom right, rgba(56, 35, 26, 0.9), rgba(5, 4, 5, 0.96));
		border: 1px solid rgba(245, 237, 224, 0.12);
		display: flex;
		align-items: flex-end;
		justify-content: flex-start;
		padding: 0.7rem 0.9rem;
		box-shadow: 0 18px 40px rgba(0, 0, 0, 0.86);
	}

	.placeholder span {
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 0.14em;
		color: rgba(245, 237, 224, 0.8);
	}

	figcaption {
		margin-top: 0.4rem;
		font-size: 0.8rem;
		color: rgba(245, 237, 224, 0.7);
	}
</style>

