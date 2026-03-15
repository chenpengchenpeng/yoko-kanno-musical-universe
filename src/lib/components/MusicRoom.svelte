<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import * as THREE from 'three';
	import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
	import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
	import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
	import gsap from 'gsap';
	import { instrumentFocus, type InstrumentKey } from '$lib/stores/instrumentFocus';

	let container: HTMLDivElement | null = null;
	let instrumentsGroup: THREE.Group | null = null;
	let glbWorker: Worker | null = null;

	let renderer: THREE.WebGLRenderer | null = null;
	let scene: THREE.Scene | null = null;
	let camera: THREE.PerspectiveCamera | null = null;
	let controls: OrbitControls | null = null;
	let frameId: number | null = null;

	const lookAtTargets: Record<InstrumentKey, THREE.Vector3> = {
		room: new THREE.Vector3(0, 0, -0.4),
		piano: new THREE.Vector3(-3.2, 0.8, 0),
		violin: new THREE.Vector3(1.6, 1.35, -0.3),
		drums: new THREE.Vector3(2.8, 1.2, -1.0),
		saxophone: new THREE.Vector3(-1.4, 1.5, -1.8),
		guitar: new THREE.Vector3(0.5, 1.2, 0.9),
		cello: new THREE.Vector3(1, 1.2, 1.2)
	};
	const lookAtTarget = new THREE.Vector3().copy(lookAtTargets.room);

	const cameraPositions: Record<InstrumentKey, THREE.Vector3> = {
		room: new THREE.Vector3(0, 3.2, 8.2),
		piano: new THREE.Vector3(-5.2, 1.4, 0.2),
		violin: new THREE.Vector3(1.4, 1.8, 4.6),
		drums: new THREE.Vector3(2.6, 2.3, 5.8),
		saxophone: new THREE.Vector3(-1.6, 2.1, 5.2),
		guitar: new THREE.Vector3(0.6, 1.7, 4.1),
		cello: new THREE.Vector3(1, 2, 4)
	};

	function createRoom() {
		if (!scene) return;

		const room = new THREE.Group();

		const floorMat = new THREE.MeshStandardMaterial({
			color: 0x2b2117,
			roughness: 0.6,
			metalness: 0.1
		});
		const floorGeo = new THREE.PlaneGeometry(14, 10);
		const floor = new THREE.Mesh(floorGeo, floorMat);
		floor.rotation.x = -Math.PI / 2;
		floor.receiveShadow = true;
		room.add(floor);

		const wallMat = new THREE.MeshStandardMaterial({
			color: 0x120d0a,
			roughness: 0.9,
			metalness: 0.05
		});

		const backWall = new THREE.Mesh(new THREE.PlaneGeometry(14, 6), wallMat);
		backWall.position.set(0, 3, -5);
		room.add(backWall);

		const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(10, 6), wallMat);
		leftWall.rotation.y = Math.PI / 2;
		leftWall.position.set(-7, 3, 0);
		room.add(leftWall);

		const rightWall = new THREE.Mesh(new THREE.PlaneGeometry(10, 6), wallMat);
		rightWall.rotation.y = -Math.PI / 2;
		rightWall.position.set(7, 3, 0);
		room.add(rightWall);

		const stageMat = new THREE.MeshStandardMaterial({
			color: 0x3c2920,
			roughness: 0.55,
			metalness: 0.15
		});
		const stage = new THREE.Mesh(new THREE.CylinderGeometry(4.5, 4.7, 0.4, 40), stageMat);
		stage.position.set(0, 0.2, -1.1);
		stage.receiveShadow = true;
		room.add(stage);

		scene.add(room);
	}

	function createInstruments() {
		if (!scene) return;

		instrumentsGroup = new THREE.Group();

		// Load GLB in worker (fetch off main thread), parse on main thread
		glbWorker = new Worker(
			new URL('../workers/fetchGlb.worker.js', import.meta.url),
			{ type: 'module' }
		);
		const gltfLoader = new GLTFLoader();
		gltfLoader.setMeshoptDecoder(MeshoptDecoder);

		function onGlbFetched(id: string, buffer: ArrayBuffer | null, error?: string) {
			if (!instrumentsGroup) return;
			if (error || !buffer) {
				console.error(`Failed to load ${id} model:`, error);
				return;
			}
			gltfLoader.parse(
				buffer,
				'',
				(gltf) => {
					if (!instrumentsGroup) return;
					const model = gltf.scene;
					if (id === 'piano') {
						model.position.set(-3.2, 0.4, 0.0);
						model.rotation.y = -Math.PI / 2;
						model.scale.setScalar(0.01);
					} else if (id === 'cello') {
						model.position.set(2, 0.4, 1.2);
						model.scale.setScalar(1.5);
					}
					model.traverse((child) => {
						if ((child as THREE.Mesh).isMesh) {
							(child as THREE.Mesh).castShadow = true;
							(child as THREE.Mesh).receiveShadow = true;
						}
					});
					instrumentsGroup.add(model);
				},
				(err) => console.error(`Failed to parse ${id} model:`, err)
			);
		}

		glbWorker.onmessage = (e: MessageEvent<{ id: string; buffer?: ArrayBuffer; error?: string }>) => {
			const { id, buffer, error } = e.data;
			onGlbFetched(id, buffer ?? null, error);
		};
		glbWorker.postMessage({ id: 'piano', url: '/models/piano.glb' });
		glbWorker.postMessage({ id: 'cello', url: '/models/cello.glb' });

		// Violin on stand
		const violinBody = new THREE.Mesh(
			new THREE.CapsuleGeometry(0.18, 0.9, 6, 10),
			new THREE.MeshStandardMaterial({ color: 0x7a3c1a, metalness: 0.25, roughness: 0.55 })
		);
		violinBody.position.set(1.6, 1.35, -0.3);
		violinBody.rotation.z = 0.05;
		violinBody.castShadow = true;

		const violinNeck = new THREE.Mesh(
			new THREE.CylinderGeometry(0.035, 0.035, 0.7, 10),
			new THREE.MeshStandardMaterial({ color: 0x2a1b13 })
		);
		violinNeck.position.set(1.45, 1.8, -0.2);
		violinNeck.rotation.z = 0.12;
		violinNeck.castShadow = true;

		const stand = new THREE.Mesh(
			new THREE.CylinderGeometry(0.04, 0.05, 1.3, 10),
			new THREE.MeshStandardMaterial({ color: 0x1b1b1b })
		);
		stand.position.set(1.6, 0.7, -0.3);
		stand.castShadow = true;

		instrumentsGroup.add(violinBody, violinNeck, stand);

		// Drum kit – kick, toms, cymbal
		const drumMat = new THREE.MeshStandardMaterial({
			color: 0x5b3b2a,
			metalness: 0.4,
			roughness: 0.45
		});
		const metalMat = new THREE.MeshStandardMaterial({
			color: 0xc7c0b8,
			metalness: 0.9,
			roughness: 0.2
		});

		const kick = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 0.6, 24), drumMat);
		kick.rotation.z = Math.PI / 2;
		kick.position.set(3.1, 0.8, -1.2);
		kick.castShadow = true;
		kick.receiveShadow = true;

		const floorTom = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 0.55, 20), drumMat);
		floorTom.position.set(2.5, 1.1, -0.5);
		floorTom.castShadow = true;

		const cymbal = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 0.05, 32), metalMat);
		cymbal.position.set(2.7, 1.7, -1.1);
		cymbal.castShadow = true;

		const cymbalStand = new THREE.Mesh(
			new THREE.CylinderGeometry(0.03, 0.03, 1.6, 10),
			new THREE.MeshStandardMaterial({ color: 0x88837c, metalness: 0.8, roughness: 0.25 })
		);
		cymbalStand.position.set(2.7, 0.95, -1.1);
		cymbalStand.castShadow = true;

		instrumentsGroup.add(kick, floorTom, cymbal, cymbalStand);

		// Saxophone – stylised golden curve
		const saxBody = new THREE.Mesh(
			new THREE.TorusKnotGeometry(0.23, 0.06, 80, 14, 2, 5),
			new THREE.MeshStandardMaterial({ color: 0xf3c26b, metalness: 1.0, roughness: 0.2 })
		);
		saxBody.position.set(-1.4, 1.5, -1.8);
		saxBody.rotation.set(0.9, 0.2, 0.2);
		saxBody.castShadow = true;

		instrumentsGroup.add(saxBody);

		// Guitar – body & neck
		const guitarBody = new THREE.Mesh(
			new THREE.CapsuleGeometry(0.22, 0.7, 6, 12),
			new THREE.MeshStandardMaterial({ color: 0x5f2c1f, metalness: 0.35, roughness: 0.45 })
		);
		guitarBody.position.set(0.5, 1.2, 0.9);
		guitarBody.rotation.z = -0.4;
		guitarBody.castShadow = true;

		const guitarNeck = new THREE.Mesh(
			new THREE.BoxGeometry(0.09, 0.7, 0.12),
			new THREE.MeshStandardMaterial({ color: 0x1b120f })
		);
		guitarNeck.position.set(0.85, 1.55, 0.8);
		guitarNeck.rotation.z = -0.43;
		guitarNeck.castShadow = true;

		instrumentsGroup.add(guitarBody, guitarNeck);

		scene.add(instrumentsGroup);
	}

	function setupLights() {
		if (!scene) return;

		const ambient = new THREE.AmbientLight(0xf5ede0, 0.35);
		scene.add(ambient);

		const ambientFill = new THREE.AmbientLight(0xe8e4dc, 0.08);
		scene.add(ambientFill);

		const warmSpot = new THREE.SpotLight(0xf5c493, 1.4, 18, Math.PI / 4.2, 0.35, 1.4);
		warmSpot.position.set(-2.0, 6.2, 3.5);
		warmSpot.target.position.set(-2.6, 1.0, -0.1);
		warmSpot.castShadow = true;
		scene.add(warmSpot);
		scene.add(warmSpot.target);

		const coolSpot = new THREE.SpotLight(0x8fc5ff, 0.65, 18, Math.PI / 4.0, 0.4, 1.8);
		coolSpot.position.set(3.0, 6.5, 4.0);
		coolSpot.target.position.set(2.0, 1.2, -1.0);
		coolSpot.castShadow = true;
		scene.add(coolSpot);
		scene.add(coolSpot.target);

		const rim = new THREE.DirectionalLight(0xffffff, 0.22);
		rim.position.set(0, 5.5, -4.5);
		scene.add(rim);
	}

	function animateCameraTo(instrument: InstrumentKey) {
		if (!camera) return;

		const targetPos = cameraPositions[instrument];
		if (!targetPos) return;

		const targetLook = lookAtTargets[instrument] ?? new THREE.Vector3(0, 1.2, -0.2);

		gsap.to(camera.position, {
			x: targetPos.x,
			y: targetPos.y,
			z: targetPos.z,
			duration: 1.6,
			ease: 'power3.inOut'
		});
		gsap.to(lookAtTarget, {
			x: targetLook.x,
			y: targetLook.y,
			z: targetLook.z,
			duration: 1.6,
			ease: 'power3.inOut'
		});
	}

	function startRenderLoop() {
		if (!renderer || !scene || !camera) return;

		const clock = new THREE.Clock();

		const renderLoop = () => {
			const delta = clock.getDelta();

			if (controls) {
				controls.target.copy(lookAtTarget);
			}
			if (camera && scene && renderer) {
				camera.lookAt(lookAtTarget);
				renderer.render(scene, camera);
			}

			frameId = requestAnimationFrame(renderLoop);
		};

		renderLoop();
	}

	function handleResize() {
		if (!container || !renderer || !camera) return;
		const { clientWidth, clientHeight } = container;
		camera.aspect = clientWidth / clientHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(clientWidth, clientHeight);
	}

	onMount(() => {
		if (!container) return;

		scene = new THREE.Scene();
		scene.background = new THREE.Color(0x050406);

		const width = container.clientWidth || window.innerWidth;
		const height = container.clientHeight || window.innerHeight;

		camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 40);
		camera.position.copy(cameraPositions.room);

		renderer = new THREE.WebGLRenderer({
			antialias: true,
			alpha: true
		});
		renderer.setSize(width, height);
		const pixelRatio = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 2) : 1;
		renderer.setPixelRatio(pixelRatio);
		renderer.shadowMap.enabled = true;
		renderer.shadowMap.type = THREE.PCFSoftShadowMap;

		container.appendChild(renderer.domElement);

		controls = new OrbitControls(camera, renderer.domElement);
		controls.enableDamping = true;
		controls.enablePan = false;
		controls.minDistance = 3.5;
		controls.maxDistance = 10;
		controls.maxPolarAngle = Math.PI / 2.1;

		createRoom();
		createInstruments();
		setupLights();

		startRenderLoop();

		const unsubscribe = instrumentFocus.subscribe((value) => {
			animateCameraTo(value);
		});

		if (typeof window !== 'undefined') {
			window.addEventListener('resize', handleResize);
		}

		return () => {
			unsubscribe();
			if (typeof window !== 'undefined') {
				window.removeEventListener('resize', handleResize);
			}
		};
	});

	onDestroy(() => {
		if (typeof window !== 'undefined') {
			window.removeEventListener('resize', handleResize);
		}
		if (glbWorker) {
			glbWorker.terminate();
			glbWorker = null;
		}
		if (frameId !== null) {
			cancelAnimationFrame(frameId);
		}

		if (controls) {
			controls.dispose();
			controls = null;
		}

		if (renderer) {
			renderer.dispose();
			if (renderer.domElement && renderer.domElement.parentElement) {
				renderer.domElement.parentElement.removeChild(renderer.domElement);
			}
			renderer = null;
		}

		if (scene) {
			scene.traverse((obj) => {
				if (obj instanceof THREE.Mesh) {
					obj.geometry.dispose();
					if (Array.isArray(obj.material)) {
						obj.material.forEach((m) => m.dispose());
					} else {
						obj.material.dispose();
					}
				}
			});
			scene.clear();
			scene = null;
		}
	});
</script>

<div class="music-room" bind:this={container} aria-hidden="true" ></div>

<style>
	.music-room {
		position: fixed;
		inset: 0;
		z-index: 0;
		opacity: 0.98;
		mix-blend-mode: normal;
	}
</style>
