<!--
 * @Description: 精选-精选资讯
 * @version: 
 * @Author: gonghonglin
 * @Date: 2021-07-09 17:49:34
 * @LastEditors: gonghonglin
 * @LastEditTime: 2021-11-04 22:47:11
-->
<template>
  <CardContainer :title="title" class="card-container" @onMore="onMore">
    <div class="community-list">
      <div class="community-item" @click.stop="viewUrl(item)" v-for="(item, index) in list" :item="item" :key="index">
        <!-- 图片 -->
        <div class="community-body" :style="{'background-image': `url(${item.urls})`}">

        </div>
				<div class="community-title">{{item.title}}</div>
        <!-- 状态 -->
        <div class="community-state">
          <span>{{item.readCount}}阅读</span>
          <span>{{item._createTime}}</span>
        </div>
      </div>
    </div>
  </CardContainer>
</template>

<script>
import CardContainer from "./cardContainer.vue";
export default {
  name: "EPromotion",
  components: {
    CardContainer,
  },
  props: {
    title: {
      type: String
    },
    list: {
      type: Array,
      default: []
    },
  },
  mounted() {
  },
  methods:{
    
    viewUrl(data){
      if(!this.$client.passCheck()) return
      this.getred(data.id)
      if(data.informationType==1){
        this.$client.pushWindow("/pages/webView/webView?url=" + encodeURIComponent(data.detail),{reLaunch:true});
      }else{
        this.$client.pushWindow("/pages/webView/within", {data});
      }
    },
    // 更新已读数量
    async getred(id){
      let { data } = await this.$client.rpc(this.$api.COMMUNITY_REND, {
       id
      })
      // this.datared = data.data
    },
    onMore(){
      if(!this.$client.passCheck()) return
      this.$client.pushWindow("/pkPromotion/Information/index");
		},
  }
}
</script>

<style lang='scss' scoped>
.community-list {
  display: flex;
  flex-direction: row;
  .community-item {
    width: 100%;
    display: flex;
    flex-direction: column;
    box-shadow: 0px 2px 9px 0px rgba(0, 0, 0, 0.06);
    border-radius: 8px;
    padding-bottom: 20px;
    overflow: hidden;
    margin-top:0;

    &:not(:last-child) {
      margin-right: 15px;
    }

		.community-body{
      height: 130px;
			position: relative;
			background-position: center;
			background-size: cover;
			background-repeat: no-repeat;
		}
		.community-title{
			padding:10px;
		}
  }

  .community-state {
    display: flex;
    justify-content: space-between;
    align-items: center;
		padding: 0 10px;
		font-size: 10px;
		color:#999;
    white-space: nowrap;
  }
}
</style>