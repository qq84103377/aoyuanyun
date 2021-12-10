<template>
  <div class="coupon-container">
    <div
      class="coupon-image"
      :style="{
        'background-image': `url(${
          couponInfo.imgUrl || 'http://img.asset/coupon-bg-default.png'
        })`
      }"
    ></div>

    <!-- 标题栏 + 优惠券类型 -->
    <div class="coupon_detali_top">
      <div class="d-flex">
        <span class="detail_top_title">{{ couponInfo.name || '奥园优惠券9折' }} </span>
        <div
          class="coupon-type"
          :class="{ 'type-discount': couponInfo.couponType == '2' }"
        >
          {{ CouponType[couponInfo.couponType] }}
        </div>
      </div>

      <!-- 9.5折、8000元， 无门槛券 -->
      <div class="coupon-val-bar">
        <div class="coupon-num">
          <div>
            <span class="coupon-value"> {{ couponInfo.amount }}</span>
            <span class="coupon-unit">{{
              couponInfo.couponType == '2' ? '折' : '元'
            }}</span>
            <span class="min-point">{{
              couponInfo.minPoint ? couponInfo.minPoint : '无门槛'
            }}</span>
            <span class="discount" v-if="changeStatus_momy(couponInfo)"
              ><span>分享预计赚</span>{{ couponInfo.expectedAmount }}</span
            >
          </div>
          <!-- <div class="sunnumber">总计 {{ couponInfo.count }} 张</div> -->
        </div>
        <!-- 进度条 -->
        <div class="progress-container">
          <span>已抢</span>
          <div class="progress-bar">
            <div
              class="progress"
              :style="{ width: (couponInfo.usageQuantity || 0) + '%' }"
            ></div>
          </div>
          <span>{{ couponInfo.usageQuantity || 0 }}%</span>
        </div>
      </div>
    </div>

    <!-- 使用规则 -->
    <div class="usuer_contant">
      <p class="user_rule">使用规则:</p>
      <p class="user_rule_p">
        <span class="user_rule_key">可用时间:&emsp;</span>
        <span> {{ couponInfo.startTime }} - {{ couponInfo.endTime }}</span>
      </p>
      <p class="user_rule_p">
        <span class="user_rule_key">所属项目:&emsp;</span>
        <span> {{ couponInfo.useRange }}</span>
      </p>
      <p class="user_rule_p">
        <span class="user_rule_key">领取限制:&emsp;</span>
        <span>{{ couponInfo.receiveCount }}张</span>
      </p>
    </div>

    <div class="user_konw_box">
      <div class="user_konw">
        <p class="user_kowns">使用须知</p>
        <div class="user-description">
          <div class="rich_box">
            <rich-text :nodes="couponInfo.description | formatRichText"></rich-text>
          </div>
        </div>
        <!-- {{couponInfo.description}} -->
        <!--         <p class="user_kownID">1、每个会员ID限领一张</p>-->
        <!--        <p class="user_kown_two"> 2、会员凭优惠券到指定景点售票窗口进行核销</p>-->
        <!--          <p class="user_kown_three"> 3、每张门票仅使用一张优惠券</p>-->
        <!--           <p class="user_kown_fou"> 4、折扣劵无需预约所有门票业务都可使用</p>-->
        <!--            <p class="user_kown_phone"> 5、客服电话：40023292921</p>-->
      </div>
    </div>

    <div class="footer">
      <div class="boxzing">
        <div class="receive_coupon-share" @click="openShare">立即分享</div>
      </div>
      <div
        class="bottom"
        v-if="couponInfo.useStatus == 0"
        @click="getReceiveCoupon(couponInfo)"
      >
        立即领取
      </div>
      <div
        class="bottom"
        style="background-color: #d3d3d3"
        v-else-if="couponInfo.useStatus == -1"
      >
        已抢光
      </div>
      <div
        class="bottom"
        style="background-color: #d3d3d3"
        v-else-if="couponInfo.useStatus == 2"
      >
        今天已抢光
      </div>
      <div class="bottom" v-else @click="showQRCode">去使用</div>
    </div>

    <UPopup v-model="couponInfo.couponCode && isShowQRCode">
      <!-- 优惠券二维码 -->
      <div class="card">
        <img class="coupon-qrcode" :src="couponInfo.qrCodeImage" alt="" />
        <div class="copy-bar" @click="copyCode(couponInfo.couponCode)">
          验证码：<span class="txt-qrcode">{{ couponInfo.couponCode || '' }}</span>
          <span class="icon-copy"></span>
        </div>
        <div class="footer1">
          <div class="btn" @click="isShowQRCode = false">关闭</div>
        </div>
      </div>
    </UPopup>
    <UPopup v-model="isShowShare">
      <div class="share_box">
        <div class="canvas_box">
          <canvas
            :style="'width: ' + width * 0.8 + 'px;height: ' + height * 0.7 + 'px;'"
            canvas-id="mycanvas"
          />
        </div>
        <div class="share_btn">
          <div class="share-item">
            <button class="share-btn" data-name="shareBtn" open-type="share"></button>
            <img src="http://img.asset/invite/qrcode_btn2.png" alt="" srcset="" />
            <div class="shar">微信分享</div>
          </div>
          <div class="share-item">
            <button class="share_btn1" data-name="shareBtn" @click="shareAic"></button>
            <img src="http://img.asset/invite/friendaic.png" alt="" srcset="" />
            <div>分享朋友圈</div>
          </div>
          <!-- <div class="share-item">
            <img src="http://img.asset/invite/qrcode_btn1.png" alt="" srcset="">
          <div>复制口令码</div>
          </div> -->
          <div class="share-item" @click="downQrcode">
            <img src="http://img.asset/invite/qrcode_btn3.png" alt="" srcset="" />
            <div>生成海报</div>
          </div>
        </div>
      </div>
    </UPopup>
  </div>
