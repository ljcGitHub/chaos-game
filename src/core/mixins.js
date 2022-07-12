import THREE from '../_libs/three.js'
import { cloneDeep } from '../common/utils'
import { Body, Box, Sphere } from './physical/index.js'

// userData 混入自定义数据
// 位置
export function transformMixins(obj, transform) {
  if (transform) {
    obj.userData.transform = cloneDeep(transform)
  } else {
    obj.userData.transform = {
      position: new THREE.Vector3(),
      rotation: new THREE.Euler()
    }
  }
}
export function transformStringify(obj) {
  return cloneDeep(obj.userData.transform)
}

// 物理
export function physicalMixins(obj, data = {}) {
  const comps = []
  if (data.comp) {
    data.comp.forEach(comp => {
      let n = physicalShapeMixins(comp)
      if (n) comps.push(n)
    })
  }
  obj.userData.physical = new Body({
    mass: data.mass,
    inertia: data.inertia,
    elasticity: data.elasticity,
    friction: data.friction,
    maxSpeed: data.maxSpeed,
    layer: data.layer
  })
  comps.forEach(comp => {
    obj.userData.physical.addShape(comp)
  })
}
export function physicalStringify(obj) {
  const data = obj.userData.physical
  return {
    mass: data.mass,
    inertia: data.inertia,
    elasticity: data.elasticity,
    friction: data.friction,
    maxSpeed: data.maxSpeed,
    layer: data.layer,
    comp: data.comp.map(comp => {
      return {
        halfSize: comp.halfSize,
        radius: comp.radius,
        offsetPosition: comp.offsetPosition,
        offsetRotation: comp.offsetRotation
      }
    })
  }
}
export function physicalShapeMixins(comp) {
  if (comp.shapeType === 'Box') {
    return new Box({
      width: comp.halfSize.x * 2,
      height: comp.halfSize.y * 2,
      depth: comp.halfSize.z * 2,
      offsetPosition: comp.offsetPosition,
      offsetRotation: comp.offsetRotation
    })
  }
  if (comp.shapeType === 'Sphere') {
    return new Sphere({
      radius: comp.radius,
      offsetPosition: comp.offsetPosition,
      offsetRotation: comp.offsetRotation
    })
  }
}
