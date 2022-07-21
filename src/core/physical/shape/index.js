import { Vector3, Euler } from '../utils/math.js'

export default class Shape {
  constructor() {
    this.shapeType = 'Box'
    this.offsetPosition = new Vector3()
    this.offsetRotation = new Euler()
    this.center = new Vector3()
    this.halfSize = new Vector3()
    this.rotation = new Euler()
  }

  showMesh(scene) {
    if (this.mesh) return false
    this.mesh = this.createMesh()
    scene.add(this.mesh)
  }

  hideMesh() {
    if (!this.mesh) return false
    this.mesh.parent.remove(this.mesh)
    this.mesh = null
  }

  updateMesh() {
    const parent = this.mesh.parent
    if (parent) {
      this.hideMesh()
      this.showMesh(parent)
    }
  }
}
