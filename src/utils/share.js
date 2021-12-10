/*
 * @Description: 
 * @version: 
 * @Author: gonghonglin
 * @Date: 2021-09-24 10:43:57
 * @LastEditors: gonghonglin
 * @LastEditTime: 2021-09-27 14:49:26
 */
export const onShareAppMessage = async function (options) {
  // 阻止顶部胶囊分享
  if (options.from == 'menu') { return }
  // 组件缓存传入的数据
  let shareData = await this.$client.getStorage('shareShareData') // 分享用户数据
  let {
    bType, bId, channelId, dId = 0, needLogin = false
  } = shareData

  // 分享是否需要进行登陆验证
  if (needLogin) {
    console.log('当前分享进行了登陆验证')
    if (!this.$client.passCheck()) return
  }

  let title = await this.$client.getStorage('shareTitle')
  let imageUrl = await this.$client.getStorage('sharePosterUrl')
  let { uid } = await this.$store.state.userInfo
  console.log('当前的分享传入数据sence', `${bType}_${uid}_${bId}_${channelId}_${dId}`)

  // 发送接口生成数据
  // scene = 
  // 0业务类型 bType + 
  // 1分享用户id uid + 
  // 2业务Id bId + 
  // 3渠道ID  channelId +
  // 8801			分享朋友圈
  // 8802			分享卡片
  // 8803			分享二维码
  // 4分销机构id  dId
  let { data } = await this.$client.rpc(this.$api.SET_SCENE, {
    scene: `${bType}_${uid}_${bId}_${channelId}_${dId}`
  })
  let scene = data.data.id

  // 最终生成分享对象
  let shareObj = {
    title,
    path: 'pages/launch/index?scene=' + scene, // 引导页
    imageUrl
  }

  // 数据埋点
  this.$client.pushEvent('SHARE_APP', {
    data: '邀请好友注册'
  }) // 埋点
  this.$client.pushEventNew(2, {}); // 埋点

  return shareObj
}