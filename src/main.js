import Vue from 'vue'
import ElementUI from 'element-ui'
import App from './_platform/App.vue'
import { Const, State, Mutations } from './_platform/store/state'
import 'element-ui/lib/theme-chalk/index.css'
import game from './game.js'

Vue.use(ElementUI, { size: 'small', zIndex: 3000 })
Vue.prototype.$const = Const
Vue.prototype.$state = State
Vue.prototype.$handle = Mutations
Vue.prototype.$game = game
window.game = game
new Vue({
  render: h => h(App)
}).$mount('#app')
