<!--
 * @Description:
 * @version:
 * @Author: gonghonglin
 * @Date: 2021-03-02 09:17:30
 * @LastEditors: gonghonglin
 * @LastEditTime: 2021-11-19 11:35:32
 * @=: ========================
 * @eg: ===== 备忘说明 =====
    1-此页面为引导启动页，以后可以展示首屏广告，loading特效等
    2-页面先获取accessToken
    3-处理入口参数拆分，跳转逻辑（用于分享，二维码扫码进入，链接进入等）
    *为统一所有入口流程，严格按照下面格式进行配置
    scene   场景总参数，拼接格式 bid _ fid _ id (对应参数加下横线)
            *scene 已加密，需要解密后处理
            bid 业务id/路径pageMap
            fid 推荐人id => fid 存为本地fid（推荐人id）
            id  业务详情id
    pageMap 业务ID对应的入口地址，根据不同的业务id指定跳转不同业务页面，例如抽奖详情


-->
<template>
  <div class="start-up auto-height">
  </div>
</template>
<script>
// getScene参数枚举
const pageMap = {
  '1': '/pages/index/index',        // 精选 / 微信小程序注册 / 邀请注册

  '2': '/pkPromotion/lucky/index',  // 抽奖分享：     业务类型 + 分享用户id + 分享的业务主键

  '3': '/pages/pkBuilding/index',   // 邀请注册：     业务类型 + 分享用户id + / + 渠道id

  '4': '/pkBuilding/detail',        // (线下裂变)项目扫码注册：   业务类型 + / + 业务主键

  '5': '/pages/index/index',        // (线下裂变)分销机构扫描注册： 业务类型 + / + 分销机构id

  '51': '/pages/index/index',       // (线下裂变)推广渠道扫描注册： 业务类型 + 渠道ID + 分销机构id

  '6': '/pkCoupon/detail/index',    // 优惠券：       业务类型 + 分享用户id + 优惠券Id + 渠道ID

  '7': '/pkPromotion/promotion/detail', // 活动：     业务类型 + 分享用户id + 业务主键

  '8': '/pkBuilding/detail',        // 楼盘分享：      业务类型 + 分享用户id + 业务主键

  // 后管生成物料二维码，放置到活动现场，然后报名的【用户】去扫码签到
  '9': '/pkPromotion/promotion/detail', // 活动签到：    业务类型 + 分享用户id + 业务主键

  '10': '/pages/webView/within', // 資訊詳情：    10 + 分享用户id + 业务主键
  '11': '/pages/webView/webViewShare', // 資訊詳情-外链：    11 + 分享用户id + 业务主键

  '88': '',                         // 核销入口，指定白名单
  '99': '/pkBuilding/detail',       // 广告进入：      业务类型 + 分享用户id + / + 渠道Id
};

