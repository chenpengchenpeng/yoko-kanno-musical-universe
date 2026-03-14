<script lang="ts">
	import { onMount } from 'svelte';
	import gsap from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';
	import { SplitText } from 'gsap/SplitText';
	import { fadeInOnScroll, createFadeInScrollTimeline } from '$lib/animations/scroll';
	import { setInstrumentFocus } from '$lib/stores/instrumentFocus';

	gsap.registerPlugin(ScrollTrigger, SplitText);

	let rootEl: HTMLElement | null = null;

	const timeline: { year: string; title: string; description: string }[] = [
		{
			year: '1963',
			title: 'Born in Sendai',
			description:
				'Yoko Kanno was born on March 18 in Sendai, Miyagi Prefecture, Japan. She began musical training early—keyboard and piano at home, organ at kindergarten. Her parents initially allowed only classical music at home.'
		},
		{
			year: '1980',
			title: 'Waseda & first compositions',
			description:
				'She attended Waseda University, majoring in literature, while transcribing music for student groups. A drummer friend introduced her to rhythm and popular music, sparking a lifelong fusion of classical and contemporary styles. Active as composer, arranger, and producer from 1985.'
		},
		{
			year: '1987',
			title: "Nobunaga's Ambition & Tetsu 100%",
			description:
				"While still at university, game company Koei asked her to compose the soundtrack for Nobunaga's Ambition—it became a hit and launched her career in games. The same year she joined the band Tetsu 100%, balancing game work with live performance."
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
			year: '1999–2000',
			title: 'Turn A Gundam',
			description:
				'Composed the full soundtrack for Turn A Gundam, including multiple OST albums and the Turn A The Concert release. The score blended orchestral and electronic elements with the series\' distinctive tone.'
		},
		{
			year: '2001',
			title: 'Cowboy Bebop: Knockin\' on Heaven\'s Door',
			description:
				'Returned to the Bebop universe with the score for the feature film Cowboy Bebop: The Movie (Knockin\' on Heaven\'s Door), reuniting with Seatbelts and expanding the jazz-noir sound for the big screen.'
		},
		{
			year: '2002–2004',
			title: "Ghost in the Shell & Wolf's Rain",
			description:
				"Composed for Ghost in the Shell: Stand Alone Complex and Wolf's Rain, further cementing her reputation as the international face of anime music—orchestral, electronic, and vocal work across multiple genres."
		},
		{
			year: '2004',
			title: 'Kamikaze Girls',
			description:
				'Composed the soundtrack for the hit film Kamikaze Girls (Shimotsuma Monogatari), directed by Tetsuya Nakashima. The score blended 1960s–70s American punk influences with instrumental and vocal pieces that matched the film\'s distinctive style.'
		},
		{
			year: '2006–2007',
			title: 'Darker than Black',
			description:
				'Composed the score for the first season, Darker than Black (Kuro no Keiyakusha), bringing a moody, atmospheric sound to the supernatural action series. The sequel Gemini of the Meteor (2009) was scored by Yasushi Ishii.'
		},
		{
			year: '2009',
			title: 'Seatbelts first arena concert',
			description:
				'Led Seatbelts in their first large-scale live show, “Chō Jiku Tanabata Sonic” (Super Dimensional Tanabata Sonic), at Saitama Super Arena on 7 July. Over 150 performers took part, including May\'n, Maaya Sakamoto, ORIGA, and the Warsaw National Philharmonic, blending Bebop-era repertoire with Macross F and other works.'
		},
		{
			year: '2012',
			title: 'Kids on the Slope',
			description:
				'Composed the score for the jazz-themed anime Kids on the Slope (Sakamichi no Apollon), set in 1960s Japan. The soundtrack centered on piano and jazz ensemble, reflecting the story of young musicians.'
		},
		{
			year: '2014',
			title: 'Terror in Resonance',
			description:
				'Composed the score for Watanabe\'s Terror in Resonance (Zankyou no Terror). The soundtrack was recorded in Iceland and drew on its landscape and atmosphere; she also wrote and arranged the opening “Trigger” (Galileo Galilei) and the ending “Dareka, Umi wo.” (Aimer).'
		},
		{
			year: '2014',
			title: 'Space Dandy',
			description:
				'One of the contributors to Space Dandy (directed by Shinichirō Watanabe), which used a rotating “Space Dandy Band” of musicians per episode. She arranged the ending theme “X-Jigen e Youkoso” and contributed to the collaborative score alongside artists such as Taku Takahashi and KenKen.'
		},
		{
			year: '2015 onward',
			title: 'Film, games & live work',
			description:
				'Continued scoring anime, film, TV, and games; collaborated with composer Hajime Mizoguchi on several soundtracks. Her style spans jazz, classical, orchestral, electronic, and countless fusions, with no single genre defining her. Seatbelts and related projects continue to perform live.'
		}
	];

	onMount(() => {
		setInstrumentFocus('piano');
		fadeInOnScroll(rootEl);

		const timelines: gsap.core.Timeline[] = [];
		const splitInstances: SplitText[] = [];

		// Cards: one timeline per card = fadeIn (scroll.ts) + SplitText on same ScrollTrigger
		const cards = rootEl?.querySelectorAll<HTMLElement>('.timeline-card');
		cards?.forEach((card) => {
			const titleEl = card.querySelector<HTMLElement>('.card-title');
			const descEl = card.querySelector<HTMLElement>('.card-desc');
			if (!titleEl || !descEl) return;

			const splitTitle = SplitText.create(titleEl, { type: 'chars' });
			const splitDesc = SplitText.create(descEl, { type: 'words' });
			splitInstances.push(splitTitle, splitDesc);

			gsap.set([...splitTitle.chars, ...splitDesc.words], { opacity: 0, y: 8 });

			const tl = createFadeInScrollTimeline(card);
			timelines.push(tl);
			tl.to(splitTitle.chars, {
				opacity: 1,
				y: 0,
				duration: 0.4,
				stagger: 0.02,
				ease: 'power2.out'
			}).to(
				splitDesc.words,
				{
					opacity: 1,
					y: 0,
					duration: 0.35,
					stagger: 0.015,
					ease: 'power2.out'
				},
				'<0.2'
			);
			// '<' = 相对上一段开始; '<0.2' = title 开始后 0.2s 就开 desc（有重叠）
		});

		const refreshTimeout = setTimeout(() => ScrollTrigger.refresh(), 150);

		return () => {
			clearTimeout(refreshTimeout);
			timelines.forEach((t) => t.kill());
			splitInstances.forEach((s) => s.revert());
			ScrollTrigger.getAll().forEach((st) => {
				if (rootEl && st.trigger && rootEl.contains(st.trigger as Node)) st.kill();
			});
		};
	});
</script>

<section class="page" bind:this={rootEl}>
	<header class="heading" data-animate="fade-in-up">
		<p class="eyebrow">Journey</p>
		<h1>A life in sound</h1>
	</header>

	<div class="bio-section" data-animate="fade-in-up">
		<p class="bio-intro">
			Composer, arranger, and sound architect—from Sendai to Waseda, from games to anime to film.
			Here are some milestones along the way.
		</p>
		<div class="timeline">
			{#each timeline as card}
				<article class="timeline-card">
					<span class="card-year">{card.year}</span>
					<div class="card-body">
						<h3 class="card-title">{card.title}</h3>
						<p class="card-desc">{card.description}</p>
					</div>
				</article>
			{/each}
		</div>
	</div>
</section>

<style>
	.page {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 2.4rem;
		padding-bottom: 5vh;
	}

	.heading h1 {
		margin: 0.5rem 0 0;
		font-size: clamp(1.9rem, 2.2vw + 1rem, 2.6rem);
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
		display: flex;
		flex-direction: column;
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
</style>
