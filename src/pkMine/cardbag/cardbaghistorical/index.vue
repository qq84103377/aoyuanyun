<template>
  <div class="content">
    <!-- 卡包列表 -->
    <div class="cardbag-list">
      <!-- 电子门票 -->
      <div class="cardbag-list-title" v-if="cardListTrave.length">
        <span class="electronic-ticket">电子门票</span>
      </div>
      <div
        class="cardbag-list-content"
        v-for="(items, typeIndex) in cardListTrave"
        :key="typeIndex"
        :style="{ 'background-image': `url(${items.cardPackVO.imgUrl})` }"
      >
        <div class="cardbag-list-content-top">
          <div class="cardbag-list-title">{{ items.cardPackVO.name }}</div>
          <div class="cardbag-list-time">
            有效期：
            <span v-if="items.cardPackVO.startTime != null">
              {{ items.cardPackVO.startTime }}：
            </span>
            {{ items.cardPackVO.endTime || '长期' }}
          </div>
        </div>
        <img
          class="overdue-imag"
          v-if="cardListIp[0].useStatus == 2"
          src="http://img.asset/lostTicket.png"
        />
        <img
          class="overdue-imag"
          v-if="cardListIp[0].useStatus == 1"
          src="http://img.asset/user10.png"
        />
        <img
          class="overdue-imag"
          v-if="cardListTrave[0].useStatus == 1"
          src="http://img.asset/user10.png"
        />
        <img
          class="overdue-imag"
          v-if="cardListTrave[0].useStatus == 2"
          src="http://img.asset/lostTicket.png"
        />
      </div>
    </div>
    <div class="cardbag-list">
      <!-- IP资产 -->
      <div class="cardbag-list-title" v-if="cardListIp.length">
        <span class="electronic-ticket">IP资产</span>
      </div>
      <div
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
            {{ items.cardPackVO.endTime || '长期' }}
          </div>
          <img
            class="overdue-imag"
            v-if="cardListIp[typeIndex].useStatus == 2"
            src="http://img.asset/lostTicket.png"
          />
          <img
            class="overdue-imag"
            v-if="cardListIp[typeIndex].useStatus == 1"
            src="http://img.asset/user10.png"
          />
          <img
            class="overdue-imag"
            v-if="cardListTrave[typeIndex].useStatus == 1"
            src="http://img.asset/user10.png"
          />
          <img
            class="overdue-imag"
            v-if="cardListTrave[typeIndex].useStatus == 2"
            src="http://img.asset/lostTicket.png"
          />
        </div>
      </div>
    </div>
    <div class="no-record" v-if="!cardListIp.length && !cardListTrave.length"></div>
    <!-- 没有更多数据 -->
    <div
      class="no-more-record"
      v-if="(cardListIp.length > 0 || cardListTrave.length > 0) && isFinish"
    >
      真的没有更多啦~
    </div>
  </div>
</template>

<script>
import apis from '@/apis'
export default {
  data() {
    return {
      isFinish: false, // 已经加载完成所有数据
      cardListIp: [], //卡包列表
      cardListTrave: [] //卡包列表
    }
  },
  mounted() {
    this.getMyCardbag()
  },
  methods: {
    async getMyCardbag() {
      let { data } = await this.$client.rpc(apis.MYCARDBAG_LIST, {
        userStatus: -1,
        page: 1,
        pageSize: 5
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
      // console.log(this.cardListIp, this.cardListTrave)
    }
  }
}
</script>

<style lang="scss" scoped>
.content {
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
      .historical-records {
        font-size: 12px;
        color: #333333;
        padding-right: 15px;
      }
    }
    .cardbag-list-content {
      border-radius: 10px;
      overflow: hidden;
      height: 115px;
      background-size: cover;
      background-position: center;
      margin: 0px 15px 15px 15px;
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
        }
        .goto-right {
          padding-right: 15px;
          span {
            font-size: 10px;
            color: #fff;
          }
          .gotoicon {
            height: 13px;
            width: 13px;
            padding-top: 5px;
          }
        }
      }
      .overdue-imag {
        width: 80px;
        height: 80px;
        position: absolute;
        top: 10px;
        right: 10px;
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
}
.no-more-record {
  text-align: center;
  padding: 15px;
  font-size: 12px;
  color: #999;
}
</style>
