<script lang="ts">
	import { onMount } from 'svelte';
	import gsap from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';
	import { SplitText } from 'gsap/SplitText';
	import { setInstrumentFocus } from '$lib/stores/instrumentFocus';

	gsap.registerPlugin(ScrollTrigger, SplitText);

	const news: { meta: string; title: string; paragraphs: string[] }[] = [
		{
			meta: '2024–2025',
			title: 'Orchestra & Seatbelts live',
			paragraphs: [
				'Yoko Kanno continues to lead live performances with full orchestra and the Seatbelts band at major venues in Japan and abroad. Programs draw from the Cowboy Bebop and Macross Plus repertoire, alongside selections from Ghost in the Shell: Stand Alone Complex, The Vision of Escaflowne, and Turn A Gundam.',
				'The blend of big-band jazz, orchestral suites, and vocal numbers—often with original singers and instrumentalists—has become a staple of anime and film music events. Audiences can expect both classic cues and reimagined arrangements, with Kanno at the keyboard and as musical director.',
				'Tour dates and ticket information are announced through official channels and partner promoters. Past concerts have included the Yoko Kanno & the Seatbelts live series and special orchestra collaborations for anniversary celebrations.'
			]
		},
		{
			meta: 'Soundtrack',
			title: 'Anime & film scores',
			paragraphs: [
				'Kanno remains one of the most sought-after composers for anime and film, with new and recent works spanning action, drama, and science fiction. Her scores combine orchestral writing, electronic production, jazz rhythm sections, and vocal pieces in a way that has defined the sound of many landmark series.',
				'From Cowboy Bebop and Ghost in the Shell to Wolf\'s Rain, Darker than Black, and beyond, her music is known for its genre-hopping range and emotional depth. Film projects such as Kamikaze Girls (Shimotsuma Monogatari) and the Cowboy Bebop feature film have further showcased her ability to shape narrative through sound.',
				'High-profile productions continue to draw on her signature style: lush strings, intimate piano, driving percussion, and memorable themes that stand alone as well as within the picture. Fans and industry watchers keep an eye on upcoming announcements for new series and films.'
			]
		},
		{
			meta: 'Releases',
			title: 'OST & concert albums',
			paragraphs: [
				'Official soundtrack reissues and live concert recordings keep Kanno\'s catalog in wide circulation. Cowboy Bebop, Macross Plus, Turn A Gundam, The Vision of Escaflowne, and Ghost in the Shell: Stand Alone Complex are among the titles that have seen multiple CD and digital releases, including remasters and anniversary editions.',
				'Concert albums and Blu-ray releases capture full orchestra and Seatbelts performances, offering both studio-quality OST material and the energy of live arrangements. These releases are essential for collectors and for anyone discovering her work for the first time.',
				'New physical and digital editions are announced through record labels and official sites. Reissues often include previously unreleased tracks, liner notes, and updated artwork, making them worthwhile even for those who already own earlier pressings.'
			]
		},
		{
			meta: 'Collaborations',
			title: 'Session work & arrangements',
			paragraphs: [
				'Studio sessions with string soloists, jazz rhythm sections, and choir are a constant part of Kanno\'s workflow. Multiple scores are often in progress at once, with recording dates in Japan and occasionally overseas. The breadth of these sessions—from full orchestral dates to small combo and electronic overdubs—reflects the variety of her output.',
				'Beyond her own compositions, she frequently arranges and produces for other artists, contributing to pop, anime, and film projects. Her touch is recognizable in the orchestration, rhythm section writing, and overall production style, even when she is not the primary composer.',
				'Collaborators have included longtime Seatbelts members, session orchestras, and guest vocalists. This network of musicians has helped sustain the distinct sound of her projects across decades and genres.'
			]
		},
		{
			meta: 'Events',
			title: 'Premieres & special appearances',
			paragraphs: [
				'Premiere announcements, concert tours, and special appearances at anime and film music events are announced through official channels and event organisers. These range from dedicated Yoko Kanno / Seatbelts concerts to festival slots, convention panels, and screenings with live music.',
				'Anniversary years for titles such as Cowboy Bebop and Macross Plus often bring one-off concerts, re-releases, and commemorative events. Keeping an eye on social media, artist websites, and ticketing partners is the best way to stay informed about dates and venues.',
				'International appearances have included performances and talks in Asia, North America, and Europe. Ticket availability and on-sale dates vary by event; early registration or newsletter sign-up is recommended for high-demand shows.'
			]
		},
		{
			meta: 'Coming soon',
			title: 'New projects',
			paragraphs: [
				'New soundtracks and concert projects are regularly in development. Kanno has rarely paused for long between major works, and the pipeline typically includes anime, film, and live performance commitments. Official details—titles, artwork, release dates, and tour schedules—are shared when contracts and production timelines allow.',
				'Rumours and fan speculation often run ahead of announcements. The most reliable source of information remains official statements from studios, labels, and the artist\'s own channels. This page will be updated as new projects are confirmed.',
				'Past “coming soon” items have evolved into full OST releases, world tours, and long-running series. Checking back periodically ensures you don’t miss the next wave of news.'
			]
		}
	];

	let rootEl: HTMLElement | null = null;
	let headingEl: HTMLElement | null = null;
	let gridEl: HTMLElement | null = null;

	onMount(() => {
		setInstrumentFocus('cello');

		if (typeof window === 'undefined' || !rootEl || !headingEl || !gridEl) return;

		// Header: fade in and slide up when in view
		gsap.fromTo(
			headingEl,
			{ autoAlpha: 0, y: 40 },
			{
				autoAlpha: 1,
				y: 0,
				duration: 1,
				ease: 'power2.out',
				scrollTrigger: {
					trigger: headingEl,
					start: 'top 88%',
					toggleActions: 'play none none reverse'
				}
			}
		);

		// Cards: timeline per card = fade-in + SplitText (title chars, body words) on ScrollTrigger
		const cards = gridEl.querySelectorAll<HTMLElement>('.card');
		const splitInstances: SplitText[] = [];

		cards.forEach((card) => {
			const titleEl = card.querySelector<HTMLElement>('.card-title');
			const bodyEl = card.querySelector<HTMLElement>('.card-body');
			if (!titleEl) return;

			const splitTitle = SplitText.create(titleEl, { type: 'chars' });
			splitInstances.push(splitTitle);

			let allWords: HTMLElement[] = [];
			if (bodyEl) {
				const paragraphs = bodyEl.querySelectorAll<HTMLElement>('p');
				paragraphs.forEach((p) => {
					const split = SplitText.create(p, { type: 'words' });
					splitInstances.push(split);
					allWords = allWords.concat(Array.from(split.words) as HTMLElement[]);
				});
			}

			gsap.set([...splitTitle.chars, ...allWords], { opacity: 0, y: 10 });

			const tl = gsap.timeline({
				scrollTrigger: {
					trigger: card,
					start: 'top 92%',
					toggleActions: 'play none none reverse'
				}
			});

			tl.fromTo(
				card,
				{ autoAlpha: 0, y: 48 },
				{ autoAlpha: 1, y: 0, duration: 0.6, ease: 'power2.out' }
			)
				.to(splitTitle.chars, {
					opacity: 1,
					y: 0,
					duration: 0.4,
					stagger: 0.02,
					ease: 'power2.out'
				})
				.to(
					allWords,
					{
						opacity: 1,
						y: 0,
						duration: 0.35,
						stagger: 0.012,
						ease: 'power2.out'
					},
					'<0.15'
				);
		});

		const refreshTimeout = setTimeout(() => ScrollTrigger.refresh(), 200);
		return () => {
			clearTimeout(refreshTimeout);
			splitInstances.forEach((s) => s.revert());
			ScrollTrigger.getAll().forEach((st) => st.kill());
		};
	});
