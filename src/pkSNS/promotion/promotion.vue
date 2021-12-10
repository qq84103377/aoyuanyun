<!--
 * @Description: 
 * @version: 
 * @Author: gonghonglin
 * @Date: 2021-08-03 20:32:56
 * @LastEditors: gonghonglin
 * @LastEditTime: 2021-11-19 11:49:27
-->
<template>
  <div class="myactivity">
    <div
      class="myactivity-list-box"
      @click="promotiondetail(item.id)"
      v-for="(item, index) in promotionList"
      :key="index"
    >
      <div class="myactivity-img">
        <div class="pro-state">{{ areStatusType[item.areStatus] }}</div>
        <img :src="item.urls || 'http://img.asset/index/bae.png'" alt="" />
        <div class="pro-state">{{areStatusType[item.areStatus]}}</div>
      </div>
      <div class="myactivity-bottom">
        <p class="myactivity-bottom-litle">
          {{ item.title }}
        </p>
        <p class="myactivity-bottom-time">
          <span class="span_label">活动时间</span>{{ item.startTime}} - {{ item.endTime }}
        </p>
        <div class="myactivity-bottom-place">
          <p><span class="span_label">活动地点</span>{{item.address}}</p>
          <span class="number-Applicants"
            >已报名<span>{{
            item.manCount > item.virtualManCount
              ? item.manCount
              : item.virtualManCount
              ? item.virtualManCount
              : item.manCount
          }}</span> 人
          </span>
        </div>
      </div>
    </div>
    <div class="not-data" v-if="promotionList.length == 0">
      <img src="http://img.asset/not_myActivite.png" alt="" srcset="">
    </div>
  </div>
</template>

<script>
import apis from "@/apis";
export default {
  data() {
    return {
      promotionList: [],
      areStatusType: {
        '1': '报名未开始',
        '2': '报名中',
        '3': '报名已结束',
        '4': '活动未开始',
        '5': '活动进行中',
        '6': '活动已结束',
        '7': '已报名'
      },
    };
  },
  onLoad() {
    this.getPromotionlist();
  },
  // onReachBottom() {
  //   console.log(123);
  // },
  methods: {
    promotiondetail(id) {
      this.$client.pushWindow("../promotion/signup", {id});
    },
    //  获取我的活动列表
    async getPromotionlist() {
      let { data } = await this.$client.rpc(apis.MY_ACTIVITY);
      data.rows.forEach(item => {
        item.startTime = this.date2Str(item.startTime, "YYYY/MM/DD hh:mm");
        item.endTime = this.date2Str(item.endTime, "YYYY/MM/DD hh:mm");
      })
      this.$set(this, "promotionList", data.rows);
    },
    // 时间格式的转化---年月日
    date2Str(date, format) {
      return this.$tools.str2DateStr(date, format);
    },
  },
};
</script>

<style lang="scss" scoped>
.myactivity {
  background: #f8f8f8;
  min-height: calc(100vh - 30px);
  padding: 15px;
  .myactivity-list-box {
    margin-bottom: 10px;
    padding: 10px;
    background-color: #ffffff;
    border-radius: 10px;
    .myactivity-img {
      position: relative;
      height: 138px;
      .pro-state{
        position: absolute;
        top: 0;
        left: 0;
        font-size: 10px;
        color: #ffffff;
        padding: 4px 10px;
        border-bottom-right-radius: 10px;
        background-color: rgba(0, 0, 0, 0.4);
        &:empty{
          display: none;
        }
      }
      img {
        height: 100%;
        width: 100%;
      }
      .pro-state {
        position: absolute;
        top: 0;
        left: 0;
        font-size: 20rpx;
        color: #ffffff;
        padding: 8rpx 20rpx;
        // border-top-left-radius: 12rpx;
        border-bottom-right-radius: 20rpx;
        background-color: rgba(0, 0, 0, 0.4);
      }
    }
    .myactivity-bottom {
      padding: 10px 5px 0;
      .myactivity-bottom-litle {
        font-size: 14px;
        color: #333333;
      }
      .myactivity-bottom-time {
        color: #999999;
        font-size: 12px;
        padding-top: 5px;
      }
      .myactivity-bottom-place {
        display: flex;
        justify-content: space-between;
        color: #999999;
        font-size: 12px;
        padding-top: 5px;
        p {
          display: flex;
          font-size: 12px;
          span {
            //  width: 100px;
          }
        }
        .number-Applicants {
          text-align: right;
          min-width: 70px;
          font-size: 12px;
          color: #333333;
          span {
            color: #f0c17b;
          }
        }
      }
    }
  }
  .not-data {
    text-align: center;
    img {
      width: 304px;
      height: 304px;
    }
  }
}
.span_label {
  min-width: 50px;
  margin-right: 5px;
}
</style>

