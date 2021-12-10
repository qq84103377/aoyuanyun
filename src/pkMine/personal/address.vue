<!--
 * @Description: 修改地址
 * @version: 
 * @Author: gonghonglin
 * @Date: 2021-07-26 14:40:23
 * @LastEditors: gonghonglin
 * @LastEditTime: 2021-08-09 09:25:16
-->
<template>
  <div class="page">
    <u-cell  title="所在区域" placeholder="请选择所在区域" v-model="area.result" @onConfirm="onChangeArea" mode='region' isLink></u-cell>
    <!-- <u-input title="详细地址" placeholder="街道、楼牌号" v-model="address"></u-input> -->
	<div >
		<div class="title">详细地址</div>
		<textarea class="m-textarea" value="" v-model="address" placeholder="街道、楼牌号" />
	</div>
  </div>
</template>

<script>
export default {
  data(){
    return {
      area: {
        result:"",  // "北京市北京市朝阳区"
        value:[
          // 0: "110000"
          // 1: "110100"
          // 2: "110105"
        ]
      },
      address: ""
    }
  },
  methods:{
    onChangeArea(e){
      this.area.value = e.value;
      this.$client.$store.dispatch("setParam", {
        area: this.area,
        address: this.address
      });
    }
  },
  mounted(){
    let param = this.$client.getParam()
    if(param){
      /// TODO: 处理省市区
      this.address = param.address
      this.area.result = param.city
    }
  },
  destroyed () {
    ;
  },
  onUnload(){
    this.$client.$store.dispatch("setParam", {
      area: this.area,
      address: this.address
    });
  }
}
</script>

<style scoped lang="scss">
.page{
  border-top: 10px solid #ededed;
}
.title{
	font-size: 14px;
	color: #666;
	margin: 5px 20px;
}
.m-textarea{
	font-size: 14px;
	margin-left: 40rpx;
	padding: 20rpx;
	background: #F8F8F8;
	width: calc(100% - 80rpx);
	height: 200rpx;
	margin-bottom: 30rpx;
	border-radius: 10rpx;
	box-sizing: border-box;
	// color: #7e7e7e;
}
</style>