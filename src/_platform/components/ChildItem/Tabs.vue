<template>
  <div class="header-tabs">
    <div
      class="header-tabs-item"
      v-for="item in data"
      :key="item.value"
      :class="{active: value == item.value}"
      @click="change(item.value)"
    >
      {{ item.label }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'Tabs',
  props: {
    data: {
      type: Array,
      default: () => []
    },
    value: {
      type: String,
      default: ''
    }
  },
  methods: {
    change(value) {
      this.$emit('input', value)
      this.$emit('change', value)
    }
  }
}

</script>

<style scoped lang="stylus">
.header-tabs {
  display: flex;
  width: 100%;
  height: 32px;
}

.header-tabs-item {
  padding: 0 16px;
  height: 32px;
  line-height: 32px;
  font-size: 12px;
  color: #969696;

  &.active {
    background-color: #606060;
    color: #fff;
  }

  &:hover {
    color: #fff;
    cursor: pointer;
  }
}
</style>
