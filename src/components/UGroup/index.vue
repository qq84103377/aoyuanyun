<template>
  <div class="u-group app-group-wrapper">
    <!-- 头部 -->
    <div class="u-group-header app-group-header"
         :style="getHeaderStyle">
      <!-- @slot title:头部 -->
      <slot name="title">
        {{ title }}
      </slot>
    </div>

    <!-- 内容 -->
    <div class="u-group-content app-group"
         :class="getContentClass">
      <slot></slot>
    </div>

    <div class="u-group-footer app-group-footer"
         :style="getFooterStyle">
      <slot name="footer">
        {{ footerText }}
      </slot>
    </div>
  </div>
</template>

<script>
const cleanStyle = (styles = {}) => {
  for (let i in styles) {
    if (typeof styles[i] === 'undefined') {
      delete styles[i];
    }
  }
  return styles;
};
/**
 *  @component
 *
 */
export default {
  name: "UGroup",
  props: {
    /**
     * group标题
     */
    title: {
      type: String,
      default: ""
    },
    /**
     * 显示背景色
     */
    showBg: {
      type: Boolean,
      default: false
    },
    /**
     * group标题字色
     */
    titleColor: {
      type: String,
      default: ""
    },
    /**
     * group顶部margin
     */
    gutter: {
      type: [String, Number],
      default: "10px"
    },
    /**
     * group底部文字
     */
    footerText: {
      type: String,
      default: ""
    },
    /**
     * group底部文字颜色
     */
    footerTitleColor: String
  },
  methods: {
    cleanStyle
  },
  computed: {
    getHeaderStyle() {
      const style = cleanStyle({
        "margin-top":
          typeof this.gutter === "number"
            ? this.gutter + "px"
            : this.gutter,
        "padding-bottom": this.title === "" ? "0px" : "10px",
        color: this.titleColor
      });
      let text = "";
      for (const key in style) {
        text = text + `${key}:${style[key]};`;
      }
      return text;
    },
    getContentClass() {
      return this.showBg ? "app-group-bg" : "";
    },
    getFooterStyle() {
      const style = cleanStyle({
        "padding-top": this.footerText === "" ? "0px" : "10px"
      });
      let text = "";
      for (const key in style) {
        text = text + `${key}:${style[key]};`;
      }
      return text;
    }
  }
};
</script>

<style lang="scss">
  @import './style.scss';
</style>
