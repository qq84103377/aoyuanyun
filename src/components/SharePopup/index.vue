<template>
  <UPopup v-model="value">
    <div class="sharePopup" catchtouchmove="true">
      <div class="share_img" id="shareImg" @click="clickMask">
        <img
          v-show="show"
          :src="posterUrl"
          :style="style"
          :mode="mode"
          :lazy-load="true"
          catchtap="true"
        />
      </div>
      <div class="share_btn">
        <div>
          <button class="share_btn1" open-type="share"></button>
          <div>微信分享</div>
        </div>
        <!-- <div>
          <button class="share_btn2" data-name="shareBtn" @click="shareAic"></button>
          <div>分享朋友圈</div>
        </div> -->
        <div @click="downQrcode">
          <img src="http://img.asset/invite/qrcode_btn3.png" />
          <div>分享图片</div>
        </div>
      </div>
    </div>
  </UPopup>
</template>

<script>
import UPopup from '@/components/UPopup'
export default {
  props: {
    // 是否可以点击遮罩
    maskClick: { type: Boolean, default: false },
    value: { type: Boolean, default: false },
    // 传入的分享按钮标题
    title: { type: String, required: true },
    // 传入下载图片本地地址
    posterUrl: { type: String, required: true },
    // 传入的分享数据 格式{bType,bId,channelId,dId}
    // dId可不传—默认0
    // needLogin 是否需要校验登陆
    shareData: { type: Object, required: true },
    mode: { type: String, default: 'widthFix' } // 图片裁剪模式
  },
  data() {
    return {
      show: false,
      style: 'width:100%'
    }
  },
  components: { UPopup },
  watch: {
    // 监听传入title 创建缓存
    title: {
      handler(nv) {
        this.$client.setStorage('shareTitle', nv)
      },
      immediate: true
    },
    // 监听传入channelId 创建缓存
    shareData: {
      handler(nv) {
        console.log('当前传入的分享数据', nv)
        this.$client.setStorage('shareShareData', nv)
      },
      immediate: true
    },
    // 获取传入图片信息
    posterUrl: {
      handler(nv) {
        if (nv) {
          if (this.mode == 'heightFix') {
            // 图片高度高于整屏允许展示区域
            this.style = 'height:100%'
          } else {
            this.style = 'width:100%'
          }
          this.show = true
          console.log('当前裁切图片模式', this.mode, '当前传入的图片路径', nv)
        }
        this.$client.setStorage('sharePosterUrl', nv)
      },
      immediate: true
    }
  },
  methods: {
    // 遮罩层点击
    clickMask() {
      if (this.maskClick) {
        this.$emit('onClose')
      }
    },
    downQrcode() {
      // 下载图片
      console.log('开始')
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
                  filePath: $this.posterUrl,
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
              filePath: $this.posterUrl,
              success(res) {
                // console.log('res2', res)
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
          console.log('fail', res)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.sharePopup {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.5);
  animation: popup 1s forwards;

  .share_img {
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    width: 100%;
    height: calc(100vh - 100px);
    padding: 20px;
  }

  .share_btn {
    display: flex;
    align-items: center;
    justify-content: space-around;
    box-sizing: border-box;
    width: 100vw;
    height: 100px;
    padding: 15px 24px;
    border-radius: 10px 10px 0px 0px;
    background: #fff;
    font-size: 11px;
    font-weight: 400;
    color: #333333;
    line-height: 16px;
    text-align: center;
    img {
      width: 48px;
      height: 48px;
      margin-bottom: 8px;
      vertical-align: middle;
    }
    .share_btn1 {
      width: 48px;
      height: 48px;
      margin-bottom: 8px;
      background: url('http://img.asset/invite/qrcode_btn2.png') no-repeat;
      background-size: 100% 100%;
    }
    .share_btn1::after {
      border: none;
    }
    .share_btn2 {
      width: 48px;
      height: 48px;
      margin-bottom: 8px;
      background: url('http://img.asset/invite/friendaic.png') no-repeat;
      background-size: 100% 100%;
    }
    .share_btn2::after {
      border: none;
    }
  }
  @keyframes popup {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
}
</style>
