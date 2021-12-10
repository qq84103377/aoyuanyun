<!--
 * @Description: 意见反馈
 * @version: 
 * @Author: gonghonglin
 * @Date: 2021-07-01 14:42:30
 * @LastEditors: gonghonglin
 * @LastEditTime: 2021-09-27 20:49:41
-->
<template>
  <div class="page">
    <textarea v-model="feedBackDto.content" @blur="onChange" :maxlength="maxlength"
      placeholder="请输入反馈意见或建议"></textarea>
    <span class="tip"
      v-if="maxlength - feedBackDto.content.length >= 0">最多还可输入{{maxlength - feedBackDto.content.length}}字</span>
    <!-- 安卓机maxlength兼容性代码 -->
    <span class="tip" v-else>最多还可输入0字</span>
    <div class="Upload-pictures">
      <div class="up-img up-show" :style="{'background-image':`url(${item})`}"
        v-for="(item,index) in showImgUrlS" :key="index">
        <span class="close" @click="removeImg(index)">&times;</span>
      </div>
      <div class="up-img" @click="onUpload()" v-if="showImgUrlS.length<9">
        <img class="icon-upload" src="http://img.asset/up-img.png" />
      </div>
    </div>
    <!-- <button @click="test">test</button> -->
    <div class="footer">
      <div class="btn-submit" :class="{disabled: !canSubmit}" @click="saveFeedBack()">提交反馈</div>
    </div>
  </div>
</template>

