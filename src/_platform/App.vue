<template>
  <div class="app">
    <div class="app-left">
      <NodeTree></NodeTree>
    </div>
    <div class="app-main">
      <div class="app-perspective">
        <Perspective></Perspective>
      </div>
      <div class="app-view">
        <GameView></GameView>
      </div>
    </div>
    <div class="app-right">
      <Attribute></Attribute>
    </div>
  </div>
</template>

<script>
import NodeTree from './components/NodeTree'
import Perspective from './components/Perspective'
import GameView from './components/GameView'
import Attribute from './components/Attribute'

export default {
  name: 'App',
  mounted() {
    const events = ['keydown', 'mouseup']
    events.forEach(event => {
      document.addEventListener(event, () => {
        setTimeout(() => {
          this.getActiveObject3d()
        }, 60)
      })
    })
  },
  methods: {
    getActiveObject3d() {
      if (this.$state.selectUid !== this.$game.selectUid) {
        this.$state.selectUid = this.$game.selectUid
      }
    }
  },
  components: {
    NodeTree,
    Perspective,
    GameView,
    Attribute
  }
}

</script>

<style lang="stylus">
@import './common/common';

.app {
  display: flex;
  width: 100vw;
  height: 100vh;
  background-color: #1e1e1e;
  user-select: none;
}

.app-left {
  width: 240px;
  flex-shrink: 0;
}

.app-main {
  position: relative;
  margin: 0 4px;
  width: 100%;
  overflow: hidden;

  .app-perspective {
    position: absolute;
    width: 100%;
    top: 0;
    left: 0;
    z-index: 20;
  }

  .app-view {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 70px;
    left: 0;
    bottom: 0;
    width: 100%;
    z-index: 10;
  }
}

.app-right {
  width: 360px;
  flex-shrink: 0;
}
</style>