</script>

<section class="page" bind:this={rootEl}>
	<header class="heading" bind:this={headingEl}>
		<p class="eyebrow">News</p>
		<h1>Yoko Kanno — projects &amp; announcements</h1>
		<p class="intro">
			Premieres, concert dates, soundtrack releases, and special appearances. Stay up to date on her latest work.
		</p>
	</header>

	<div class="news-list" bind:this={gridEl}>
		{#each news as item}
			<article class="card">
				<p class="meta">{item.meta}</p>
				<h2 class="card-title">{item.title}</h2>
				<div class="card-body">
					{#each item.paragraphs as paragraph}
						<p>{paragraph}</p>
					{/each}
				</div>
			</article>
		{/each}
	</div>
</section>

<style>
	.page {
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

	.news-list {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.card {
		padding: 1.8rem 2rem;
		border-radius: 1rem;
		background: radial-gradient(circle at top, rgba(245, 193, 119, 0.15), rgba(9, 6, 5, 0.92));
		border: 1px solid rgba(245, 237, 224, 0.09);
		box-shadow: 0 18px 40px rgba(0, 0, 0, 0.78);
	}

	.card h2 {
		margin: 0.4rem 0 1rem;
		font-size: 1.25rem;
	}

	.card p {
		margin: 0 0 1rem;
		color: rgba(245, 237, 224, 0.86);
		line-height: 1.7;
	}

	.card p:last-child {
		margin-bottom: 0;
	}

	.meta {
		font-size: 0.78rem;
		text-transform: uppercase;
		letter-spacing: 0.18em;
		color: rgba(245, 237, 224, 0.6);
	}
</style>

