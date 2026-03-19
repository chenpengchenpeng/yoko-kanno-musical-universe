import * as THREE from 'three';
import { Background } from './background/index';
import { Label } from './Label';
import { Gallery } from './Gallery';
import { TrailController } from './TrailController';

export class Experience {
  isInitialized = false
  isDisposede = false
  frameDarkPlaneCount = 2
  isFrameTextDark = null
  gallery = new Gallery()
  label = new Label(this.gallery)
  background = new Background()
  trailContriller = new TrailController(this.gallery)
  constructor() {

  }

  public async init(scene: THREE.Scene, camera: THREE.Camera) {
    if (this.isInitialized) return
    await this.gallery.init(scene)
    // this.label.init()
    this.background.init()
    this.trailContriller.init(scene, camera)
    // const initialPlaneBlendData = this.gallery.getPlaneBlendData(camera.position.z)
    this.isInitialized = true
  }
}