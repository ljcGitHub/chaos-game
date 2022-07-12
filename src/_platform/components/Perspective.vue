<template>
  <div class="Perspective">
    <div class="Perspective-tab">
      <Tabs
        :data="$const.perspectiveTabs"
        v-model="$state.perspectiveTabsValue"
        @change="(v) => $handle.change('perspectiveTabsValue', v)"
      ></Tabs>
    </div>
    <div class="Perspective-dropdown">
      <el-dropdown @command="deviceChange">
        <span class="Perspective-dropdown-link el-dropdown-link">
          {{ $state.deviceValue }}<i class="el-icon-caret-bottom"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            v-for="device in $const.devicesArrs"
            :key="device.label"
            :command="device.label"
            >{{ device.label }}</el-dropdown-item
          >
        </el-dropdown-menu>
      </el-dropdown>
      <el-dropdown @command="ratioChange">
        <span class="Perspective-dropdown-link el-dropdown-link">
          {{ $state.ratioValue }}%<i class="el-icon-caret-bottom"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            v-for="ratio in $const.ratioArrs"
            :key="ratio"
            :command="ratio"
            >{{ ratio }}%</el-dropdown-item
          >
        </el-dropdown-menu>
      </el-dropdown>

      <div
        class="Perspective-dropdown-button"
        :class="{
          active: $state.deviceDirectionIsHorizontal,
        }"
        @click="
          () =>
            $handle.change(
              'deviceDirectionIsHorizontal',
              !$state.deviceDirectionIsHorizontal
            )
        "
      >
        <Icon iconClass="rotating"></Icon>
      </div>

      <div class="Perspective-button">
        <div class="Perspective-button-icon">
          <Icon iconClass="stop"></Icon>
        </div>
        <div class="Perspective-button-icon">
          <Icon iconClass="play"></Icon>
        </div>
        <div class="Perspective-button-icon">
          <Icon iconClass="pause"></Icon>
        </div>
        <div class="Perspective-button-icon">
          <Icon iconClass="nextTick"></Icon>
        </div>
        <div class="Perspective-button-icon">
          <Icon iconClass="refresh"></Icon>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Tabs from './ChildItem/Tabs'
import Icon from './Icon.vue'

export default {
  name: 'Perspective',
  computed: {
    perspectiveTabsValue() {
      return this.$state.perspectiveTabsValue
    }
  },
  methods: {
    deviceChange(e) {
      const item = this.$const.devicesArrs.find(_item => _item.label === e)
      this.$handle.change('deviceValue', item.label)
    },
    ratioChange(e) {
      this.$handle.change('ratioValue', e)
    }
  },
  components: {
    Tabs,
    Icon
  },
  watch: {
    perspectiveTabsValue: {
      handler() {
        if (this.perspectiveTabsValue === 'game') {
          this.$game.showHelp()
        } else {
          this.$game.hideHelp()
        }
      },
      immediate: true
    }
  }
}

</script>

<style scoped lang="stylus">
.Perspective {
  width: 100%;
  background-color: #2e2e2e;
}

.Perspective-tab {
  display: flex;
  width: 100%;
  height: 32px;
}

.Perspective-dropdown {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  height: 38px;
  background-color: #3d3c3c;

  .Perspective-dropdown-link {
    display: block;
    padding: 10px;
    font-size: 12px;
    color: #787575;
    transform: scale(0.9);
    cursor: pointer;

    &:hover {
      color: #969696;
    }
  }
}

.Perspective-item {
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

.Perspective-button {
  position: absolute;
  right: 10px;
  top: 50%;
  display: flex;
  background-color: #787878;
  border-radius: 4px;
  overflow: hidden;
  transform: translateY(-50%);
}

.Perspective-button-icon {
  display: flex;
  padding: 0 10px;
  height: 24px;
  align-items: center;
  font-size: 12px;
  color: #fff;

  &.active {
    color: #67C23A;
  }

  &:hover {
    cursor: pointer;
    background-color: #606060;
  }
}

.Perspective-dropdown-button {
  display: flex;
  padding: 0 10px;
  height: 24px;
  align-items: center;
  font-size: 14px;
  color: #787575;
  border-radius: 4px;
  overflow: hidden;

  &.active {
    color: #67C23A;
  }

  &:hover {
    cursor: pointer;
    background-color: #606060;
  }
}
</style>
