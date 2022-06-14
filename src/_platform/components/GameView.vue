<template>
  <div class="GameView" :style="viewStyle"></div>
</template>

<script>
export default {
  name: 'GameView',
  computed: {
    devicesItem() {
      return this.$const.devicesArrs.find(item => item.label === this.$state.deviceValue)
    },
    deviceValue() {
      return this.$state.deviceValue
    },
    deviceDirectionIsHorizontal() {
      return this.$state.deviceDirectionIsHorizontal
    },
    viewStyle() {
      if (this.isGame) return ''
      return `transform: scale(${this.$state.ratioValue / 100});`
    },
    isGame() {
      return this.$state.perspectiveTabsValue === this.$const.perspectiveTabs[0].value
    }
  },
  mounted() {
    this.refresh()
    this.$el.appendChild(window.canvas)
  },
  methods: {
    refresh() {
      const v = this.devicesItem
      if (this.isGame) {
        const el = this.$el.parentElement
        this.$game.setSize(el.clientWidth, el.clientHeight)
      } else {
        if (this.deviceDirectionIsHorizontal) {
          this.$game.setSize(v.value[1], v.value[0])
        } else {
          this.$game.setSize(v.value[0], v.value[1])
        }
      }
    }
  },
  watch: {
    deviceValue() {
      this.refresh()
    },
    deviceDirectionIsHorizontal() {
      this.refresh()
    },
    isGame() {
      this.refresh()
    }
  },
  components: {}
}

</script>

<style scoped lang="stylus">
.GameView {
  display: inline-block;
  border: 1px solid #dcdcdc;
}
</style>
