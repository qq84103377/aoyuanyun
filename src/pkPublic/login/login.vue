<template>
  <div class="login">
    <!-- <UNavbar :isShowBack="true" :isShowAddress="false" @onBack="onBack"  /> -->
    <div class="login-main">
      您好，
      <div class="login-dec">
        欢迎使用<text class="login-title">奥园云</text>
      </div>
      <!-- <div @click="testMod=!testMod">测试⚠️</div> -->
    </div>

    <template v-if="!testMod">
      <button v-if="!checked" class="login-button setbg666" @click="isShowModel">本机号码一键登录</button>
      <button v-else class="login-button" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">本机号码一键登录</button>
    </template>
    <template v-else>
      <div class="test-form">
        <u-input title="手机" placeholder="请输入手机" v-model="test.account" ></u-input>
        <u-input title="验证码" placeholder="请输入验证码" v-model="test.smsCode" ></u-input>
        <button class="login-button" @click="smsLogin">模拟APP登录</button>
      </div>
    </template>


    <!-- <UAuth v-model="showModel"
					open-type="getUserProfile"
					@confrim="onConfirm"
					@getUserInfo="handleAuth"
					content="您需要授权微信登录，才能使用我们的服务。"></UAuth> -->
    <!-- <button  hover-class="none" @tap="getUserProfile">微信登录</button> -->
    <div class="check_box">
      <div class="check_btn" @click="checked = !checked"> 
        <img v-if="checked" src="http://img.asset/selected_icon.png" alt="">
      </div>
      <div class="check_text">
        为保障您的个人隐私权益，请在登录前阅读<br><span @click.stop="gotofile(100001)">《奥园云服务协议》</span><span @click.stop="gotofile(100003)">《推荐须知》</span>和<span @click.stop="gotofile(100002)">《免责条款》</span><span @click.stop="gotofile(100004)"><br>《隐私政策》</span>
      </div>
    </div>
  </div>
</template>

