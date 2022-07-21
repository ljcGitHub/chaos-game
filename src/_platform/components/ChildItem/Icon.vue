<template>
  <svg class="svg-icon" aria-hidden="true" v-on="$listeners">
    <use :href="iconName" />
  </svg>
</template>

<script>
import * as Svg from '../../common/svg'
const svgRoot = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
svgRoot.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
svgRoot.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink')
svgRoot.setAttribute('aria-hidden', 'true')
svgRoot.setAttribute('id', '__SVG_SPRITE_NODE__')
svgRoot.style.cssText = 'position: absolute; width: 0; height: 0'
document.body.appendChild(svgRoot)
const parseDom = function (html) {
  var div = document.createElement('div')
  div.innerHTML = html
  if (div.children.length > 0) return div.children[0]
  return null
}

export default {
  name: 'unIcon',
  props: {
    iconClass: {
      type: String,
      required: true
    }
  },
  computed: {
    iconName() {
      return `#icon-${this.iconClass}`
    }
  },
  created() {
    this.loadingSvg(this.iconClass)
  },
  watch: {
    iconClass() {
      this.loadingSvg(this.iconClass)
    }
  },
  methods: {
    loadingSvg(svgName) {
      const svgStr = Svg[svgName]
      if (svgStr) {
        const id = 'icon-' + svgName
        const html = parseDom(svgStr)
        const symbol = document.createElementNS(
          'http://www.w3.org/2000/svg',
          'symbol'
        )
        symbol.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
        symbol.setAttribute('viewBox', html.getAttribute('viewBox'))
        symbol.setAttribute('id', id)
        while (html.children.length > 0) {
          const childDom = html.children[0]
          symbol.appendChild(childDom)
        }
        svgRoot.appendChild(symbol)
      }
    }
  }
}
</script>

<style>
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
  outline: none;
}
</style>
