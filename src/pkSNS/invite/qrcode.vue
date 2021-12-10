<!--
 * @Description:
 * @version:
 * @Author: lilinhong
 * @Date: 2021-08-06 14:34
 * @LastEditors: gonghonglin
 * @LastEditTime: 2021-10-13 17:01:45
-->
<template>
  <div class="canvasBox">
    <div>
      <div>
        <img
          class="backgroundImg"
          src="http://img.asset/invite/invite_background_3.png"
          mode="widthFix"
        />
      </div>
      <div class="content">
        <div class="userInfo_box">
          <div>
            <img
              class="avatar"
              :src="
                userInfo.avatarUrl ||
                'https://img04.aomygod.com/fontend/202179/imgs/user_attr.png'
              "
            />
            <div>
              <div class="user_name">
                {{ userInfo.name || '微信用户' }}
              </div>
              <div class="user_phone">
                {{ userInfo.phone || '--' }}
              </div>
            </div>
          </div>
          <div>邀您一起加入奥园云，分享好房，分享好物，0元创收</div>
        </div>
        <div class="code_box">
          <div class="inviteCode">
            <div>我的邀请码</div>
            <div>
              {{ userInfo.inviteCode || '--' }}
            </div>
          </div>
          <img class="codeImg" :src="qrcode" />
        </div>
      </div>
    </div>
    <!-- canvas 绘制区域 -->
    <div class="canvas_box">
      <canvas style="width: 100%; height: 100%" canvas-id="mycanvas_qrcode" />
    </div>
    <!-- 分享弹框 -->
    <SharePopup
      v-model="showPop"
      :maskClick="false"
      :title="'注册奥园云，领优惠，赚佣金'"
      :posterUrl="poster"
      :shareData="{
        bType: 1,
        bId: 0,
        channelId: '8802'
      }"
      :mode="'heightFix'"
    />
  </div>
</template>

