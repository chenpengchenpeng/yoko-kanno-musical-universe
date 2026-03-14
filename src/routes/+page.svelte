<script lang="ts">
	import { onMount } from 'svelte';
	import { setInstrumentFocus } from '$lib/stores/instrumentFocus';

	let rootEl: HTMLElement | null = null;

	onMount(() => {
		setInstrumentFocus('room');
	});
</script>

<section class="hero" bind:this={rootEl}>
	<!-- 内容已清空 -->
</section>

<style>
	.hero {
		max-width: 1120px;
		width: 100%;
		background: radial-gradient(circle at top left, rgba(245, 193, 119, 0.14), transparent 55%);
		color: inherit;
	}
</style>
