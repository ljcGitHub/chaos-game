import THREE from '../_libs/three.js'

const isDev = process.env.NODE_ENV === 'development'
const Touchstart = ['touchstart', 'mousedown']
const Touchmove = ['touchmove', 'mousemove']
const Touchend = ['touchend', 'touchcancel', 'mouseup', 'mousecancel']

export default class Event {
  constructor(game) {
    this.game = game
    this._events = []
    this._touches = {}
    this.mouse = new THREE.Vector2() // 鼠标坐标值
    this.raycaster = new THREE.Raycaster() // 射线
    this.bindEvent(Touchstart, e => this.touchstart(e))
    this.bindEvent(Touchmove, e => this.touchmove(e))
    this.bindEvent(Touchend, e => this.touchend(e))
  }

  touchstart(touches) {
    // 按下
    this.getIntersectObject(touches)
    this.dispatch('touchstart', touches)
    isDev && this.selectGameObject(touches)
  }

  touchmove(touches) {
    // 按着
    touches.forEach(touche => {
      if (this._touches[touche.identifier]) {
        this._touches[touche.identifier].pageX = touche.pageX
        this._touches[touche.identifier].pageY = touche.pageY
        this._touches[touche.identifier].isMove = true
      }
    })
    this.dispatch('touchmove', touches)
  }

  touchend(touches) {
    // 按起
    this.dispatch('touchend', touches)
  }

  dispatch(type, touches) {
    for (let i = 0; i < touches.length; i++) {
      const e = touches[i]
      const _touches = this._touches[e.identifier]
      if (_touches) {
        let isNext = true
        const preventDefault = function () {
          isNext = false
        }
        for (let i = 0; i < _touches.length; i++) {
          const touche = _touches[i]
          const data = touche.object.userData
          touche.preventDefault = preventDefault
          if (isNext) {
            data[type] && data[type](touche)
            !touche.isMove && data['click'] && data['click'](touche)
          }
        }
      }
      if (type === 'touchend') delete this._touches[e.identifier]
    }
  }

  getIntersectObject(touches) {
    touches.forEach(touche => {
      this.mouse.x = (touche.pageX / this.game.w) * 2 - 1
      this.mouse.y = 0 - (touche.pageY / this.game.h) * 2 + 1
      this.raycaster.setFromCamera(this.mouse, this.game.camera)
      const intersects = this.raycaster.intersectObjects(this._events)
      const touches = []
      intersects.forEach(obj => {
        touches.push({
          ...touche,
          object: obj.object
        })
      })
      this._touches[touche.identifier] = touches
    })
  }

  on(obj) {
    if (this._events.indexOf(obj) === -1) {
      this._events.push(obj)
    }
  }

  off(obj) {
    this._events.splice(this._events.indexOf(obj), 1)
  }

  bindEvent(events, callback) {
    events.forEach(type => {
      document.addEventListener(type, e => {
        if (isDev) {
          if (e.target === window.canvas) {
            e.preventDefault()
            if (Touchstart.includes(type)) this.active = true
            if (Touchmove.includes(type) && !this.active) return false
            if (Touchend.includes(type)) this.active = false
            callback(this.getEventData(e))
          }
        } else {
          callback(this.getEventData(e))
        }
      })
    })
  }

  selectGameObject(touches) {
    const touche = touches[0]
    this.mouse.x = (touche.pageX / this.game.w) * 2 - 1
    this.mouse.y = 0 - (touche.pageY / this.game.h) * 2 + 1
    this.raycaster.setFromCamera(this.mouse, this.game.camera)
    const intersects = this.raycaster.intersectObjects(this.game.scene.children)
    if (isDev && intersects.length) {
      this.game.selectObject(intersects[0].object)
    }
  }

  getEventData(e) {
    // 获取鼠标/触摸的数据
    let touches = []
    let rect = { top: 0, left: 0 }
    if (isDev) rect = window.canvas.getBoundingClientRect()
    if (e.changedTouches) {
      for (let i = 0; i < e.changedTouches.length; i++) {
        const touche = e.changedTouches[i]
        touches.push({
          identifier: touche.identifier,
          pageX: touche.pageX - rect.left,
          pageY: touche.pageY - rect.top
        })
      }
    } else {
      touches.push({
        identifier: 0,
        pageX: e.pageX - rect.left,
        pageY: e.pageY - rect.top
      })
    }
    return touches
  }
}
