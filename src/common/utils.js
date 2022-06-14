export const fps = Math.ceil(1000 / 60)

// 帧函数
export const raf = function (callback) {
  if (window.requestAnimationFrame) return window.requestAnimationFrame(callback)
  setTimeout(() => {
    callback()
  }, fps)
}

// 深拷贝
export const cloneDeep = function (data) {
  if (!data) return data
  if (typeof data !== 'object') return data
  if (data.constructor === Date) return new Date(data)
  const clone = Array.isArray(data) ? [] : {}
  for (let key in data) {
    if (data.hasOwnProperty(key)) {
      if (typeof data[key] === 'object') {
        clone[key] = cloneDeep(data[key])
      } else {
        clone[key] = data[key]
      }
    }
  }
  return clone
}
