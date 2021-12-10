<template>
  <div class="content">
    <!-- 卡包列表 -->
    <div class="b">
      <img src="http://img.asset/ic_arrow_right.png" alt="" />
      <span class="historical-records" @click="gotoHistorical()">历史记录</span>
    </div>
    <div class="cardbag-list">
      <!-- 电子门票 -->
      <div class="cardbag-list-title" v-if="cardListTrave.length">
        <span class="electronic-ticket">电子门票</span>
      </div>
      <div
        class="cardbag-list-content"
        @click="gotoCardbagdetails(items)"
        v-for="(items, typeIndex) in cardListTrave"
        :key="typeIndex"
        :style="{ 'background-image': `url(${items.cardPackVO.imgUrl})` }"
      >
        <div class="cardbag-list-content-top">
          <div class="cardbag-list-title">{{ items.cardPackVO.name }}</div>
          <div class="cardbag-list-time">
            有效期：{{ items.cardPackVO.startTime }}-{{
              items.cardPackVO.endTime || '长期'
            }}
          </div>
        </div>
        <div class="cardbag-list-content-bottom">
          <div class="gotoUser" @click.stop="gotoCardbaguser(items, 'showQRCode')">
            去使用
          </div>
          <div class="goto-right">
            <span>查看详情</span>
            <img class="gotoicon" src="http://img.asset/goto.png" />
          </div>
        </div>
      </div>
      <!-- IP资产 -->
      <div class="cardbag-list-title" v-if="cardListIp.length">
        <span class="electronic-ticket">IP资产</span>
      </div>
      <div
        @click.stop="gotoCardbagdetails(items, items.type)"
        v-for="(items, typeIndex) in cardListIp"
        :key="typeIndex"
        class="cardbag-list-content"
        :style="{ 'background-image': `url(${items.cardPackVO.imgUrl})` }"
      >
        <div class="cardbag-list-content-top">
          <div class="cardbag-list-title">{{ items.cardPackVO.name }}</div>
          <div class="cardbag-list-time">
            有效期：
            <span v-if="items.cardPackVO.startTime != null">
              {{ items.cardPackVO.startTime }}-
            </span>
            <span>{{ items.cardPackVO.endTime || '长期' }}</span>
          </div>
        </div>
        <div class="cardbag-list-content-bottom">
          <div class="gotoUser" @click.stop="gotoCardbaguser(items, 'showQRCode')">
            去使用
          </div>
          <div class="goto-right">
            <span>查看详情</span>
            <img class="gotoicon" src="http://img.asset/goto.png" />
          </div>
        </div>
      </div>
    </div>
    <!-- 无数据 -->
    <div class="no-record" v-if="!cardListIp.length && !cardListTrave.length">
      <div class="btn" @click="signUp()">去领取</div>
    </div>
    <!-- 没有更多数据 -->
    <div
      class="no-more-record"
      v-if="(cardListIp.length > 0 || cardListTrave.length > 0) && isFinish"
    >
      真的没有更多啦~
    </div>
    <!-- <div class="no-more-record">
  {{loadingType === 0 ? contentText.contentdown : (loadingType === 1 ? contentText.contentrefresh : contentText.contentnomore)}}
</div>  -->
  </div>
</template>

