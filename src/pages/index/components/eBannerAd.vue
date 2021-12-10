<!--
 * @Description: 
 * @version: 
 * @Author: gonghonglin
 * @Date: 2021-07-09 17:49:34
 * @LastEditors: gonghonglin
 * @LastEditTime: 2021-09-13 11:32:23
-->

<template>
  <div class="ad-container">
    <swiper  :indicator-dots="list && list.length>1" class="swiper" :autoplay="true">
      <swiper-item class="swiper-item" v-for="(item, index) in list" :key="index">
        <div class="ad-content" @click="onClickAd(item)">
          <img class="ad-img" :src="item.url" alt="">
        </div>
      </swiper-item>
    </swiper>
  </div>
</template>

<script>
export default {
  name: 'EBannerAd',
  props: {
    list: {
      type: Array,
      default: []
    },
  },
  computed: {
  },
  data() {
    return {

    }
  },
  methods:{
    onClickAd(item){
      // 跳转类型（0,外部地址； 1、App首页；2、楼盘页面；3、服务；4、我的页面；5、个人信息, 6 抽奖）
      const pageMap = {
        '0': '/pages/webView/webView?url=',  //0,外部地址

        // 需要switch tab
        '1': '/pages/index/index',        // 1-精选 / 微信小程序注册 / 邀请注册
        '2': '/pages/pkBuilding/index',  //2、楼盘首页
        '3': '/pages/serve/serve',        // 3、服务
        '4': '/pages/pkMine/index',// 4-我的

        '5': '/pkMine/personal/index',// 5-个人
        '6': '/pkPromotion/lucky/index',// 6-抽奖
        '7': '/pkBuilding/detail',  //7、楼盘页面
      };
      // 0-外部地址
      if(item.redirectType=="0"){
        let isWebUrl = /(http)\S*/.test(item.redirectUrl)
        if(isWebUrl){
          this.$client.pushWindow(pageMap[0] + encodeURIComponent(item.redirectUrl),{reLaunch:true});
        }else{
          this.$client.pushWindow(item.redirectUrl)
        }
      }else{
        let url = item.redirectUrl ? pageMap[item.redirectType] + '?' + item.redirectUrl : pageMap[item.redirectType]
        console.log(url)
        let option = {
          switch: '1,2,3,4'.includes(item.redirectType)
        }
        if(url) this.$client.pushWindow(url,{},option)
      }
    }
  },
  mounted() {
  }

}
</script>
<style lang="scss" scoped>
$height: 190px;
.ad-container {
  height: $height;
  .swiper {
    height: $height;
    background: #eee;
  }
  .ad-content {
    overflow: hidden;
    height: $height;
    background-color: #f0f0f0;
    .ad-img {
      width: 100%;
      height: $height;
    }
  }
}
</style>