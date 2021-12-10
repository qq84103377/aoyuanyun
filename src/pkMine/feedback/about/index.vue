<!--
 * @Description:
 * @version:
 * @Author: gonghonglin
 * @Date: 2021-07-15 11:22:18
 * @LastEditors: gonghonglin
 * @LastEditTime: 2021-10-21 13:49:23
-->
<template>
  <div class="about">
    <img class="login-img" src="http://img.asset/login.png" />
    <div class="title">奥园云</div>
    <div class="msg">
      奥园云为奥园统一的线上对外门户平台，围绕优惠券聚合、分润结算、客服服务等为奥园集团旗下多业态客户提供便捷的线上服务。
    </div>
    <!-- <div class="cell" @click="callPhone">
      <div class="cell-title">联系客服</div>
      <div class="cell-tips">
        <div style="font-size: 14px; color: #f0c17b">400-111-3883</div>
        <div>
          <img src="http://img.asset/text_icon.png" />
        </div>
      </div>
    </div> -->
    <div class="cell" @click="jump">
      <div class="cell-title">协议条款</div>
      <div class="cell-tips">
        <div>
          <img src="http://img.asset/text_icon.png" />
        </div>
      </div>
    </div>
    <!-- <div class="cell">
      <div class="cell-title">版本号</div>
      <div class="cell-tips">
        <div style="font-size: 14px; color: #999999">V1.0.2</div>
        <div></div>
      </div>
    </div> -->
    <div class="version_cell">版本号:{{ version }}</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      version: ''
    }
  },
  onLoad() {
    this.version = uni.getAccountInfoSync().miniProgram.version || ''
    wx.getSystemInfo({
      success(res) {
        console.log(res)
      }
    })
  },
  methods: {
    // 打电话
    callPhone() {
      uni.makePhoneCall({
        phoneNumber: '400-111-3883'
      })
    },
    // 跳转协议列表页
    jump() {
      this.$client.pushWindow('/pkMine/feedback/about/agreenmentList')
    }
  }
}
</script>

<style lang="scss" scoped>
.about {
  position: relative;
  padding: 44px 25px 0;
  text-align: center;
  min-height: calc(100vh - 45px);

  .login-img {
    width: 100px;
    height: 86px;
    margin-bottom: 18px;
  }
  .title {
    font-size: 20px;
    color: #333333;
    margin-bottom: 30px;
  }
  .msg {
    font-size: 14px;
    color: #666666;
    line-height: 19px;
    text-align: justify;
    margin-bottom: 64px;
  }
  .cell {
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 50px;
    border-top: 1px solid #f8f8f8;
    .cell-title {
      font-size: 14px;
      color: #666666;
    }
    .cell-tips {
      display: flex;
      align-items: center;
      & > div:last-child {
        flex-shrink: 0;
        width: 20px;
        height: 20px;
        margin-left: 6px;
        & > img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
  .cell:last-child {
    border-bottom: 1px solid #f8f8f8;
  }
  .version_cell {
    position: absolute;
    bottom: 60px;
    left: 0;
    width: 100%;
    font-size: 12px;
    color: #999999;
    text-align: center;
  }
}
</style>
