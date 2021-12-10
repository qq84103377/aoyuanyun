<!--
 * @Description: 
 * @version: 
 * @Author: gonghonglin
 * @Date: 2021-08-03 20:32:56
 * @LastEditors: gonghonglin
 * @LastEditTime: 2021-11-17 16:28:48
-->
<template>
  <div class="myactivity">
    <div class="myactivity-list">
      <div class="myactivity-img">
        <img class="img" :src="detail.urls || ' '" alt="" />
      </div>
      <div class="myactivity-bottom">
        <p class="myactivity-bottom-litle">
          {{ detail.title || '' }}
        </p>
        <p class="myactivity-bottom-time">
          活动状态：{{ areStatusType[detail.areStatus] || '' }}
        </p>
        <p class="myactivity-bottom-time">
          活动时间：{{ detail.startTime || '' }}-{{ detail.endTime || '' }}
        </p>
        <div class="myactivity-bottom-place">
          <p><span>活动地点：</span>{{ detail.address || '' }}</p>
          <span class="number-Applicants"
            >已报名<span>{{
              detail.virtualManCount > detail.manCount
                ? detail.virtualManCount
                : detail.manCount
            }}</span>
            人
          </span>
        </div>
      </div>
    </div>
    <div class="signup-information">
      <div class="information">
        <div class="information-title">报名信息</div>
        <div class="information-item" v-for="(item, index) in user" :key="index">
          <span class="information-label">
            <span v-for="text in item.label" :key="text">{{ text }}</span>
          </span>
          <span>{{ item.value }}</span>
        </div>
      </div>
    </div>
    <div class="qr-Codeinformation">
      <p>签到二维码</p>
      <div class="card" :class="{ 'is-used': isUsed }">
        <div class="used-tag" v-if="isUsed">已使用</div>
        <img class="coupon-qrcode" :src="couponInfo.qrCodeImage" alt="" />
        <div v-if="detail.areStatus == 6" class="pase_due">二维码已失效</div>
      </div>
      <div class="tips">请在活动现场出示给管理人员</div>
      <div class="tips">或 用微信扫描现场活动签到码 进行签到确认</div>
    </div>
  </div>
</template>

<script>
import apis from '@/apis'
import QRCode from '@/utils/qrcode.js'
export default {
  data() {
    return {
      detail: {},
      user: [],
      couponInfo: {},
      isUsed: false, //是否已经签到
      timmer: null,
      times: 5,
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
  mounted() {
    this.getDetail()
    // 开启状态轮询
    this.timmer = setInterval(() => {
      if (this.detail.areStatus == 7 && --this.times > 0) {
        this.getDetail()
      } else {
        clearInterval(this.timmer)
      }
    }, 5000)
  },
  destroyed() {
    if (this.timmer) {
      clearInterval(this.timmer)
    }
  },
  methods: {
    async getDetail() {
      var id = this.$client.getParam()
      // console.log(id);
      var { data } = await this.$client.rpc(
        apis.ACTIVITY_DETAIL,
        { id: id.id },
        { silent: true }
      )
      // console.log(data);
      this.detail = data.data
      this.detail.startTime = this.date2Str(this.detail.startTime, 'YYYY/MM/DD hh:mm')
      this.detail.endTime = this.date2Str(this.detail.endTime, 'YYYY/MM/DD hh:mm')
      var str = data.data.formData
      // console.log(typeof str);
      // console.log(str);
      this.user = JSON.parse(str)
      // console.log(typeof this.user);
      this.showQRCode()
      this.isUsed = this.detail.joinStatus == 1
      if (this.isUsed) {
        clearInterval(this.timmer)
      }
    },
    // 显示优惠券明细
    showQRCode() {
      let mode = ['Numeric', 'Alphanumeric', 'Byte', 'Kanji'][2]
      let errorCorrectionLevel = ['L', 'M', 'Q', 'H'][0]
      let qr = QRCode(0, errorCorrectionLevel)
      let { uid } = this.$store.state.userInfo
      qr.addData(`POMO_${this.detail.id}_${uid}`, mode)
      qr.make()
      let rt = qr.createDataURL(5, 10) //输出base64地址
      this.$set(this.couponInfo, 'qrCodeImage', rt)
      // this.$client.pushEvent('COUPON_RECEIVE',{type:'显示优惠券二维码',data: this.couponInfo.couponCode}) // 埋点
    },
    // 时间格式的转化---年月日
    date2Str(date, format) {
      return this.$tools.str2DateStr(date, format)
    }
  }
}
</script>
<style>
page {
  background-color: #f8f8f8 !important;
  min-height: 100vh !important;
}
</style>
<style lang="scss" scoped>
.myactivity {
  padding: 15px;
  background: #f8f8f8;
  min-height: calc(100vh-30px);
  .myactivity-list {
    padding: 10px;
    background-color: #ffffff;
    border-radius: 10px;
    .myactivity-img {
      width: 100%;
      height: 138px;
      img {
        height: 100%;
        width: 100%;
        background-color: #f0f0f0;
      }
    }
    .myactivity-bottom {
      padding: 0 5px;
      .myactivity-bottom-litle {
        font-size: 14px;
        color: #333333;
        padding-top: 10px;
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
          span {
            min-width: 50px;
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
  //   报名信息
  .signup-information {
    background: #ffffff;
    border-radius: 10px;
    padding: 20px;
    margin-top: 15px;
    .information {
      .information-title {
        font-size: 14px;
        font-weight: 900;
        color: #000000;
        padding-bottom: 10px;
      }
      .information-item {
        font-size: 12px;
        display: flex;
        padding-bottom: 10px;
        span {
          color: #333;
        }
        .information-label {
          color: #000;
          min-width: 50px;
          padding-right: 10px;
          display: flex;
          justify-content: space-between;
        }
      }
      .information-item:nth-last-child(1) {
        padding: 0;
      }
    }
  }
  .qr-Codeinformation {
    border-radius: 10px;
    background-color: #ffffff;
    margin-top: 20px;
    padding: 20px;
    text-align: center;
    p {
      font-size: 14px;
      font-weight: 900;
      color: #000000;
      text-align: left;
    }
    .tips {
      font-size: 10px;
      color: #999;
      text-align: center;
    }
  }
  .card {
    padding-top: 14px;
    position: relative;
    .coupon-qrcode {
      width: 150px;
      height: 150px;
    }
    &.is-used {
      .coupon-qrcode {
        opacity: 0.1;
      }
      .used-tag {
        position: absolute;
        top: calc(50% - 20px);
        left: calc(50% - 40px);
        background-color: #fff;
        padding: 20px;
        color: #ff9800;
        z-index: 1;
      }
    }
    .pase_due {
      position: absolute;
      top: 14px;
      left: calc(50% - 75px);
      width: 150px;
      height: 150px;
      background: rgba(0, 0, 0, 0.4);
      color: #fff;
      line-height: 150px;
      text-align: center;
    }
  }
}
</style>
