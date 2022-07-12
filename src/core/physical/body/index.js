import { Vector3, toVector3, Euler, toEuler, extractBasis } from '../utils/math.js'

export default class Body {
  constructor(options) {
    this.comp = []
    this.position = options.position ? toVector3(options.position) : new Vector3()
    this.rotation = options.rotation ? toEuler(options.rotation) : new Euler()
    this.mass = options.mass || 0 // 质量
    if (this.mass === 0) {
      this.inverseMass = 0 // 逆质量
    } else {
      this.inverseMass = 1 / this.mass // 逆质量
    }
    this.keyForce = new Vector3(0, 0, 0)
    this.inertia = 0 // 惯性
    this.inverseInertia = 0 // 逆惯性
    this.elasticity = options.elasticity || 1 // 弹性值
    this.friction = options.friction || 0.1 // 摩擦力
    this.maxSpeed = 0 // 最大速度
    this.layer = 0 // 碰撞层级
    this.velocity = new Vector3(0, 0, 0) // 速度
    this.acceleration = new Vector3(0, 0, 0) // 加速度
    this.show = false
    this._parentNode = null
  }
  reposition() {
    this.velocity = this.velocity.add(this.acceleration).multiplyScalar(1 - this.friction)
    if (this.velocity.length() > this.maxSpeed && this.maxSpeed !== 0) {
      this.velocity = this.velocity.normalize().multiply(this.maxSpeed)
    }
    this.position.add(this.velocity)
    this.comp.forEach(comp => {
      comp.center = comp.center.copy(this.position).add(comp.offsetPosition)
      comp.rotation = comp.rotation.set(
        this.rotation.x + comp.offsetRotation.x,
        this.rotation.y + comp.offsetRotation.y,
        this.rotation.z + comp.offsetRotation.z
      )
      comp.unitAxis = extractBasis(comp)
    })
  }

  setKeyForce(x = 0, y = 0, z = 0) {
    this.acceleration.set(x, y, z)
  }

  render() {
    if (this.debug) {
      this.comp.forEach(com => {
        if (com.mesh) {
          com.mesh.position.copy(com.center)
          com.mesh.rotation.copy(com.rotation)
        }
      })
    }
  }

  get parentNode() {
    return this._parentNode
  }
  set parentNode(parentNode) {
    this._parentNode = parentNode
    this.debugMesh(this.debug)
  }

  get debug() {
    return this.show
  }
  set debug(v) {
    this.show = v
    this.debugMesh(v)
  }

  debugMesh(v) {
    if (!this.parentNode) return false
    const scene = this.parentNode.scene
    if (v) {
      this.comp.forEach(comp => {
        comp.showMesh(scene)
      })
    } else {
      this.comp.forEach(comp => {
        comp.hideMesh(scene)
      })
    }
  }

  addShape(comp) {
    this.comp.push(comp)
  }

  removeShape(comp) {
    comp.hideMesh()
    this.comp.splice(this.comp.indexOf(comp), 1)
  }
}
