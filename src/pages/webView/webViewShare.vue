<template>
  <div>
    <div>
      <web-view :src="url" :progress="false"></web-view>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      titleBarHeight: 0,
      statusBarHeight: 0,
      url: '',
      item: {}
    }
  },
  async onLoad(val) {
    var that = this
    uni.getSystemInfo({
      success: function (res) {
        if (res.model.indexOf('iPhone') !== -1) {
          that.titleBarHeight = 44 + 'px'
        } else {
          that.titleBarHeight = 48 + 'px'
        }
        that.statusBarHeight = res.statusBarHeight + 'px'
      }
    })

    let data = this.$client.getParam()
    // console.log('data', data)
    // 分享入口进入
    if (data.id) {
      let res = await this.$client.rpc(this.$api.COMMUNITY_DETAIL, { id: data.id })
      this.item = res.data.data
      this.url = res.data.data.detail
    } else {
      this.item = data.data
      this.url = data.url
    }
    // console.log('dataitem', this.item)

    // this.url = decodeURIComponent(val.url)
    // let urlObj = val.urlObj
    // if (urlObj != undefined && urlObj) {
    //   urlObj = JSON.parse(urlObj)
    //   if (urlObj.url != undefined) {
    //     this.url = decodeURIComponent(urlObj.url)
    //   }
    // }
  },
  async onShareAppMessage() {
    let { uid } = await this.$store.state.userInfo
    let { data } = await this.$client.rpc(this.$api.SET_SCENE, {
      scene: `${11}_${uid}_${this.item.id}`
    })
    let scene = data.data.id
    return {
      title: this.item.title,
      path: 'pages/launch/index?scene=' + scene,
      imageUrl: this.item.urls
    }
  }
}
</script>

<style>
.status-bar {
  width: 100%;
  background: #007aff;
  top: 0;
  position: fixed;
  z-index: 100;
  left: 0;
}
.status-bar-title {
  position: absolute;
  left: 0;
  right: 0;
  margin: auto;
  font-size: 34rpx;
  color: #ffffff;
  text-align: center;
}
</style>
