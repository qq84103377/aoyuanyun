<template>
  <section class="order-detail">
    <div class="detail-wrap">
      <div class="detail-wrap__info">
        <div>
          <div class="mb10 order-no"><span class="tag">{{detailInfo.channelType == 1 ? '优惠券' : (detailInfo.channelType == 2 ? '文旅门票' : '商品订单')}}</span>订单编号<span>{{detailInfo.orderId}}</span></div>
          <div class="order-time">下单时间 <span>{{formatDate(detailInfo.createTime)}}</span></div>
        </div>
        <div class="pay-group">
          <div class="pay-acount">{{(detailInfo.payStatus === 0 && detailInfo.orderStatus === 0) ? '待' : '实'}}付款: <span class="price">￥{{detailInfo.realPayPrice || 0}}</span></div>
          <div class="btn" v-if="detailInfo.payStatus === 0 && detailInfo.orderStatus === 0">去支付</div>
          <div v-else class="btn grey">{{detailInfo.orderStatus === 1 ? '已完成' : '已取消'}}</div>
        </div>
      </div>
      <div class="detail-wrap__top" v-if="detailInfo.externalCouponCode">
        <img :src="detailInfo.imgUrl" alt="">
        <div class="title">
          <div class="ellipsis title__label">{{detailInfo.title}}</div>
          <div class="discount">￥{{detailInfo.couponAmount || 0}}</div>
        </div>
      </div>
      <div class="detail-wrap__bottom" v-if="detailInfo.ticketQrCode.length && detailInfo.couponVerifierType == 2 && detailInfo.channelType == 2">
        <swiper class="swiper" @change="handleChange">
          <swiper-item v-for="item in detailInfo.ticketQrCode" :key="item">
            <view class="swiper-item">
              <img :src="item.ticketQrCodeUrl" alt="">
              <div :class="['mask',{expire: item.ticketStatus == 5}, {use: item.ticketStatus == 2 || item.ticketStatus == 6}]"></div>
            </view>
          </swiper-item>
        </swiper>
        <div class="indicator"><span>{{bannerIdx + 1}}</span>/{{detailInfo.ticketQrCode.length}}</div>
        <div class="use-time" v-if="detailInfo.ticketQrCode[bannerIdx]">游玩时间：{{formatDate(detailInfo.ticketQrCode[bannerIdx].useDate, 'yyyy-MM-dd')}}</div>
      </div>
      <div class="detail-wrap__bottom" v-if="detailInfo.couponCode && detailInfo.couponVerifierType == 2 && detailInfo.channelType == 1">
        <div class="qrcode-wrap">
          <img class="qrcode" :src="detailInfo.qrCodeImage" alt="">
          <div :class="['mask',{expire: detailInfo.useStatus == 2}, {use: detailInfo.useStatus == 1}]"></div>
        </div>
        <div class="use-time">验证码：{{detailInfo.couponCode}}</div>
      </div>
    </div>
  </section>
</template>

<script>
  import QRCode from '@/utils/qrcode.js'
  import apis from '@/apis'
  export default {
    name: 'detail',
    data(){
      return {
        bannerList: [
          require('@/static/phone.png'),
          require('@/static/seach.png'),
          require('@/static/tiop.png'),
        ],
        bannerIdx: 0,
        detailInfo: {ticketQrCode: []},
        orderId: '',
      }
    },
    onLoad(opt){
      this.orderId = opt.id
    },
    onShow(){
      this.getDetail()
    },
    methods: {
      formatDate(date, fmt = 'yyyy-MM-dd hh:mm:ss'){
        if(!date || date==='0001-01-01T00:00:00'){
          return ''
        }
        date = new Date(date)
        if (/(y+)/.test(fmt)) {
          fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
        }
        let o = {
          'M+': date.getMonth() + 1,
          'd+': date.getDate(),
          'h+': date.getHours(),
          'm+': date.getMinutes(),
          's+': date.getSeconds()
        }
        for (let k in o) {
          if (new RegExp(`(${k})`).test(fmt)) {
            let str = o[k] + ''
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : this.padLeftZero(str))
          }
        }
        return fmt
      },
      padLeftZero (str) {
        return ('00' + str).substr(str.length)
      },
      handleChange(e){
        this.bannerIdx = e.detail.current
      },
      async getDetail(id){
        uni.showLoading({
          title: '加载中...',
          mask: true,
        })
        try{
          let { data } = await this.$client.rpc(apis.ORDER_DETAIL, {
            id: this.orderId
          })
          if (data.success) {
            if(data.data && data.data.couponVerifierType == 2 && data.data.channelType == 1 && data.data.couponCode){
              let mode = ['Numeric', 'Alphanumeric', 'Byte', 'Kanji'][2]
              let errorCorrectionLevel = ['L', 'M', 'Q', 'H'][0]
              let qr = QRCode(0, errorCorrectionLevel)
              qr.addData('CP_' + data.data.couponCode, mode)
              qr.make()
              let rt = qr.createDataURL(5, 10) //输出base64地址
              data.data.qrCodeImage = rt
            }
            this.detailInfo = data.data || {}
          }
          uni.hideLoading()
        }catch(e){
          uni.hideLoading()
          // this.$set(this.mainItems, userStatus, [])
          // console.log(e);
        }
      }
    }
  };
