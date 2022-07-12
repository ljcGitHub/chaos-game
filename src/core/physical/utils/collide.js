/* eslint-disable */
import {
  add, sub, dot,
  cross, clamp, Vector3,
  doTwistX, doTwistY, doTwistZ, distanceToSquared
} from './math.js'

const Key = ['x', 'y', 'z']
const exchange = function (o1, o2, aTargetType) {
  let _o1 = o1
  let _o2 = o2
  if (o2.shapeType === aTargetType) {
    _o1 = o2
    _o2 = o1
  }
  return { o1: _o1, o2: _o2 }
}

export const collide = function (o1, o2) {
  let bestSat = {
    overlap: null,
    axis: null,
    vertex: null
  }
  for (let i = 0; i < o1.comp.length; i++) {
    for (let j = 0; j < o2.comp.length; j++) {
      let _bs = sat(o1.comp[i], o2.comp[j])
      // 取物体的overlap重叠值最大
      if (_bs && _bs.overlap > bestSat.overlap) {
        bestSat = _bs
      }
    }
  }
  // 没有重叠就没有发生碰撞
  if (bestSat.overlap !== null) {
    return bestSat
  } else {
    return false
  }
}

// 分离轴定律 Separating axis theorem on two objects
export const sat = function (o1, o2) {
  let minOverlap = null
  let smallestAxis
  let contactVertex
  let tk

  if (o1.shapeType === 'Box' && o2.shapeType === 'Box') {
    tk = intersectsBox_Box(o1, o2)
    minOverlap = tk.overlap
    smallestAxis = tk.axis
    contactVertex = tk.vertex
  }

  if (o1.shapeType === 'Sphere' && o2.shapeType === 'Sphere') {
    tk = intersectsSphere_Sphere(o1, o2)
    minOverlap = tk.overlap
    smallestAxis = tk.axis
    contactVertex = tk.vertex
  }

  if (o1.shapeType === 'Box' && o2.shapeType === 'Sphere' ||
    o1.shapeType === 'Sphere' && o2.shapeType === 'Box') {
    tk = intersectsBox_Sphere(o1, o2)
    minOverlap = tk.overlap
    smallestAxis = tk.axis
    contactVertex = tk.vertex
  }

  if (!tk) return false
  return {
    overlap: minOverlap,
    axis: smallestAxis,
    vertex: contactVertex
  }
}

