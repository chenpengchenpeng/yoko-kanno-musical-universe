import { Planes } from './planes';
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/Addons.js"

export class Canvas {
  element: HTMLCanvasElement
  scene: THREE.Scene
  camera: THREE.PerspectiveCamera
  renderder: THREE.WebGLRenderer
  sizes: Size
  dimensions: Dimensions
  time: number
  clock: THREE.Clock
  raycaster: THREE.Raycaster
  mouse: THREE.Vector2 = new THREE.Vector2()
  orbitControls: OrbitControls 
  planes: Planes
  materiak: THREE.ShaderMaterial

  constructor(element: HTMLCanvasElement) {
    this.element = element
    this.time = 0
    this.createClock()
    this.createScene()
    this.createCamera()
    this.createRenderer()
    this.setSizes()
    this.addEventListeners()
    this.createPlanes()

    this.render()
  }

  createScene() {
    this.scene = new THREE.Scene()
  }
  createCamera() {
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    )
    this.scene.add(this.camera)
    this.camera.position.z = 10
  }

  createHelpers() {
    const axesHelper = new THREE.AxesHelper(5)
    this.scene.add(axesHelper)
  }

  createOrbitControls() {
    this.orbitControls = new OrbitControls(
      this.camera,
      this.renderder.domElement
    )
  }

  createPlanes() {
    this.planes = new Planes({ scene: this.scene, sizes: this.sizes })
    this.planes.bindDrag(this.renderder.domElement)
  }
  
  createRenderer() {
    this.planes = new Planes({})
  }
}