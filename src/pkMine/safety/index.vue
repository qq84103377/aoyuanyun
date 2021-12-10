<!--
 * @Description: 
 * @version: 
 * @Author: gonghonglin
 * @Date: 2021-08-30 09:32:54
 * @LastEditors: gonghonglin
 * @LastEditTime: 2021-09-22 14:38:52
-->
<template>
  <div class="safety">
    <u-cell title="实名认证" textAlign="right" hasBorder isLink @clickHandler="singerReal()" >
      <template slot="icon-after">
        <span v-if="userInfo.verifiedStatus==1">已认证</span>
        <span v-else class="text-warning">去认证</span>
      </template>
    </u-cell>
    <u-cell title="银行卡" textAlign="right" hasBorder isLink @clickHandler="showBankList()" >
      <template slot="icon-after">
        <span class="text-default" v-if="bankList.length==0">去绑定银行卡</span>
        <span v-else class="text-warning">已添加 {{bankList.length || 0}} 张</span>
      </template>
    </u-cell>
    <!-- <u-cell  title="重置密码" textAlign="right" hasBorder isLink :value="verifiedStatus"></u-cell> -->
    <!-- <u-cell  title="退出登录" textAlign="right" hasBorder isLink @clickHandler="exit"></u-cell> -->
    <div class="btn_relog">
      <div @click="exit">退出登录</div>
    </div>
  </div>
</template>

<script>
  export default {
    data(){
      return{
        //认证状态
        userInfo: {
          verifiedStatus:0,
        },
        bankList: [],       // 绑定的银行卡列表
      }
    },
    async onShow(){
      // let {data} = await this.$client.rpc(this.$api.BIND_LIST,{},{hideLoading: true})
      // if(data.success){
      //   this.$set(this,'bankList',data.rows)
      // }
      setTimeout(() => {
        this.refresh()
      }, 300);
    },
    methods:{
      onPullDownRefresh() {
        this.refresh()
        this.$client.stopPullDownRefresh();
      },
      async refresh(){
        // 认证状态
        // this.verifiedStatus = await this.$client.getUserInfo('verifiedStatus')
        // 绑定银行列表
        this.userInfo = await this.$client.getUserInfo('',true)
        let {data} = await this.$client.rpc(this.$api.BIND_LIST)
        // console.log(data)
        if(data.success){
          this.$set(this,'bankList',data.rows)
        }
      },
      async singerReal(){
        if(this.userInfo.verifiedStatus==1){
          this.$client.pushWindow('./center', this.userInfo)
          return
        }
        this.$client.singerReal();
        this.userInfo = await this.$client.getUserInfo('',true)
      },
      showBankList(){
        if(this.userInfo.verifiedStatus==1){
          this.$client.pushWindow('./bank/index', this.bankList || [])
          return
        }
        this.$client.alert({content: '请先实名认证',showCancel:true}).then(async (rt)=>{
          if(rt) this.$client.singerReal();
          this.userInfo = await this.$client.getUserInfo('',true)
        })      
      },
      // 退出登录
      async exit() {
        if (
          await this.$client.alert({
            title: "操作提示",
            content: "是否确认退出",
            showCancel: true,
          })
        ) {
          this.$store.commit("CLEAR_USER_INFO");
          this.$client.pushEvent('WX_LOGOUT') // 埋点
          this.$client.setStorage('menuCode', 1)
          this.$client.pushWindow('/pages/index/index',{refreshFlag:true},{reLaunch:true})
          this.$client.toast('已退出')
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
.safety {
  height: 100vh;
  border-top: 10px solid #F8F8F8;
  box-sizing: border-box;
  .text-default{
    color:#999
  }
  .text-warning {
    color: #F0C17B;
  }
  
  .btn_relog {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 50px 100px;
    div {
      background-color: #F0C17B;
      color: #fff;
      text-align: center;
      line-height: 40px;
      border-radius: 40px;
    }
  }
}
</style>