<script>
import SharePopup from '@/components/SharePopup'
import { onShareAppMessage } from '@/utils/share'
export default {
  data() {
    return {
      screenWidth: 375,
      qrcode: null, // 二维码
      userInfo: {}, // 用户信息
      poster: null, // 海报
      back: null,

      showPop: false
    }
  },
  components: {
    SharePopup
  },
  onLoad(e) {
    const _this = this
    // 查询设备信息，用于canvas px 转换定位
    if (uni.canIUse('getSystemInfo')) {
      uni.getSystemInfo({
        success(res) {
          _this.screenWidth = res.screenWidth
        }
      })
    }
  },
  mounted() {
    this.getQrcode()
  },
  methods: {
    async getUser() {
      // 获取用户信息
      const $this = this
      let data = await this.$client.getUserInfo()
      console.log(data)
      data.phone =
        data.phone.slice(0, 3) + '****' + data.phone.slice(data.phone.length - 4)
      data.name = data.name
        ? data.name.slice(0, 1) + '*'.repeat(data.name.length - 1)
        : ''
      data.name =
        data.name ||
        (data.nickName
          ? data.nickName.length > 6
            ? data.nickName.slice(0, 6) + '...'
            : data.nickName
          : '') ||
        '微信用户'
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
          fail: (err) => {
            console.error('用户头像图片获取失败',img,err)
            $this.getBack()
          }
        })
      }
    },
    getBack() {
      const $this = this
      uni.downloadFile({
        url: 'http://img.asset/invite/invite_background_3.png',
        // url: 'https://img04.aomygod.com/fontend/202179/imgs/user_attr.png',
        success: (res) => {
          $this.back = res.tempFilePath
          $this.init()
        },
        fail(err) {
          console.error('背景图片获取失败')
          $this.init()
        }
      })
    },
    async getQrcode() {
      // 获取二维码
      let channelId = '8803' // 渠道id
      // scene = 0业务类型 + 1分享用户id + 2业务Id + 3渠道ID
      let { uid } = this.$store.state.userInfo // 用户id
      let { data } = await this.$client.rpc(this.$api.SET_SCENE, {
        scene: `1_${uid}_0_${channelId}_0`
      })
      let scene = data.data.id
      var qrcode = await this.$client.rpc(this.$api.CREATE_WXQRCODE, {
        page: 'pages/launch/index', //TODO--生产改成 pages/launch/index
        scene
      })
      // console.log(qrcode);
      this.send_code(`data:image/png;base64,${qrcode.data.data.base64}`)
    },
    //将base64图片转网络图片
    send_code(code) {
      const $this = this
      const fs = wx.getFileSystemManager()
      var times = new Date().getTime()
      var codeimg = wx.env.USER_DATA_PATH + '/' + times + '.png'
      fs.writeFile({
        filePath: codeimg,
        data: code.slice(22),
        encoding: 'base64',
        success: (res) => {
          // console.log(codeimg);
          $this.qrcode = codeimg
          $this.getUser()
          // console.error(123444444, codeimg, res)
        },
        fail() {
          console.error('二维码获取失败')
        }
      })
    },
    init() {
      // canvas初始化
      var ctx = uni.createCanvasContext('mycanvas_qrcode'),
        imgWidth = 0,
        imgHeight = 0,
        _this = this
      // 查询绘制海报宽高，动态生成canvas
      this.$nextTick(() => {
        // 以下绘制需要自己转换px适配
        let { toPx } = this

        // 设置banner 图片宽高
        imgWidth = toPx(670)
        imgHeight = toPx(680)
        console.log('当前banner宽=', imgWidth, '当前banner高=', imgHeight)

        // 绘制画布背景色保存
        ctx.setFillStyle('#fff')
        ctx.fillRect(0, 0, toPx(670), toPx(980))
        console.log('当前', this.qrcode)
        // 绘制顶部banner 图
        ctx.drawImage(this.back, 0, 60, imgWidth, imgHeight)
        ctx.save()

        // 绘制用户头像
        ctx.beginPath()
        ctx.setFillStyle('#fff')
        ctx.arc(toPx(58.8), toPx(58.8), toPx(28.8), 0, 2 * Math.PI)
        ctx.clip()

        ctx.drawImage(
          _this.userInfo.avatarUrl,
          toPx(30),
          toPx(30),
          toPx(57.6),
          toPx(57.6)
        )
        ctx.restore()

        // 绘制用户信息
        ctx.setTextBaseline('top')
        ctx.fillStyle = '#666666'
        ctx.setFontSize(toPx(24))
        ctx.fillText(this.userInfo.name || '', toPx(106), toPx(32))
        ctx.setFontSize(toPx(18))
        ctx.fillText(this.userInfo.phone, toPx(106), toPx(62) )

        // 绘制用户宣传语
        ctx.setFontSize(toPx(20))
        ctx.fillText('在奥园云', toPx(560), toPx(32) )
        ctx.fillText('人人都是健康生活分享家', toPx(420), toPx(60) )

        // 绘制邀请码
        ctx.setFontSize(toPx(28))
        ctx.fillText('我的邀请码', toPx(30), toPx(172) + imgHeight)
        ctx.setFontSize(toPx(36))
        let code = this.userInfo.inviteCode || '--'
        ctx.fillText(code, toPx(30), toPx(220) + imgHeight)

        // 绘制二维码
        ctx.drawImage(this.qrcode, toPx(500), toPx(130) + imgHeight, toPx(140), toPx(140))

        // 最终生成图
        ctx.draw(true, () => {
          uni.canvasToTempFilePath({
            canvasId: 'mycanvas_qrcode',
            success: (res) => {
              _this.poster = res.tempFilePath
              _this.showPop = true
              // console.log('canvasToTempFilePath-success', res)
            },
            fail: (err) => {
              // console.log('canvasToTempFilePath-fail', err)
            }
          })
        })
      })
    },

    //rpx --> px 转换canvas 适配px 像素
    toPx(data) {
      let format = parseFloat(this.screenWidth / 750)
      return parseFloat(data * format)
    },
    //px --> rpx 转换canvas 适配rpx 像素
    toRpx(data) {
      let format = parseFloat(this.screenWidth / 750)
      return parseFloat(data / format)
    }
  },
  /**
   * 用户点击右上角分享对话窗口
   */
  onShareAppMessage
}
</script>

<style lang="scss" scoped>
.canvasBox {
  position: relative;
  width: 100%;
  .backgroundImg {
    width: 100%;
    // height: 595px;
    vertical-align: middle;
  }
  .content {
    height: 178px;
    .userInfo_box {
      display: flex;
      padding: 19px 15px 15px 20px;
      justify-content: space-between;
      .avatar {
        flex-shrink: 0;
        width: 28.8px;
        height: 28.8px;
        border-radius: 50%;
        margin-right: 9px;
      }
      & > div:first-child {
        flex-shrink: 0;
        display: flex;
        margin-right: 49px;
      }
      & > div:last-child {
        display: flex;
        font-size: 10px;
        color: #3c4871;
        line-height: 13px;
        max-width: 203px;
      }
      .user_name {
        font-size: 12px;
        font-weight: 500;
        color: #666666;
        line-height: 17px;
      }
      .user_phone {
        font-size: 9px;
        font-weight: 400;
        color: #666666;
        line-height: 13px;
      }
    }
    .code_box {
      display: flex;
      justify-content: space-between;
      padding: 0 15px 25px 20px;
      .inviteCode {
        padding: 37px 0 5px 0;
        & > div:first-child {
          font-size: 14px;
          color: #333333;
          line-height: 19px;
          margin-bottom: 4px;
        }
        & > div:last-child {
          font-size: 18px;
          color: #333333;
          line-height: 25px;
        }
      }
      .codeImg {
        width: 90px;
        height: 90px;
      }
    }
  }
  .canvas_box {
    position: fixed;
    top: 0;
    left: 999px;
    width: 335px;
    height: 535px;
  }
}
</style>
