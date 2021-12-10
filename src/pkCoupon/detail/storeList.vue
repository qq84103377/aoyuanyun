<template>
  <div class="store-list">
    <div class="store-list__item" v-for="(item,idx) in storeList" :key="idx">
      <div class="name">{{item.merchantName}}</div>
      <div class="address">{{item.detail}}</div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'storeList',
    data(){
      return {
        storeList: [],
      }
    },
    onLoad(){
      this.storeList = this.$client.getParam().storeList
    },
  };
</script>

<style lang="scss" scoped>
  .store-list{
    border-top: 10px solid #f5f5f5;
    padding: 0 10px;
    &__item{
      padding: 10px 0;
      min-height: 30px;
      border-bottom: 1px solid #f5f5f5;
      .name,.address{
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        word-break: break-all;
      }
      .address{
        margin-top: 10px;
        font-size: 12px;
        color: #999;
      }
    }
  }
</style>
