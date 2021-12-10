import WeCropper from './we-cropper.js'
const device = wx.getSystemInfoSync() // 获取设备信息
const width = device.windowWidth // 示例为一个与屏幕等宽的正方形裁剪框
const height = width

Component({
  properties: {
    src: {
      type: String,
      value: ''
    }
  },
  observers: {
    src(n) {
      this.setData({
        show: n ? true : false
      });
      n ? setTimeout(() => {
        this.init()
      }, 200) : void 0;
    }
  },
  data: {
    cropperOpt: {
      id: 'cropper', // 用于手势操作的canvas组件标识符
      targetId: 'targetCropper', // 用于用于生成截图的canvas组件标识符
      pixelRatio: device.pixelRatio, // 传入设备像素比
      width, // 画布宽度
      height, // 画布高度
      scale: 2.5, // 最大缩放倍数
      zoom: 8, // 缩放系数
      cut: {
        x: (width - 200) / 2, // 裁剪框x轴起点
        y: (width - 200) / 2, // 裁剪框y轴期起点
        width: 200, // 裁剪框宽度
        height: 200 // 裁剪框高度
      },
      show: false,
    }
  },
  attached() {},
  methods: {
    init() {
      const options = {
        ...this.data.cropperOpt,
        src: this.properties.src,
        _this: this
      }

      this.cropper = new WeCropper(options)
        .on('ready', (ctx) => {
          console.log(`wecropper is ready for work!`)
        })
        .on('beforeImageLoad', (ctx) => {
          wx.showToast({
            title: '上传中',
            icon: 'loading',
            duration: 20000
          })
        })
        .on('imageLoad', (ctx) => {
          wx.hideToast()
        })
    },
    touchStart(e) {
      this.cropper.touchStart(e)
    },
    touchMove(e) {
      this.cropper.touchMove(e)
    },
    touchEnd(e) {
      this.cropper.touchEnd(e)
    },
    uploadTap() {
      const self = this

      wx.chooseImage({
        count: 1, // 默认9
        sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success(res) {
          const src = res.tempFilePaths[0]

          self.cropper.pushOrign(src)
        }
      })
    },
    cancel() {
      this.triggerEvent('confirm', 0);
      this.setData({
        show: false,
        cropper: {}
      })
    },
    getCropperImage() {
      this.cropper.getCropperImage({ componentContext: true }, (tempFilePath) => {
        // tempFilePath 为裁剪后的图片临时路径
        if (tempFilePath) {
          // wx.previewImage({
          //   current: '',
          //   urls: [tempFilePath]
          // })
          this.triggerEvent('confirm', { tempFilePath });
        } else {
          console.log('获取图片地址失败，请稍后重试')
        }
        this.setData({
          show: false,
          cropper: {}
        })
      })
    }
  }
})