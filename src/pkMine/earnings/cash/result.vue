<template>
  <div class="result">
    <div class="state_list">
      <div class="state_item state_item_icon">
        <div class="item_inbox">
          <div></div>
          <div>发起结算申请</div>
        </div>
      </div>
      <div class="state_item state_item_timeIcon">
        <div class="item_inbox">
          <div>处理中</div>
          <div>预计1-2天内到账</div>
        </div>
      </div>
    </div>
    <div class="result_info">
      <div class="info_item">
        <div>税前</div>
        <div>￥{{ parmas.preTaxAmount }}</div>
      </div>
      <div class="info_item">
        <div>预计到账</div>
        <div>￥{{ parmas.afterTaxAmount }}</div>
      </div>

      <div class="info_item">
        <div>到账银行</div>
        <div>
          {{ parmas.bankName }}({{ parmas.bankCard.slice(parmas.bankCard.length - 4) }})
        </div>
      </div>
      <div class="info_item">
        <div>提交时间</div>
        <div>{{ time }}</div>
      </div>
      <div class="tips_box">若有疑问，请联系客服！</div>
    </div>
    <div class="result_back">
      <div @click="back">返回</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      parmas: {},
      time: ''
    }
  },
  created() {
    this.parmas = this.$client.getParam()
    this.time = this.formatTime()
    // console.log('-=t', this.parmas)
  },
  methods: {
    back() {
      this.$client.pushWindow('./index', {}, { redirect: true })
    },
    // 格式化时间
    formatTime() {
      // time
      // if (!time) return
      let date = new Date()
      let year = date.getFullYear()
      let month = date.getMonth() + 1
      month = month > 9 ? month : '0' + month
      let day = date.getDate()
      day = day > 9 ? day : '0' + day
      let hour = date.getHours()
      hour = hour > 9 ? hour : '0' + hour
      let minute = date.getMinutes()
      minute = minute > 9 ? minute : '0' + minute
      // let second = date.getSeconds()
      // second = second > 9 ? second : '0' + second
      // :${second}
      return `${year}/${month}/${day} ${hour}:${minute}`
    }
  }
}
</script>

<style lang="scss" scoped>
.result {
  min-height: 100vh;
  padding-bottom: 80px;
  box-sizing: border-box;
  background-color: #fff;
  .state_list {
    padding: 28px 0 45px 35px;
    .state_item {
      position: relative;
      padding: 0 0 51px 53px;
      .item_inbox {
        font-size: 14px;
        color: #333;
        & > div:nth-last-child(1) {
          padding-top: 2px;
          color: #999;
        }
      }
    }
    .state_item_timeIcon::before {
      content: '';
      left: 0px;
      top: 0px;
      position: absolute;
      width: 33px;
      height: 33px;
      background: url('http://img.asset/draw-cash/blur_time.png') no-repeat;
      background-size: 100% 100%;
      border-radius: 50%;
    }
    .state_item_icon::before {
      content: '';
      left: 10px;
      top: 6px;
      position: absolute;
      width: 13px;
      height: 13px;
      background-color: #02c160;
      border-radius: 50%;
    }
    .state_item_icon::after {
      content: '';
      left: 15px;
      top: 14px;
      position: absolute;
      height: 55px;
      border: 1px dashed #02c160;
      border-radius: 50%;
    }
    .state_item:nth-last-child(1) {
      padding-bottom: 0;
      &::after {
        display: none;
      }
    }
  }
  .result_info {
    padding: 15px 25px;
    .info_item {
      font-size: 14px;
      color: #333;
      display: flex;
      padding-bottom: 15px;
      & > div:nth-child(1) {
        flex: 1;
        color: #999;
      }
      & > div:nth-child(2) {
        flex: 1;
        text-align: right;
      }
    }
    .info_item:nth-last-child(2) {
      padding-bottom: 0;
    }
    .tips_box {
      font-size: 12px;
      color: #999;
      padding-top: 13px;
    }
  }
  .result_back {
    padding: 200px 0 124px;
    div {
      width: 200px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      font-size: 16px;
      color: #f0c17b;
      margin: 0 auto;
      background-color: #f8f8f8;
      border-radius: 10px;
    }
  }
}
</style>
