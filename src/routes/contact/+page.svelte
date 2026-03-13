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

<section class="page" bind:this={rootEl}>
	<header class="heading" data-animate="fade-in-up">
		<p class="eyebrow">Contact</p>
		<h1>Write to the musical universe.</h1>
		<p class="intro">
			This form is a template. Connect it to your preferred backend, email service, or contact
			workflow to receive messages.
		</p>
	</header>

	<form class="form" data-animate="fade-in-up">
		<div class="field">
			<label for="name">Name</label>
			<input id="name" name="name" type="text" placeholder="Your name" />
		</div>

		<div class="field">
			<label for="email">Email</label>
			<input id="email" name="email" type="email" placeholder="you@example.com" />
		</div>

		<div class="field">
			<label for="topic">Topic</label>
			<select id="topic" name="topic">
				<option>General message</option>
				<option>Scoring / soundtrack enquiry</option>
				<option>Live / concert</option>
				<option>Press / media</option>
			</select>
		</div>

		<div class="field">
			<label for="message">Message</label>
			<textarea id="message" name="message" rows="5" placeholder="Your message" />
		</div>

		<button type="submit">Send (not yet wired)</button>
	</form>
</section>

<style>
	.page {
		max-width: 720px;
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
		max-width: 32rem;
		color: rgba(245, 237, 224, 0.8);
		line-height: 1.7;
	}

	.form {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: 1rem;
		padding: 1.5rem 1.6rem 1.6rem;
		border-radius: 1rem;
		background: radial-gradient(circle at top, rgba(245, 193, 119, 0.14), rgba(9, 6, 5, 0.96));
		border: 1px solid rgba(245, 237, 224, 0.14);
		box-shadow: 0 18px 40px rgba(0, 0, 0, 0.78);
	}

	.field {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	label {
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 0.16em;
		color: rgba(245, 237, 224, 0.7);
	}

	input,
	select,
	textarea {
		border-radius: 0.6rem;
		border: 1px solid rgba(245, 237, 224, 0.28);
		background: rgba(5, 4, 5, 0.9);
		padding: 0.55rem 0.7rem;
		color: rgba(245, 237, 224, 0.95);
		font: inherit;
		outline: none;
	}

	input::placeholder,
	textarea::placeholder {
		color: rgba(245, 237, 224, 0.4);
	}

	button {
		margin-top: 0.4rem;
		align-self: flex-start;
		padding: 0.7rem 1.6rem;
		border-radius: 999px;
		border: none;
		cursor: pointer;
		text-transform: uppercase;
		letter-spacing: 0.18em;
		font-size: 0.8rem;
		background: radial-gradient(circle at top left, #f5d7a2, #f58a3c);
		color: #1a100a;
	}
</style>

