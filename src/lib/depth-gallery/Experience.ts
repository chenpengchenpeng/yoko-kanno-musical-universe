import * as THREE from 'three';
import { Background } from './background/index';

import { Gallery } from './Gallery';
import { TrailController } from './TrailController';
import type { Scroll } from './Scroll';

export class Experience {
  private isInitialized = false
  private isDisposed = false
  private frameDarkPlaneCount = 2
  private isFrameTextDark = false
  public gallery = new Gallery()
  public background = new Background()
  private trailController = new TrailController(this.gallery)
  constructor() {

  }

  public async init(scene: THREE.Scene, camera: THREE.Camera) {
    if (this.isInitialized) return
    await this.gallery.init(scene)
    // this.label.init()
    this.background.init()
    this.trailController.init(scene, camera)
    const initialPlaneBlendData = this.gallery.getPlaneBlendData(camera.position.z)
    this.updateFrameTextTone(initialPlaneBlendData)
    this.isInitialized = true
  }

  updateFrameTextTone(planeBlendData: ReturnType<typeof this.gallery.getPlaneBlendData>) {
    if (!planeBlendData) return

    const nearestPlaneIndex =
      planeBlendData.blend >= 0.5 ? planeBlendData.nextPlaneIndex : planeBlendData.currentPlaneIndex
    const shouldUseDarkText = nearestPlaneIndex < this.frameDarkPlaneCount

    if (this.isFrameTextDark === shouldUseDarkText) return

    this.isFrameTextDark = shouldUseDarkText
  }
  
  update(time: number, camera: THREE.Camera, scroll: Scroll) {
    this.trailController.update(camera, scroll, time)
    this.gallery.update(camera, scroll)
    if (camera) {
      const planeBlendData = this.gallery.getPlaneBlendData(camera.position.z)
      this.updateFrameTextTone(planeBlendData)
      const moodBlendData = this.gallery.getMoodBlendData(camera.position.z)
      if (moodBlendData) {
        this.background.setMoodBlend(moodBlendData)
      }
      const depthProgress = this.gallery.getDepthProgress(camera.position.z)
      const velocityMax = scroll?.velocityMax || 1
      const velocityIntensity = THREE.MathUtils.clamp(
        Math.abs(scroll?.velocity || 0) / Math.max(velocityMax, 0.0001),
        0,
        1
      )
      const blend = planeBlendData?.blend ?? 0
      const distanceFromBlendCenter = Math.abs(blend - 0.5) * 2
      const transitionStability = THREE.MathUtils.smoothstep(distanceFromBlendCenter, 0.35, 1)
      const stabilizedVelocityIntensity = velocityIntensity * transitionStability
      this.background.setMotionResponse({
        depthProgress,
        velocityIntensity: stabilizedVelocityIntensity,
      })
      this.background.update(time)
    }
  }
  dispose() {
    if (this.isDisposed) return
    this.trailController.dispose()
    this.gallery.dispose()
    this.background.dispose()
    this.isDisposed = true
  }
}