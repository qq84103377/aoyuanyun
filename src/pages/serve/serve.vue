<template>
  <div class="serve">
    <swiper v-if="bannerList && bannerList.length" :indicator-dots="showDot" class="swiper" :autoplay="true">
      <swiper-item class="swiper-item" v-for="(item, index) in bannerList" :key="index">
        <div class="ad-content" @click="onClickAd(item)">
          <img class="ad-img" :src="item.url" alt="">
        </div>
      </swiper-item>
    </swiper>
    <div class="main">
      <div class="title">智能客服</div>
      <div class="content">
        <div
          class="item"
          v-for="item of serveList"
          :key="item.type"
          @click="itemClick(item)"
        >
          <div class="item-icon">
            <image :src="item.icon" mode="scaleToFill"></image>
          </div>
          <div class="item-name">{{ item.name }}</div>
        </div>
      </div>
    </div>
<!--    <div class="main" style="margin-top:10px;height:140px; ">-->
<!--      <div class="title">智慧营销</div>-->
<!--      <div class="content">-->
<!--        <div class="item" @click="viewTicket" >-->
<!--          <div class="item-icon">-->
<!--            <img class="cell-icon" src="@/static/icon-elec-bill.png" />-->
<!--          </div>-->
<!--          <div class="item-name">电子票据</div>-->
<!--        </div>-->
<!--        <div class="item" @click="viewAyCloud" >-->
<!--          <div class="item-icon">-->
<!--            <img class="cell-icon" src="@/static/icon-ay-cloud.png" />-->
<!--          </div>-->
<!--          <div class="item-name">奥园云客</div>-->
<!--        </div>-->
<!--      </div>-->
<!--    </div>-->
    <div class="main" style="margin-top:10px;height:140px; " v-if="userInfo.verificationCoupon==1">
      <div class="title">自助服务</div>
      <div class="content">
        <div class="item" @click="writeoffClick()" >
          <div class="item-icon">
            <img class="cell-icon" src="@/static/icon-write-off.png" />
          </div>
          <div class="item-name">优惠券核销</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userInfo:{},
      serveList: [
        {
          type: 1,
          name: '客户认证',
          icon: 'https://img04.aomygod.com/fontend/2021719/imgs/serve_icon4.png',
          url:
            '?ssoCenterLoginType=THIRD_TOKEN&appCode=ayH5Sso&tenantCode=ayjt&userToken=xxx&returnUrl=https%3A%2F%2Fkf-vcustomer.aoyuan.net%2F%23%2Fmember%2Fauthenticate%3Fo%3Dayjt'
        },
        {
          type: 2,
          name: '我要报修',
          icon:
            'https://digital-dev-1306790816.cos.ap-guangzhou.myqcloud.com/img/service/icon-fix.png',
          url:
            '?ssoCenterLoginType=THIRD_TOKEN&appCode=ayH5Sso&tenantCode=ayjt&userToken=xxx&returnUrl=https%3A%2F%2Fkf-vfw.aoyuan.net%2Fayjt%2Fapp-service-online%2Ftask%2Flist%3Ftype%3D%E7%BB%B4%E4%BF%AE%26from%3DwebApp%26svcId%3D1'
        },
        {
          type: 3,
          name: '我要投诉',
          icon: 'https://img04.aomygod.com/fontend/2021719/imgs/serve_icon5.png',
          url:
            '?ssoCenterLoginType=THIRD_TOKEN&appCode=ayH5Sso&tenantCode=ayjt&userToken=xxx&returnUrl=https%3A%2F%2Fkf-vfw.aoyuan.net%2Fayjt%2Fapp-service-online%2Ftask%2Flist%3Ftype%3D%E6%8A%95%E8%AF%89%26from%3DwebApp%26svcId%3D1'
        },
        {
          type: 4,
          name: '交付预约',
          icon: 'https://img04.aomygod.com/fontend/2021719/imgs/serve_icon3.png',
          url:
            '?ssoCenterLoginType=THIRD_TOKEN&appCode=ayYfSso&tenantCode=ayjt&userToken=xxx&returnUrl=https%3A%2F%2Fkf-yf.aoyuan.net%2Fayjt%2Fthirdappservice%2Froom-process%2Findex%3Fo%3Dayjt%26from%3DwebApp'
        },
        {
          type: 5,
          name: '家书',
          icon:
            'https://digital-dev-1306790816.cos.ap-guangzhou.myqcloud.com/img/service/homebook.png',
          url:
            '?ssoCenterLoginType=THIRD_TOKEN&appCode=ayH5Sso&tenantCode=ayjt&userToken=xxx&returnUrl=https%3A%2F%2Fkf-vfw.aoyuan.net%2Fayjt%2Fapp-service-online%2Fletter%2Findex%3Ffrom%3DwebApp%26svcId%3D1'
        },
        {
          type: 7,
          name: '客服电话',
          icon: 'https://img04.aomygod.com/fontend/2021719/imgs/serve_icon2.png',
          url: '400-111-3883'
        },
        // {
        //   type: 8,
        //   name: 'A+工厂',
        //   icon: 'https://img04.aomygod.com/fontend/2021719/imgs/serve_icon2.png',
        //   url: '400-111-3883'
        // },
        // {
        //   type: 9,
        //   name: '客户活动',
        //   icon: 'https://img04.aomygod.com/fontend/2021719/imgs/serve_icon2.png',
        //   url: '400-111-3883'
        // }
      ],
      isLogin: false,
      lngShowTimes: 0,
      bannerList: [],
    }
  },
  computed: {
    showDot() {
      return this.bannerList.length > 1
    }
  },
  onLoad() {
    // 判断环境，不同环境url 前缀改变
    let { serveList } = this
    this.serveList = serveList.map((item) => {
      // 前缀默认生产
      let host = 'https://kf-vmember.aoyuan.net/wap/sso/login'
      if (MSG_ENV == 'dev') {
        host = 'https://kf-vmember-test.aoyuan.net/wap/sso/login'
      }
      if (MSG_ENV == 'sit') {
        host = 'https://kf-vmember-test.aoyuan.net/wap/sso/login'
      }
      if (MSG_ENV == 'test') {
        host = 'https://kf-vmember-test.aoyuan.net/wap/sso/login'
      }

      if (item.type != 7) {
        item.url = host + item.url
      }
      return item
    })
  },
  mounted() {
    uni.hideHomeButton()
    this.isLogin = this.$store.state.userInfo && this.$store.state.userInfo.uid
  },
  async onShow(options) {
    this.getBanner()
    this.isLogin = this.$store.state.userInfo && this.$store.state.userInfo.uid
    if(!this.isLogin) return

    let res = await this.$client.getUserInfo('',true)
    if (res && Object.keys(res).length) {
      this.$set(this,'userInfo', res)
    }
  },
  methods: {
    viewTicket(){
      const url = encodeURIComponent('https://myscrm-receipt.aoyuancrm.com/sub-trade-electronic-h5/page/index.html')
      uni.navigateTo({
        url: `/pages/webView/webView?url=${url}`
      });
    },
    viewAyCloud(){
      this.$client.pushWindow(`/pages/webView/webView?url=${encodeURIComponent('https://myscrm-qdgj.aoyuancrm.com/qmyx-front/ayjtadmin/index?token=lwkkyi1463040847&orgCode=ayjtadmin')}`)
    },
    onClickAd(item){
      if (!this.$client.passCheck()) return
      if(item.redirectUrl && item.redirectUrl.indexOf('http') > -1){
        this.$client.pushWindow("/pages/webView/webView?url=" + encodeURIComponent(item.redirectUrl),{reLaunch:true});
      }else{
        this.$client.pushWindow('/pkPromotion/promotion/index')

      }
    },
    getBanner(){
      this.$client.rpc(this.$api.AD_BY_ACTIVITY, {
        page: 1,
        pageSize: 99,
        type: 7,
        advertisingStatus: 1,
      }).then(res => {
        if(res.data.success){
          const time = new Date().getTime()
          // this.bannerList = res.data.rows || []
         this.bannerList = (res.data.rows || []).filter(v => time > Date.parse(v.startTime.replace(/-/g,"/")) && time < Date.parse(v.endTime.replace(/-/g,"/")))
        }
      })
    },
    // 核销
    writeoffClick() {
      this.$client.pushWindow('/pkMine/writeoff/writeoff')
    },
    // 服务入口
    itemClick(item) {
      if (!this.$client.passCheck()) return
      const { type } = item
      let { url } = item
      if (type == 8) {
        this.$client.pushWindow('/pkPromotion/aplus/index')
        return
      }
      if (type == 9) {
        this.$client.pushWindow('/pkPromotion/activity/index')
        return
      }
      if (type == 7) {
        uni.makePhoneCall({
          phoneNumber: url.toString()
        })
        return
      }
      // 用户登录信息
      const clientToken = this.$client.getStorage('clientToken')
      console.log(clientToken)
      const that = this
      // 判断token 是否有效
      this.checkVerifyToken((param) => {
        // token 有效才跳转
        if (param) {
          if (type === 2) {
            const tmplIds = [
              'q1umbXh0qB-xhIYUrkUOAdXRoFj_5NyTJZoGW_t0nVY',
              'BXSq4O-_fTcIHl0JwKWzUr8JFHHiILZ8UzSklKMALvQ',
              'OpZgVKeOArqslzGITneqVPN8sNKnGSW4zDoZNaJHe2w'
            ]
            uni.requestSubscribeMessage({
              tmplIds,
              success(res) {
                if (url.indexOf('xxx') != -1) {
                  url = url.replace('xxx', clientToken)
                }
                url = encodeURIComponent(url)
                console.log(2222, url)
                that.$client.pushWindow(`/pages/webView/webView?url=${url}`)
                // uni.navigateTo({
                // url: '/pages/webView/webView?url=' + url
                // })
              },
              fail(res) {}
            })
            return
          }
          if (type === 3) {
            uni.requestSubscribeMessage({
              tmplIds: [
                'vv0VTa4BoqO7wPDpvSdRDjO6mmGrm7D_y2x20CuM7m8',
                'cBWqIDFKtYVQbevpdK5KygK59vdsJmL9uVpUGcZvcmg'
              ],
              success(res) {
                if (url.indexOf('xxx') != -1) {
                  url = url.replace('xxx', clientToken)
                }
                url = encodeURIComponent(url)
                that.$client.pushWindow(`/pages/webView/webView?url=${url}`)
                //  uni.navigateTo({
                // url: '/pages/webView/webView?url=' + url
                //  })
              },
              fail(res) {}
            })
            return
          }

          // 案场助理/销售助手
          if (type == 5 || type == 6) {
            url += clientToken
            const urlObj = { url: encodeURIComponent(url) }
            that.$client.pushWindow(
              `/pages/webView/webView?urlObj=${JSON.stringify(urlObj)}`
            )
            // uni.navigateTo({
            // 	url: '/pages/webView/webView?urlObj=' + JSON.stringify(urlObj)
            // })
            return
          }
          // 替换为clientToken
          if (url.indexOf('xxx') != -1) {
            url = url.replace('xxx', clientToken)
          }
          url = encodeURIComponent(url)
          that.$client.pushWindow(`/pages/webView/webView?url=${url}`)
          // uni.navigateTo({
          // 	url: '/pages/webView/webView?url=' + url
          // })
        }
      })
    },
    // 校验token是否有效
    verifyToken(data) {
      if (data == undefined) {
        return
      }
      // data.clientId = clientId
      return this.$client.rpc(this.$api.VERIFY_TOKEN, data, { method: 'GET' })
    },
    // 校验token是否有效
    checkVerifyToken(callback) {
      // uni.showLoading({
      //   title: '加载中...'
      // })
      const that = this
      this.verifyToken({
        thirdAppId: 0
      })
        .then((res) => {
          const data = res
          let valid = ''
          if (data) {
            valid = data.data.valid
            if (valid) {
              // 有效
              callback && callback(valid)
            } else {
              // 失效
              // that.$client.clearStorage()
              that.$client.pushWindow('/pkPublic/login/login')
            }
          }
        })
        .catch((err) => {
          // console.log(err)
          uni.showToast({
            title: '网络不给力，请稍后再试',
            icon: 'none'
          })
        })
    },
  }
}
</script>

<style lang="scss">
.serve {
  width: 100%;
  height: 100vh;
  background-color: #f6f6f6;
  padding-top: 10upx;
  box-sizing: border-box;
  .swiper{
    width: 100%;
    height: 380upx;
    .ad-content{
      height: 100%;
      width: 100%;
    }
    .ad-img{
      height: 100%;
      width: 100%;
    }
  }
  .main {
    width: 750upx;
    height: 400upx;
    background: #ffffff;
    padding: 20upx 50upx 0 40upx;
    box-sizing: border-box;
    .title {
      font-size: 32upx;
      color: #333333;
      line-height: 46upx;
    }
    .content {
      width: 100%;
      padding-left: 10upx;
      box-sizing: border-box;
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;
      align-items: center;
      .item {
        margin-top: 58upx;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-right: 110upx;
        min-width: 40px;
        &:nth-child(4n) {
          margin-right: 0;
        }
        .item-icon {
          width: 42upx;
          height: 42upx;
          image {
            width: 42upx;
            height: 42upx;
          }
        }
        .item-name {
          margin-top: 12upx;
          font-size: 20upx;
          color: #333333;
          line-height: 26upx;
        }
      }
    }
  }
}
</style>
