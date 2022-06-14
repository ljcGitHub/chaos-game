<template>
  <div></div>
</template>

<script>
export default {
  name: 'template',
  props: {
    active: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {}
  },
  computed: {},
  created() {},
  mounted() {},
  beforeDestroy() {},
  methods: {},
  watch: {},
  components: {}
}

</script>

<style scoped lang="stylus">
.wrapper {
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 100%;
  font-size: 14px;
  color: #333;
  border: 1px solid #ccc;
  background: #ccc;
  transition: all 0.3s;
  box-sizing: border-box;
}
</style>
