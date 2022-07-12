import THREE from '../_libs/three.js'
import { OrbitControls } from '../_libs/orbitControls.js'
import { fps, raf } from '../common/utils.js'
import Event from './event.js'
import { World } from './physical/index.js'
import { transformMixins, physicalMixins } from './mixins.js'
import { copy } from './physical/utils/math.js'
import { mock } from './mock.js'

class Game {
  constructor(handle) {
    this.selectUid = '' // 选中对象
    this.fps = fps // 帧数频率
    this.logicFpsStep = 3 // 逻辑帧数
    this.step = 0 // 帧
    this.w = window.innerWidth
    this.h = window.innerHeight
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(45, this.w / this.h, 1, 2000)
    this.renderer = new THREE.WebGLRenderer({ antialias: true, canvas: window.canvas })
    this.handle = handle
    this.pubsub = new Event(this)
    this.physicalWorld = new World(this.scene)
    this.init()
  }

  // 主循环
  loop() {
    this.step += 1
    if (this.step % this.logicFpsStep === 0) {
      this.logicRender()
    }
    this.updateRender()
    raf(() => this.loop())
  }

  logicRender() {
    this.physicalWorld.step()
  }
  updateRender() {
    this.physicalWorld.physicsRender()
    this.scene.children.forEach(obj => this.objectUpdate(obj))
    this.renderer.clear()
    this.renderer.render(this.scene, this.camera)
  }
  objectUpdate(obj) {
    if (obj.userData.transform) {
      const transform = obj.userData.transform
      const physical = obj.userData.physical
      copy(obj.position, transform.position)
      copy(obj.rotation, transform.rotation)
      if (physical) {
        copy(physical.position, transform.position)
        copy(physical.rotation, transform.rotation)
      }
    }
    if (obj.children && obj.children.length) {
      obj.children.forEach(obj => this.objectUpdate(obj))
    }
  }

  // 获取循环对象
  getLoopObject3d(target, callback) {
    target.children.forEach(obj3d => {
      if (obj3d.userData._isChaos) {
        callback(this.getPool(obj3d))
        if (obj3d.children.length) {
          this.getLoopObject3d(obj3d, callback)
        }
      }
    })
  }

  setSize(w, h) {
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(w, h)
    this.w = w
    this.h = h
    this.camera.aspect = w / h
    this.camera.updateProjectionMatrix()
  }

  selectObject(obj) {
    const lastSelectUid = this.selectUid
    this.selectUid = obj.uuid
    if (!this.getSelectObject()) {
      this.selectUid = lastSelectUid
    }
  }
  getSelectObject(child) {
    const children = child || this.scene.children
    for (let i = 0; i < children.length; i++) {
      const item = children[i]
      if (!item.userData.transform) continue
      if (this.selectUid === item.uuid) return item
      if (item.children.length) return this.getSelectObject(item.children)
    }
    return null
  }

  init() {
    this.scene.background = new THREE.Color(0x5896f7)
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(this.w, this.h)
    this.renderer.autoClear = false
    this.camera.position.set(200, 200, 200)
    this.camera.lookAt(new THREE.Vector3(0, 0, 0))
    this.parse(mock)
  }
  parse(objs, parent) {
    objs.forEach(item => {
      const obj = new THREE.Object3D()
      if (item.transform) transformMixins(obj, item.transform)
      if (item.physical) {
        physicalMixins(obj, item.physical)
        this.physicalWorld.addBody(obj.userData.physical)
      }
      if (item.children && item.children.length) {
        this.parse(item.children, obj)
      }
      parent ? parent.add(obj) : this.scene.add(obj)
    })
  }
  start() {
    this.working = true
    this.loop()
  }
  stop() {
    this.working = false
  }

  showHelp() {
    if (!this.controls) {
      this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    }
    this.controls.enabled = true

    if (!this.axesHelper) {
      this.axesHelper = new THREE.AxesHelper(500)
      this.scene.add(this.axesHelper)
    }
  }

  hideHelp() {
    if (this.controls) {
      this.controls.enabled = false
    }
    if (this.axesHelper) {
      this.scene.remove(this.axesHelper)
      this.axesHelper = null
    }
  }
}

export default Game
