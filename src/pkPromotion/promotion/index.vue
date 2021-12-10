<template>
  <div class="Registration-list">
    <div class="myactivity-list" v-for="(item, index) in enlistpromotionList" :key="index"
      @click="promotiondetali(item)">
      <div class="myactivity-img" :style="{ 'background-image': `url(${item.urls})` }">
        <!-- <div class="pro-state">{{item.areStatus == 1 ? '未开始' : item.areStatus == 2 ? '报名中' : '报名结束'}}</div> -->
        <div class="pro-state">{{areStatusType[item.areStatus]}}</div>
        <!-- <img src="http://img.asset/index/bae.png" alt="" /> -->
      </div>
      <div class="myactivity-bottom">
        <div class="activity-item">
          <div class="myactivity-bottom-litle">
            {{ item.title }}
          </div>
          <div class="price">{{ item.spend ==0? '免费' :item.spend+'元' }}</div>
        </div>
        <div class="myactivity-bottom-place">
          <p class="myactivity-bottom-time">
            <span>报名时间</span>{{ item._expTime }}
          </p>
        </div>
        <!-- <p class="myactivity-bottom-time"><span>活动时间:</span>{{item.endTime}}</p> -->
        <div class="myactivity-bottom-place">
          <p class="myactivity-bottom-time">
            <span>活动时间</span>{{ item._expTimes }}
          </p>
          <span
            class="number-Applicants">已报名<span>{{ item.virtualManCount > item.manCount ?item.virtualManCount:item.manCount}}</span>
            人
          </span>
        </div>
      </div>
    </div>
    <div v-if="isUpNoMore" class="upwarp-nodata">真的没有更多啦！</div>
    <div class="no-record" v-if="!enlistpromotionList.length && !enlistpromotionList.length">

    </div>
  </div>
</template>

<script>
import apis from "@/apis";
export default {
  data() {
    return {
      isNotData: false,
      isUpNoMore: false,
      isGet: false,
      page: 1,
      enlistpromotionList: [],
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
  onReachBottom() {
    if (this.isGet) { // 正在获取数据
      return
    }
    this.getPromotionlist();
  },
  onShow() {
    this.getPromotionlist();

  },

  methods: {
    promotiondetali(item) {
      this.$client.pushWindow("./detail?id", item);
    },
    //  获取活动列表
    async getPromotionlist() {
      var { page, enlistpromotionList } = this;
      this.isGet = true;
      let { data } = await this.$client.rpc(apis.PROMOTION_LIST, {
        gatheringStatus: 1,
        page,
        pageSize: 10,
      });
      if (data.success) {
        var list = data.rows;

        if (list.length > 0) {
          list.forEach(item => {
            item._expTimes = this.date2Str(item.startTime, "YYYY/MM/DD hh:mm") + "-" + this.date2Str(item.endTime, "YYYY/MM/DD hh:mm");
            item._expTime = this.date2Str(item.joinStartTime, "YYYY/MM/DD hh:mm") + "-" + this.date2Str(item.joinEndTime, "YYYY/MM/DD hh:mm");
          });
        } else {
          if (page > 1) {
            this.isUpNoMore = true;
          } else {
            this.isNotData = true;
          }
        }
        if (page == 1) {
          this.$set(this, "enlistpromotionList", list);
        } else {
          this.enlistpromotionList = enlistpromotionList.concat(list);
        }
        this.page = page + 1;
        this.isGet = false;
      }
    },
    // 时间格式的转化---年月日
    date2Str(date, format) {
      return this.$tools.str2DateStr(date, format);
    },
  },
};
</script>

<style lang="scss" scoped>
.Registration-list {
  background: #f8f8f8;
  padding: 15px;
  min-height: 100vh;
  .no-record {
    height: 400px;
    margin-top: 20px;
    background: no-repeat url("http://img.asset/not_myActivite.png");
    background-size: 80%;
    background-position: top center;
    position: relative;
    .btn {
      position: absolute;
      bottom: 0;
      left: calc(50% - 82.5px);
    }
  }
  .myactivity-list {
    padding: 10px;
    background-color: #fff;
    margin-bottom: 10px;
    border-radius: 8px;
    overflow: hidden;

    .myactivity-img {
      position: relative;
      background-color: #ffffff;
      height: 105px;
      padding: 10px;
      background-size: cover;
      background-repeat: no-repeat;
      background-color: #f0f0f0;
      background-position: center;
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
      background-color: #ffffff;
      padding: 10px 5px 5px;
      .activity-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2px;
        .myactivity-bottom-litle {
          font-size: 15px;
          color: #333333;
          max-width: 85%;
        }
        .price {
          font-size: 16px;
          color: #f0c17b;
        }
      }
      .myactivity-bottom-place {
        display: flex;
        justify-content: space-between;
        color: #999999;
        font-size: 12px;
        padding-top: 6px;
        align-items: center;
        .number-Applicants {
          // padding-top: 5px;
          font-size: 10px;
          color: #333333;
          span {
            color: #f0c17b;
          }
        }
      }
      .myactivity-bottom-time {
        color: #999999;
        font-size: 10px;
        display: flex;
        span {
          min-width: 50px;
        }
      }
    }
  }
  .upwarp-nodata {
    padding-bottom: 15px;
    text-align: center;
    font-size: 14px;
    color: #999999;
  }
  .not-data {
    text-align: center;
    img {
      width: 304px;
      height: 304px;
    }
  }
}
</style>