import { cloneDeep } from '../common/utils'

// userData 混入自定义数据
// 位置
export function transformMixins(obj, transform) {
  if (transform) {
    obj.userData.transform = cloneDeep(transform)
  } else {
    obj.userData.transform = {
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 0, y: 0, z: 0 }
    }
  }
}

// 物理
export function physicalMixins(obj) {
}
