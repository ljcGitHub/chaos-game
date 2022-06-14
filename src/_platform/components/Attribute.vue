<template>
  <div class="Attribute">
    <div class="Attribute-item" v-if="target.transform">
      <div class="Attribute-item-header">Transform</div>
      <Vector3 title="Position" :form="target.transform.position" :data="position"></Vector3>
      <Vector3 title="Rotation" :form="target.transform.rotation" :data="position"></Vector3>
      <Vector3 title="Scale" :form="target.transform.scale" :data="position"></Vector3>
    </div>
  </div>
</template>

<script>
import Vector3 from './ChildItem/Vector3'

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
  methods: {},
  watch: {
    selectUid() {
      const item = this.$game.getSelectObject()
      if (item) {
        this.$set(this.target, 'transform', item.userData.transform)
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
  background-color: #2e2e2e;
}

.Attribute-item{
  padding: 5px 0;
  border-bottom: 1px solid #6a6a6a;
}

.Attribute-item-header{
  padding: 12px 10px;
  color: #969696;
  font-size: 16px;
  font-weight: bold;
  background-color: #393939;
}
</style>
