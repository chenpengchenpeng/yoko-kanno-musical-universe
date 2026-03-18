import * as THREE from 'three'
import type { Gallery } from './Gallery';
export class Scroll {
  camera: THREE.PerspectiveCamera;
  gallery: Gallery;
  constructor(camera: THREE.PerspectiveCamera, gallery: Gallery) {
    this.camera = camera;
    this.gallery = gallery;
  }
}