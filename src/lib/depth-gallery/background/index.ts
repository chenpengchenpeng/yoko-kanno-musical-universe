import * as THREE from 'three';

/**
 * Transparent/no-op background implementation.
 * Keeps the same API surface so existing Engine/Experience code keeps working.
 */
export class Background {
	isInitialized = false;

	public init() {
		if (this.isInitialized) return;
		this.isInitialized = true;
	}

	public setMoodColors(_: { background: string; blob1: string; blob2: string }) {}

	public setMoodBlend(_: {
		currentMood: { background: string; blob1: string; blob2: string };
		nextMood: { background: string; blob1: string; blob2: string };
		blend: number;
	}) {}

	public setMotionResponse(_: { depthProgress: number; velocityIntensity: number }) {}

	public update(_time = 0) {}

	public render(_renderer: THREE.WebGLRenderer) {}

	public dispose() {
		this.isInitialized = false;
	}
}
