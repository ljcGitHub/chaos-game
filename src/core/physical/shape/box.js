import THREE from '../../../_libs/three.js'
import Shape from './index.js'
import { Vector3 } from '../utils/math.js'
import { baseMaterial } from '../utils/common.js'

export default class Box extends Shape {
  constructor(options = {}) {
    super()
    this.shapeType = 'Box'
    this.halfSize = new Vector3(options.width, options.height, options.depth).multiplyScalar(0.5)
    if (options.offsetPosition) {
      this.offsetPosition.set(options.offsetPosition.x, options.offsetPosition.y, options.offsetPosition.z)
    }
    if (options.offsetRotation) {
      this.offsetRotation.set(options.offsetRotation.x, options.offsetRotation.y, options.offsetRotation.z)
    }
  }
  createMesh() {
    const size = this.halfSize
    return new THREE.Mesh(new THREE.BoxGeometry(size.x * 2, size.y * 2, size.z * 2), baseMaterial)
  }
}