// box-box 碰撞检测
const intersectsBox_Box = function (o1, o2) {
  let overlap = 0
  let minOverlap = null
  let axis = new Vector3()
  let vertex = null
  const VA = o1.unitAxis
  const VB = o2.unitAxis
  const v = sub(o2.center, o1.center)
  const T = [dot(v, VA[0]), dot(v, VA[1]), dot(v, VA[2])]
  const R = [[], [], []]
  const FR = [[], [], []]
  for (let i = 0; i < 3; i++) {
    for (let k = 0; k < 3; k++) {
      let d = dot(VA[i], VB[k])
      if (d > 0 && d < 0.0001) d = 0
      R[i][k] = d
      FR[i][k] = Math.abs(d)
    }
  }

  let ra
  let rb
  let t
  // A's basis vectors
  for (let i = 0; i < 3; i++) {
    ra = o1.halfSize[Key[i]]
    rb = o2.halfSize.x * FR[i][0] + o2.halfSize.y * FR[i][1] + o2.halfSize.z * FR[i][2]
    t = Math.abs(T[i])
    overlap = ra + rb - t
    if (minOverlap === null || overlap && overlap < minOverlap) {
      minOverlap = overlap
      axis = axis.copy(VA[i]).normalize()
    }
    if (overlap < 0) return false
  }

  // B's basis vectors
  for (let i = 0; i < 3; i++) {
    ra = o1.halfSize.x * FR[0][i] + o1.halfSize.y * FR[1][i] + o1.halfSize.z * FR[2][i]
    rb = o2.halfSize[Key[i]]
    t = Math.abs(T[0] * R[0][i] + T[1] * R[1][i] + T[2] * R[2][i])
    overlap = ra + rb - t
    if (overlap && overlap < minOverlap) {
      minOverlap = overlap
      axis = axis.copy(VB[i]).normalize()
    }
    if (overlap < 0) return false
  }

  //9 cross products
  // L = A0 x B0
  ra = o1.halfSize.y * FR[2][0] + o1.halfSize.z * FR[1][0]
  rb = o2.halfSize.y * FR[0][2] + o2.halfSize.z * FR[0][1]
  t = Math.abs(T[2] * R[1][0] - T[1] * R[2][0])
  overlap = ra + rb - t
  if (overlap && overlap < minOverlap) {
    minOverlap = overlap
    axis = cross(VA[0], VB[0])
  }
  if (overlap < 0) return false

  // L = A0 x B1
  ra = o1.halfSize.y * FR[2][1] + o1.halfSize.z * FR[1][1]
  rb = o2.halfSize.x * FR[0][2] + o2.halfSize.z * FR[0][0]
  t = Math.abs(T[2] * R[1][1] - T[1] * R[2][1])
  overlap = ra + rb - t
  if (overlap && overlap < minOverlap) {
    minOverlap = overlap
    axis = cross(VA[0], VB[1])
  }
  if (overlap < 0) return false

  // L = A0 x B2
  ra = o1.halfSize.y * FR[2][2] + o1.halfSize.z * FR[1][2]
  rb = o2.halfSize.x * FR[0][1] + o2.halfSize.y * FR[0][0]
  t = Math.abs(T[2] * R[1][2] - T[1] * R[2][2])
  overlap = ra + rb - t
  if (overlap && overlap < minOverlap) {
    minOverlap = overlap
    axis = cross(VA[0], VB[2])
  }
  if (overlap < 0) return false

  // L = A1 x B0
  ra = o1.halfSize.x * FR[2][0] + o1.halfSize.z * FR[0][0]
  rb = o2.halfSize.y * FR[1][2] + o2.halfSize.z * FR[1][1]
  t = Math.abs(T[0] * R[2][0] - T[2] * R[0][0])
  overlap = ra + rb - t
  if (overlap && overlap < minOverlap) {
    minOverlap = overlap
    axis = cross(VA[1], VB[0])
  }
  if (overlap < 0) return false

  // L = A1 x B1
  ra = o1.halfSize.x * FR[2][1] + o1.halfSize.z * FR[0][1]
  rb = o2.halfSize.x * FR[1][2] + o2.halfSize.z * FR[1][0]
  t = Math.abs(T[0] * R[2][1] - T[2] * R[0][1])
  overlap = ra + rb - t
  if (overlap && overlap < minOverlap) {
    minOverlap = overlap
    axis = cross(VA[1], VB[1])
  }
  if (overlap < 0) return false

  // L = A1 x B2
  ra = o1.halfSize.x * FR[2][2] + o1.halfSize.z * FR[0][2]
  rb = o2.halfSize.x * FR[1][1] + o2.halfSize.y * FR[1][0]
  t = Math.abs(T[0] * R[2][2] - T[2] * R[0][2])
  overlap = ra + rb - t
  if (overlap && overlap < minOverlap) {
    minOverlap = overlap
    axis = cross(VA[1], VB[2])
  }
  if (overlap < 0) return false

  // L = A2 x B0
  ra = o1.halfSize.x * FR[1][0] + o1.halfSize.y * FR[0][0]
  rb = o2.halfSize.y * FR[2][2] + o2.halfSize.z * FR[2][1]
  t = Math.abs(T[1] * R[0][0] - T[0] * R[1][0])
  overlap = ra + rb - t
  if (overlap && overlap < minOverlap) {
    minOverlap = overlap
    axis = cross(VA[2], VB[0])
  }
  if (overlap < 0) return false

  // L = A2 x B1
  ra = o1.halfSize.x * FR[1][1] + o1.halfSize.y * FR[0][1]
  rb = o2.halfSize.x * FR[2][2] + o2.halfSize.z * FR[2][0]
  t = Math.abs(T[1] * R[0][1] - T[0] * R[1][1])
  overlap = ra + rb - t
  if (overlap && overlap < minOverlap) {
    minOverlap = overlap
    axis = cross(VA[2], VB[1])
  }
  if (overlap < 0) return false

  // L = A2 x B2
  ra = o1.halfSize.x * FR[1][2] + o1.halfSize.y * FR[0][2]
  rb = o2.halfSize.x * FR[2][1] + o2.halfSize.y * FR[2][0]
  t = Math.abs(T[1] * R[0][2] - T[0] * R[1][2])
  overlap = ra + rb - t
  if (overlap && overlap < minOverlap) {
    minOverlap = overlap
    axis = cross(VA[2], VB[2])
  }
  if (overlap < 0) return false
  if (dot(axis, v) > 0) axis.multiplyScalar(-1)
  return { overlap: minOverlap, axis, vertex }
}

// box-sphere 碰撞检测
const intersectsBox_Sphere = function (_o1, _o2) {
  const { o1, o2 } = exchange(_o1, _o2, 'Box')
  let axis = sub(o1.center, o2.center)
  const VA = o1.unitAxis
  const v1 = sub(o2.center, o1.center)
  const result = new Vector3().copy(o1.center)
  const x = clamp(-o1.halfSize.x, o1.halfSize.x, dot(v1, VA[0]))
  result.add(VA[0].multiplyScalar(x))
  const y = clamp(-o1.halfSize.y, o1.halfSize.y, dot(v1, VA[1]))
  result.add(VA[1].multiplyScalar(y))
  const z = clamp(-o1.halfSize.z, o1.halfSize.z, dot(v1, VA[2]))
  result.add(VA[2].multiplyScalar(z))
  const len = distanceToSquared(result, o2.center)
  // 检测距离是否相交
  let minOverlap = o2.radius * o2.radius - len
  if (minOverlap < 0) return false
  axis = axis.copy(result).sub(o2.center).multiplyScalar(-1).normalize()
  return { overlap: minOverlap, axis, vertex: null }
}

// sphere-sphere 碰撞检测
const intersectsSphere_Sphere = function (o1, o2) {
  let d = sub(o1.center, o2.center)
  const axis = new Vector3().copy(d).normalize()
  const radious = o1.radius + o2.radius
  // 检测距离是否相交
  let minOverlap = radious - d.length()
  if (minOverlap < 0) return false
  return { overlap: minOverlap, axis, vertex: null }
}
