<template>
  <div class="u-button"
       :style="customStyle"
       :class="getButtonClass"
       @click.stop="onButtonClick">
    <div class="u-button-content">
      <div class="u-button-content-left">
        <!-- @slot 匿名插槽，自定义按钮内容 -->
        <slot></slot>
      </div>
      <div class="u-button-content-right">
        <!-- <div class="u-button-arrow-wrapper"> -->
        <i v-if="isLink && type === 'hollow' && !disabled"
           :class="getArrowClass"
           class="u-button-arrow app-arrow-color"></i>
        <!-- </div> -->
      </div>
    </div>

  </div>
</template>
<script>
/**
 * @component
 *
 * @example <h2>按钮组件示例</h2>
 *
 * <u-button>按钮</u-button>
 *
 * <u-button :disabled="true">禁用按钮</u-button>
 */
export default {
  name: "UButton",
  props: {
    /**
     * 表示按钮类型，实心（solid）、空心（hollow）
     */
    type: {
      type: String,
      default: "solid"
      // validator(v) {
      //     return ['solid', 'hollow'].includes(v);
      // }
    },
    /**
     * 表示按钮是否禁用
     */
    disabled: {
      type: Boolean,
      default: false
    },
    /**
     * 节流阀
     */
    throttle: {
      type: Number,
      default: 1000
    },
    /**
     * 没有圆角
     */
    noBorderRadius: {
      type: Boolean,
      default: false
    },
    /**
     * 表示按钮尺寸，长（L）、中（M）、短（S）
     */
    size: {
      type: String,
      default: "L",
      validator(v) {
        return ["L", "M", "S"].includes(v);
      }
    },
    /**
     * 自定义按钮样式
     */
    customStyle: {
      type: Object
    },
    /**
     * 拓展类
     */
    extendClass: String,
    /**
     * 是否需要箭头，按钮会变成椭圆形，只有disabled值为false时才会有箭头
     */
    isLink: {
      type: Boolean,
      default: false
    },
    /**
     * 是否是椭圆按钮，只有在noBorderRadius属性为false时生效
     */
    ellipseButton: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      flag: false
    };
  },
  watch: {},
  computed: {
    btnTypeAdapter() {
      if (this.type === "primary") {
        return "solid";
      }
      return this.type;
    },
    getButtonClass() {
      const classes = [];
      if (this.disabled) {
        classes.push("app-btn-disabled");
      }
      if (this.gray) {
        classes.push("app-btn-disabled");
      }
      if (this.noBorderRadius) {
        classes.push("u-button-no-radius");
      }
      if (this.extendClass) {
        classes.push(this.extendClass);
      }
      if ((this.isLink || this.ellipseButton) && !this.noBorderRadius) {
        classes.push("u-button-radio");
      }
      classes.push(`app-btn-${this.btnTypeAdapter}`);
      classes.push(`u-button-${this.size.toLowerCase()}`);

      return classes.join(" ");
    },
    getArrowClass() {
      let classes = [];
      if (this.isLink && this.type === "hollow" && !this.disabled) {
        if (this.size == "S") {
          classes.push("app-btn-arrow-s");
        }
        if (this.size == "L" || this.size == "M") {
          classes.push("app-btn-arrow-l");
        }
      }
      return classes;
    }
  },
  created() { },
  mounted() { },
  destoryed() { },
  methods: {
    /**
     * 按钮点击事件处理
     *
     * @param {DomEvent} e 事件对象
     */
    onButtonClick(e) {
      /**
       * 按钮点击事件，返回 Dom
       *
       * @event click
       */
      if (this.flag || this.disabled) {
        return;
      }
      this.flag = true;
      this.$emit("clickHandler");
      setTimeout(() => {
        this.flag = false;
      }, this.throttle * 1);
    }
  }
};
</script>
<style lang="scss" scoped>
  @import './style.scss';
</style>
