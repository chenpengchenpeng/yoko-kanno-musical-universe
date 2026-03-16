<script lang="ts">
	import { onMount } from 'svelte';
	import { fadeInOnScroll } from '$lib/animations/scroll';
	import { setInstrumentFocus } from '$lib/stores/instrumentFocus';

	const defaultAlbumImage = '/images/works/placeholder.svg';

	type Album = {
		title: string;
		year: string;
		image: string;
		alt: string;
	};

type AlbumWithLayout = Album & {
	x: number;
	y: number;
	z: number;
	size: number;
	rot: number;
};

	const albums: Album[] = [
		{ title: 'Cowboy Bebop', year: '1998', image: defaultAlbumImage, alt: 'Cowboy Bebop OST' },
		{ title: 'Macross Plus', year: '1994', image: defaultAlbumImage, alt: 'Macross Plus' },
		{
			title: 'Escaflowne',
			year: '1996',
			image: defaultAlbumImage,
			alt: 'The Vision of Escaflowne'
		},
		{
			title: 'Ghost in the Shell: SAC',
			year: '2002',
			image: defaultAlbumImage,
			alt: 'Stand Alone Complex'
		},
		{ title: 'Turn A Gundam', year: '1999', image: defaultAlbumImage, alt: 'Turn A Gundam' },
		{ title: "Wolf's Rain", year: '2003', image: defaultAlbumImage, alt: "Wolf's Rain" },
		{
			title: 'Darker than Black',
			year: '2007',
			image: defaultAlbumImage,
			alt: 'Darker than Black'
		},
		{
			title: 'Kids on the Slope',
			year: '2012',
			image: defaultAlbumImage,
			alt: 'Sakamichi no Apollon'
		},
		{
			title: 'Terror in Resonance',
			year: '2014',
			image: defaultAlbumImage,
			alt: 'Zankyou no Terror'
		},
		{ title: 'Space Dandy', year: '2014', image: defaultAlbumImage, alt: 'Space Dandy' }
	];

	// Simple Poisson-like sampler: tries random points and enforces a minimum radius
	type PoissonPoint = { x: number; y: number };

	function poisson(width: number, height: number, r: number, maxPoints: number): PoissonPoint[] {
		const points: PoissonPoint[] = [];

		function valid(x: number, y: number) {
			for (const p of points) {
				const dx = p.x - x;
				const dy = p.y - y;
				if (Math.hypot(dx, dy) < r) return false;
			}
			return true;
		}

		let attempts = 0;
		const maxAttempts = 10000;

		while (points.length < maxPoints && attempts < maxAttempts) {
			const x = Math.random() * width;
			const y = Math.random() * height;

			if (valid(x, y)) {
				points.push({ x, y });
			}

			attempts += 1;
		}

		return points;
	}

// Precompute a 3D Poisson layout so SSR 和客户端首屏都能直接渲染
const logicalWidth = 2000;
const logicalHeight = 2000;
const minDistance = 220;

const poissonPoints = poisson(logicalWidth, logicalHeight, minDistance, 60);

const layoutAlbums: AlbumWithLayout[] = albums.map((album, index) => {
	const p =
		poissonPoints[index] ?? ({
			x: (logicalWidth / (albums.length + 1)) * (index + 1),
			y: logicalHeight / 2
		} satisfies PoissonPoint);

	const size = 120 + Math.random() * 120;
	const z = (Math.random() - 0.5) * 1200;
	const rot = (Math.random() - 0.5) * 40;

	return {
		...album,
		x: p.x - logicalWidth / 2,
		y: p.y - logicalHeight / 2,
		z,
		size,
		rot
	};
});

	let rootEl: HTMLElement | null = null;

	onMount(() => {
		setInstrumentFocus('guitar');
		// fadeInOnScroll(rootEl);
	});
</script>

<section class="page" bind:this={rootEl}>
	<header class="heading" data-animate="fade-in-up">
		<p class="eyebrow">Works</p>
		<h1>Selected musical universes.</h1>
	</header>

	<div class="albums-section">
		<h2 class="albums-title" data-animate="fade-in-up">Selected albums</h2>

		<div class="scene">
			<div class="space">
				{#each layoutAlbums as album}
					<div
						class="album-card"
						data-animate="fade-in-up"
						style={`
							width:${album.size}px;
							height:${album.size * 1.2}px;
							transform:
								translate3d(${album.x}px,${album.y}px,${album.z}px)
								rotateY(${album.rot}deg)
								rotateX(${album.rot * 0.3}deg);
						`}
					>
						<div class="album-cover">
							<img src={album.image} alt={album.alt} loading="lazy" />
						</div>
						<p class="album-title">{album.title}</p>
						<p class="album-year">{album.year}</p>
					</div>
				{/each}
			</div>
		</div>
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

	.albums-section {
		width: 100%;
	}

	.albums-title {
		margin: 0 0 1.5rem;
		font-size: 1.1rem;
		font-weight: 600;
		color: rgba(245, 237, 224, 0.95);
	}

	.scene {
		width: 100%;
		height: 2000;
		perspective: 1200px;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
	}

	.space {
		position: relative;
		width: 2000px;
		height: 2000;
		transform-style: preserve-3d;
	}

	.album-card {
		position: absolute;
		border-radius: 0.75rem;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
		box-shadow:
			0 20px 40px rgba(0, 0, 0, 0.4),
			0 4px 12px rgba(0, 0, 0, 0.3);
		transition: transform 0.6s;
	}

	.album-cover {
		position: relative;
		width: 100%;
		aspect-ratio: 1;
		border-radius: 0.6rem;
		overflow: hidden;
		background: rgba(26, 21, 18, 0.95);
		box-shadow: 0 18px 40px rgba(0, 0, 0, 0.85);
	}

	.album-cover img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	.album-title {
		margin: 0.4rem 0 0;
		font-size: 0.9rem;
		font-weight: 500;
		color: rgba(245, 237, 224, 0.92);
	}

	.album-year {
		margin: 0;
		font-size: 0.75rem;
		color: rgba(245, 237, 224, 0.55);
	}

	@media (max-width: 720px) {
		.scene {
			height: 80vh;
		}
	}
</style>
