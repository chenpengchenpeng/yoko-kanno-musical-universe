import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

let registered = false;

function ensureRegistered() {
	if (!registered && typeof window !== 'undefined') {
		gsap.registerPlugin(ScrollTrigger);
		registered = true;
	}
}

const defaultFadeInUp = {
	from: { autoAlpha: 0, y: 32 },
	to: { autoAlpha: 1, y: 0, duration: 0.9, ease: 'power2.out' as const }
};

export function fadeInOnScroll(root: HTMLElement | null) {
	if (!root || typeof window === 'undefined') return;

	ensureRegistered();

	const elements = root.querySelectorAll<HTMLElement>('[data-animate="fade-in-up"]');

	elements.forEach((el) => {
		gsap.fromTo(
			el,
			defaultFadeInUp.from,
			{
				...defaultFadeInUp.to,
				scrollTrigger: {
					trigger: el,
					start: 'top 100%',
					toggleActions: 'play none none reverse'
				}
			}
		);
	});
}

export type FadeInScrollTriggerConfig = {
	trigger?: gsap.DOMTarget;
	start?: string;
	end?: string;
	once?: boolean;
	[t: string]: unknown;
};

/**
 * Creates a timeline with ScrollTrigger that runs a fade-in-up animation.
 * Returned timeline can be used to add more animations (e.g. SplitText) in the same scroll trigger.
 */
export function createFadeInScrollTimeline(
	el: HTMLElement,
	scrollTriggerConfig: FadeInScrollTriggerConfig = {}
): gsap.core.Timeline {
	ensureRegistered();

	const tl = gsap.timeline({
		scrollTrigger: {
			trigger: el,
			start: 'top 100%',
			once: true,
			...scrollTriggerConfig
		}
	});

	tl.fromTo(el, defaultFadeInUp.from, defaultFadeInUp.to);
	return tl;
}

