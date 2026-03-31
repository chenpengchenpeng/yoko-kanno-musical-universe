import * as THREE from 'three';
import type { Gallery } from './Gallery';
export class Scroll {
	camera: THREE.Camera;
	gallery: Gallery;
	rawVelocity: number;
	velocity: number;
	velocityDamping: number;
	velocityMax: number;
	velocityStopThreshold: number;
	useScrollBounds: boolean;
	firstPlaneViewOffset: number;
	lastPlaneViewOffset: number;
	minCameraZ: number;
	maxCameraZ: number;
	cameraStartZ: number;
	showVelocityVisualizer: boolean;
	debugUiVisible: boolean;
	touchY: number;
	isInitialized: boolean;
	previousScrollCurrent: number;
	scrollTarget: number;
	scrollCurrent: number;
	scrollSmoothing: number;
	scrollToWorldFactor: number;
	wheelScrollSpeed: number;
	touchScrollSpeed: number;
	invertScroll: boolean;
	onWheel: (event: WheelEvent) => void;
	onTouchStart: (event: TouchEvent) => void;
	onTouchMove: (event: TouchEvent) => void;

	constructor(camera: THREE.Camera, gallery: Gallery) {
		this.isInitialized = false;
		this.camera = camera;
		this.gallery = gallery;

		// Scroll state
		this.scrollTarget = 0;
		this.scrollCurrent = 0;
		this.scrollSmoothing = 0.08;
		this.scrollToWorldFactor = 0.01;
		this.wheelScrollSpeed = 1;
		this.touchScrollSpeed = 1.8;
		this.previousScrollCurrent = 0;
		this.invertScroll = false;

		// Velocity
		this.rawVelocity = 0;
		this.velocity = 0;
		this.velocityDamping = 0.12;
		this.velocityMax = 1.5;
		this.velocityStopThreshold = 0.0001;

		// Bounds
		this.useScrollBounds = true;
		this.firstPlaneViewOffset = 5;
		this.lastPlaneViewOffset = 5;
		this.minCameraZ = -Infinity;
		this.maxCameraZ = Infinity;
		this.cameraStartZ = this.camera.position.z;

		// Debug UI
		this.showVelocityVisualizer = true;
		this.debugUiVisible = false;
		this.touchY = 0;

		// Input events
		this.onWheel = (event: WheelEvent) => {
			event.preventDefault();
			const normalizedWheelDelta = this.normalizeWheelDelta(event) * this.wheelScrollSpeed;
			this.addScrollInput(normalizedWheelDelta);
		};
		this.onTouchStart = (event: TouchEvent) => {
			this.touchY = event.touches[0]?.clientY ?? 0;
		};
		this.onTouchMove = (event: TouchEvent) => {
			event.preventDefault();
			const currentTouchY = event.touches[0]?.clientY ?? this.touchY;
			const deltaY = this.touchY - currentTouchY;
			this.addScrollInput(deltaY * this.touchScrollSpeed);
			this.touchY = currentTouchY;
		};
	}

	init() {
		if (this.isInitialized) return;

		this.updateCameraBounds();
		this.cameraStartZ = this.maxCameraZ;
		this.camera.position.z = this.cameraStartZ;
		this.scrollTarget = 0;
		this.scrollCurrent = 0;
		this.previousScrollCurrent = this.scrollCurrent;
		this.rawVelocity = 0;
		this.velocity = 0;

		this.isInitialized = true;
	}

	bindEvents() {
		window.addEventListener('wheel', this.onWheel, { passive: false });
		window.addEventListener('touchstart', this.onTouchStart, { passive: true });
		window.addEventListener('touchmove', this.onTouchMove, { passive: false });
	}

	updateCameraBounds() {
		const depthRange = this.gallery.getDepthRange();
		this.maxCameraZ = depthRange.nearestZ + this.firstPlaneViewOffset;
		this.minCameraZ = depthRange.deepestZ + this.lastPlaneViewOffset;

		if (this.minCameraZ > this.maxCameraZ) {
			this.minCameraZ = this.maxCameraZ;
		}
	}

	cameraZFromScroll(scrollAmount: number) {
		return this.cameraStartZ - scrollAmount * this.scrollToWorldFactor;
	}

	scrollFromCameraZ(cameraZ: number) {
		if (this.scrollToWorldFactor === 0) return 0;
		return (this.cameraStartZ - cameraZ) / this.scrollToWorldFactor;
	}

	normalizeWheelDelta(event: WheelEvent) {
		if (event.deltaMode === 1) return event.deltaY * 16;
		if (event.deltaMode === 2) return event.deltaY * window.innerHeight;
		return event.deltaY;
	}

	addScrollInput(deltaY: number) {
		const scrollDirection = this.invertScroll ? -1 : 1;
		this.scrollTarget += deltaY * scrollDirection;
	}

	updateVelocity() {
		this.rawVelocity = this.scrollCurrent - this.previousScrollCurrent;
		this.velocity = THREE.MathUtils.lerp(this.velocity, this.rawVelocity, this.velocityDamping);
		this.velocity = THREE.MathUtils.clamp(this.velocity, -this.velocityMax, this.velocityMax);

		if (Math.abs(this.velocity) < this.velocityStopThreshold) {
			this.velocity = 0;
		}

		this.previousScrollCurrent = this.scrollCurrent;
	}

	setDebugUiVisible(isVisible: boolean) {
		this.debugUiVisible = Boolean(isVisible);
	}


	update() {
		this.updateCameraBounds();
		this.scrollCurrent = THREE.MathUtils.lerp(
			this.scrollCurrent,
			this.scrollTarget,
			this.scrollSmoothing
		);

		if (this.useScrollBounds) {
			const minimumScroll = this.scrollFromCameraZ(this.maxCameraZ);
			const maximumScroll = this.scrollFromCameraZ(this.minCameraZ);

			this.scrollTarget = THREE.MathUtils.clamp(this.scrollTarget, minimumScroll, maximumScroll);
			this.scrollCurrent = THREE.MathUtils.clamp(this.scrollCurrent, minimumScroll, maximumScroll);
		}

		this.updateVelocity();

		const nextCameraZ = this.cameraZFromScroll(this.scrollCurrent);
		if (this.useScrollBounds) {
			this.camera.position.z = THREE.MathUtils.clamp(nextCameraZ, this.minCameraZ, this.maxCameraZ);
			return;
		}

		this.camera.position.z = nextCameraZ;
	}
	dispose() {
		window.removeEventListener('wheel', this.onWheel);
		window.removeEventListener('touchstart', this.onTouchStart);
		window.removeEventListener('touchmove', this.onTouchMove);

	}
}
