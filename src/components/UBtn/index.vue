<template>
  <div class="u-btn"
       :class="getButtonClass"
       @click.stop="onButtonClick"
       @touchstart="handleTouchStart">
    <div class="u-btn-content">
      <span v-if="intWait">({{intWait}}s)</span>
      <!-- @slot 匿名插槽，自定义按钮内容 -->
      <slot></slot>
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
 * <u-button :enable="false" :wait="5" @autoRun="true" @onWaitUp="handleWaitUp">禁用按钮</u-button>
 */
export default {
  name: "UBtn",
  props: {
    /**
     * 等待时长，5s，等待期间按钮状态为禁用
     */
    wait: {
      type: Number,
    },
    /**
     * 等待时长，5s，自动触发，此时状态为可用，否则为禁用
     */
    autoRun: {
      type: Boolean,
    },

    /**
     * 按钮实心（true）、空心（false）
     */
    solid: {
      type: Boolean,
      default: true
    },
    /**
     * 是否显示阴影（默认有阴影）
     */
    shadow: {
      type: Boolean,
      default: true
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
     * 拓展类
     */
    extendClass: String,
    /**
     * 是否固定底部
     */
    fixedBottom: {
      type: Boolean,
      default: false
    },
    /**
     * 背景颜色 默认透明
     */
    bg: {
      type: String,
      default: ''
    },
    /**
     * 金色按钮风格
     */
    isGolden: {
      type: Boolean,
      default: false
    },
    /**
     * 金色按钮风格
     */
    isGolden2: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      flag: false, // 节流标记
      intWait: 0,  // 剩余等待时长
    };
  },
  computed: {
    getButtonClass() {
      const classes = [];
      if (this.extendClass) {
        classes.push(this.extendClass);
      }
      if (this.disabled) {
        classes.push("u-btn-disabled");
      }
      if (this.shadow) {
        classes.push("u-btn-shadow");
      }
      if (this.solid === false) {
        classes.push("u-btn-hollow");
      }
      if (this.type === "primary") {
        classes.push("u-btn-primary");
      }
      if (this.fixedBottom) {
        classes.push("u-btn-fixed");
      }
      if (this.isGolden) {
        classes.push("is-golden");
      }
      if (this.isGolden2) {
        classes.push("is-golden2");
      }
      return classes.join(" ");
    },
  },
  mounted() {
    this.intWait = this.wait ? this.wait : 0;
    if (this.intWait > 0) {
      this.countDown();
    }
  },
  destoryed() { },
  watch: {
    wait: function (val) {
      // console.log(this);
    }
  },
  methods: {
    /**
     * 按钮点击事件处理
     * @param {DomEvent} e 事件对象
     */
    onButtonClick(e) {
      /**
       * 按钮点击事件，返回 Dom
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
    },
    /**
     * 定时触发
     */
    countDown(time) {
      if (this.clock) {
        clearInterval(this.clock);
      }
      this.clock = setInterval(() => {
        this.intWait--;
        if (this.intWait <= 0) {
          clearInterval(this.clock);
          this.disabled = false;
          if (this.autoRun) {
            this.$emit("clickHandler");
          }
        }
      }, 1000);
    },
    /**
     * 触摸，暂停倒数
     */
    handleTouchStart() {
      if (this.clock && this.disabled === false) {
        this.intWait = 0;
        clearInterval(this.clock);
      }
    },
  }
};
</script>
<style lang="scss" scoped>
  @import './style.scss';
</style>
