import * as THREE from 'three';
import { galleryPlaneData, type GalleryPlaneData } from './data/gallery-data';
export class Gallery {
	isInitialized = false;
	isDisposed = false;
	// planes
	planes: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>[] = [];
	texturesBySource = new Map();
	useTextures = true;
	planeGap = 5;
	desktopPlaneScale = 1;
	mobilePlaneScale = 0.65;
	mobileXSpreadFactor = 0.25;
	mobileBreakpoint = 768;
	planeConfig = galleryPlaneData;
	moodSampleOffset = 1;
	planeFadeSampleOffset = 1;
	planeFadeSmoothing = 0.14;
	// parallax
	parallaxEnabled = true;
	parallaxAmountX = 0.16;
	parallaxAmountY = 0.08;
	parallaxSmoothing = 0.08;
	pointerTarget = new THREE.Vector2(0, 0);
	pointerCurrent = new THREE.Vector2(0, 0);

	// breath
	breathEnabled = true;
	breathTiltAmount = 0.045;
	breathScaleAmount = 0.03;
	breathSmoothing = 0.14;
	breathGain = 1.1;
	breathIntensity = 0;
	targetBreathIntensity = 0;

	// Gesture drift
	gestureParallaxEnabled = true;
	gestureParallaxAmountY = 0.05;
	gestureParallaxSmoothing = 0.05;
	driftCurrent = 0;
	driftTarget = 0;

	constructor() {}

	private onPointerMove = (event: MouseEvent) => {
		const x = (event.clientX / window.innerWidth) * 2 - 1;
		const y = (event.clientY / window.innerHeight) * 2 - 1;
		this.pointerTarget.set(x, -y);
	};

	private onPointerLeave = () => {
		this.pointerTarget.set(0, 0);
	};

	public init(scene: THREE.Scene) {
		if (this.isInitialized) return;
		this.setPlanes(scene);
		// this.updatePlaneMaterialMode();
		// this.updatePlaneScale();
		// this.layoutPlanes();
		// this.bindPointerEvents();
		// this.bindDebug();
		this.isInitialized = true;
	}

	private setPlanes(scene: THREE.Scene) {
		const planeGeometry = new THREE.PlaneGeometry(3, 3);

		this.planeConfig.forEach((plane, index) => {
			const texture = this.texturesBySource.get(plane.textureSrc) ?? null;
			const textureImage = texture?.image;
			// get aspect ratio
			const aspectRatio =
				textureImage && textureImage.width > 0 && textureImage.height > 0
					? textureImage.width / textureImage.height
					: 1;
			// get plane data
			const fallbackColor = plane.fallbackColor ?? '#ffffff';
			const accentColor = plane.accentColor ?? fallbackColor;
			const backgroundColor = plane.backgroundColor ?? fallbackColor;
			const blob1Color = plane.blob1Color ?? fallbackColor;
			const blob2Color = plane.blob2Color ?? fallbackColor;
			const labelData = this.getPlaneLabelData(plane, this.planes.length);
			// create plane material
			const planeMaterial = new THREE.MeshBasicMaterial({
				color: fallbackColor,
				map: texture,
				side: THREE.DoubleSide,
				transparent: true,
				depthWrite: false,
				opacity: index === 0 ? 1 : 0
			});
			// add plane mesh to scene
			const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
			planeMesh.userData.basePosition = plane.position;
			planeMesh.userData.baseColor = fallbackColor;
			planeMesh.userData.accentColor = accentColor;
			planeMesh.userData.backgroundColor = backgroundColor;
			planeMesh.userData.blob1Color = blob1Color;
			planeMesh.userData.blob2Color = blob2Color;
			planeMesh.userData.label = labelData;
			planeMesh.userData.texture = texture;
			planeMesh.userData.aspectRatio = aspectRatio;
			scene.add(planeMesh);
			this.planes.push(planeMesh);
		});
	}
	private getPlaneLabelData(planeDefinition: GalleryPlaneData, index: number) {
		const fallback = {
			word: `tone ${String(index + 1).padStart(2, '0')}`,
			pms: 'N/A',
			color: ''
		};
		const label = planeDefinition.label || fallback;

		return {
			word: label.word || fallback.word,
			pms: label.pms || fallback.pms,
			color: label.color || fallback.color
		};
	}

	public getTextureSources() {
		return [...new Set(this.planeConfig.map((plane) => plane.textureSrc).filter(Boolean))];
	}

	public setPreloadedTextures(texturesBySource: Map<string, THREE.Texture>) {
		this.texturesBySource = texturesBySource instanceof Map ? texturesBySource : new Map<string, THREE.Texture>();
	}
}
