<!--
 * @Description: 幸运抽奖架子
 * @version: 
 * @Author: gonghonglin
 * @Date: 2021-07-09 17:49:34
 * @LastEditors: gonghonglin
 * @LastEditTime: 2021-08-03 14:29:44
-->
<template>
  <div class="ad-container">
    <swiper class="swiper">
      <swiper-item class="swiper-item" v-for="(item, index) in list"  :key="index">
          <div class="ad-content"
            :style="{'background-image':`url(${item.imgUrl})`}"
            @click="onClickAd(item)">
          </div>
      </swiper-item>
    </swiper>
  </div>
</template>

<script>
export default {

  props: {
    option:{

    },
  },
  data(){
      return{
        list: [],
      }
  },
  methods: {
    onClickAd(item){
			this.$client.pushWindow('/pkPromotion/lucky/index', item)
    }
  },
};
</script>

<style lang="scss" scoped>
.swiper{
   height: 110px;

  .ad-content{
    margin: 0 15px;
    border-radius: 10px;
    overflow: hidden;
    height: 110px;
    .ad-img{
      width: 100%;
      height: 110px;
    }
  }
}

</style>
