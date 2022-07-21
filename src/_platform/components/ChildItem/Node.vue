<template>
  <div>
    <div v-for="item in data" :key="item.uuid" class="NodeTreeItem">
      <div
        :class="{
          active: item.uuid == selectUid,
        }"
        class="NodeTreeLabel"
        @click="selectItem(item)"
      >
        {{ item.label }}
      </div>
      <Node v-if="item.children.length" :data="item.children"></Node>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Array
    }
  },
  name: 'Node',
  computed: {
    selectUid() {
      return this.$state.selectUid
    }
  },
  methods: {
    selectItem(data) {
      this.$game.selectUid = data.uuid
      this.$state.selectUid = data.uuid
    }
  }
}

</script>

<style lang="stylus">
.NodeTreeItem {
  margin-left: 10px;
}

.NodeTreeLabel {
  line-height: 28px;
  font-size: 12px;

  &.active {
    color: #ff3300;
  }
}
</style>
