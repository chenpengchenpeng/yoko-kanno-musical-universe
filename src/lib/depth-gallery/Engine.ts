import { Experience } from './Experience';
import * as THREE from 'three';
import { Scroll } from './Scroll';
export class Engine {
	private canvas: HTMLCanvasElement;
	private experience = new Experience();
	private isInitialized = false;
	private isRunning = false;
	private animationFrameRequestId: number | null = null;
	private preloadedTextures = new Map<string, THREE.Texture>();
	private showFps = true;
	private scene = new THREE.Scene();
	private camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
	private scroll: Scroll;
	private renderer: THREE.WebGLRenderer;

	private onResize = () => {
		this.resize();
	};

	private animate = this.update.bind(this);

	constructor(canvas: HTMLCanvasElement) {
		if (!(canvas instanceof HTMLCanvasElement)) {
			throw new Error('Engine requires a valid canvas element');
		}
		this.canvas = canvas;

		this.camera.position.set(0, 0, 6);
		// Scroll controller that drives camera + gallery based on page scroll
		this.scroll = new Scroll(this.camera, this.experience.gallery);

		// WebGL renderer bound to the provided canvas
		this.renderer = new THREE.WebGLRenderer({
			canvas: this.canvas,
			antialias: true,
			alpha: true
		});
		this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
		this.renderer.outputColorSpace = THREE.SRGBColorSpace;
		this.renderer.autoClear = false;
		// Transparent clear color so page background shows through
		this.renderer.setClearColor(0x000000, 0);
		this.scene.background = null;
	}

	public async init() {
		if (this.isInitialized) return;
		try {
			// Preload all gallery textures before creating meshes
			this.preloadedTextures = await this.preloadTextures();
			this.experience.gallery.setPreloadedTextures(this.preloadedTextures);

			// Let the experience populate the scene graph
			await this.experience.init(this.scene, this.camera);
			this.scroll.init();

			// Perform an initial layout and start listening to global events
			this.resize();
			window.addEventListener('resize', this.onResize);

			this.isInitialized = true;
			this.start();
		} finally {
		}
	}

	private start() {
		if (!this.isInitialized || this.isRunning) return;

		this.isRunning = true;
		this.update();
	}

	private async preloadTextures() {
		const textureSources = this.experience.gallery.getTextureSources();
		if (!textureSources.length) return new Map<string, THREE.Texture>();

		const textureLoader = new THREE.TextureLoader();
		const loadedTextures = new Map<string, THREE.Texture>();

		await Promise.all(
			textureSources.map(async (textureSource) => {
				try {
					const texture = await textureLoader.loadAsync(textureSource);
					texture.colorSpace = THREE.SRGBColorSpace;
					loadedTextures.set(textureSource, texture);
				} catch (error) {
					console.warn(`Texture failed to load: ${textureSource}`, error);
				}
			})
		);

		return loadedTextures;
	}
	private update() {
		if (!this.isRunning) return;

		this.animationFrameRequestId = requestAnimationFrame(this.animate);

		const time = performance.now();

		// Update scroll state first so experience can react to it
		this.scroll.update();
		this.experience.update(time, this.camera, this.scroll);

		// Layered rendering:
		// 1) clear everything
		// 2) draw background
		// 3) clear depth and draw main scene
		// 4) draw labels / overlays on top
		this.renderer.clear(true, true, true);
		this.experience.background.render(this.renderer);
		this.renderer.clearDepth();
		this.renderer.render(this.scene, this.camera);
	}

	resize() {
		const width = this.canvas.clientWidth || window.innerWidth || 1;
		const height = this.canvas.clientHeight || window.innerHeight || 1;
		if (width <= 0 || height <= 0) return;

		this.camera.aspect = width / height;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(width, height, false);
		// Inform experience components that depend on viewport size
		this.experience.gallery.updatePlaneScale();
		this.experience.gallery.layoutPlanes();
	}

	dispose() {
		this.isRunning = false;

		if (this.animationFrameRequestId !== null) {
			cancelAnimationFrame(this.animationFrameRequestId);
			this.animationFrameRequestId = null;
		}

		window.removeEventListener('resize', this.onResize);
		this.scroll.dispose();

		this.preloadedTextures.forEach((texture) => {
			texture.dispose();
		});
		this.preloadedTextures.clear();
		this.experience.dispose?.();
	}
}
