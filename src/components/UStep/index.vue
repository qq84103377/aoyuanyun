<template>
  <div class="step">
    <div :class="'step-item ' + (index > (activeIndex - 1) ? 'step-disable' : 'step-active')"
         v-for="(item, index) in step"
         :key="item">
      <div class="title">{{item}}</div>
      <div class="point"></div>
      <div :class="'line ' + ((activeIndex - 1) > index ? 'line-active' : 'line-dsiable')"
           v-if="index < step.length - 1"></div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    step: {
      type: Array,
      default: () => ([])
    },
    activeIndex: {
      type: [Number, String],
      default: 1
    }
  },
  data() {
    return {
    }
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
  @import './style.scss';
</style>
