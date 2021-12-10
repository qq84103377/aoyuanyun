<template>
  <div class="u-tab-item"
       :class="getTabItemClass"
       :style="getTabItemStyle"
       @click="onItemClick">
    <slot></slot>
    <span v-if="showBadge"
          :style="getBadgeStyle"
          class="u-tab-item-badge">{{ badgeLabel }}</span>
  </div>
</template>
<script>
export default {
  name: "UTabItem",
  components: {},
  props: {
    activeClass: String,
    disabled: Boolean,
    badgeBackground: {
      type: String,
      default: "#D60006"
    },
    badgeColor: {
      type: String,
      default: "#fff"
    },
    badgeLabel: String,
    selected: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      currentIndex: -1,
      currentSelected: this.selected
    };
  },
  watch: {
    currentSelected(val) {
      if (val) {
        this.$parent.index = this.currentIndex;
      }
    },
    selected(val) {
      this.currentSelected = val;
    }
  },
  computed: {
    getTabItemStyle() {
      if (!this.$parent) {
        return "";
      }
      const color = this.currentSelected
        ? this.$parent.activeColor
        : this.disabled
          ? this.$parent.disabledColor
          : this.$parent.defaultColor;
      const border = this.$parent.animate ? "none" : "auto";
      const styles = [];
      if (this.$parent.lineWidth) {
        styles.push(`border-width:${this.$parent.lineWidth}px;`);
      }
      if (this.$parent.activeColor) {
        styles.push(`border-color:${this.$parent.activeColor};`);
      }
      if (color) {
        styles.push(`color:${color};`);
      }
      styles.push(`border:${border};`);
      return styles.join("");
    },
    getTabItemClass() {
      const clazz = [];
      if (this.currentSelected) {
        clazz.push(this.activeClass);
      }
      if (this.currentSelected) {
        clazz.push("app-tab-text-active");
      }
      if (this.disabled) {
        clazz.push("app-tab-text-disable");
      }
      return clazz.join(" ");
    },
    getBadgeStyle() {
      return `background:${this.badgeBackground};color:${this.badgeColor};`;
    },
    showBadge() {
      return (
        typeof this.badgeLabel !== "undefined" && this.badgeLabel !== ""
      );
    }
  },
  created() { },
  mounted() {
    this.$parent.updateIndex();
  },
  beforeDestroy() {
    const $parent = this.$parent;
    this.$nextTick(() => {
      $parent.updateIndex();
    });
  },
  destoryed() { },
  methods: {
    onItemClick(hasLink) {
      if (this.$parent.preventDefault) {
        this.$parent.$emit("on-before-index-change", this.currentIndex);
        return;
      }
      if (
        typeof this.disabled === "undefined" ||
        this.disabled === false
      ) {
        this.currentSelected = true;
        this.$parent.currentIndex = this.currentIndex;
        this.$nextTick(() => {
          this.$emit("on-item-click", this.currentIndex);
        });
      }
      if (hasLink === true) {
        go(this.link, this.$router);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
  @import './item.scss';
</style>