<script>
// const COS = require('cos-wx-sdk-v5');
import COS from 'cos-wx-sdk-v5';
export default {
  data() {

    return {
      showImgUrlS: [],
      feedBackDto: {
        content: "",
        urls: "",
        channelCode: "AYCL0001"
      },
      maxlength: 500, //内容字数上限最多500
      cos: null,
      config: {
        Bucket: 'digital-dev-1306790816', /* 必须 */
        Region: 'ap-guangzhou',     /* 存储桶所在地域，必须字段 */
      }
    };
  },
  computed: {
    canSubmit() {
      return !!this.feedBackDto.content && this.maxlength - this.feedBackDto.content.length >= 0
    },
  },
  async mounted() {
    // return

    // url: https://digital-dev-1306790816.cos.ap-guangzhou.myqcloud.com/
    // storeUrl: /home/ay/aoyuan-admin-web/ay-fs/
    // secretId:  AKIDrWx94i7G8j36sNbZGgphHacU5PSEjxua
    // secretKey: QZOwHL8euud4E7i25qLYVBbkcDXaMr52
    // bucketName: digital-dev-1306790816
    // region: ap-guangzhou

    let _data;
    let that = this
      this.cos = new COS({
        SecretId:  'AKIDrWx94i7G8j36sNbZGgphHacU5PSEjxua',
        SecretKey: 'QZOwHL8euud4E7i25qLYVBbkcDXaMr52',
      });
    // console.log(_data)

  },
  methods: {
    test() {
      wx.chooseImage({
        count: 1,
        camera: 'back',
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
          var filePath = res.tempFilePaths[0];
          if (filePath) {
            wx.showLoading({ title: '正在上传...' });
            let param = {
              Bucket: this.config.Bucket,
              Region: this.config.Region,
              Key: "/img/" + new Date().getTime() + '.png',
              FilePath: filePath,
            }
            console.log(param)
            this.cos.postObject(param, function (err, data) {
              wx.hideLoading();
              if (data && data.Location) {
                wx.showToast({ title: '上传成功', icon: 'success', duration: 2000 });
              } else {
                console.log(err)
                wx.showToast({ title: '上传失败', icon: 'error', duration: 2000 });
              }
            });
          }
        }
      })

    },
    onChange() {
      this.$set(this.feedBackDto, 'content', this.feedBackDto.content.substr(0, 500))
    },
    removeImg(index) {
      this.showImgUrlS.splice(index, 1)
    },
    async saveFeedBack() {
      if (!this.canSubmit) {
        this.$client.alert('请填写反馈内容')
        return;
      }
      this.feedBackDto.urls = "";
      this.showImgUrlS.forEach(img => {
        this.feedBackDto.urls = this.feedBackDto.urls ? (this.feedBackDto.urls + ',' + img) : img;
      });
      let res = await this.$client.rpc(this.$api.SAVE_FEED_BACK, this.feedBackDto)
      if (res.data.success) {
        await this.$client.alert('提交成功，感谢您的反馈');
        this.showImgUrlS = [];
        this.feedBackDto.content = '';
        this.feedBackDto.urls = '';
        this.$client.back()
      } else {
        this.$client.alert('提交失败');
      }
    },
    // 上传图片
    async onUpload() {
      if (this.showImgUrlS.length >= 9) {
        this.$client.toast('图片最多上传9张');
        return;
      }
      try {
        let chooseImageRes = await this.$client.chooseImage();
        // console.log(chooseImageRes, 'chooseImageRes')

        for (const item of chooseImageRes.tempFiles) {
          if (this.showImgUrlS.length == 9) {
            this.$client.toast('图片最多上传9张');
            return;
          }

          if (item.size < 1.5 * 1024 * 1024) {

            let { data: base64 } = await this.$client.readFile({ filePath: item.path, encoding: 'base64' });

            uni.showLoading({ title: '正在上传...' });
            let param = {
              Bucket: this.config.Bucket,
              Region: this.config.Region,
              Key: "/img/" + this.$client.getRandFileName(item.path),
              FilePath: item.path,
            }
            console.log(param)
            this.cos.postObject(param, (err, data) => {
              console.log(44444, err, data)
              uni.hideLoading();
              if (data && data.Location) {
                this.showImgUrlS.push('//' + data.Location);
                wx.showToast({ title: '上传成功', icon: 'success', duration: 2000 });
              } else {
                console.log(err)
                this.$client.alert('上传失败')
              }
            });

          } else {
            this.$client.alert('上传的图片需小于1.5M')
            return
          }
        }

      } catch (error) {
        console.error(error)
        // 取消了
      }

    },
  },
};
</script>
<style>
page {
  height: 100%;
  display: flex;
}
</style>
<style lang="scss" scoped>
.page {
  flex: 1;
  padding: 20px;

  textarea {
    position: relative;
    width: 100%;
    height: 196px;
    background: #f8f8f8;
    border-radius: 10px;
    font-size: 14px;
    box-sizing: border-box;
    padding: 20px;

    &::-webkit-input-placeholder {
      /* WebKit browsers */
      color: #d3d3d3;
    }
  }

  .tip {
    position: absolute;
    right: 30px;
    top: 220px;
    font-size: 13px;
    color: #666660;
  }
  .text-danger {
    color: #fdb64b;
  }

  //上传图片
  .Upload-pictures {
    padding: 30px 0;
    display: flex;
    flex-wrap: wrap;

    .up-img {
      background: #f8f8f8;
      border-radius: 10px;
      width: 80px;
      height: 80px;
      margin-right: 10px;
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center;
      border: 1px solid #f3f3f3;

      .close {
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #a1a1a1;
        position: absolute;
        right: -10px;
        top: -10px;
        width: 25px;
        height: 25px;
      }
    }

    .icon-upload {
      height: 40px;
      width: 45px;
    }
  }

  // 底部
  .footer {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    bottom: 0;
    height: 100px;
    left: 0;
    right: 0;
    .btn-submit {
      width: 165px;
      height: 50px;
      border-radius: 25px;
      background: #f0c17b;
      color: #ffffff;
      font-size: 16px;
      text-align: center;
      line-height: 50px;
      &:active {
        background: #d8ab68;
      }
      &.disabled {
        background: #d3d3d3;
      }
    }
  }
}
</style>

