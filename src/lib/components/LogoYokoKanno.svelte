<script lang="ts">
	import { onMount } from 'svelte';
	import gsap from 'gsap';

	let pathEl: SVGPathElement | null = null;

	onMount(() => {
		if (!pathEl) return;

		const length = pathEl.getTotalLength();
		pathEl.style.strokeDasharray = `${length}`;
		pathEl.style.strokeDashoffset = `${length}`;

		gsap.fromTo(
			pathEl,
			{ strokeDashoffset: length },
			{
				strokeDashoffset: 0,
				duration: 2.8,
				ease: 'power2.out',
				delay: 0.4
			}
		);
	});
</script>

<svg
	class="logo"
	viewBox="0 0 320 70"
	role="img"
	aria-label="Yoko Kanno logo handwritten"
>
	<defs>
		<linearGradient id="logoStroke" x1="0%" y1="0%" x2="100%" y2="0%">
			<stop offset="0%" stop-color="#f5d7a2" />
			<stop offset="50%" stop-color="#f2a963" />
			<stop offset="100%" stop-color="#f57a3a" />
		</linearGradient>
	</defs>

	<path
		bind:this={pathEl}
		fill="none"
		stroke="url(#logoStroke)"
		stroke-width="2.4"
		stroke-linecap="round"
		stroke-linejoin="round"
		d="M15 40
           Q 30 18, 46 30
           T 80 38
           Q 88 40, 94 34
           T 112 30
           Q 124 30, 124 42
           T 130 54
           M138 20
           Q 150 16, 162 26
           T 188 34
           Q 196 34, 198 28
           T 206 22
           Q 216 20, 220 30
           T 224 46
           M230 32
           Q 238 24, 246 24
           T 262 30
           Q 270 34, 276 32
           T 294 22"
	/>

	<text
		x="16"
		y="64"
		font-size="11"
		letter-spacing="0.32em"
		fill="rgba(245, 237, 224, 0.7)"
	>
		YOKO KANNO
	</text>
</svg>

<style>
	.logo {
		height: 34px;
		display: block;
	}

	@media (max-width: 600px) {
		.logo {
			height: 28px;
		}
	}
</style>

