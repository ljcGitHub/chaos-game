import { collide } from './utils/collide.js'
import CollData from './utils/solver.js'

export default class World {
  constructor(scene) {
    this.gravity = ''
    this.bodys = []
    this.collision = []
    this.scene = scene
    this.collisionTarger = {}
  }

  addBody(body) {
    body.parentNode = this
    this.bodys.push(body)
  }

  removeBody(body) {
    body.object3d = null
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
        if (bestSat && bestSat.overlap > 0.01) {
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

    const collisionTarger = {}
    const createId = `create${Date.now()}`
    this.collision.forEach((c) => {
      const u1 = c.o1.uuid
      const u2 = c.o2.uuid
      if (!c.o1.collisionTargetIds) {
        c.o1.collisionTargetIds = []
        c.o1.collisionTargetStatus = {}
        c.o1.collisionTargets = []
      }
      if (c.o1.collisionTargetIds.includes(u2)) {
        c.o1.collisionTargetStatus[u2] = 'active'
      } else {
        c.o1.collisionTargetStatus[u2] = createId
        c.o1.collisionTargetIds.push(u2)
      }
      c.o1.collisionTargets.push(c.o2)
      collisionTarger[u1] = c.o1
    })
    for (const x in collisionTarger) {
      const o1 = collisionTarger[x]
      const isTrigger = o1.isTrigger
      o1.collisionTargets.forEach(o2 => {
        const u2 = o2.uuid
        const userData1 = o1.object3d.userData
        if (o1.collisionTargetStatus[u2] === 'active') {
          if (isTrigger) {
            userData1.triggerActive && userData1.triggerActive(o2.object3d)
          } else {
            userData1.collisionActive && userData1.collisionActive(o2.object3d)
          }
        } else {
          if (isTrigger) {
            userData1.triggerEnter && userData1.triggerEnter(o2.object3d)
          } else {
            userData1.collisionEnter && userData1.collisionEnter(o2.object3d)
          }
        }
      })
    }
    for (const x in this.collisionTarger) {
      const obj = this.collisionTarger[x]
      const userData1 = obj.object3d.userData
      const isTrigger = obj.isTrigger
      if (collisionTarger[x]) {
        const deleteIds = []
        obj.collisionTargets.forEach(o2 => {
          const u2 = o2.uuid
          if (obj.collisionTargetStatus[u2] !== 'active' && obj.collisionTargetStatus[u2] !== createId) {
            if (isTrigger) {
              userData1.triggerExit && userData1.triggerExit(o2.object3d)
            } else {
              userData1.collisionExit && userData1.collisionExit(o2.object3d)
            }
          }
          deleteIds.push(u2)
        })
        deleteIds.forEach(uuid => {
          obj.collisionTargets.splice(obj.collisionTargetIds.indexOf(uuid), 1)
        })
      } else {
        obj.collisionTargets.forEach(o2 => {
          const u2 = o2.uuid
          if (obj.collisionTargetStatus[u2] !== 'active') {
            if (isTrigger) {
              userData1.triggerExit && userData1.triggerExit(o2.object3d)
            } else {
              userData1.collisionExit && userData1.collisionExit(o2.object3d)
            }
          }
        })
        obj.collisionTargets = []
      }
    }
    this.collisionTarger = collisionTarger
  }

  physicsRender() {
    this.bodys.forEach((b) => b.render())
  }
}
