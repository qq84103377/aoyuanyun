<!--
 * @Description: 
 * @version: 
 * @Author: gonghonglin
 * @Date: 2021-08-30 09:32:54
 * @LastEditors: gonghonglin
 * @LastEditTime: 2021-09-10 10:55:47
-->
<template>
  <div class="center">
    <div class="center_item" v-for="(item, index) in bankList" :key="index">
      <img class="center_img" :src="avatarUrl" alt="" />
      <div class="center_info">
        <p>
          {{ item.name }} <span>{{ item.cardDefault ? '默认' : '' }}</span>
        </p>
        <p>{{ item.certificateNumber }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      bankList: [],
      avatarUrl: 'https://img04.aomygod.com/fontend/202179/imgs/user_attr.png'
    }
  },
  async mounted() {
    let userInfo = await this.$client.getUserInfo()
    if (userInfo.avatarUrl) {
      this.avatarUrl = userInfo.avatarUrl
    }
    console.log(userInfo)
    this.bankList = userInfo.certificateVos
      .filter((item) => item.valid == 1)
      .map((item) => {
        item.certificateNumber =
          item.certificateNumber.slice(0, 1) +
          '****************' +
          item.certificateNumber.slice(item.certificateNumber.length - 1)
        return item
      })
  }
}
</script>

<style lang="scss" scoped>
.center {
  min-height: 100vh;
  padding: 19px 15px;
  background-color: #f8f8f8;
  box-sizing: border-box;
  .center_item {
    background-color: #fff;
    border-radius: 10px;
    padding: 15px;
    display: flex;
    margin-bottom: 20px;

    &:active {
      background-color: #f3f3f3;
    }
    .center_img {
      width: 45px;
      height: 45px;
      margin-right: 10px;
    }
    .center_info {
      font-size: 14px;
      color: #333;
      p:nth-child(1) {
        padding-bottom: 7px;
      }
    }
  }
}
</style>
