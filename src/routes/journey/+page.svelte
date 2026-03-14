<script lang="ts">
	import { onMount } from 'svelte';
	import { fadeInOnScroll } from '$lib/animations/scroll';
	import { setInstrumentFocus } from '$lib/stores/instrumentFocus';

	let rootEl: HTMLElement | null = null;

	const timeline: { year: string; title: string; description: string }[] = [
		{
			year: '1963',
			title: 'Born in Sendai',
			description:
				'Yoko Kanno was born on March 18 in Sendai, Miyagi Prefecture, Japan. She began musical training early—keyboard and piano at home, organ at kindergarten. Her parents initially allowed only classical music at home.'
		},
		{
			year: '1980s',
			title: 'Waseda & first compositions',
			description:
				'She attended Waseda University, majoring in literature, while transcribing music for student groups. A drummer friend introduced her to rhythm and popular music, sparking a lifelong fusion of classical and contemporary styles. Active as composer, arranger, and producer from 1985.'
		},
		{
			year: '1987',
			title: 'Nobunaga\'s Ambition & Tetsu 100%',
			description:
				'While still at university, game company Koei asked her to compose the soundtrack for Nobunaga\'s Ambition—it became a hit and launched her career in games. The same year she joined the band Tetsu 100%, balancing game work with live performance.'
		},
		{
			year: '1994',
			title: 'Macross Plus — anime breakthrough',
			description:
				'Her score for Macross Plus marked her breakthrough in anime. She left Koei to pursue independent work, establishing herself as a composer who could move freely between orchestral, electronic, and vocal styles.'
		},
		{
			year: '1996',
			title: 'The Vision of Escaflowne',
			description:
				'Composed the full score for The Vision of Escaflowne, blending fantasy, orchestral, and pop elements. The soundtrack became a landmark in anime music and expanded her international recognition.'
		},
		{
			year: '1998',
			title: 'Cowboy Bebop & Seatbelts',
			description:
				'Scored the iconic Cowboy Bebop and formed the band Seatbelts as keyboardist and frontwoman. The jazz, blues, and genre-hopping soundtrack defined the series and is celebrated worldwide.'
		},
		{
			year: '2002–2004',
			title: 'Ghost in the Shell & Wolf\'s Rain',
			description:
				'Composed for Ghost in the Shell: Stand Alone Complex and Wolf\'s Rain, further cementing her reputation as the international face of anime music—orchestral, electronic, and vocal work across multiple genres.'
		},
		{
			year: '2000s onward',
			title: 'Film, games & collaborations',
			description:
				'Continued scoring anime, film, TV, and games; collaborated with composer Hajime Mizoguchi on several soundtracks. Her style spans jazz, classical, orchestral, electronic, and countless fusions, with no single genre defining her.'
		}
	];

	onMount(() => {
		setInstrumentFocus('piano');
		fadeInOnScroll(rootEl);
	});
</script>

<section class="page" bind:this={rootEl}>
	<header class="heading" data-animate="fade-in-up">
		<p class="eyebrow">Journey</p>
		<h1>Your bridge to Yoko&apos;s studio.</h1>
		<p class="intro">
			For concert bookings, scoring enquiries, and creative collaborations, please reach out through
			the official management channels below.
		</p>
	</header>

	<div class="bio-section" data-animate="fade-in-up">
		<h2 class="bio-title">A life in sound</h2>
		<p class="bio-intro">
			Composer, arranger, and sound architect—from Sendai to Waseda, from games to anime to film.
			Here are some milestones along the way.
		</p>
		<div class="timeline">
			{#each timeline as card}
				<article class="timeline-card" data-animate="fade-in-up">
					<span class="card-year">{card.year}</span>
					<div class="card-body">
						<h3 class="card-title">{card.title}</h3>
						<p class="card-desc">{card.description}</p>
					</div>
				</article>
			{/each}
		</div>
	</div>

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

	.bio-section {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.bio-title {
		margin: 0;
		font-size: clamp(1.35rem, 1.5vw + 0.8rem, 1.65rem);
		color: rgba(245, 237, 224, 0.95);
	}

	.bio-intro {
		margin: 0;
		max-width: 40rem;
		color: rgba(245, 237, 224, 0.78);
		line-height: 1.65;
		font-size: 0.98rem;
	}

	.timeline {
		display: flex;
		flex-direction: column;
		gap: 1.2rem;
		position: relative;
		padding-left: 0.5rem;
		border-left: 2px solid rgba(245, 193, 119, 0.25);
		margin-left: 0.25rem;
	}

	.timeline-card {
		display: grid;
		grid-template-columns: 5.5rem minmax(0, 1fr);
		gap: 1.2rem;
		align-items: start;
		padding: 1.25rem 1.4rem;
		border-radius: 1rem;
		background: radial-gradient(circle at top, rgba(245, 193, 119, 0.12), rgba(9, 6, 5, 0.9));
		border: 1px solid rgba(245, 237, 224, 0.08);
		box-shadow: 0 12px 32px rgba(0, 0, 0, 0.6);
	}

	.card-year {
		font-size: 0.8rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.15em;
		color: rgba(245, 215, 162, 0.9);
		white-space: nowrap;
		padding-top: 0.15rem;
	}

	.card-body {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.card-title {
		margin: 0;
		font-size: 1.05rem;
		color: rgba(245, 237, 224, 0.95);
	}

	.card-desc {
		margin: 0;
		font-size: 0.9rem;
		line-height: 1.6;
		color: rgba(245, 237, 224, 0.78);
	}

	@media (max-width: 640px) {
		.timeline {
			padding-left: 0.35rem;
			margin-left: 0;
		}

		.timeline-card {
			grid-template-columns: 1fr;
			gap: 0.6rem;
		}

		.card-year {
			font-size: 0.75rem;
		}
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
