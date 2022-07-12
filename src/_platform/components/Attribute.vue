<template>
  <div class="Attribute" v-if="selectUid">
    <div class="Attribute-item">
      <div class="Attribute-item-header">Transform(变换)</div>
      <template v-if="target.transform">
        <Vector3
          title="Position"
          :form="target.transform.position"
          :data="position"
        ></Vector3>
        <Vector3
          title="Rotation"
          :form="target.transform.rotation"
          :data="position"
        ></Vector3>
      </template>
    </div>

    <div class="Attribute-item">
      <div class="Attribute-item-header">Physical(刚体)</div>
      <template v-if="target.physical">
        <Vector3 :form="target.physical" subtitle="质量" data="mass"></Vector3>
        <Vector3
          :form="target.physical"
          subtitle="惯性"
          data="inertia"
        ></Vector3>
        <Vector3
          :form="target.physical"
          subtitle="弹性值"
          data="elasticity"
        ></Vector3>
        <Vector3
          :form="target.physical"
          subtitle="摩擦力"
          data="friction"
        ></Vector3>
        <div class="AttributeItem">
          <span class="AttributeLabel">显隐</span>
          <el-switch v-model="target.physical.debug" size="mini"></el-switch>
        </div>
        <template v-if="target.physical.comp">
          <div
            class="AttributeComp"
            v-for="(comp, $index) in target.physical.comp"
            :key="$index"
          >
            <div class="AttributeItem" @change="(e) => compChange($index)">
              <span class="AttributeLabel">形状</span>
              <el-radio-group v-model="comp.shapeType" size="mini">
                <el-radio label="Box">Box</el-radio>
                <el-radio label="Sphere">Sphere</el-radio>
              </el-radio-group>
            </div>
            <Vector3
              :form="comp"
              subtitle="半径"
              data="radius"
              v-if="comp.shapeType == 'Sphere'"
              @change="halfSizeChange(comp)"
            ></Vector3>
            <Vector3
              title="大小"
              :form="comp.halfSize"
              :data="position"
              @change="halfSizeChange(comp)"
              v-else
            ></Vector3>
            <Vector3
              title="相对位置"
              :form="comp.offsetPosition"
              :data="position"
            ></Vector3>
            <Vector3
              title="相对旋转"
              :form="comp.offsetRotation"
              :data="position"
            ></Vector3>
            <div class="AttributeDeleteComp" @click="deleteComp(comp)">
              <i class="el-icon-error"></i>
            </div>
          </div>
        </template>
        <div class="AttributeButton">
          <el-button style="width: 100%" @click="addPhysicalComp" type="success">新增碰撞体</el-button>
        </div>
      </template>
      <div class="AttributeButton" v-else>
        <el-button style="width: 100%" @click="addPhysical" type="primary">新增物理</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import Vector3 from './ChildItem/Vector3'
import { physicalMixins, physicalShapeMixins } from '@/core/mixins'

export default {
  name: 'Attribute',
  data() {
    return {
      target: {},
      position: ['x', 'y', 'z']
    }
  },
  computed: {
    selectUid() {
      return this.$state.selectUid
    }
  },
  methods: {
    addPhysical() {
      const item = this.$game.getSelectObject()
      physicalMixins(item)
      this.$game.physicalWorld.addBody(item.userData.physical)
      this.$set(this.target, 'physical', item.userData.physical)
    },
    compChange(index) {
      const item = this.target.physical.comp[index]
      const newComp = physicalShapeMixins({
        shapeType: item.shapeType,
        halfSize: item.halfSize,
        offsetPosition: item.offsetPosition,
        offsetRotation: item.offsetRotation,
        radius: item.radius || item.halfSize.x * 2
      })
      item.hideMesh(this.$game.scene)
      this.target.physical.comp.splice(index, 1, newComp)
      if (this.target.physical.show) {
        this.target.physical.debugMesh(false)
        this.target.physical.debugMesh(true)
      }
    },
    addPhysicalComp() {
      const newComp = physicalShapeMixins({
        shapeType: 'Box',
        halfSize: { x: 10, y: 10, z: 10 }
      })
      this.target.physical.addShape(newComp)
      if (this.target.physical.show) {
        this.target.physical.debugMesh(false)
        this.target.physical.debugMesh(true)
      }
    },
    deleteComp(comp) {
      this.target.physical.removeShape(comp)
    },
    halfSizeChange(comp) {
      comp.updateMesh()
    }
  },
  watch: {
    selectUid() {
      const item = this.$game.getSelectObject()
      this.target = {}
      if (item) {
        this.$set(this.target, 'transform', item.userData.transform)
        if (item.userData.physical) {
          this.$set(this.target, 'physical', item.userData.physical)
        } else {
          this.target.physical = null
        }
      }
    }
  },
  components: {
    Vector3
  }
}

</script>

<style lang="stylus">
.Attribute {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  background-color: #2e2e2e;
}

.Attribute-item {
  padding: 10px 0;
  border-bottom: 1px solid #6a6a6a;
}

.Attribute-item-header {
  margin-bottom: 10px;
  padding: 12px 10px;
  color: #969696;
  font-size: 16px;
  font-weight: bold;
  background-color: #393939;
}

.AttributeButton {
  display: flex;
  justify-content: center;
  padding: 4px 10px;
  width: 100%;

  & >>> .el-button {
    width: 100%;
  }
}

.AttributeItem {
  display: flex;
  padding: 5px 0 5px 20px;
  align-items: center;

  .AttributeLabel {
    margin-right: 10px;
    min-width: 45px;
    font-size: 12px;
    font-weight: bold;
    color: #969696;
    flex-shrink: 0;
    text-align: right;
  }
}

.AttributeComp {
  position: relative;
  margin: 0 10px;
  border: 1px dashed #dcdcdc;
}

.AttributeDeleteComp {
  position: absolute;
  top: 0;
  right: 0;
  font-size: 14px;
  color: #fff;
}
</style>