<script>
import apis from '@/apis'
export default {
  data() {
    return {
      isFinish: false, // 已经加载完成所有数据
      cardListIp: [], //卡包列表
      cardListTrave: [], //卡包列表
      // 分页提示信息
      loadingType: 0,
      flag: false
    }
  },
  // mounted() {
  //   this.getMyCardbag();
  // },
  onShow() {
    this.getMyCardbag()
  },

  methods: {
    async onPullDownRefresh() {
      this.getMyCardbag()
      // 停止下拉刷新，回弹问题
      this.$client.stopPullDownRefresh()
    },
    gotoCardbagdetails(items) {
      if (items.cardPackVO.type == 1) {
        // var dateil =
        //   "https://app.vipsave.cn/vip-html/#/member?channel=100001&customerId=1423906103271211008&sign=bf1a7389aa7268a90c906cb29046369f&timestamp=1628320644825&returnPath=txCoupon%3FgoodsNo%3Dskumy05%26awardCode%3Df9865fb87aa5c07d3f44d42a9c456453%3D1%3D1213bb144fd9c7c1a4fe5ce172fd732f";
        //      this.$client.pushWindow(
        //   "/pages/webView/webView?url=" + encodeURIComponent(dateil)
        // );
        this.$client.pushWindow('/pkCoupon/cardbagdetails/index', {
          id: items.cardPackVO.id
        })
      } else {
        this.$client.pushWindow('/pkCoupon/cardbagdetails/index', {
          cardCode: items.cardPackCode,
          id: items.cardPackVO.id
        })
      }
    },
    //跳转到卡包使用
    gotoCardbaguser(items, isShowQRCode = '') {
      if (items.cardPackVO.type == 1) {
        if (items.cardPackVO.ipAssetVO.awardDetail) {
          this.$client.pushWindow(
            '/pages/webView/webView?url=' +
              encodeURIComponent(items.cardPackVO.ipAssetVO.awardDetail)
          )
        } else {
          this.$client.pushWindow('./cardbagdetail/index', {
            id: items.cardPackVO.id
          })
        }
      } else {
        this.$client.pushWindow('../../pkCoupon/cardbagdetails/index', {
          id: items.cardPackVO.id,
          isShowQRCode
        })
      }
    },

    //跳转到卡包历史
    gotoHistorical() {
      this.$client.pushWindow('./cardbaghistorical/index')
    },
    signUp() {
      this.$client.pushWindow('/pkCoupon/cardbag/index')
    },
    async getMyCardbag() {
      let { data } = await this.$client.rpc(apis.MYCARDBAG_LIST, {
        userStatus: 0,
        page: 1,
        pageSize: 999
      })
      if (!data.success) {
        this.$client.toast('加载失败')
        return
      }
      this.cardListIp = []
      this.cardListTrave = []
      data.rows.forEach((x) => {
        if (x.cardPackVO.type == 1) {
          this.cardListIp.push(x)
        } else {
          this.cardListTrave.push(x)
        }
      })
      this.isFinish = true
      // console.log(this.cardListIp, this.cardListTrave);
    }
  }
}
</script>

<style lang="scss" scoped>
.content {
  .b {
    img {
      height: 15px;
      width: 15px;
      position: absolute;
      top: 12px;
      right: 15px;
    }
    .historical-records {
      font-size: 12px;
      color: #333333;
      padding-right: 15px;
      position: absolute;
      top: 10px;
      right: 15px;
    }
  }
  .cardbag-list {
    background: #f8f8f8;
    .cardbag-list-title {
      height: 29px;
      display: flex;
      justify-content: space-between;
      line-height: 29px;
      .electronic-ticket {
        font-size: 10px;
        color: #999999;
        padding-left: 15px;
      }
    }
    .cardbag-list-content {
      border-radius: 10px;
      overflow: hidden;
      height: 115px;
      margin: 0px 15px 15px 15px;
      background-size: cover;
      background-position: center;
      position: relative;
      &::before {
        content: '';
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        position: absolute;
      }
      .cardbag-list-content-top {
        position: relative;
        z-index: 1;
        padding: 15px 15px 0px 15px;
        .cardbag-list-title {
          font-size: 18px;
          font-weight: 600;
          color: #fff;
        }
        .cardbag-list-time {
          font-size: 10px;
          color: #fff;
        }
      }
      .cardbag-list-content-bottom {
        position: relative;
        z-index: 1;

        display: flex;
        justify-content: space-between;
        width: 100%;
        height: 25px;
        padding-left: 15px;
        padding-top: 15px;
        box-sizing: border-box;
        .gotoUser {
          height: 25px;
          width: 64px;
          font-size: 10px;
          color: #fff;
          border-radius: 5px;
          border: 1px solid;
          text-align: center;
          line-height: 25px;
          background-color: rgba(255, 255, 255, 0.2);
        }
        .goto-right {
          display: flex;
          justify-content: space-around;
          height: 40px;
          line-height: 40px;
          padding-right: 15px;
          span {
            font-size: 10px;
            color: #fff;
          }
          .gotoicon {
            height: 13px;
            width: 13px;
            padding-top: 13px;
            padding-left: 5px;
          }
        }
      }
    }
  }
  .no-record {
    height: 400px;
    margin-top: 20px;
    background: no-repeat url($ui-asset-url + 'coupon/no-record.png');
    background-size: 80%;
    background-position: top center;
    position: relative;
    .btn {
      position: absolute;
      bottom: 0;
      left: calc(50% - 82.5px);
    }
  }
}
.btn {
  width: 165px;
  height: 50px;
  background: #f0c17b;
  border-radius: 25px;
  color: #fff;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  &:active {
    background: #d3a869;
  }
}
.no-more-record {
  text-align: center;
  padding: 15px;
  font-size: 12px;
  color: #999;
}
</style>
