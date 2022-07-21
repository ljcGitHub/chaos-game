
export const getFilePathName = function (paths) {
  let str = paths.substr(0, 1) === '.' ? paths.substr(1) : paths
  const strArr = str.split('/').filter(p => p)
  return strArr.map((item, $index) => {
    if ($index === strArr.length - 1) {
      const $$index = item.lastIndexOf('.')
      return $$index > -1 ? item.substr(0, $$index) : item
    } else {
      return item
    }
  })
}

export const getAssetsPath = function (rq) {
  const objs = {}
  rq.keys().forEach(k => {
    const fileNames = getFilePathName(k)
    let target = objs
    if (fileNames.length > 1) {
      fileNames.forEach((fileName, $index) => {
        if ($index === fileNames.length - 1) {
          target[fileName] = rq(k)
        } else {
          if (!target[fileName]) target[fileName] = {}
          target = target[fileName]
        }
      })
    } else {
      objs[fileNames[0]] = rq(k)
    }
  })
  return objs
}

export const getScript = () => getAssetsPath(require.context('../script/', true, /\.js$/))
