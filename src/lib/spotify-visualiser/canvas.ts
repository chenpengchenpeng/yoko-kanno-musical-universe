import { Planes } from './planes';
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/Addons.js"

export class Canvas {
  element: HTMLCanvasElement
  scene: THREE.Scene
  camera: THREE.PerspectiveCamera
  renderer: THREE.WebGLRenderer
  sizes: Size
  dimensions: Dimensions
  time: number
  timer: THREE.Timer
  raycaster: THREE.Raycaster
  mouse: THREE.Vector2 = new THREE.Vector2()
  orbitControls: OrbitControls 
  planes: Planes
  material: THREE.ShaderMaterial

  constructor(element: HTMLCanvasElement) {
    this.element = element
    this.time = 0
    this.createTimer()
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
      this.renderer.domElement
    )
  }

  createPlanes() {
    this.planes = new Planes({ scene: this.scene, sizes: this.sizes })
    this.planes.bindDrag(this.renderer.domElement)
  }

  createRenderer() {
    this.dimensions = {
      width: window.innerWidth,
      height: window.innerHeight,
      pixelRatio: Math.min(2, window.devicePixelRatio),
    }

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.element,
      alpha: true,
    })

    this.renderer.setSize(this.dimensions.width, this.dimensions.height)
    this.renderer.render(this.scene, this.camera)
    this.renderer.setPixelRatio(this.dimensions.pixelRatio)
  }

  setSizes() {
    let fov = this.camera.fov * (Math.PI / 180)
    let height = this.camera.position.z * Math.tan(fov / 2) * 2
    let width = height * this.camera.aspect
    this.sizes = {
      width: width,
      height: height,
    }
  }

  createTimer() {
    this.timer = new THREE.Timer()
  }

  onMouseMove(event: MouseEvent) {
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
  }

  addEventListeners() {
    window.addEventListener("mousemove", this.onMouseMove)
    window.addEventListener("resize", this.onResize)
  }

  onResize() {
    this.dimensions = {
      width: window.innerWidth,
      height: window.innerHeight,
      pixelRatio: Math.min(2, window.devicePixelRatio),
    }

    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()
    this.setSizes()

    this.renderer.setPixelRatio(this.dimensions.pixelRatio)
    this.renderer.setSize(this.dimensions.width, this.dimensions.height)
  }

  render() {
    this.timer.update()
    const now = this.timer.getElapsed()
    const delta = now - this.time
    this.time = now
    const normalizedDelta = delta / (1 / 60)
    this.planes?.render(normalizedDelta)
    this.renderer.render(this.scene, this.camera)
  }
}