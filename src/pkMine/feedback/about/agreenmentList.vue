<!--
 * @Description:
 * @version: 
 * @Author: gonghonglin
 * @Date: 2021-07-15 11:22:18
 * @LastEditors: gonghonglin
 * @LastEditTime: 2021-07-20 11:48:05
-->
<template>
  <div class="about">
    <div class="cell" @click="jump('/pkPublic/login/file', '100001')">
      <div class="cell-title">奥园云服务协议</div>
      <div class="cell-tips">
        <div>
          <img src="http://img.asset/text_icon.png" />
        </div>
      </div>
    </div>
    <div class="border"></div>
    <div class="cell" @click="jump('/pkPublic/login/file', '100003')">
      <div class="cell-title">推荐须知</div>
      <div class="cell-tips">
        <div>
          <img src="http://img.asset/text_icon.png" />
        </div>
      </div>
    </div>
    <div class="border"></div>
    <div class="cell" @click="jump('/pkPublic/login/file', '100002')">
      <div class="cell-title">免责条款</div>
      <div class="cell-tips">
        <div>
          <img src="http://img.asset/text_icon.png" />
        </div>
      </div>
    </div>
    <div class="border"></div>
    <div class="cell" @click="jump('/pkPublic/login/file', '100004')">
      <div class="cell-title">隐私协议</div>
      <div class="cell-tips">
        <div>
          <img src="http://img.asset/text_icon.png" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  methods: {
    // 跳转协议列表页
    jump(url, code) {
      this.$client.pushWindow(url, { code })
    }
  }
}
</script>

<style lang="scss" scoped>
.about {
  padding: 10px 0;
  background: #f8f8f8;
  min-height: 100vh;

  .cell {
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 50px;
    padding: 0 15px;
    background: #fff;
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
        & > img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
  .border {
    box-sizing: border-box;
    padding: 0 25px;
    width: 100%;
    height: 1px;
    background: #fff;
  }
  .border::before {
    content: '';
    display: block;
    width: 100%;
    height: 100%;
    background: #f8f8f8;
  }
}
</style>
