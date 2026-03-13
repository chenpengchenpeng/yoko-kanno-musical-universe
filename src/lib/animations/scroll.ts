import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

let registered = false;

function ensureRegistered() {
	if (!registered && typeof window !== 'undefined') {
		gsap.registerPlugin(ScrollTrigger);
		registered = true;
	}
}

export function fadeInOnScroll(root: HTMLElement | null) {
	if (!root || typeof window === 'undefined') return;

	ensureRegistered();

	const elements = root.querySelectorAll<HTMLElement>('[data-animate="fade-in-up"]');

	elements.forEach((el) => {
		gsap.fromTo(
			el,
			{ autoAlpha: 0, y: 32 },
			{
				autoAlpha: 1,
				y: 0,
				duration: 0.9,
				ease: 'power2.out',
				scrollTrigger: {
					trigger: el,
					start: 'top 80%',
					toggleActions: 'play none none reverse'
				}
			}
		);
	});
}

