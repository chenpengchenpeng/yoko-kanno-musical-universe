import * as THREE from 'three';
import { Size } from "./types/types"
interface PlanesProps {
	scene: THREE.Scene;
	sizes: Size;
}

interface ImageInfo {
  width: number
  height: number
  aspectRatio: number
  uvs: {
    xStart: number
    xEnd: number
    yStart: number
    yEnd: number
  }
}

export class Planes {
	scene: THREE.Scene;
	geometry: THREE.PlaneGeometry;
	material: THREE.ShaderMaterial;
	mesh: THREE.InstancedMesh;
	meshCount: number = 400;
	sizes: Size;
	drag: {
		xCurrent: number;
		xTarget: number;
		yCurrent: number;
		yTarget: number;
		isDown: boolean;
		startX: number;
		startY: number;
		lastX: number;
		lastY: number;
	} = {
		xCurrent: 0,
		xTarget: 0,
		yCurrent: 0,
		yTarget: 0,
		isDown: false,
		startX: 0,
		startY: 0,
		lastX: 0,
		lastY: 0
	};
	shaderParameters = {
		maxX: 0,
		maxY: 0
	};
	scrollY: {
		target: number;
		current: number;
		direction: number;
	} = {
		target: 0,
		current: 0,
		direction: 0
	};
	dragSensitivity: number = 1;
	dragDamping: number = 0.1;
	dragElement?: HTMLElement;
	imageInfos: ImageInfo[] = [];
	atlasTexture: THREE.Texture | null = null;
	blurryAtlasTexture: THREE.Texture | null = null;

	constructor({ scene, sizes }: PlanesProps) {
		this.scene = scene;
		this.sizes = sizes;

		this.shaderParameters = {
			maxX: this.sizes.width * 2,
			maxY: this.sizes.height * 2
		};

		this.createGeometry();
		this.createMaterial();
		this.createInstancedMesh();
		this.fetchCovers();

		window.addEventListener('wheel', this.onWheel.bind(this));
	}

	private createGeometry() {
		this.geometry = new THREE.PlaneGeometry(1, 1.69, 1, 1);
		this.geometry.scale(2, 2, 2);
	}

  private async fetchCovers() {
    //const urls: string[] = await get30NewReleaseCovers()
    const urls: string[] = new Array(30)
      .fill(0)
      .map((_, i) => `/covers/image_${i}.jpg`)
    await this.loadTextureAtlas(urls)
    this.createBlurryAtlas()
    this.fillMeshData()
  }

 
  async loadTextureAtlas(urls: string[]) {
    // Load all images with CORS-safe approach to avoid tainted canvas
    const imagePromises = urls.map(async (path) => {
      try {
        const res = await fetch(path, { mode: "cors" })
        if (!res.ok) throw new Error(`Failed to fetch image: ${path}`)
        const blob = await res.blob()
        const bitmap = await createImageBitmap(blob)
        return bitmap as CanvasImageSource
      } catch (err) {
        // Fallback to HTMLImageElement with crossOrigin
        return await new Promise<CanvasImageSource>((resolve, reject) => {
          const img = new Image()
          img.crossOrigin = "anonymous"
          img.onload = () => resolve(img)
          img.onerror = (e) => reject(e)
          img.src = path
        })
      }
    })

    const images = await Promise.all(imagePromises)

    // Calculate atlas dimensions (for simplicity, we'll stack images vertically)
    const atlasWidth = Math.max(
      ...images.map((img: any) => img.width as number)
    )
    let totalHeight = 0

    // First pass: calculate total height
    images.forEach((img: any) => {
      totalHeight += img.height as number
    })

    // Create canvas with calculated dimensions
    const canvas = document.createElement("canvas")
    canvas.width = atlasWidth
    canvas.height = totalHeight
    const ctx = canvas.getContext("2d")!

    // Second pass: draw images and calculate normalized coordinates
    let currentY = 0
    this.imageInfos = images.map((img: any) => {
      const aspectRatio = (img.width as number) / (img.height as number)

      // Draw the image
      ctx.drawImage(img as any, 0, currentY)

      // Calculate normalized coordinates

      const info = {
        width: img.width,
        height: img.height,
        aspectRatio,
        uvs: {
          xStart: 0,
          xEnd: (img.width as number) / atlasWidth,
          yStart: 1 - currentY / totalHeight,
          yEnd: 1 - (currentY + (img.height as number)) / totalHeight,
        },
      }

      currentY += img.height as number
      return info
    })

    // Create texture from canvas
    this.atlasTexture = new THREE.Texture(canvas)
    this.atlasTexture.wrapS = THREE.ClampToEdgeWrapping
    this.atlasTexture.wrapT = THREE.ClampToEdgeWrapping
    this.atlasTexture.minFilter = THREE.LinearFilter
    this.atlasTexture.magFilter = THREE.LinearFilter
    this.atlasTexture.needsUpdate = true
    this.material.uniforms.uAtlas.value = this.atlasTexture
  }

  createBlurryAtlas() {
    //create a blurry version of the atlas for far away planes
    if (!this.atlasTexture) return

    const source = this.atlasTexture.image
    if (!(source instanceof HTMLCanvasElement)) return

    const blurryCanvas = document.createElement("canvas")
    blurryCanvas.width = source.width
    blurryCanvas.height = source.height
    const ctx = blurryCanvas.getContext("2d")!
    ctx.filter = "blur(100px)"
    ctx.drawImage(source, 0, 0)
    this.blurryAtlasTexture = new THREE.Texture(blurryCanvas)
    this.blurryAtlasTexture.wrapS = THREE.ClampToEdgeWrapping
    this.blurryAtlasTexture.wrapT = THREE.ClampToEdgeWrapping
    this.blurryAtlasTexture.minFilter = THREE.LinearFilter
    this.blurryAtlasTexture.magFilter = THREE.LinearFilter
    this.blurryAtlasTexture.needsUpdate = true
    this.material.uniforms.uBlurryAtlas.value = this.blurryAtlasTexture
  }
}
