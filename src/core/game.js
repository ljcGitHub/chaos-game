import THREE from '../_libs/three.js'
import { fps, raf } from '../common/utils.js'
import Event from './event.js'
import { transformMixins } from './mixins.js'

class Game {
  constructor(handle) {
    this.pools = {} // 对象池
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
    this.init()
  }

  addPool(obj3d, info) {
    obj3d.userData._isChaos = true
    this.pools[obj3d.uuid] = info
  }
  getPool(obj3d, info) {
    if (obj3d.userData._isChaos) return this.pools[obj3d.uuid]
    return null
  }
  removePool(obj3d) {
    delete this.pools[obj3d.uuid]
  }

  // 主循环
  loop() {
    if (this.working) {
      this.step += 1
      if (this.step % this.logicFpsStep === 0) {
        this.logicRender()
      }
      this.updateRender()
    } else {
      this.staticRender()
    }
    raf(() => this.loop())
  }

  logicRender() {
  }
  updateRender() {
    this.renderer.clear()
    this.renderer.render(this.scene, this.camera)
  }
  staticRender() {
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
    this.selectUid = obj.uuid
  }
  getSelectObject(child) {
    const children = child || this.scene.children
    for (let i = 0; i < children.length; i++) {
      const item = children[i]
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
    this.demo()
  }
  demo() {
    const geometry = new THREE.BoxGeometry(40, 40, 40)
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true })
    const cube = new THREE.Mesh(geometry, material)
    transformMixins(cube)
    this.scene.add(cube)
    this.pubsub.on(cube, 'touchstart', () => {
    })
    cube.position.x = -40
    const cube2 = new THREE.Mesh(geometry, material)
    transformMixins(cube2)
    this.scene.add(cube2)
    this.pubsub.on(cube2, 'touchstart', () => {
    })
    cube2.position.x = 40
    setInterval(() => {
      cube.rotation.x += 0.01
      cube.rotation.y += 0.01
    }, 1000 / 60)
  }
  start() {
    this.working = true
    this.loop()
  }
  stop() {
    this.working = false
  }
}

export default Game
