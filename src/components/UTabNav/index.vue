<!--
 * @Description: tab导航栏
 * @version: 
 * @Author: gonghonglin
 * @Date: 2021-07-01 11:43:29
 * @LastEditors: gonghonglin
 * @LastEditTime: 2021-07-01 14:39:25

 使用方法
 <u-tab-nav :tabs="tabsData" :activeIndex.sync="tabIndex" @onChange="onTabChange"></u-tab-nav>
  tabs:[
    {
       label: '标签名称',
       badge: '角标',//没有则不显示角标
     }
  ]
-->
<template>
  <div class="tab-nav">
    <div class="tab" v-for="(tab,index) in tabs" :key="index" 
      :class="{active:index==tabIndex}" @click="onClick(index)">
      <div class="tab-title">{{tab.label}}</div>
      <div class="badge" v-if="tab.badge">{{tab.badge}}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "UTabNav",
  props:{
    // 传入的tabs结构
    // [{
    //   label: '标签名称',
    //   badge: '角标',
    // }...]
    tabs: {
      type: Array,
      default: [],
    },
    activeIndex: {
      type: Number,
      default: 0,
    }
  },
  data() {
    return {
      tabIndex: this.activeIndex
    };
  },
  methods: {
    onClick(index){
      if(this.activeIndex == index) return;
      this.tabIndex = index;
      this.$emit('onChange',index);
      this.$emit('update:activeIndex',this.tabIndex);
    },
  },
};
</script>

<style lang="scss" scoped>
  @import './style.scss';
</style>