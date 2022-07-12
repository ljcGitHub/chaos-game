import THREE from '../../../_libs/three.js'
import Shape from './index.js'
import { Vector3 } from '../utils/math.js'
import { baseMaterial } from '../utils/common.js'

export default class Sphere extends Shape {
  constructor(options = {}) {
    super()
    this.shapeType = 'Sphere'
    this.halfSize = new Vector3(options.radius, options.radius, options.radius).multiplyScalar(0.5)
    this.radius = options.radius || 5
    if (options.offsetPosition) {
      this.offsetPosition.set(options.offsetPosition.x, options.offsetPosition.y, options.offsetPosition.z)
    }
    if (options.offsetRotation) {
      this.offsetRotation.set(options.offsetRotation.x, options.offsetRotation.y, options.offsetRotation.z)
    }
  }

  createMesh() {
    return new THREE.Mesh(new THREE.SphereGeometry(this.radius, 32, 16), baseMaterial)
  }
}
