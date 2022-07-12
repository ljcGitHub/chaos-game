<template>
  <div class="NodeTree">
    <div class="NodeTree-tabs">
      <Tabs :data="tabs" v-model="tabsValue"></Tabs>
    </div>
    <div class="NodeTree-content">
      <div class="NodeTree-header">
        <el-input placeholder="搜索节点" v-model="search" clearable>
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
      </div>
      <div class="NodeTreeContent">
        <div v-for="item in data" :key="item.label" class="NodeTreeItem">
          <div
            :class="{
              active: item.uuid == selectUid,
            }"
            class="NodeTreeLabel"
            @click="selectItem(item)"
          >
            {{ item.label }}
          </div>
          <div
            v-for="child in item.children"
            :key="child.label"
            class="NodeTreeItem"
            @click="selectItem(child)"
          >
            <div
              class="NodeTreeLabel"
              :class="{
                active: child.uuid == selectUid,
              }"
            >
              {{ item.label }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Tabs from './ChildItem/Tabs'

export default {
  name: 'NodeTree',
  data() {
    return {
      search: '',
      tabs: [{
        label: 'Project',
        value: 'Project'
      }, {
        label: 'Nodes',
        value: 'Nodes'
      }],
      tabsValue: 'Project'
    }
  },
  computed: {
    selectUid() {
      return this.$state.selectUid
    },
    data() {
      if (this.tabsValue === 'Project') return []
      return this.getNodes(this.$game.scene.children)
    }
  },
  methods: {
    getNodes(arr = [], out = []) {
      for (let i = 0; i < arr.length; i++) {
        const item = arr[i]
        const children = []
        const label = this.getObjectName(item)
        if (item.userData.hide) continue
        if (!label) continue
        out.push({
          label,
          uuid: item.uuid,
          children
        })
        if (item.children.length) {
          this.getNodes(item.children, children)
        }
      }
      return out
    },
    getObjectName(obj) {
      if (obj.userData.tag) return obj.userData.tag
      if (obj.isScene) return `Scene(${obj.id})`
      if (obj.isCamera) return `Camera(${obj.id})`
      if (obj.isMesh) return `Mesh(${obj.id})`
      if (obj.isLine) return false
      return `Object3D(${obj.id})`
    },
    selectItem(data) {
      this.$game.selectUid = data.uuid
      this.$state.selectUid = data.uuid
    }
  },
  components: {
    Tabs
  }
}

</script>

<style lang="stylus">
.NodeTree {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #2e2e2e;

  .NodeTree-tabs {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 32px;
  }

  .NodeTree-content {
    position: absolute;
    top: 32px;
    left: 0;
    width: 100%;
    bottom: 0;
    overflow-x: hidden;
    overflow-y: auto;
  }
}

.NodeTree-header {
  position: sticky;
  top: 0;
  z-index: 10;
  padding: 3px 10px 6px 10px;

  .el-input__inner {
    border-color: #424242 !important;
    background-color: #383838 !important;
    color: #b4b4b4 !important;
  }
}

.NodeTreeContent {
  background-color: #2e2e2e;
  color: #fff;

  .NodeTreeItem {
    padding: 5px 10px;

    & > .NodeTreeItem {
      margin-left: 10px;
      padding: 5px 10px;
    }
  }

  .NodeTreeLabel {
    font-size: 12px;

    &.active {
      color: #ff3300;
    }
  }
}
</style>
