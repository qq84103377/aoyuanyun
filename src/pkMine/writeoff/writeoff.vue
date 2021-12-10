<!--
 * @Description: 优惠券核销
 * @version:
 * @Author: gonghonglin
 * @Date: 2021-07-01 11:43:29
 * @LastEditors: gonghonglin
 * @LastEditTime: 2021-10-29 19:20:09
-->
<template>
  <div class="page">
    <div class="filter-wrap" @click="filterShow = true">
      <span class="label">当前店铺: </span>
      <span class="value">{{curStoreName}} </span>
      <img class="icon-toggle" src="@/static/icon-toggle.png" alt="">
    </div>
    <div v-if="filterShow" class="select-wrap" @click="hidePop">
      <div class="select-wrap__scroll">
        <div @click.stop="handleSelectStore(item)" :class="['select-wrap__item', {active: curStoreId === item.merchantId}]" v-for="(item,index) in storeList" :key="index">
          {{item.name}}
        </div>
      </div>
    </div>
    <div class="card-container">
      <div class="title">
        扫码核销
      </div>
      <div class="btn" @click="scanCode">
        <img class="icon" src="@/static/icon-scan.png" />
        扫码核销</div>
    </div>
    <div class="card-container">
      <div class="title">
        输入券码核销
      </div>
      <input class="qrcode" v-model="couponCode" placeholder="请输入核销码" type="text">
      <div class="btn" @click="writeOff">确定</div>
    </div>
    <div class="tips">
      <div class="title">如何核销优惠券</div>
      <div>
        <p>1、引导用户进入APP，查看我的-我的优惠券，点击立即使用进入优惠券详情，查看优惠券券码。</p>
        <p>2、点击扫码，扫描顾客的优惠券二维码，完成核销。</p>
        <p>3、手动输入客户展示的优惠券数字券码，进行核销。</p>
      </div>
    </div>

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
  props: {},
  data() {
    return {
      couponCode: '',
      isSuccess: false,
      isShowResult: false,
      filterShow: false,
      storeList: [],
      curStoreId: '',
    };
  },
  onLoad() {
    this.getStoreList()
  },
  computed: {
    curStoreName(){
      const item = this.storeList.find(v => v.merchantId === this.curStoreId)
      return item ? item.name : ''
    }
  },
  methods: {
    getStoreList(){
      this.$client.rpc(this.$api.COUPON_STORE_LIST, {}).then(res => {
        if(res.data.success) {
          this.storeList = res.data.rows
          if(this.storeList.length){
            this.curStoreId = this.storeList[0].merchantId
          }
        }
      })
    },
    handleSelectStore(item){
      this.curStoreId = item.merchantId
      this.filterShow = false
    },
    hidePop(){
      this.filterShow = false
    },
    // 扫码
    async scanCode() {
      try {
        let res = await this.$client.scanCode()
        if (res.result) {
          let arrArg = res.result.split('_')
          if(arrArg[0]!='CP'){
            this.$client.alert('券码无效')
            this.couponCode=res.result;
            return
          }
          this.couponCode = arrArg[1]
          this.writeOff();
        } else {
          this.$client.alert('扫码失败')
        }
      } catch (error) {

      }
    },

    // 核销
    async writeOff() {
      if (!this.couponCode) {
        this.$client.alert('请输入优惠券劵码')
      } else {
        let res = await this.$client.rpc(this.$api.COUPON_WHITE_OFF, {
          couponCode: this.couponCode,
          merchantId: this.curStoreId,
          pageSize:1,
          page:1
        })
        // console.log(res)
        this.showResult();
      }
    },

    showResult(isSuccess = true) {
      this.isSuccess = isSuccess;
      this.isShowResult = true;
      this.$client.pushEvent('COUPON_WRITE_OFF', {data:this.couponCode})
    },
    hideResult() {
      this.isShowResult = false;
      this.couponCode = ""
    }

  },
};
</script>
<style lang="scss" scoped>
.icon {
  background-repeat: no-repeat;
  background-size: contain;
  width: 100px;
  height: 100px;
}
.page {
  font-size: 14px;
  .filter-wrap{
    height: 43px;
    padding: 0 20px;
    font-size: 14px;
    display: flex;
    align-items: center;
    background: #fff;
    .label{
      color: #999;
      margin-right: 5px;
    }
    .value{
      color: #333;
      font-weight: bold;
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
      max-width: 510px;
    }
    .icon-toggle{
      width: 14px;
      height: 14px;
      margin-left: 4px;
    }
  }

  .select-wrap{
    position: fixed;
    width: 100vw;
    height: calc(100vh - 43px);
    background: rgba(0, 0, 0, .5);
    left: 0;
    top: 43px;
    z-index: 9;
    font-size: 14px;
    color: #333;
    font-weight: bold;
    &__scroll{
      max-height: 258px;
      overflow-y: auto;
    }
    &__item{
      line-height: 43px;
      padding: 0 20px;
      background: #F8F8F8;
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
      &.active{
        color: #F0C17B;
      }
    }
  }

  .card-container {
    padding: 20px;
    background-color: #fff;
    border-radius: 10px;
    text-align: center;
    margin: 20px;
    display: flex;
    align-items: center;
    flex-direction: column;

    .title {
      padding: 0 15px 15px;
    }
    .qrcode {
      width: 95%;
      background-color: #efefef;
      border-radius: 10px;
      text-align: left;
      padding: 10px;
      margin-bottom: 20px;
      &::-webkit-input-placeholder {
        /* WebKit browsers */
        color: #d3d3d3;
      }
    }
  }
  .btn {
    border-radius: 100px;
    padding: 15px;
    text-align: center;
    min-width: 140px;
    background-color: #F0C17B;
    color: #fff;
    @include flexLayout;

    &:active {
      background-color: #dbad67;
    }

    &.btn-scan {
      background-color: #3d64eb;
      &:active {
        background-color: #3153d1;
      }
    }
    .icon {
      width: 20px;
      height: 20px;
      margin-right:6px;
    }
  }

  .tips {
    margin: 20px;
    .title {
      font-weight: 600;
      margin-bottom: 10px;
    }
    font-size: 12px;
    color: #999999;
  }

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
}
</style>
<style>
page {
  background: #f8f8f8;
  height: 100vh;
}
</style>
