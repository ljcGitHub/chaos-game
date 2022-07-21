<template>
  <el-select v-model="form[functionPaths]" size="mini" @change="functionChange" filterable clearable>
    <el-option
      v-for="item in handleOptions"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
</template>

<script>
import { functionMixins } from '@/core/mixins.js'

export default {
  name: 'Func',
  props: {
    form: {
      type: Object
    },
    functionCallBackName: {
      type: String,
      default: ''
    },
    functionPaths: {
      type: String,
      default: ''
    }
  },
  computed: {
    handleOptions() {
      return this.$game.handleOptions
    }
  },
  methods: {
    functionChange() {
      if (!this.form[this.functionPaths]) {
        this.form[this.functionCallBackName] = null
      } else {
        this.form[this.functionCallBackName] = functionMixins(this.form[this.functionPaths], this.$game.handle)
      }
      this.$emit('change', this.form[this.functionCallBackName])
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
