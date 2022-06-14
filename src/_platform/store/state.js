import Vue from 'vue'

export const Const = {
  perspectiveTabs: [{
    label: 'Game',
    value: 'game'
  }, {
    label: 'Scene',
    value: 'scene'
  }],
  devicesArrs: [{
    label: 'iphone6',
    value: [375, 667]
  }, {
    label: 'iphone12 Pro',
    value: [390, 844]
  }, {
    label: 'Samsung S8+',
    value: [360, 740]
  }],
  ratioArrs: [100, 85, 75, 60, 50]
}

export const State = Vue.observable({
  // 视角区域
  perspectiveTabsValue: Const.perspectiveTabs[0].value,
  // 模拟机型分辨率
  deviceValue: Const.devicesArrs[0].label,
  // 模拟机型缩放
  ratioValue: Const.ratioArrs[2],
  // 模拟机型方向（横向，纵向）
  deviceDirectionIsHorizontal: false,
  // 3d对象
  selectUid: ''
})

export const Mutations = {
  change(keyName, newValue) {
    if (State.hasOwnProperty(keyName)) {
      State[keyName] = newValue
    }
  },
  setSelectUid(val) {
    State.selectUid = val
  }
}
