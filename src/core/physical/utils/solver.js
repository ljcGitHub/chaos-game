import { add, sub, dot, Vector3 } from './math.js'

export default class CollData {
  constructor(o1, o2, normal, overlap, vertex) {
    this.o1 = o1
    this.o2 = o2
    this.normal = normal
    this.overlap = overlap
    this.vertex = vertex
  }
  // 碰撞响应--位置
  pen() {
    const inv = this.overlap / (this.o1.inverseMass + this.o2.inverseMass)
    const inv1 = inv * this.o1.inverseMass
    const inv2 = inv * -this.o2.inverseMass
    if (this.o1.inverseMass) {
      const n1 = new Vector3().copy(this.normal).multiplyScalar(inv)
      this.o1.position = add(this.o1.position, n1.multiplyScalar(inv1))
    }
    if (this.o2.inverseMass) {
      const n2 = new Vector3().copy(this.normal).multiplyScalar(inv)
      this.o2.position = add(this.o2.position, n2.multiplyScalar(inv2))
    }
  }

  // 碰撞响应--速度
  coll() {
    let relVel = sub(this.o1.velocity, this.o2.velocity)
    let sepVel = dot(relVel, this.normal)
    let newSepVel = -sepVel * Math.min(this.o1.elasticity, this.o2.elasticity)
    let vsepDiff = newSepVel - sepVel
    let impulse = vsepDiff / (this.o1.inverseMass + this.o2.inverseMass)
    let impulseVec1 = this.normal.multiplyScalar(impulse)
    let impulseVec2 = new Vector3().copy(impulseVec1)
    if (this.o1.inverseMass) {
      this.o1.velocity = this.o1.velocity.add(impulseVec1.multiplyScalar(this.o1.inverseMass))
      this.o1.velocity = new Vector3()
    }
    if (this.o2.inverseMass) {
      this.o2.velocity = this.o2.velocity.add(impulseVec2.multiplyScalar(-this.o2.inverseMass))
      this.o2.velocity = new Vector3()
    }
  }
}
