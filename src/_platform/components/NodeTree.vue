<template>
  <div class="NodeTree">
    <div class="NodeTree-tabs">
      <Tabs
        :data="tabs"
        v-model="tabsValue"
      ></Tabs>
    </div>
    <div class="NodeTree-content">
      <div class="NodeTree-header">
        <el-input placeholder="搜索节点" v-model="search" clearable>
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
      </div>
      <el-tree
        class="NodeTreeContent"
        :data="data"
        :props="defaultProps"
        @node-click="handleNodeClick"
      ></el-tree>
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
      data: [{
        label: '一级 1',
        children: [{
          label: '二级 1-1',
          children: [{
            label: '三级 1-1-1'
          }]
        }]
      }, {
        label: '一级 2',
        children: [{
          label: '二级 2-1',
          children: [{
            label: '三级 2-1-1'
          }]
        }, {
          label: '二级 2-2',
          children: [{
            label: '三级 2-2-1'
          }]
        }]
      }, {
        label: '一级 3',
        children: [{
          label: '二级 3-1',
          children: [{
            label: '三级 3-1-1'
          }]
        }, {
          label: '二级 3-2',
          children: [{
            label: '三级 3-2-1'
          }]
        }]
      }],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
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
  computed: {},
  created() { },
  methods: {
    handleNodeClick(data) {
      console.log(data)
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
  background-color: #2e2e2e !important;
  color: #fff !important;

  .el-tree-node, .el-tree-node__content {
    background-color: #2e2e2e !important;
  }

  .el-tree-node__content:hover, .el-upload-list__item:hover {
    background-color: #434343 !important;
  }
}
</style>
