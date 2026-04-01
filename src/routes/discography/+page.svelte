<script lang="ts">
	import { onMount } from 'svelte';
	import { fadeInOnScroll } from '$lib/animations/scroll';
	import { setInstrumentFocus } from '$lib/stores/instrumentFocus';
	import { Engine } from '$lib/depth-gallery/Engine';

	let rootEl: HTMLElement | null = null;
	let canvasEl: HTMLCanvasElement | null = null;
	let engine: Engine | null = null;

	onMount(() => {
		setInstrumentFocus('piano');
		fadeInOnScroll(rootEl);

		if (!canvasEl) return;
		engine = new Engine(canvasEl);
		engine.init().catch((error) => {
			console.error('Engine initialization failed', error);
		});

		return () => {
			engine?.dispose();
			engine = null;
		};
	});
</script>

<canvas class="webgl" bind:this={canvasEl}></canvas>

<style>
	.webgl {
		width: 100%;
		width: 100vw;
		height: 100vh;
		display: block;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 1;
	}
</style>
