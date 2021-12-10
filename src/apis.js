/*
 * @Description: 所有接口转义定义
 * @version:
 * @Author: gonghonglin
 * @Date: 2021-06-24 14:01:38
 * @LastEditors: gonghonglin
 * @LastEditTime: 2021-11-04 11:30:01
 */
export default {

  // ===== 授权 =====
  // 获取accessToken接口
  ACCESS_TOKEN: { 'name': 'ACCESS_TOKEN', 'url': 'ay-auth-platform/api/auth/accessToken' },
  GET_MOBILE: { 'name': '获取手机号', 'url': 'ay-auth-platform/miniApp/getMobile' },
  VERIFY_TOKEN: { 'name': '校验token', 'url': 'ay-auth-platform/api/auth/verifyToken' },
  LOGIN: { 'name': '登录', 'url': 'ay-cloud-ump/login/wechatLogin' },
  APP_LOGIN: { 'name': 'APPP登录', 'url': 'ay-cloud-ump/login/appLogin' },
  SMS_LOGIN: { 'name': 'SMS登录', 'url': 'ay-cloud-ump/login/appSmsCodeLogin' },
  TOKEN: { 'name': '续约TOKEN', 'url': 'ay-cloud-ump/api/auth/token' },

  // POST /distribution/saveDistributionUser
  JOIN_ORG: { 'name': '加入组织', 'url': 'ay-cloud-ump/distribution/saveDistributionUser' },


  // ===== 首页信息 =====
  QUERY_HOME: { 'name': '首页信息', 'url': 'ay-cloud-ump/home/queryHome' },

  PROJECT_DETAIL: { 'name': '获取项目详情', 'url': 'ay-cloud-ump/listProjectProperty' },
  PROJECT_LIST: { 'name': '查询项目列表', 'url': 'ay-cloud-ump/listProjectProperty' },
  DEIL_PROJECT: { 'name': '楼盘详情', 'url': 'ay-cloud-ump/detailProject' },
  BUILDING_DYNAMIC: { 'name': '项目动态', 'url': 'ay-cloud-ump/getBuildingDynamic' },
  CREATE_CUSTOMER: { 'name': '推荐客户', 'url': 'ay-cloud-ump/createCustomer' },
  CREATE_CUSTOMER_AI: { 'name': '推荐客户AI', 'url': 'ay-cloud-ump/createCustomerAi' },
  GETCITY_NAME: { "name": '城市列表', 'url': 'ay-cloud-ump/address/getCityName' },


  // ===== 地址 =====
  // /address/findAddressByParentCode
  // /address/getArea
  // /address/getCityName



  // ===== 活动 =====
  LUCKY_LIST: { 'name': '抽奖列表（精选页）', 'url': 'ay-cloud-ump/lucky/queryByDto' },
  // LUCKY_ITEM: { 'name': '抽奖详情(包括奖品列表)', 
  // 'url': 'ay-cloud-ump/lucky/queryGatheringAndPrizeById' },
  LUCKY_ITEM: { 'name': '抽奖详情(包括奖品列表)', 'url': 'ay-cloud-ump/lottery/findLottery' },
  // LUCKY_DRAW: { 'name': '抽奖', 'url': 'ay-cloud-ump/lucky/luckDraw' },
  LUCKY_DRAW: { 'name': '抽奖', 'url': 'ay-cloud-ump/lottery/lottery' },
  // LUCKY_HISTORY: { 'name': '抽奖记录', 'url': 'ay-cloud-ump/lucky/queryGatheringHistoryById' },
  LUCKY_HISTORY: { 'name': '抽奖记录', 'url': 'ay-cloud-ump/lottery/findUserLotteryHistory' },
  //===== 优惠券 =====
  COUPON_LIST: { 'name': '优惠券列表', 'url': 'ay-cloud-ump/coupon/queryCoupon' },
  COUPON_LISTNEW: { 'name': '优惠券筛选列表', 'url': 'ay-cloud-ump/coupon/queryNewCoupon' },
  COUPON_DETAIL: { 'name': '优惠券明细', 'url': 'ay-cloud-ump/coupon/getCouponOne' },
  COUPON_HISTORY_LIST: { 'name': '我的优惠券', 'url': 'ay-cloud-ump/couponHistory/getCouponHistoryByUserStatusList' },
  COUPON_GET_RECEIVE: { 'name': '领取优惠券', 'url': 'ay-cloud-ump/couponHistory/saveCouponHistory' },
  COUPON_HISTOR_COUNT: { 'name': '优惠劵总数', 'url': 'ay-cloud-ump/couponHistory/countCouponHistoryByUser' },
  COUPON_WHITE_OFF: { 'name': '优惠劵核销', 'url': 'ay-cloud-ump/couponHistory/cancelAfterVerificationCoupon' },
  COUPON_STORE_LIST: { 'name': '优惠劵商家', 'url': 'ay-cloud-ump/merchantPerson/getMerchantByPerson' },
  // ====卡包列表====
  CARDBAG_LIST: { 'name': '卡包列表', 'url': 'ay-cloud-ump/cardPack/queryCardPack' },
  CARDBAG_GET_RECEIVE: { 'name': '领取卡包', 'url': 'ay-cloud-ump/cardPackHistory/saveCardPackHistory' },
  CARDPACK_DETAIL: { 'name': '卡包明细', 'url': 'ay-cloud-ump/cardPack/getCardPackOne' },


  // 我的卡包列表
  CARDBAG_HISTOR_COUNT: { 'name': '卡包总数', 'url': 'ay-cloud-ump/cardPackHistory/countCardPackHistoryByUser' },
  MYCARDBAG_LIST: { 'name': '卡包列表', 'url': 'ay-cloud-ump/cardPackHistory/getCardPackHistoryByUserStatusList' },
  // 卡包核销
  MYCARDBAG_WRITE: { 'name': '卡包核销', 'url': 'ay-cloud-ump/cardPackHistory/consumeStockIp' },




  // ===== 反馈 =====
  SAVE_FEED_BACK: { 'name': '反馈', 'url': 'ay-cloud-ump/feedBack/saveFeedBack' },

  // ===== 文件上传 =====
  UPLOAD_FILE: { 'name': '文件上传', 'url': 'ay-cloud-ump/feedBack/upload' },
  // 协议
  UPLOAD_FILES: { 'name': '协议', 'url': 'ay-cloud-ump/about/findAboutByCode' },

  // ===== 个人信息维护 =====
  GET_USER_INFO: { 'name': '获取个人资料', 'url': 'ay-cloud-ump/broker/findOwner' },
  GET_CERT_TYPE: { 'name': '查看证件类型', 'url': 'ay-cloud-ump/broker/queryCertificateType' },
  UPDATE_ADDRESS: { 'name': '更新地址', 'url': 'ay-cloud-ump/broker/saveOrUpdateAddress' },
  UPDATE_BIRTH: { 'name': '更新生日', 'url': 'ay-cloud-ump/broker/saveOrUpdateBirthDay' },
  UPDATE_CERT: { 'name': '更新证件号', 'url': 'ay-cloud-ump/broker/saveOrUpdateCertificate' },
  UPDATE_EMAIL: { 'name': '更新邮箱', 'url': 'ay-cloud-ump/broker/saveOrUpdateEmail' },
  UPDATE_SEX: { 'name': '更新性别', 'url': 'ay-cloud-ump/broker/saveOrUpdateGender' },
  UPDATE_NAME: { 'name': '更新姓名', 'url': 'ay-cloud-ump/broker/saveOrUpdateName' },
  UPDATE_NICK_NAME: { 'name': '更新昵称', 'url': 'ay-cloud-ump/broker/updateNickName' },
  UPDATE_AVATAR: { 'name': '更新头像', 'url': 'ay-cloud-ump/broker/updateAvatar' },
  // 判断是否实名认证
  CHECK_REAL: { 'name': '检查是否已实名', 'url': 'ay-cloud-ump/broker/veriedCard' },
  DO_REAL: { 'name': '实名认证', 'url': 'ay-cloud-ump/broker/verifiedIdCard' },
  INTERBANKAGREE:{ 'name': '网银协议内容', 'url': 'ay-cloud-ump/broker/getAgreement'
  },
  UPDATEINTERBANK:{'name': '更新网银协议签约时间', 'url': 'ay-cloud-ump/broker/sign'},


  // ===== 广告 =====
  AD_BY_CITY: { 'name': '城市区域查询广告配置', 'url': 'ay-cloud-ump/advertising/findByCityName' },
  AD_BY_ACTIVITY: { 'name': '城市区域查询广告配置', 'url': 'ay-cloud-ump/advertising/findAdvertising' },


  // ===== 买房页 =====
  GET_FIND_ADDRESS: { 'name': '查询子级城市区域', 'url': 'ay-cloud-ump/address/getArea' },
  GET_FIND_HOUSETYPE: { 'name': '查询子级的户型', 'url': 'ay-cloud-ump/projectDict/getDictByParentCode' },

  GET_FIND_AVERAGEPRICE: { 'name': '查询子级均价', 'url': 'ay-cloud-ump/projectDict/getDictByParentCode' },
  GET_FIND_GETDEALLIST: { 'name': '我的佣金', 'url': 'ay-cloud-ump/getDealList' },

  // ===== 邀请 =====
  INVITE_COUNT: { 'name': '我的邀请统计', 'url': 'ay-cloud-ump/invite/inviteCount' },
  INVITE_DETAIL: { 'name': '我的邀请列表', 'url': 'ay-cloud-ump/invite/inviteDetail' },
  TWO_AMOUNT: { 'name': '二级分销总收益', 'url': 'ay-cloud-ump/invite/queryMyTwoLevelUserAmount' },
  TWO_LIST: { 'name': '二级分销列表', 'url': 'ay-cloud-ump/invite/queryMyTwoLevelUserList' },
  CREATE_WXQRCODE: { 'name': '生成小程序码', 'url': 'ay-cloud-ump/base/createWxQrCode' },

  UPLOAD_IMG: { 'name': '上传图片', 'url': 'ay-cloud-ump/base/uploadImg' },
  GET_TMP_SCREAT: { 'name': '获取临时密钥', 'url': 'ay-cloud-ump/base/getCosTmpScreat' },
  // 发送验证码
  GET_SMS_CODE: { 'name': '发送验证码', 'url': 'ay-cloud-ump/base/sendSmsCode' },


  // 埋点上送
  SAVE_EVENT: { 'name': '埋点上送', 'url': 'ay-cloud-ump/monitorPoint/saveEventDetail' },
  // GET_EVENT:   { 'name': '我的埋点', 'url': 'ay-cloud-ump/monitorPoint/findPerCountByEvent'},
  STATIS_EVENT: { 'name': '埋点上送', 'url': 'ay-cloud-ump/statistics/details/save' },
  CLICK_EVENT: { 'name': '广告点击上送', 'url': 'ay-cloud-ump/statistics/advert/clickImg' },

  // ====我的活动
  QUERY_BYDTO: { 'name': '我的活动', 'url': 'ay-cloud-ump/gatheringHistory/queryByDto' },
  MY_ACTIVITY: { 'name': '我的活动', 'url': 'ay-cloud-ump/gathering/myGathering' },
  ACTIVITY_DETAIL: { 'name': '我的活动详情', 'url': 'ay-cloud-ump/gathering/myGatheringGingle' },

  //===新增活动报名
  PROMOTION_INSERT: { 'name': '新增活动报名', 'url': 'ay-cloud-ump/gatheringHistory/insert' },
  PROMOTION_LIST: { 'name': '活动列表（精选页）', 'url': 'ay-cloud-ump/gathering/queryByDto' },
  PROMOTION_SIGNUP: { 'name': '没有报名（精选页）', 'url': 'ay-cloud-ump/gathering/signUpGathering' },
  PROMOTION_QUERYBUID: { 'name': '活动报名信息', 'url': 'ay-cloud-ump/gathering/queryById' },
  PROMOTION_SIGNIN: { 'name': '活动报名', 'url': 'ay-cloud-ump/gatheringHistory/updateStatus' },

  VALIDATE_USERINFO: { 'name': '校验用户信息是否完善', 'url': 'ay-cloud-ump/validateUserInfo' },
  QUERY_CENTERLIST: { 'name': '楼盘置业顾问', 'url': 'ay-cloud-ump/queryCenterList' },


  CUSTOMERLIST: { 'name': '我的客户', 'url': 'ay-cloud-ump/customerList' },
  CUSTOMERFLOW: { 'name': '我的客户详情', 'url': 'ay-cloud-ump/customerFlow' },
  COUNTCUSTOMER: { 'name': '我的客户统计', 'url': 'ay-cloud-ump/countCustomer' },
  COUNTCUREMOODE: { 'name': '重新报备', 'url': 'ay-cloud-ump/recommend' },

  // 资讯列表
  COMMUNITY_LIST: { 'name': '资讯列表', 'url': 'ay-cloud-ump/information/findInformation' },
  COMMUNITY_LIKE:{'name': '资讯点赞', 'url':'ay-cloud-ump/information/likeInformation'},
  COMMUNITY_REND:{'name': '资讯阅读', 'url':'ay-cloud-ump/information/readInformation'},
  // A+工厂资讯列表
  APLUS_LIST: { 'name': 'A+工厂资讯列表', 'url': 'ay-cloud-ump/aplusfactory/list' },
  COMMUNITY_DETAIL:{'name': '资讯详情', 'url':'ay-cloud-ump/information/findInformationDetail'},



  // 检查是否已经报备
  QUERY_CLUE: { 'name': '检查报备', 'url': 'ay-cloud-ump/clue/queryClue' },


  //分润功能接口
  // 绑卡
  BIND_CARD: { 'name': '绑卡', 'url': 'ay-cloud-ump/broker/saveBankCard' },
  // 我的银行卡列表
  BIND_LIST: { 'name': '银行卡列表', 'url': 'ay-cloud-ump/broker/findBankCards' },

  //我的收益
  MY_EARNINGS: { 'name': '我的收益', 'url': 'ay-cloud-ump/accountordersummary/qryAccountOrderSummary' },
  // 关注公众号
  FOCUS_OFFICIAL: { 'name': '关注公众号', 'url': 'ay-cloud-ump/base/getWechatPublicLink' },
  //收益列表
  EARNINGS_LIST: { 'name': '我的收益列表', 'url': 'ay-cloud-ump/withdraw/queryWithdrawUserOrderAndAmount' },
  // 提现记录
  DRAW_LIST: { 'name': '结算记录', 'url': 'ay-cloud-ump/withdraw/queryUserWithdrawBatch' },
  DRAWORDER: { 'name': '提现订单', 'url': 'ay-cloud-ump/withdraw/queryWithdrawUserOrderAndAmount' },
  DRAWORDERHISTORY: { 'name': '提现记录详情',
  'url': 'ay-cloud-ump/withdraw/queryWithdrawHistory' },
  DRAWCONFIRM: { 'name': '结算确认', 'url': 'ay-cloud-ump/withdraw/submitOrderWithdraw' },
  COMPUTEDTAX: { 'name': '预计到账计算', 'url': 'ay-cloud-ump/commission/getCommissionTax' },
  QUERYSET: { 'name': '查询结算规则', 'url': 'ay-cloud-ump/withdraw/queryWithdrawRule' },
  // 提现记录
  ACCOUNTNUM: { 'name': '总收益', 'url': 'ay-cloud-ump/accountordersummary/qryAccountOrderSummary' },
  // //生成优惠劵二维码
  // CREATE_WXQRCODECOPON:  { 'name': '生成小程序码', 'url': 'ay-cloud-ump/base/createWxQrCode'},

  // 存取键值对
  GET_SCENE: { 'name': '获取SCENE', 'url': 'ay-cloud-ump/base/findSceneById' },
  SET_SCENE: { 'name': '存储SCENE', 'url': 'ay-cloud-ump/base/saveScene' },

  // 楼盘详情页优惠券查询
  HOUSES_COUPON: { 'name': '楼盘详情优惠券', 'url': 'ay-cloud-ump/coupon/queryCoupon' },
  // 文旅优惠券查询
  COUPON_TYPE: { 'name': '文旅优惠券查询', 'url': 'ay-cloud-ump/coupon/useCoupon' },
  // ====订单列表====
  ORDER_LIST: { 'name': '订单列表', 'url': 'ay-cloud-ump/aoyuanorder/queryPage' },
  // ====订单详情====
  ORDER_DETAIL: { 'name': '订单详情', 'url': 'ay-cloud-ump/aoyuanorder/getAoyuanOrderInfo' },

  // 微信扫码进入统计渠道 POST /statistics/scanWxCode
  STATISTICS_CHANNEL: { 'name': '统计渠道', 'url': 'ay-cloud-ump/statistics/scanWxCode' }
}
