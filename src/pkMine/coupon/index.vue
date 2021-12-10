<!--
 * @Description:
 * @version:
 * @Author: gonghonglin
 * @Date: 2021-07-10 17:16:59
 * @LastEditors: gonghonglin
 * @LastEditTime: 2021-11-17 17:52:15
-->
<template>
  <div class="pages_coupon">
    <div
      class="couponList"
      v-for="(item, index) in mainItems"
      :class="{ disabled: item.useStatus == -1 || item.useStatus == 2 }"
      :key="index"
    >
      <div class="coupon-top" @click="showCouponDetail(item)">
        <!-- 券类型 -->
        <div
          class="coupon-img"
          :style="{
            'background-image': `url(${
              item.imgUrl || 'http://img.asset/coupon-bg-default.png'
            })`
          }"
        >
          <div class="coupon-type" :class="{ 'type-discount': item.couponType == '2' }">
            {{ CouponType[item.couponType] }}
          </div>
        </div>
        <!-- 券主体 -->
        <div class="coupon-ringht">
          <div class="coupon-name">{{ item.name }}</div>
          <div class="coupon-num">
            <span class="coupon-value"
              >{{ couponInfo.amount
              }}<span class="coupon-unit">{{
                item.couponType == '2' ? '折' : '元'
              }}</span></span
            >
          </div>
          <div class="use-range">所属项目： {{ item.projectName }}</div>
          <div class="copon-time">有效时期:{{ item._expTimes }}</div>
          <!-- 进度条 -->
          <div class="box">
            <div class="progress-container">
              <span>已抢 &nbsp;{{ item.usageQuantity }}%</span>
              <div class="progress-bar">
                <div class="progress" :style="{ width: item.usageQuantity + '%' }"></div>
              </div>
              <span>{{ item.usageQuantity }}%</span>
            </div>
            <div>
              <span v-if="changeStatus_momy(item)"
                >分享预计赚{{ item.expectedAmount }}</span
              >
            </div>
          </div>
        </div>
      </div>
      <div class="receive_coupon_box" v-if="changeStatus(item)">
        <div class="receive_coupon-share" @click="shareChange(item)">立即分享</div>
        <div
          class="receive_coupon"
          v-if="item.useStatus == 0"
          @click="getReceiveCoupon(item)"
        >
          立即领取
        </div>
        <div
          class="receive_coupon"
          style="color: #cbd7e1"
          v-else-if="item.useStatus == -1"
        >
          已抢光
        </div>
        <div
          class="receive_coupon"
          style="color: #cbd7e1"
          v-else-if="item.useStatus == 2"
        >
          今天已抢光
        </div>
        <div
          class="receive_coupon active"
          v-else
          @click="showCouponDetail(item, 'showQRCode')"
        >
          去使用
        </div>
      </div>
      <div class="not" v-else>已抢光</div>
    </div>
    <div class="loading">{{ contentText }}</div>
    <div class="no-record" v-if="!mainItems.length && !mainItems.length"></div>

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
          <div class="share-item" @click="shareAic">
            <button class="share_btn2" data-name="shareBtn"></button>
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
  components: { UPopup },
  data() {
    return {
      width: 0,
      height: 0,
      isShowShare: false,
      couponInfo: {},
      qrcode: null, // 二维码
      userInfo: {}, // 用户信息
      poster: null, // 海报
      back: null,
      // 参数
      isNotData: false,
      pager: {
        page: 1,
        pageSize: 10,
        enableTime: '',
        couponStatus: 1,
        publishType: 1,
        city: this.$store.state.location //当前城市
      },
      isComplete: false, //标记已经加载完成了
      CouponType: {
        1: '抵扣券',
        2: '折扣券',
        3: '礼品券',
        4: '停车券'
      },
      mainItems: [],
      constants: {},
      flag: false,
      contentText: '',
      isLoading: false, // 正在加载中
    }
  },
  onLoad() {
    this.getListcoupon()
  },
  // 上拉加载
  onReachBottom() {
    if (this.isComplete) return
    uni.showNavigationBarLoading()
    this.pager.page++
    this.getListcoupon()

    uni.hideNavigationBarLoading()
  },
  methods: {
    onPullDownRefresh() {
      uni.stopPullDownRefresh() //停止当前页面下拉刷新
      this.pager.page = 1
      this.isComplete = false
      this.getListcoupon()
    },
    // 列表数据的数据
    async getListcoupon() {
      this.pager.enableTime = this.$tools.date2Str(new Date(), 'YYYY-MM-DD hh:mm:ss')
      this.pager.city = this.pager.city == '全部' ? '' : this.pager.city
      let res = await this.$client.rpc(this.$api.COUPON_LIST, this.pager)
      var data = res.data.rows
      data.forEach((item) => {
        item._expTimes =
          this.date2Str(item.startTime, 'YYYY/MM/DD') +
          '-' +
          this.date2Str(item.endTime, 'YYYY/MM/DD')
      })
      if (this.pager.page != 1) {
        this.mainItems = this.mainItems.concat(data)

        if (data.length == 0) {
          this.contentText = '真的没有更多啦~'
        }
      } else {
        this.mainItems = data
        if (data.length == 0) {
          this.isNotData = true
        }
      }
      // 标记已经加载完成了
      if (this.mainItems.length == res.data.total) {
        this.isComplete = true
      }
    },

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
          // item.useStatus =1,
          this.pager.page = 1
          this.getListcoupon() //再次刷新列表
  
          this.$emit('onRefresh')
        } else {
          // console.log('优惠券领取失败', data)
        }
        this.isLoading = false
      } catch (error) {
        this.isLoading = false
      }
    },
    showCouponDetail(item, isShowQRCode = '') {
      this.$client.pushWindow(
        './detail/index?id=' + item.id + '&isShowQRCode=' + isShowQRCode
      )
    },
    // 时间格式的转化---年月日
    date2Str(date, format) {
      return this.$tools.str2DateStr(date, format)
    },
    // 根据状态显示 0 不可分享   1可分享
    changeStatus(item) {
      var showRentPrise
      if (item.shareStatus == 1) {
        showRentPrise = true
      } else {
        showRentPrise = false
      }
      return showRentPrise
    },
    shareChange(item) {
      this.couponInfo = item
      this.isShowShare = true
      var that = this
      uni.getSystemInfo({
        success(res) {
          that.width = res.screenWidth
          that.height = res.screenHeight
          that.getUser()
        }
      })
      that.getUser()
    },
    changeStatus_momy(item) {
      var showPrise
      if (item.shareStatus == 1) {
        showPrise = true
      } else {
        showPrise = false
      }
      return showPrise
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
            $this.userInfo.avatarUrl = res.tempFilePath
            $this.getBack()
          },
          fail: () => {
            $this.getBack()
          }
        })
      } else {
        $this.getBack()
      }
    },
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
    // 用户分享到朋友圈 -- 不支持自定义路径
    async onShareTimeline() {
      const _this = this
      return {
        title: '注册奥园云，领优惠，赚佣金',
        query: {}, // 页面参数
        imageUrl: _this.poster
      }
    },

    async getQrcode() {
      // 获取二维码
      // 如果存在小程序码，则直接读取，不重新生产
      let wechat_code = await this.$client.getStorage('wechat_code')
      var qrcode = await this.$client.rpc(this.$api.CREATE_WXQRCODE, {
        businessType: '5',
        page: '/pages/launch/index' // 优惠券
      })
      // console.log(qrcode);
      this.send_code(`data:image/png;base64,${qrcode.data.data.base64}`)
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
    shareAic() {
      console.log(123)
      this.$client.toast('请点击 右上角-分享到朋友圈，即可分享朋友圈')
    }
  }
}
</script>

<style lang="scss">
@import './index.scss';
.not-data {
  text-align: center;
  img {
    width: 304px;
    height: 304px;
  }
}
</style>
