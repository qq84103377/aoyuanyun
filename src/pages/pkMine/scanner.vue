<!--
 * @Description: 扫码功能
 * @version: 统一处理所有扫码逻辑，根据参数拆分类型，业务ID等
 * @Author: gonghonglin
 * @Date: 2021-09-29 16:14:29
 * @LastEditors: gonghonglin
 * @LastEditTime: 2021-09-29 19:53:17
-->
<template>
  <div>
    <UPopup v-model="isShowResult">
      <div class="card-container card-result">
        <div class="close" @click="hideResult">&times;</div>
        <img class="icon" v-if="isSuccess" src="@/static/icon-success.png" />
        <img class="icon" v-else src="@/static/icon-error.png" />
        <div class="title-x">{{isSuccess? '已核销成功': '核销失败'}}</div>
      </div>
    </UPopup>

  </div>
</template>
<script>
import UPopup from "@/components/UPopup";
export default {
  components: {
    UPopup
  },
  data(){
    return{
      arrArg:[],
      isShowResult: false,
      isSuccess:false,
    }
  },
  methods:{
    // 扫码
    async scanCode() {
      try {
        let qr = await this.$client.scanCode()
        console.log(qr)
        if (qr.errMsg == "scanCode:ok") {
          // 普通二维码
            // {
            //   charSet: "ISO8859-1"
            //   errMsg: "scanCode:ok"
            //   rawData: "MTQ0MjUxNzA5NTczMjA2ODM1Mg=="
            //   result: "CP_1442517095732068352"
            //   scanType: "QR_CODE"
            // }
          if(qr.scanType === "QR_CODE"){
            this.arrArg = qr.result.split('_')
            
            // 优惠券
            if(this.arrArg[0] === 'CP' && this.arrArg[1]){
              this.writeOffCoupon(this.arrArg[1]);
              return
            }

            // 活动签到
            if(this.arrArg[0] === 'POMO' && this.arrArg[1] && this.arrArg[2]){
              this.signInPromotion(this.arrArg[1],this.arrArg[2]);
              return
            }
          }

          // 小程序码
            // {
            //   charSet: "ISO8859-1"
            //   errMsg: "scanCode:ok"
            //   path: "pages/index/index?scene=3_2382538"
            //   rawData: "bDExOVovbURiVTR2PUR1bEBNR1lqMWc4"
            //   scanType: "WX_CODE"
            // }
          if(qr.scanType === "WX_CODE"){

          }
          
          this.$client.alert('无效二维码')
        } else {
          this.$client.alert('扫码失败')
        }
      } catch (error) {
        console.log('error',error)
      }
    },

    // 核销-优惠券
    async writeOffCoupon(couponCode) {
      let res = await this.$client.rpc(this.$api.COUPON_WHITE_OFF, {
        couponCode,
        pageSize:1,
        page:1
      })
      console.log(res);
      this.isSuccess = res.data.success;
      // this.isShowResult = true;
      this.$client.alert('优惠券核销'+(this.isSuccess?'成功':'失败'))
      this.$client.pushEvent('COUPON_WRITE_OFF', {data:this.couponCode})
    },
    hideResult() {
      this.isShowResult = false;
    },

    // 签到活动
    async signInPromotion(id,brokerId){
      let res = await this.$client.rpc(this.$api.PROMOTION_SIGNIN, {
        id,
        brokerId,
        pageSize:1,
        page:1
      })
      console.log('签到活动',res);
      this.isSuccess = res.data.success;
      this.$client.alert('活动签到'+(this.isSuccess?'成功':'失败'))
    }
  }
}
</script>
<style lang="scss">
  .card-result {
    width: 240px;
    height: 240px;
    position: relative;
    @include flexLayout(column, center, center);
    .icon {
      margin-bottom: 20px;
    }
    .close {
      width: 20px;
      height: 20px;
      font-size: 20px;
      @include flexLayout(row, center, center);
      position: absolute;
      right: 20px;
      top: 20px;
      color: #d8d8d8;
    }
    .title-x {
      font-size: 16px;
      font-weight: 600;
    }
  }
</style>