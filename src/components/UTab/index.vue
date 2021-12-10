<template>
  <div class="u-tab-wrap"
       :class="getTabWrapClass">
    <div class="u-tab-container">
      <div class="u-tab app-tab-background"
           :class="getTabClass"
           ref="nav">
        <slot></slot>
        <div v-if="animate"
             class="u-tab-ink-bar app-tab-bar-active"
             :class="getBarClass"
             :style="getBarStyle">
          <span v-if="customBarWidth"
                class="u-tab-bar-inner app-tab-bar-active"
                :style="getInnerBarStyle"></span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
function go(url, $router) {
  if (/^javas/.test(url) || !url) return;
  const useRouter =
    typeof url === "object" ||
    ($router && typeof url === "string" && !/http/.test(url));
  if (useRouter) {
    if (typeof url === "object" && url.replace === true) {
      $router.replace(url);
    } else {
      url === "BACK" ? $router.go(-1) : $router.push(url);
    }
  } else if (window && window.location) {
    window.location.href = url;
  }
}
export default {
  name: "UTab",
  components: {},
  props: {
    lineWidth: {
      type: Number,
      default: 3
    },
    activeColor: String,
    barActiveColor: String,
    defaultColor: String,
    disabledColor: String,
    animate: {
      type: Boolean,
      default: true
    },
    customBarWidth: [Function, String],
    preventDefault: Boolean,
    scrollThreshold: {
      type: Number,
      default: 4
    },
    barPosition: {
      type: String,
      default: "bottom",
      validator(val) {
        return ["bottom", "top"].indexOf(val) !== -1;
      }
    },
    value: Number
  },
  data() {
    return {
      direction: "forward",
      right: "100%",
      hasReady: false,
      index: -1,
      currentIndex: this.index,
      number: this.$children.length
    };
  },
  watch: {
    currentIndex(newIndex, oldIndex) {
      if (oldIndex > -1 && this.$children && this.$children[oldIndex]) {
        this.$children[oldIndex].currentSelected = false;
      }
      if (newIndex > -1 && this.$children && this.$children[newIndex]) {
        this.$children[newIndex].currentSelected = true;
      }
      this.direction = newIndex > oldIndex ? "forward" : "backward";
      this.$emit("input", newIndex);
      this.$emit("on-index-change", newIndex, oldIndex);
      if (this.hasReady) {
        this.scrollToActiveTab();
      }
    },
    index(val) {
      this.currentIndex = val;
    },
    value(val) {
      this.index = val;
    }
  },
  computed: {
    getTabWrapClass() {
      return this.barPosition === "top" ? "u-tab-bar-top" : "";
    },
    getTabClass() {
      const clazz = [];
      if (!this.animate) {
        clazz.push("u-tab-no-animate");
      }
      if (this.scrollable) {
        clazz.push("scrollable");
      }
      return clazz.join(" ");
    },
    getBarLeft() {
      if (this.hasReady) {
        const nav = this.$refs.nav;
        const count = this.scrollable
          ? nav.offsetWidth /
          this.$children[
            this.currentIndex || 0
          ].$el.getBoundingClientRect().width
          : this.number;
        return `${this.currentIndex * (100 / count)}%`;
      }
    },
    getBarRight() {
      if (this.hasReady) {
        const nav = this.$refs.nav;
        const count = this.scrollable
          ? nav.offsetWidth /
          this.$children[
            this.currentIndex || 0
          ].$el.getBoundingClientRect().width
          : this.number;
        return `${(count - this.currentIndex - 1) * (100 / count)}%`;
      }
    },
    // when prop:custom-bar-width
    getInnerBarStyle() {
      const width =
        typeof this.customBarWidth === "function"
          ? this.customBarWidth(this.currentIndex)
          : this.customBarWidth;
      const background = this.barActiveColor || this.activeColor;
      const styles = [];
      styles.push(`width:${width};`);
      if (background) {
        styles.push(`background:${background};`);
      }
      return styles.join("");
    },
    // end
    getBarStyle() {
      const commonStyle = {
        left: this.getBarLeft,
        right: this.getBarRight,
        display: "block",
        height: this.lineWidth + "px",
        transition: !this.hasReady ? "none" : null
      };
      if (!this.customBarWidth) {
        if (this.activeColor) {
          commonStyle.background = this.activeColor;
        }
        if (this.barActiveColor) {
          commonStyle.background = this.barActiveColor;
        }
      } else {
        commonStyle.background = "transparent"; // when=prop:custom-bar-width
      }
      const style = [];
      for (const key in commonStyle) {
        style.push(`${key}:${commonStyle[key]};`);
      }
      return style.join("");
    },
    getBarClass() {
      const clazz = [];
      if (this.direction === "forward") {
        clazz.push("u-tab-ink-bar-transition-forward");
      }
      if (this.direction === "backward") {
        clazz.push("u-tab-ink-bar-transition-backward");
      }
      return clazz.join(" ");
    },
    scrollable() {
      return this.number > this.scrollThreshold;
    }
  },
  created() { },
  mounted() {
    // stop bar anmination on first loading
    this.$nextTick(() => {
      setTimeout(() => {
        this.hasReady = true;
      }, 0);
    });
    if (this.value >= 0) {
      this.currentIndex = this.value;
    }
    this.updateIndex();
  },
  destoryed() { },
  methods: {
    scrollToActiveTab() {
      if (!this.scrollable || !this.$children || !this.$children.length) {
        return;
      }
      const currentIndexTab = this.$children[this.currentIndex].$el;
      let count = 0;
      // scroll animation
      const step = () => {
        const scrollDuration = 15;
        const nav = this.$refs.nav;
        nav.scrollLeft +=
          (currentIndexTab.offsetLeft -
            (nav.offsetWidth - currentIndexTab.offsetWidth) / 2 -
            nav.scrollLeft) /
          scrollDuration;
        if (++count < scrollDuration) {
          window.requestAnimationFrame(step);
        }
      };
      window.requestAnimationFrame(step);
    },
    updateIndex() {
      if (!this.$children || !this.$children.length) return;
      this.number = this.$children.length;
      let children = this.$children;
      for (let i = 0; i < children.length; i++) {
        children[i].currentIndex = i;
        if (children[i].currentSelected) {
          this.index = i;
        }
      }
    }
  }
};
</script>
<style lang="scss" scoped>
  @import './style.scss';
</style>