<!--
 * @Description: YStep 楼盘详情-项目动态组件
 * @version: 
 * @Author: gonghonglin
 * @Date: 2021-07-21 14:04:03
 * @LastEditors: gonghonglin
 * @LastEditTime: 2021-07-21 16:02:08
-->
<template>
  <div class="step">
    <div class="step-item" v-for="(item, index) in step" :key="index">
      <div class="title"><span class="tag">{{item.tag}}</span>{{item.title}}</div>
      <div class="contents">
        <div class="content" v-for="(sitem,sindex) in item.contents" :key="sindex">
          <div class="sub-content">{{sitem.content}}</div>
          <div class="sub-time">{{sitem.time}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    step: {
      type: Array,
      default: () => ([
        {
          tag: "交房信息",
          title: "2023年",
          contents: [
            {content:"开盘", time:"发布于2021年5月4日"}
          ],
        },
        {
          tag: "交房信息",
          title: "2023年",
          contents: [
            {content:"开盘", time:"发布于2021年5月4日"}
          ],
        },
        {
          tag: "交房信息",
          title: "2023年",
          contents: [
            {content:"开盘", time:"发布于2021年5月4日"}
          ],
        },
        {
          tag: "交房信息",
          title: "2023年",
          contents: [
            {content:"开盘", time:"发布于2021年5月4日"}
          ],
        },
      ])
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