</script>
<style lang="scss">
  page{
    height: 100%;
  }
</style>
<style lang="scss" scoped>

  .order-detail{
    height: 100%;
    background: #f5f5f5;
    padding: 10px;
    .detail-wrap{
      background: #fff;
      padding: 10px;
      &__info{
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 12px;
        .btn{
          background: #F0C17B;
          border-radius: 10px;
          flex: 0 0 18px;
          width: 50px;
          text-align: center;
          line-height: 18px;
          color: #fff;
          font-size: 10px;
          &.grey{
            background: #CBD7E1;
          }
        }
        .pay-group{
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          .pay-acount{
            margin-bottom: 10px;
            font-size: 10px;
            color: #999;
            .price{
              margin-left: 10px;
              font-size: 16px;
              font-weight: 500;
              color: red;
            }
          }
        }
      }
      &__top{
        margin-top: 10px;
        padding: 10px 0;
        display: flex;
        border-bottom: 1px solid #eee;
        border-top: 1px solid #eee;
        .title{
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          flex: 1;
          &__label{
            font-weight: 500;
            font-size: 14px;
          }
          .discount{
            font-size: 16px;
            color: red;
            text-align: right;
            font-weight: 500;
          }
        }
        img{
          width: 125px;
          flex: 0 0 125px;
          height: 92px;
          border-radius: 5px;
          margin-right: 10px;
        }
        .discount{
          font-size: 10px;
          color: red;
        }
        .ellipsis{
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
          word-break: break-all;
        }
      }
      &__bottom{
        padding-top: 10px;
        text-align: center;
        .qrcode-wrap{
          position: relative;
          height: 150px;
          width: 150px;
          margin: 10px auto 0;
          .qrcode{
            height: 150px;
            width: 150px;
          }
          .mask{
            position: absolute;
            left: 0;
            top: 0;
            height: 150px;
            width: 150px;
            &.expire{
              background: rgba(255,255,255,.3) url('../../static/stamp__expire.png') center center no-repeat;
              background-size: 80px 80px;
            }
            &.use{
              background: rgba(255,255,255,.3) url('../../static/stamp__use.png') center center no-repeat;
              background-size: 80px 80px;
            }
          }
        }

        .swiper{
          height: 150px;
          width: 150px;
          margin: 10px auto 0;
          &-item{
            height: 100%;
            position: relative;
            img{
              height: 100%;
              width: 100%;
            }
            .mask{
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              &.expire{
                background: rgba(255,255,255,.3) url('../../static/stamp__expire.png') center center no-repeat;
                background-size: 80px 80px;
              }
              &.use{
                background: rgba(255,255,255,.3) url('../../static/stamp__use.png') center center no-repeat;
                background-size: 80px 80px;
              }
            }
          }
        }
        .indicator{
          font-size: 12px;
          text-align: center;
          margin-top: 10px;
          margin-bottom: 12px;
          font-weight: 500;
          span{
            color: red;
          }
        }
        .use-time{
          font-size: 12px;
          color: #333;
          text-align: center;
          margin-bottom: 20px;
        }
      }
    }
    .mb10{
      margin-bottom: 10px;
    }
    .order-no{
      color: #999;
      font-size: 12px;
      span{
        color: #333;
        font-size: 14px;
        font-weight: 500;
        margin-left: 10px;
      }
      .tag{
        margin-left: 0;
        margin-right: 5px;
        display: inline-block;
        line-height: 16px;
        padding: 0 5px;
        border-radius: 8px;
        background: #ff9c20;
        color: #fff;
        font-size: 10px;
      }
    }
    .order-time{
      font-size: 10px;
      color: #999;
      span{
        margin-left: 10px;
      }
    }
  }
</style>