export default {
  data() {
    return {
      sceneFlag: 0 // 标记，1-是否已经去了登录页面
    }
  },
  async onLoad(e) {
    // console.log('launch-onload-e',e)
    await this.getAccessToken();
    // console.log("startUp scene:",e, scene);
    // scene = 0业务类型 + 1分享用户id + 2业务Id + 3渠道ID + 4分销机构id

    // ==== DEBUG ---> "1461234530405892097"
    // ==== 线下扫码测试，可以给 SCENE 赋值 后管生成的scene码
    let SCENE = e.scene 
    let scene = ''
    let hasMultiParameter = false // 有多参数
    let hasParam = false          // 有参数
    try {
      if(SCENE){
        let {data} = await this.$client.rpc(this.$api.GET_SCENE,{id:SCENE})
        if(data.success){
          scene = data.data.scene
        }
        console.log('SCENE--->',scene)
      }
      // 如果是1047小程序二维码进入时，不用解密
      // let val = appScene=='1047' ? scene : this.$client.decrypt(scene)
      // console.log(val)

      // 测试-添加分销机构
      // this.$client.rpc(this.$api.JOIN_ORG, {
      //   distributionOrganId:'1439459633485901826'
      // }, {silent:true}); // 静默处理
      if(scene){
        hasParam = true
        let args = scene.split('_')
        if (args.length > 1) {
          hasMultiParameter = true
          // 如果有'_'参数
          // scene = 0业务类型 + 1分享用户id + 2业务Id + 3渠道ID
          let path = pageMap[args[0]] || pageMap['1']
          let isLogin = this.$store.state.userInfo && this.$store.state.userInfo.uid

          // 保存推荐用户Id
          this.saveScene(scene)

          // 入会机构-(线下裂变)分销机构扫描注册
          if(args[0] == 5 && isLogin){
            await this.$client.rpc(this.$api.JOIN_ORG, {
              distributionOrganId: args[2]
            }, {silent:true}); // 静默处理
          }

          // 后管生成物料二维码，放置到活动现场，然后报名的【用户】去扫码签到
          if(args[0] == 9){
            // TODO:
            // 如果已经登录，判断是否已报名了活动，
            // 如果没有报名，则去活动详情页面，并且提示“您未报名此活动”
            // 如果报名了，则跳转去我的活动的详情页面，并且调用活动签到接口
          }

          // 渠道码(线下裂变)
          // 如果未登录，以下逻辑在登录完成后会同样需要执行一次
          if(args[0] == 51){
            // 只要是扫渠道码，或第三方点击进入，未登录的，直接去登录页
            if(this.$client.passCheck()){
              console.log('pushWindow--->0')
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

              console.log('pushWindow--->0')
              this.toMainPage()
            }else{
              // 标记已经去登录了，处理返回后去首页
              this.sceneFlag = 51
            }
          }else{
            if(args[0]==3){
              console.log('pushWindow--->1')
              this.$client.pushWindow(path, { scene}, { reLaunch: true });
            }else{
              console.log('pushWindow--->2')
              this.$client.pushWindow(path, { id: args[2], scene}, { reLaunch: true });
            }
          }

        } else {
          console.log('pushWindow--->3')
          this.toMainPage()
        }
      }else{
        this.toMainPage()
      }
    } catch (error) {
      console.log('参数错误', error);
      this.$client.toast('参数错误')
    }
    // 记录进入的场景码 scene  1047 - 扫微信小程序码进入
    this.$nextTick(()=>{
      this.$client.pushEvent('ENTER', {scene}) // 埋点
      this.$client.pushEventNew(1, {scene}); // 埋点
    })
    /*
      type (integer, optional): 点击类型
      1 进入小程序 2 转发分享 3 进入首页
      4 地理位置授权 5 点击（参与活动）
      6 授权微信个人信息 7 浏览楼盘（进入项目客户池）
      8 领取购房券（报备）
      9 经纪人主动报备
      10 添加企业微信
      11 首次call客 12 二次回call
      13 多次回call 14 一次跟进互动 15 二次跟进互动
      16 多次跟进互动 17 首次来访 18 复访 19
      认筹 20 认购/核销 21 签约 22 结佣 23 授权电话（留电注册） ,
      24，领取优惠券
      25，自主报备--感兴趣楼盘自动报备
    */
    // 外部广告入口统计（）
    if(!hasParam || hasMultiParameter) return
    this.$client.rpc(this.$api.CLICK_EVENT, {channelCode: scene}); // 埋点
  },
  methods: {
    toMainPage(){
      this.$client.pushWindow('/pages/index/index', { }, { reLaunch: true });
    },
    // 获取accessToken接口
    async getAccessToken(){
      try {
        let {data} = await this.$client.rpc(this.$api.ACCESS_TOKEN,{}, {method: 'GET'});
        // console.log('getAccessToken', data)
      } catch (error) {
        // console.log(error)
      }
    },
    // 存推荐人ID
    async saveScene(value=""){
      let tmp = await this.$client.getStorage('scene')
      if(!value || tmp) return
      let uid = this.$store.state.userInfo.uid
      // 没有本地缓存推荐人 + 自己不能推荐自己
      if(value == tmp || value == uid){
        // console.log('自己不能推荐自己')
        return
      }
      if(!tmp){
        this.$client.setStorage('scene',value)
      }
    },
  },
  onShow(options) {
    if( this.sceneFlag==51 ){
      this.toMainPage()
    }
  }
}
</script>
