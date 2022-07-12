<template>
  <div class="Vector">
    <h4 class="Vector-title" v-if="title">{{ title }}</h4>
    <div class="Vector-content">
      <template v-if="isString">
        <div class="Vector-item">
          <span class="Vector-label" style="min-width:45px;">{{ subtitle }}</span>
          <el-input @keydown.native="e => keydown(e, data)" @input="change(data, form[data])" v-model="form[data]" size="mini"></el-input>
        </div>
      </template>
      <template v-else>
        <div class="Vector-item" v-for="item in data" :key="item">
          <span class="Vector-label">{{ toLocaleUpperCase(item) }}</span>
          <el-input @keydown.native="e => keydown(e, item)" @input="change(item, form[item])" v-model="form[item]" size="mini"></el-input>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { add, sub } from '../../../common/math'

export default {
  name: 'Vector',
  props: {
    title: {
      type: String,
      default: ''
    },
    subtitle: {
      type: String,
      default: ''
    },
    form: {
      type: Object
    },
    data: {
      type: [Array, String],
      default: () => []
    }
  },
  computed: {
    isString() {
      return this.data.constructor === String
    }
  },
  methods: {
    toLocaleUpperCase(v) {
      return v.substr(0, 1).toLocaleUpperCase() + v.substr(1)
    },
    keydown(e, item) {
      const num = e.altKey ? 0.1 : 1
      e.stopPropagation()
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        this.form[item] = add(this.form[item], num)
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        this.form[item] = sub(this.form[item], num)
      }
    },
    change(item, val) {
      this.form[item] = Number(this.form[item])
      this.$emit('change', item, val)
    }
  }
}

</script>

<style lang="stylus">
.Vector {
  padding: 5px;

  .Vector-title {
    padding: 0 4px 4px 4px;
    font-size: 13px;
    font-weight: bold;
    color: #969696;
  }

  .Vector-content {
    display: flex;
    padding-left: 20px;
  }

  .Vector-item {
    display: flex;
    align-items: center;

    &+.Vector-item {
      margin-left: 10px;
    }
  }

  .Vector-label {
    margin-right: 10px;
    font-size: 12px;
    font-weight: bold;
    color: #969696;
    flex-shrink: 0;
    text-align: right;
  }

  .el-input__inner {
    padding: 0 4px;
    background-color: #383838;
    color: #969696;
    border-color: #222;
    height: 24px !important;
    line-height: 24px !important;
  }
}
</style>
