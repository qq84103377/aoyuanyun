<!--
 * @Description: 资讯页面
 * @version: 
 * @Author: gonghonglin
 * @Date: 2021-09-27 22:18:01
 * @LastEditors: gonghonglin
 * @LastEditTime: 2021-10-12 17:52:38
-->
<template>
  <div class="container">
    <div class="title">{{ item.title }}</div>
    <div class="title_time">
      <span class="title_small">{{ item.publisher }}</span>
      <span class="createTime">{{ item.createTime }}</span>
    </div>
    <div class="content">
      <rich-text style="line-height: 2em" :nodes="item.detail"></rich-text>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      item: {}
    }
  },
  async onLoad() {
    let data = this.$client.getParam()
    // 分享入口进入
    if (data.id) {
      let res = await this.$client.rpc(this.$api.COMMUNITY_DETAIL, { id: data.id })
      this.item = res.data.data
    } else {
      this.item = data.data
    }

    this.$set(this.item, 'detail', this.$client.setEscape(this.item.detail, 'hasImage'))
  },
  async onShareAppMessage() {
    let { uid } = await this.$store.state.userInfo
    let { data } = await this.$client.rpc(this.$api.SET_SCENE, {
      scene: `${10}_${uid}_${this.item.id}`
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

<style lang="scss" scoped>
.container {
  .title {
    font-size: 24px;
    padding: 0 20px;
  }
  .title_time {
    padding: 0 20px;
    .title_small {
      font-size: 14px;
      margin-top: 20px;
      margin-right: 20px;
    }
    .createTime {
      color: #999;
    }
  }
  .content {
    padding: 20px;
  }
}
</style>