<script>
import UAuth from './eAuth';
export default {
  components: {
    UAuth
  },
  data() {
    return {
      checked: false,
      BusinessType: {
        WECHAT: 1,      //自来用户微信小程序注册
        LUCK_SHARE: 2,  //抽奖分享注册
        INVITE: 3       //邀请注册注册
      },
      showModel: false,
      code: null,
			// 头像
			avatarUrl: "",
			// 昵称
			nickName: "",
      //推荐人信息等，详情看launch页面
      scene:"",
      isLogined: false,
      testMod: false,
      test:{
        "account": "",
        "app_version": "1",
        "channel": "AYCL0001",
        "device_sys": "iPhone13",
        "device_type": "IOS",
        "guid": "",
        "platform": 2,
        "smsCode": "888888"
      }
    }
  },
  async onLoad() {
    this.$client.removeStorage('clientToken')
    this.$client.removeStorage('userInfo')
    this.code = await this.$client.getCode()
    this.scene = await this.$client.getStorage('scene')
    this.params = this.$client.getParam()
  },
  methods: {
    async smsLogin(){
      this.test.guid = new Date().getTime()
      let res = await this.$client.rpc(this.$api.SMS_LOGIN,{
        ...this.test
      })
      
    },
    onBack(){
      // 如果是没登录的，直接返回首页去！
      if(!this.params){
        if(!this.isLogined){
          console.log(8877777)
          this.$client.pushWindow('/pages/index/index',{},{redirect:true})
        }
      }else{
        this.$client.pushWindow(this.params.backPath,{},{redirect:true})
      }
    },
    /**
     * @description 授权
     */
    handleAuth(e) {
      this.$client.hideLoading();
      let { errMsg, userInfo } = e.detail;
      // console.log('getUserInfo', e);
      if (errMsg === 'getUserInfo:ok') {
        this.$client.setStorage('wxInfo', userInfo);
        // this.$client.pushWindow('/pages/index/login/index');
      }
    },
    onConfirm() {
      this.$client.showLoading();
    },
    // 微信小程序登录
    async wxLogin(iv, encryptedData) {
      // // #### DEBUGGER ####
      //     console.log(this.code)
      //     console.log(iv)
      //     console.log(encryptedData)
      //     this.$client.copy(this.code + "\r\n\r\n" + iv + "\r\n\r\n" + encryptedData)
      //     return
      // // #### DEBUGGER ####
      try {
        let { data } = await this.$client.rpc(this.$api.LOGIN, {
          code: this.code,
          thirdAppId: 0,
          iv,
          encryptedData,
					avatarUrl: this.avatarUrl,
					nickName: this.nickName,
          businessType: this.scene ? this.scene.split('_')[0] : 1,
          scene: this.scene,
          createCity: this.$store.state.location || "广州市",
        })
        let {userInfo,clientToken} = data.data
        await this.$client.setUserInfo(userInfo)
        await this.$client.setStorage('clientToken', clientToken)
        await this.$client.getUserInfo('',true)
        this.isLogined = true;
        //=======
        let args = this.scene.split('_')
        // 入会机构-(线下裂变)分销机构扫描注册
        if(this.scene && args[0] == 5){
          await this.$client.rpc(this.$api.JOIN_ORG, {
            distributionOrganId: args[2]
          }, {silent:true}); // 静默处理
        }
        // 渠道码(线下裂变)
        if(this.scene && args[0] == 51){
          let isWorksiteScene = +args[3] >= 5000 && +args[3] < 6000
          // 如果是线下渠道扫码进入的，添加一次曝光量
          if(isWorksiteScene){
            await this.$client.rpc(this.$api.STATISTICS_CHANNEL, {
              "channelCode": args[3],
              "type": 1  // 类型：1、曝光量；2、点击量
            }, {silent:true}); // 静默处理
          }

          // 无论线上线下，添加一次点击量
          await this.$client.rpc(this.$api.STATISTICS_CHANNEL, {
            "channelCode": args[3],
            "type": 2  // 类型：1、曝光量；2、点击量
          }, {silent:true}); // 静默处理

        }
        //=======
        this.$client.pushEvent('WX_ONE_KEY_LOGIN',{
          name: userInfo.name,
          nickName: userInfo.nickName
        }) // 埋点
        this.$client.pushEventNew(23,{}); // 23 授权电话（留电注册
				this.$client.toast('登录成功')
        // 渠道码进入的逻辑，从引导直接进入登录，登录后，要跳转到首页，不能back
        if(this.scene && args[0] == 51){
          this.$client.pushWindow('/pages/index/index',{},{reLaunch:true})
        }else{
          this.$client.back()
        }
      } catch (error) {
				// console.log(error)
        this.$client.pushEvent('WX_ONE_KEY_LOGIN',{error}) // 埋点
        this.code = await this.$client.getCode()
        // console.log('getUserInfo', this.$client.getStorage('userInfo'))
      }
    },
    isShowModel(e) {
      if (!this.checked) {
        uni.showModal({
          title: '温馨提示',
          content: '请勾选用户协议'
        })
      }
    },
    // 获取手机号码
    getPhoneNumber(e) {
      // this.showModel = true;
      let iv = e.detail.iv
      let encryptedData = e.detail.encryptedData
      let that = this
      if (iv && encryptedData) {
        uni.checkSession({
          success(res) {
            that.wxLogin(iv, encryptedData)
          },
          fail() {
            that.login(that.wxLogin(iv, encryptedData))
          }
        })
      }
    },
    gotofile(num){
       this.$client.pushWindow('/pkPublic/login/file', {code: num});

    }
  }
}
</script>

<style lang="scss">
.login {
  width: 100%;
  height: 100vh;
  display: flex;
  // justify-content: center;
  // align-items: center;
  flex-direction: column;
  padding: 0 66upx;
  box-sizing: border-box;
  padding-top: 60px;
  .login-main {
    // margin-top: 160upx;
    font-size: 80upx;
    color: #333333;
    .login-dec {
      margin-top: 20upx;
      font-size: 48upx;
      color: #333333;
      .login-title {
        color: #f0c17b;
      }
    }
  }
  .login-button {
    margin-top: 320upx;
    font-size: 34upx;
    color: #ffffff;
    width: 100%;
    height: 98upx;
    line-height: 98upx;
    background: #f0c17b;
    border-radius: 20upx;
    border: 0;
    outline: none;
    &:active{
      background: #dfb474;
    }
  }
  .setbg666{
      background-color :#D3D3D3;
    }
  button::after {
    border: none;
  }
  .check_box {
    padding: 5px;
    margin-top: 100px;
    font-size: 12px;
    color: #999;
    display: flex;
    .check_btn {
      width: 20px;
      height: 20px;
      background-color: #d3d3d3;
      border-radius: 5px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .check_text {
      flex: 1;
      padding-left: 5px;
      span{
        color: #F0C17B;
      }
    }
  }
}
</style>
