/* eslint-disable */
import THREE from '../../../_libs/three.js'

export const Vector3 = THREE.Vector3

export const toVector3 = function (v) {
  if (v.isVector3) return v
  return new Vector3(v.x, v.y, v.z)
}

export const Euler = THREE.Euler
export const toEuler = function (v) {
  if (v.isEuler) return v
  return new Euler(v.x, v.y, v.z)
}

export const Matrix3 = THREE.Matrix3

export const dot = function (v1, v2) {
  let v = new THREE.Vector3(v1.x, v1.y, v1.z)
  return v.dot(v2)
}

export const sub = function (v1, v2) {
  let v = new THREE.Vector3(v1.x, v1.y, v1.z)
  v.sub(v2)
  return v
}

export const add = function (v1, v2) {
  let v = new THREE.Vector3(v1.x, v1.y, v1.z)
  v.add(v2)
  return v
}

export const multiply = function (v1, v2) {
  let v = new THREE.Vector3(v1.x, v1.y, v1.z)
  v.multiply(v2)
  return v
}

export const cross = function (a, b) {
  let ax = a.x, ay = a.y, az = a.z
  let bx = b.x, by = b.y, bz = b.z
  return new THREE.Vector3(
    ay * bz - az * by,
    az * bx - ax * bz,
    ax * by - ay * bx
  )
}

export const clamp = function (min, max, value) {
  return Math.max(min, Math.min(max, value))
}

export const distanceToSquared = function (v1, v2) {
  let dx = v1.x - v2.x
  let dy = v1.y - v2.y
  let dz = v1.z - v2.z
  return dx * dx + dy * dy + dz * dz
}

// 围绕着X轴旋转
export const doTwistX = function (position, angle) {
  let s1ngle = Math.sin(angle)
  let c1ngle = Math.cos(angle)
  return new Vector3(
    position.x,
    position.y * c1ngle + s1ngle * position.z,
    -position.y * s1ngle + c1ngle * position.z
  )
}
// 围绕着Y轴旋转
export const doTwistY = function (position, angle) {
  let s1ngle = Math.sin(angle)
  let c1ngle = Math.cos(angle)
  return new Vector3(
    position.x * c1ngle - s1ngle * position.z,
    position.y,
    position.x * s1ngle + c1ngle * position.z
  )
}
// 围绕着Z轴旋转
export const doTwistZ = function (position, angle) {
  let s1ngle = Math.sin(angle)
  let c1ngle = Math.cos(angle)
  return new Vector3(
    position.x * c1ngle + s1ngle * position.y,
    -position.x * s1ngle + c1ngle * position.y,
    position.z
  )
}

export const extractBasis = function (box) {
  let s1 = Math.sin(-box.rotation.x)
  let c1 = Math.cos(-box.rotation.x)
  let s2 = Math.sin(-box.rotation.y)
  let c2 = Math.cos(-box.rotation.y)
  let s3 = Math.sin(-box.rotation.z)
  let c3 = Math.cos(-box.rotation.z)

  return [
    new Vector3(c2 * c3, s1 * s2 * c3 - c1 * s3, c1 * s2 * c3 + s1 * s3),
    new Vector3(c2 * s3, s1 * s2 * s3 + c1 * c3, c1 * s2 * s3 - s1 * c3),
    new Vector3(-s2, s1 * c2, c1 * c2)
  ]
}

export const copy = function (v1, v2) {
  v1.x = v2.x
  v1.y = v2.y
  v1.z = v2.z
  return v1
}