</template>

<script>
import UPopup from '@/components/UPopup'
import QRCode from '@/utils/qrcode.js'

export default {
  data() {
    return {
      qrcode: null, // 二维码
      userInfo: {}, // 用户信息
      poster: null, // 海报
      back: null,
      width: 0,
      height: 0,
      isShowQRCode: false, // 显示二维码
      isShowShare: false, // 显示分享
      poster: null, // 海报
      queryParams: {},
      couponInfo: {
        name: '',
        count: '',
        usageQuantity: '',
        startTime: '',
        endTime: '',
        useRange: '',
        receiveCount: '',
        description: ''
      },
      CouponType: {
        1: '抵扣券',
        2: '折扣券',
        3: '礼品券',
        4: '停车劵'
      },
      isShowUserInfoTips: false, // 检测用户信息是否完善
      stateTips: '',
      isLoading: false, // 正在加载中
    }
  },
  //  mounted() {
  //     this.getQrcode();
  //   },
  filters: {
    /**
     * 处理富文本里的图片宽度自适应
     * 1.查找img标签有无style属性，如果没有，加上style
     * 2.所有标签style后追加 max-width:100% !important;
     * 4.去掉<br/>标签
     * @param html
     * @returns {void|string|*}
     */
    formatRichText(html = '') {
      //控制小程序中图片大小
      let newContent = html.replace(/<img[^>]*>/gi, function (match, capture) {
        // console.log(match.search(/style=/gi));

        if (match.search(/style=/gi) == -1) {
          match = match.replace(/\<img/gi, '<img style=""')
        }
        return match
      })

      newContent = newContent.replace(
        /style="/gi,
        '$& max-width:100% !important; height:auto !important;'
      )
      newContent = newContent.replace(/<br[^>]*\/>/gi, '')
      return newContent
    }
  },
  components: {
    UPopup
  },
  methods: {
    openShare() {
      this.getUser()

      this.isShowShare = true
      var that = this
      uni.getSystemInfo({
        success(res) {
          that.width = res.screenWidth
          that.height = res.screenHeight
          that.init()
        }
      })
    },
    onLoad(option) {
      // console.log(option);
      this.queryParams = option
      this.getCouponInfo(this.queryParams.id, this.queryParams.isShowQRCode)
    },
    gotodelits() {
      this.$client.pushWindow('/pages/index/couponindex/index')
    },

    // 获取优惠券详情
    async getCouponInfo(id, isShowQRCode) {
      if (!this.$client.passCheck()) return
      // 检查是否已经完善了信息
      let us = await this.getUserDataState()
      if (us) return

      let { data } = await this.$client.rpc(this.$api.COUPON_DETAIL, { id })
      if (data.success) {
        data.data.description = this.$client.setEscape(data.data.description)
        data.data.startTime = this.date2Str(data.data.startTime, 'YYYY/MM/DD hh:mm')
        data.data.endTime = this.date2Str(data.data.endTime, 'YYYY/MM/DD hh:mm')
        this.$set(this, 'couponInfo', data.data)
        console.log('data.data',data.data);
        if (data.data.couponCode && isShowQRCode) {
          setTimeout(() => {
            this.showQRCode()
          }, 600)
        }
      } else {
        this.$client.alert('优惠券详情获取失败')
      }
    },

    // 显示优惠券明细
    showQRCode() {
      this.isShowQRCode = true
      if (!this.couponInfo.qrCodeImage) {
        let mode = ['Numeric', 'Alphanumeric', 'Byte', 'Kanji'][2]
        let errorCorrectionLevel = ['L', 'M', 'Q', 'H'][0]
        let qr = QRCode(0, errorCorrectionLevel)
        qr.addData('CP_' + this.couponInfo.couponCode, mode)
        qr.make()
        // let rt =  qr.createTableTag();
        // let rt =  qr.createSvgTag();
        // let rt =  qr.createImgTag();
        let rt = qr.createDataURL(5, 10) //输出base64地址
        this.$set(this.couponInfo, 'qrCodeImage', rt)
        this.$client.pushEvent('COUPON_RECEIVE', {
          type: '显示优惠券二维码',
          data: this.couponInfo.couponCode
        }) // 埋点
      }
    },
    // 复制验证码
    async copyCode(txt) {
      await this.$client.copy(txt)
      this.$client.toast('验证码已复制')
    },
    //生成

    // 领取优惠券
    async getReceiveCoupon(item) {
      if(this.isLoading){
        this.$client.toast('正在加载中')
        return
      }
      this.isLoading = true
      try {
        let { data } = await this.$client.rpc(this.$api.COUPON_GET_RECEIVE, {
          couponId: item.id
        })
        if (data.success) {
          this.$client.toast('已领取成功')
          this.getCouponInfo(this.queryParams.id, this.queryParams.isShowQRCode)
          // console.log("优惠券已领取");
          this.$emit('onRefresh')
          this.$client.pushEvent('COUPON_RECEIVE', item) // 埋点
        } else {
          // console.log("优惠券领取失败", data);
        }
        this.isLoading = false
      } catch (error) {
        this.isLoading = false
      }
    },
    // 获取用户信息是否完善
    async getUserDataState() {
      let { data } = await this.$client.rpc(this.$api.VALIDATE_USERINFO)
      this.isShowUserInfoTips = !data.data
      this.stateTips = data.msg
      return new Promise((resolve) => resolve(this.isShowUserInfoTips))
    },
    routerUserInfo() {
      this.isShowUserInfoTips = false
      this.$client.pushWindow('/pkMine/personal/index', { hasBackBtn: true })
    },
    // 时间格式的转化---年月日
    date2Str(date, format) {
      return this.$tools.str2DateStr(date, format)
    },
    async getUser() {
      // 获取用户信息
      const $this = this
      let data = await this.$client.getUserInfo()
      this.userInfo = data
      var img =
        data.avatarUrl || 'https://img04.aomygod.com/fontend/202179/imgs/user_attr.png'
      if (data.avatarUrl.indexOf('http://tmp') == -1) {
        uni.downloadFile({
          url: img,
          success: (res) => {
            console.log(res, 11)
            $this.userInfo.avatarUrl = res.tempFilePath
            $this.getBack()
          },
          fail: (res) => {
            console.log(res)
            $this.getBack()
          }
        })
      } else {
        $this.getBack()
      }
    },
    //获取优惠劵二维码

    getBack() {
      const $this = this
      uni.downloadFile({
        url: this.couponInfo.imgUrl || 'http://img.asset/coupon-bg-default.png',
        success: (res) => {
          $this.couponInfo.imgUrl = res.tempFilePath
          $this.getQrcode()
        },
        fail(err) {
          $this.getQrcode()
        }
      })
    },
    async getQrcode() {
      // 获取二维码
      // 如果存在小程序码，则直接读取，不重新生产
      // let wechat_code = await this.$client.getStorage('wechat_code')
      let wechat_code = await this.$client.getStorage('wechat_code')
      var qrcode = await this.$client.rpc(this.$api.CREATE_WXQRCODE, {
        businessType: '3',
        businessId: this.queryParams.id,
        page: 'pages/launch/index' // 优惠券
      })
      // console.log(qrcode);
      this.send_code(`data:image/png;base64,${qrcode.data.data.base64}`)
      console.log(`data:image/png;base64,${qrcode.data.data.base64}`, '二维码11111')

      // this.qrcode = `data:image/png;base64,${qrcode.data.data.base64}`
      // 缓存小程序二维码
      this.$client.setStorage('wechat_code', {
        uid: this.userInfo.uid,
        data: this.qrcode
      })
    },
    send_code(code) {
      //将base64图片转网络图片
      const $this = this
      const fs = wx.getFileSystemManager()
      var times = new Date().getTime()
      var codeimg = wx.env.USER_DATA_PATH + '/' + times + '.png'
      fs.writeFile({
        filePath: codeimg,
        data: code.slice(22),
        encoding: 'base64',
        success: () => {
          console.log(codeimg)
          $this.qrcode = codeimg
          $this.init()
        }
      })
    },
    init() {
      // canvas初始化
      var $this = this,
        ctx = uni.createCanvasContext('mycanvas')
      var { width, height, couponInfo } = this

      // 设置白色背景
      ctx.setFillStyle('#fff')
      ctx.fillRect(0, 0, width * 0.8, height * 0.7)

      // 绘制名称
      ctx.setFontSize(width * 0.05)
      ctx.setFillStyle('#000')
      var str = $this.couponInfo.name
      if (str.length > 16) {
        var arr = str.split('')
        var text = arr.splice(0, 16).join('')
        var text1 = arr.splice(0, 10).join('') + '...'
        ctx.fillText(text, width * 0.02, height * 0.05, width * 0.75)
        ctx.stroke()
        ctx.fillText(text1, width * 0.02, height * 0.09, width * 0.75)
        ctx.stroke()
      } else {
        ctx.fillText(str, width * 0.02, height * 0.07, width * 0.75)
        ctx.stroke()
      }

      if ($this.couponInfo.imgUrl) {
        // 图片
        ctx.drawImage(
          $this.couponInfo.imgUrl,
          width * 0.02,
          height * 0.12,
          width * 0.76,
          width * 0.76
        )
      }

      // 绘制头像
      ctx.save() // 先保存状态 已便于画完圆再用
      ctx.beginPath() //开始绘制
      ctx.arc(width * 0.1, height * 0.65, width * 0.04, 0, Math.PI * 2, false)
      ctx.clip() //画了圆 再剪切  原始画布中剪切任意形状和尺寸。一旦剪切了某个区域，则所有之后的绘图都会被限制在被剪切的区域内
      ctx.fillRect(0, 0, width, height)
      if ($this.userInfo.avatarUrl) {
        ctx.drawImage(
          $this.userInfo.avatarUrl,
          width * 0.05,
          height * 0.62,
          width * 0.1,
          width * 0.1
        )
      }
      ctx.restore()

      // 折扣
      var money =
        (couponInfo.amount || '*') + (couponInfo.couponType == '2' ? '折' : '元')
      ctx.setFontSize(width * 0.05)
      ctx.setFillStyle('#e20000')
      ctx.fillText(money, width * 0.06, height * 0.6, width * 0.75)
      ctx.stroke()

      // 是否有无门槛
      if (!couponInfo.minPoint) {
        ctx.setFontSize(width * 0.04)
        ctx.setFillStyle('#000')
        ctx.fillText('无门槛', width * 0.18, height * 0.6, width * 0.75)
        ctx.stroke()
      }

      // 用户名称
      ctx.setFontSize(width * 0.04)
      ctx.setFillStyle('#000')
      ctx.fillText($this.userInfo.name, width * 0.15, height * 0.646, width * 0.75)
      ctx.stroke()

      // 手机号码
      ctx.setFontSize(width * 0.02)
      ctx.setFillStyle('#999')
      ctx.fillText($this.userInfo.phone, width * 0.15, height * 0.665, width * 0.75)
      ctx.stroke()

      // 二维码
      ctx.setFillStyle('#F8F8F8')
      ctx.fillRect(width * 0.49, height * 0.53, width * 0.27, width * 0.27)
      if ($this.qrcode) {
        ctx.drawImage(
          $this.qrcode,
          width * 0.51,
          height * 0.54,
          width * 0.23,
          width * 0.23
        )
      }
      ctx.draw(true, () => {
        uni.canvasToTempFilePath({
          canvasId: 'mycanvas',
          success: (res) => {
            $this.poster = res.tempFilePath
            // console.log('canvasToTempFilePath-success', res)
          },
          fail: (err) => {
            // console.log('canvasToTempFilePath-fail', err)
          }
        })
      })
    },
    async onShareAppMessage(options) {
      // let imageUrl = "http://img.asset/logo-share.jpg";
      // let uid = await this.$client.getUserInfo('uid') || ''
      // let scene = await this.$client.getScene(uid ? '3': '1')

      let channelId = '8802' // 渠道id
      // scene = 0业务类型 + 1分享用户id + 2业务Id + 3渠道ID + 4分销机构id
      let { uid } = this.$store.state.userInfo // 用户id
      let { data } = await this.$client.rpc(this.$api.SET_SCENE, {
        scene: `3_${uid}_0_${channelId}_0`
      })
      let scene = data.data.id

      let shareObj = {
        title: '注册奥园云，领优惠，赚佣金',
        path: 'pages/launch/index?scene=' + scene // 引导页
        // imageUrl,
        // success(res) {
        //   // 转发成功之后的回调
        //   this.$client.pushEvent("SHARE_APP", {
        //     data: "邀请好友注册",
        //   }); // 埋点
        //   if (res.errMsg == "shareAppMessage:ok") {
        //   }
        // },
        // fail() {
        //   // 转发失败之后的回调
        //   if (res.errMsg == "shareAppMessage:fail cancel") {
        //     // 用户取消转发
        //   } else if (res.errMsg == "shareAppMessage:fail") {
        //     // 转发失败，其中 detail message 为详细失败信息
        //   }
        // },
        // complete() {
        //   // 转发结束之后的回调（转发成不成功都会执行）
        // },
      }

      // 转发埋点
      this.$client.pushEvent('SHARE_APP', {
        data: '邀请好友注册'
      }) // 埋点

      return shareObj
    },
    // 根据状态显示 0 不可分享   1可分享
    // changeStatus(item) {
    //   var showRentPrise;
    //   if (item.shareStatus == 1) {
    //     showRentPrise = true;
    //   } else {
    //     showRentPrise = false;
    //   }
    //   return showRentPrise;
    // },
    downQrcode() {
      // 下载图片
      // console.log('开始');
      var $this = this
      // console.log(this.poster);
      uni.getSetting({
        success(res) {
          // console.log('校验');
          if (!res.authSetting['scope.writePhotosAlbum']) {
            // console.log('授权');
            uni.authorize({
              scope: 'scope.writePhotosAlbum',
              success() {
                uni.saveImageToPhotosAlbum({
                  filePath: $this.poster,
                  success(res) {
                    // console.log('res1', res);
                    uni.showToast({
                      title: '已保存到相册',
                      icon: 'success',
                      duration: 3000
                    })
                  }
                })
              }
            })
          } else {
            uni.saveImageToPhotosAlbum({
              filePath: $this.poster,
              success(res) {
                // console.log('res2', res);
                uni.showToast({
                  title: '已保存到相册',
                  icon: 'success',
                  duration: 3000
                })
              }
            })
          }
        },
        fail(res) {
          // console.log('fail',res)
        }
      })
    },
    shareAic() {
      this.$client.toast('请点击 右上角-分享到朋友圈，即可分享朋友圈')
    },
    // 用户分享到朋友圈 -- 不支持自定义路径
    async onShareTimeline() {
      const _this = this
      return {
        title: '注册奥园云，领优惠，赚佣金',
        query: {}, // 页面参数
        imageUrl: _this.poster
      }
    },

    changeStatus_momy(couponInfo) {
      var showPrise
      if (couponInfo.shareStatus == 1) {
        showPrise = true
      } else {
        showPrise = false
      }
      return showPrise
    }
  }
}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
