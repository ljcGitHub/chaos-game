import { collide } from './utils/collide.js'
import CollData from './utils/solver.js'

export default class World {
  constructor(scene) {
    this.gravity = ''
    this.bodys = []
    this.collision = []
    this.scene = scene
  }

  addBody(body) {
    body.parentNode = this
    this.bodys.push(body)
  }

  removeBody(body) {
    body.parentNode = null
    this.bodys.splice(this.bodys.indexOf(body), 1)
  }

  step() {
    this.physicsLoop()
  }

  physicsLoop() {
    this.collision = []
    // 碰撞前置
    this.bodys.forEach((b) => b.reposition())

    // 碰撞检测
    this.bodys.forEach((b1, i) => {
      for (let j = i + 1; j < this.bodys.length; j++) {
        const b2 = this.bodys[j]
        let bestSat = collide(b1, b2)
        if (bestSat) {
          this.collision.push(
            new CollData(b1, b2, bestSat.axis, bestSat.overlap, bestSat.vertex)
          )
        }
      }
    })

    // 碰撞响应
    this.collision.forEach((c) => {
      c.pen()
      c.coll()
    })
  }

  physicsRender() {
    this.bodys.forEach((b) => b.render())
  }
}
