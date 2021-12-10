<!--
 * @Description: 精选页-活动组件
 * @version: 
 * @Author: gonghonglin
 * @Date: 2021-07-09 17:49:34
 * @LastEditors: gonghonglin
 * @LastEditTime: 2021-11-04 22:47:48
-->
<template>
  <CardContainer :title="title" class="pro-container" @onMore="onMore">
    <div
      class="pro-item"
      @click="gotoPromotion(item)"
      v-for="(item, index) in list"
      :item="item"
      :key="index"
    >
      <div class="pro-header" :style="{ 'background-image': `url(${item._img})` }">
        <div class="pro-state">{{ areStatusType[item.areStatus] }}</div>
      </div>
      <div class="pro-title">
        {{ item.title }}
        <span style="float:right;font-size: 16px;
          color: #F0C17B;">{{ item.spend ==0? '免费' :item.spend+'元' }}</span>
      </div>
       <div class="d-flex" style="padding: 0 20rpx 8rpx 20rpx;">
        <div class="pro-date">
          <span style="padding-right: 5px">报名时间</span>{{ item._dates }}
        </div>
      </div>
      <div class="d-flex">
        <div class="pro-date">
          <span style="padding-right: 5px">活动时间</span>{{ item._date }}
        </div>
        <div class="pro-count">
          已报名
          <span style="color: #c9a568">{{
            item.manCount > item.virtualManCount
              ? item.manCount
              : item.virtualManCount
              ? item.virtualManCount
              : item.manCount
          }}</span>
          人
        </div>
      </div>
    </div>
  </CardContainer>
</template>

<script>
import CardContainer from './cardContainer.vue'
export default {
  name: 'EPromotion',
  components: {
    CardContainer
  },
  data() {
    return {
      areStatusType: {
        1: '报名未开始',
        2: '报名中',
        3: '报名已结束',
        4: '活动未开始',
        5: '活动进行中',
        6: '活动已结束',
        7: '已报名'
      }
    }
  },
  props: {
    title: {
      type: String
    },
    list: {
      type: Array,
      default: []
    }
  },
  mounted() {},
  methods: {
    gotoPromotion(item) {
      // console.log(item)
      // this.$client.toast('活动暂未开放')
      if(!this.$client.passCheck()) return
      this.$client.pushWindow('/pkPromotion/promotion/detail', item)
    },
    onMore() {
      if(!this.$client.passCheck()) return
      this.$client.pushWindow('/pkPromotion/promotion/index')
    }
  }
}
</script>

<style lang="scss" scoped>
.pro-container {
  margin-bottom: 0;
}
.d-flex {
  display: flex;
  justify-content: space-between;
  padding: 0 10px 10px 10px;
  font-size: 10px;
  color: #999;
}

.pro-item {
  margin-bottom: 15px;
  border-radius: 5px;
  overflow: hidden;
  box-shadow: 0px 2px 9px 0px rgba(0, 0, 0, 0.06);

  .pro-header {
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    overflow: hidden;
    height: 130px;
    position: relative;
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    background-color: #f0f0f0;
    .pro-state {
      position: absolute;
      top: 0;
      left: 0;
      font-size: 10px;
      color: #ffffff;
      padding: 4px 10px;
      border-top-left-radius: 6px;
      border-bottom-right-radius: 10px;
      background-color: rgba(0, 0, 0, 0.4);
    }
    .pro-img {
      height: 200px;
      width: 100%;
    }
  }

  .pro-title {
    padding:10px 10px 8px;
    font-size: 15px;
  }
}
</style>
