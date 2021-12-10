<!--
 * @Description: 
 * @version: 
 * @Author: gonghonglin
 * @Date: 2021-06-23 16:34:14
 * @LastEditors: gonghonglin
 * @LastEditTime: 2021-10-26 10:54:43
-->
<script>
export default {
  onLaunch: async function(e) {
    // 判断环境，如果发生变化，清除所有缓存
    let env = this.$client.getStorage('MSG_ENV')
    console.log('当前环境8',MSG_ENV,e)
    if(env != MSG_ENV){
      this.$client.clearStorage()
      this.$client.setStorage('MSG_ENV', MSG_ENV)
    }
    let scene = e.query ? e.query.scene ? e.query.scene : '' : ''
      // path: "pages/launch/index"
      // query: {scene: "1_123_1234567"}
      // referrerInfo: {}
      // scene: 1047
      // shareTicket: undefined
    // 缓存进入场景，在引导页会用到，用于判断是否需要解密传入的参数
    this.$client.setCache('scene')

    this.$client.removeStorage('menuCode')
    this.$client.initEventEngine()//初始化埋点引擎

    // 网络环境处理
    // wx.getNetworkType({
    //   success: (res) => {
    //     // networkType字段的有效值：
    //     // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
    //     this.$client.setCache({'networkType': res.networkType}) //如果联网状态，显示网络类型
    //     console.log('getNetworkType ---->', res);
    //   }
    // })
    // wx.onNetworkStatusChange((res) => { //调用监听网络状态变化的函数
    //   if (res.isConnected) {
    //     console.log('networkType ---->', res.networkType);
    //     this.$client.setCache({'networkType': res.networkType}) //如果联网状态，显示网络类型
    //   } else {
    //     console.log('networkType ---->', '无网络');
    //     this.$client.setCache({'networkType': ''}) //如果联网状态，显示网络类型
    //   }
    // })
  },
  onShow: function (options) {
    console.log('appOnShow',options)
    this.$client.check4Updates()   // 检查更新
    this.$client.pushEvent('SHOW') // 埋点
    // 处理实名认证结果返回通知
    if(!options) return
    const { referrerInfo, scene } = options
    /* 判断是否从腾讯云E证通返回 */
    const { appId } = referrerInfo
    if(!this.$store.state.userInfo.verifiedStatus && scene === 1038 && appId === 'wxab57af387b01ba6d') {
      const { extraData } = referrerInfo
      if(extraData) {
        const { status, verifyDone, message } = extraData
        console.log(status, verifyDone)
        if(verifyDone && status==1) {
          /**
          * 这⾥是指⼈脸核身的流程结束
          */
          console.log('核身完成')
          this.$client.pushEvent('REAL_SUCCESS') // 埋点

          // 通知后管已经实名完成了，更新数据
          let realInfo = this.$client.getStorage('real_info')
          console.log(89898989, realInfo)
          this.$client.removeStorage('real_info')

          // 更新用户信息
          this.$client.setUserInfo({verifiedStatus:1})

          this.$client.rpc(this.$api.DO_REAL,{
            "cardBackImgUrl": "",
            "cardFaceImgUrl": "",
            "cardNumber": realInfo.idCard,
            "userName": realInfo.name
          })

          this.$client.alert('核身完成')
        }else{
          this.$client.alert(msg || '核身失败')
          this.$client.pushEvent('REAL_FAIL',{data:msg}) // 埋点
        }
      }else{
        // 用户取消实名认证
        console.log('用户取消实名认证')
        this.$client.pushEvent('REAL_CANCEL') // 埋点
      }
    }
  },
};
</script>

<style type="scss">
/*每个页面公共css */
</style>
