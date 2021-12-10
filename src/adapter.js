import interfaces from "./apis";
import dateFunction from "./utils/dateTools.js";
import fsm from './fsm';
import tools from './utils/index';
import CryptoJS from 'crypto-js';

const global = {};

const App = {
  /**
   * @dese rpc的loading图显示、隐藏的计数器逻辑，即单例模式
   * @example App.device => {isShown: false, count: 0, timer: null, plusOne() {}, minusOne () {}}
   */
  loadingCounter: {
    isShown: false,
    count: 0,
    timer: null,
    plusOne(showLoadingCallback) {
      if (!this.isShown) {
        showLoading();
        this.isShown = true;
      }
      clearTimeout(this.timer);
      this.count++;
      // console.log(`loading + 1 >>> loading数量:${this.count}`);
    },
    minusOne(hideLoadingCallback) {
      this.count--;
      // console.log(`loading - 1 <<< loading数量:${this.count}`);
      if (this.count <= 0) {
        this.timer = setTimeout(() => {
          this.isShown = false;
          hideLoading();
        }, 200);
      }
    }
  },
  /**
   * @desc - rpc的超时提示confirm 去登录、回首页，防止多次提示，即单例模式
   * @example App.isOvertimeConfirmed == true 表示已提示
   */
  isOvertimeConfirmed: false,
};

// 加解密

//随机生成指定数量的16进制key
function generatekey(num) {
  let library = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let key = "";
  for (var i = 0; i < num; i++) {
      let randomPoz = Math.floor(Math.random() * library.length);
      key += library.substring(randomPoz, randomPoz + 1);
  }
  return key;
}
const _generatekey = 'N8OqISyWBfL6VZg4'
//加密
function encrypt(word, keyStr=_generatekey) {
  var key = CryptoJS.enc.Utf8.parse(keyStr);
  var srcs = CryptoJS.enc.Utf8.parse(word);
  var encrypted = CryptoJS.AES.encrypt(srcs, key, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 });
  return encrypted.toString();
}

//解密
function decrypt(word, keyStr=_generatekey) {
  var key = CryptoJS.enc.Utf8.parse(keyStr);
  var decrypt = CryptoJS.AES.decrypt(word, key, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 });
  return CryptoJS.enc.Utf8.stringify(decrypt).toString();
}

//生成加密的scene,,en是否加密
async function getScene(bid,id='',en=true) {
  let uid = await client.getUserInfo('uid') || ''
  let scene = `${bid}_${uid}_${id}`
  // console.log('生成的scene----',scene)
  return en ? client.encrypt(scene) : scene
}


/**
 * 跳转页面方法
 * @param {String} url 页面路径
 * @param {Object} options 可选参数
 */
function pushWindowShadow(url, options) {
  if (options && options.redirect) {
    // console.log('redirectTo');
    uni.redirectTo({
      url: url.replace(".html", "")
    });
  } else if (options && options.switch) {
    uni.switchTab({
      url: url.replace(".html", "")
    });
  } else if (options && options.reLaunch) {
    uni.reLaunch({
      url: url.replace(".html", "")
    });
  } else {
    // console.log('navigateTo');
    uni.navigateTo({
      url: url.replace(".html", "")
    });
  }
}

// 实际调用跳转页面方法
function pushWindow(url, param, options = {}) {
  // 处理返回进入页面
  // let pages = getCurrentPages()
  // for (const item of pages) {
  //   console.log(url,  item, item.route==url)
  //   if(url.includes(item.route)){
  //     console.warn(9999)
  //     options.redirect=true
  //   }
  // }

  // 当传入阻止跳转信息时，不进行跳转，直接弹窗提示
  if (options && options.stopMessage) {
    alert(options.stopMessage);
    return;
  }
  client.$store.dispatch("setParam", param);
  return pushWindowShadow(url, options);
}

/**
 * 返回方法
 * @param {Number|String} delta 页面栈索引 或 页面路径 page/index/index
 * @param {String} animationType 动画类型
 * @param {Number} animationDuration 动画持续时间
 */
function back(delta = 1, animationType = "pop-out", animationDuration = 300) {
  let num = 1;
  if (typeof delta === "number" || !delta) {
    // 返回历史栈页面
    num = Number(delta || 1);
  } else if (typeof delta === "string") {
    // 返回指定地址的历史栈页面
    const routes = getHisRoutes();
    const n = routes.indexOf(delta);
    num = n >= 0 ? routes.length - n - 1 : 1;
  }
  uni.navigateBack({
    delta: num,
    animationType,
    animationDuration
  });
}

/**
 * 获取当前历史页面栈
 */
function getHisRoutes() {
  const hisPages = getCurrentPages();
  return hisPages.map(p => `/${p.route}`);
}

/**
 * 弹窗
 * @param {Object} options 可选参数
 */
function alert(options = {}) {
  return new Promise(resolve => {
    const param = {};
    if (typeof options === 'string') {
      param.title = '温馨提示';
      param.content = options;
      param.showCancel = false;
    } else if (typeof options === 'object') {
      param.title = options.title === '' ? '' : (options.title || '温馨提示');
      param.content = options.content || '';
      param.showCancel = options.showCancel || false;
      param.cancelText = options.cancelText || '取消';
      param.cancelColor = options.cancelColor || '#888888';
      param.confirmText = options.confirmText || '确定';
      param.confirmColor = options.confirmColor || '#F23D59';
    }
    param.success = (data) => {
      if (data.confirm) {
        resolve(true);
      }
      if (data.cancel) {
        resolve(false);
      }
    }
    uni.showModal(param);
  });
}

/**
 * Toast
 * @param {Object} options toast
 */
function toast(options = {}) {
  return new Promise(resolve => {
    const param = {};
    if (typeof options === 'string') {
      param.title = options;
      param.icon = 'none';
      param.image = '';
      param.duration = 2000;
      param.mask = false;
    } else if (typeof options === 'object') {
      param.title = options.content || '';
      param.icon = options.icon || 'none';
      param.image = options.image || '';
      param.duration = options.duration || 2000;
      param.mask = options.mask || false;
    }
    param.success = () => resolve();
    uni.showToast(param);
  });
}

/**
 * 显示 Loading
 */
function showLoading() {
  uni.showLoading({
    title: '加载中...',
    mask: true,
  })
}

/**
 * 隐藏 Loading
 */
function hideLoading() {
  uni.hideLoading();
}

/**
 * 获取微信
 */
function getCode(options = {}) {
  return new Promise((resolve, reject) => {
    !options.hideLoading && client.App.loadingCounter.plusOne();
    uni.login({
      provider: 'weixin',
      success(data) {
        const code = data.code;
        if (!code) {
          alert(data.errMsg)
          return;
        }
        resolve(code);
      },
      fail(error) {
        // 获取失败递归调用
        getCode(options).then(res => resolve(res));
      },
      complete() {
        !options.hideLoading && client.App.loadingCounter.minusOne();
      }
    });
  });
}

/**
 * 扫码
 */
function scanCode(options = {}) {
  let option= Object.assign({
    onlyFromCamera: true,  //不允许从相册选择图片
    scanType: 'qrCode',
  },options)
  return new Promise((resolve, reject) => {
    uni.scanCode({
      ...option,
      success: res => {
        resolve(res)
      },
      fail: err => {
        reject(err)
      }
    });
  })
}

/**
 * 获取服务器时间
 */
async function getServerTime(format = 'YYYY-MM-DD') {
  let {
    body
  } = await client.rpc("getTimeStamp", {
    biz: true,
    globalLoading: false
  })
  let ts = body.timeStamp; //将时间戳转为日期
  let d = new Date(Number(ts)); // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
  return dateFunction.date2Str(d, format);
}


// 是否已经登录
function isLogin(auto) {
  if (!!client.$store.state.userInfo && client.$store.state.userInfo.uid) {
    return true;
  } else {
    if(auto) client.pushWindow("/pkPublic/login/login");
    return false;
  }
}

// 获取页面参数
function getParam() {
  return client.$store.getters.getParam();
}
// 获取页面参数
function setParam(param) {
  client.$store.dispatch("setParam", param);
}

// 缓存存储
function setCache(data) {
  client.$store.dispatch("setCache", data);
}

// 缓存查询
function getCache(key) {
  return client.$store.getters.getCache(key);
}

// 设置用户信息
function setUserInfo(data) {
  return new Promise(async (resolve, reject) => {
    if (!data) {
      reject();
    }
    let info = await client.getUserInfo() || {};
    // console.log('dq用户信息', info)
    let newInfo = Object.assign(info, data)
    // console.log('dq用户信息', newInfo)
    client.$store.dispatch('setUserInfo', newInfo)
    resolve(newInfo);
  })
}

// 查询用户信息
async function getUserInfo(key, reNew) {
  // 去接口拿最新的数据，并且缓存起来
  if(reNew){
    let {data} = await client.rpc(interfaces.GET_USER_INFO);
    client.setStorage('userInfo', data.data);
  }
  return new Promise(async (resolve) => {
    const info = client.getStorage('userInfo');
    resolve(key ? info[key] : info);
  });
}

// 清除用户信息
function clearUserInfo() {
  client.$store.dispatch('clearUserInfo');
}

/**
 * 获取微信个人信息
 */
function getUserProfile() {
  return new Promise((resolve, reject) => {
    uni.getUserProfile({
      desc: '获取微信头像、昵称',
      success: (res) => {
        console.log(res)
        resolve(res);
      },
      fail: (error) => {
        reject(error);
      }
    });
    // wx.getUserProfile({
    //   desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
    //   success: (res) => {
    //     console.log(res)
    //     this.setData({
    //       userInfo: res.userInfo,
    //       hasUserInfo: true
    //     })
    //   }
    // })
  })
}
// function obtainUserInfo() {
// 	return new Promise((resolve, reject) => {
// 		uni.getUserInfo({
// 			provider: 'weixin',
// 			withCredentials: true,
// 			success({
// 				userInfo,
// 				rawData,
// 				signature,
// 				encryptedData,
// 				iv,
// 				errMsg
// 			}) {
// 				resolve({
// 					userInfo,
// 					wxErrMsg: errMsg,
// 					wxSecure: {
// 						rawData,
// 						signature,
// 						encryptedData,
// 						iv
// 					}
// 				});
// 			},
// 			fail(error) {
// 				reject(error);
// 			}
// 		});
// 	});
// }

/**
 * 拨打电话
 * @param {String}} num 电话号码
 */
function makePhoneCall(num) {
  uni.makePhoneCall({
    phoneNumber: num + ''
  });
}

/**
 * 剪切板 - 复制
 *  {
 *  "data": "要放入剪贴板的文本"
 *  }
 */
function copy(data) {
  return new Promise((resolve, reject) => {
    uni.setClipboardData({
      data,
      success() {
        resolve();
      },
      fail(error) {
        reject(error);
      }
    });
  });
}

/**
 * 获取系统信息
 */
function getSystemInfo() {
  return new Promise((resolve, reject) => {
    uni.getSystemInfo({
      success(data) {
        resolve(data);
      },
      fail(error) {
        reject(error);
      }
    });
  });
}
/**
 * 获取地理信息
 */
function getLocation() {
  return new Promise((resolve, reject) => {
    // uni.getLocation({
    //   success(data) {
    //     resolve(data);
    //   },
    //   fail(error) {
    //     reject(error);
    //   }
    // });
  });
}


/**
 * 
 * @param uni.setStorageSync
 * @param 必须用驼峰命名 不能用_
 * @returns 
 */

/**
 * @description 设置小程序缓存-同步
 */
function setStorage(key, data) {
  let prefix = 'weixin_';
  return uni.setStorageSync(prefix + key, data);
}

/**
 * @description 获取小程序缓存-同步
 */
function getStorage(key) {
  let prefix = 'weixin_';
  return uni.getStorageSync(prefix + key);
}

/**
 * @description 删除某条小程序缓存-同步
 */
function removeStorage(key) {
  let prefix = 'weixin_';
  return uni.removeStorageSync(prefix + key);
}

/**
 * @description 清除所有小程序缓存-同步 
 */
function clearStorage() {
  uni.clearStorageSync();
}

/**
 * 下载文件
 * @param {String} url 文件地址
 */
function downloadFile(url, fileName) {
  // 如果没有传入文件名，则提取url中的文件名
  return new Promise((resolve, reject) => {
    fileName = fileName ? fileName : url.replace(/(.*\/)*([^.]+).*/ig, "$2");
    uni.downloadFile({
      url: url,
      filePath: `${client.USER_DATA_PATH}/${fileName}.pdf`,
      success: function (res) {
        resolve(res);
      },
      fail: function () {
        reject();
      }
    });
  })
}

/**
 * 新开页面打开文档
 * @param {String} filePath 文件路径
 * @param {String} fileType 文件类型
 */
function openDocument(filePath, fileType) {
  return new Promise((resolve, reject) => {
    uni.openDocument({
      filePath: filePath,
      fileType: fileType,
      success: function (res) {
        resolve(res);
      },
      fail: function () {
        reject();
      }
    })
  });
}


/**
 * @description 事件监听器
 */
function EventListener() {
  let eventList = {};

  function addEvent(eventName, cb) {
    if (eventList[eventName] == undefined) {
      eventList[eventName] = []
    }
    eventList[eventName].push(cb)
  }

  function callEvent(eventName, params) {
    if (eventList[eventName] == undefined) {
      return
    }

    let list = eventList[eventName]
    for (let i = 0; i < list.length; i++) {
      eventList[eventName][i](params)
    }
  }
  return {
    addEvent,
    callEvent,
  }
}

/**
 * @description 程序初始化完成
 * @param {Function} callback 
 */
function ready(callback) {
  if (global.initOk) {
    callback && callback();
  } else {
    client.EventListener.addEvent('ready', callback);
  }
}

// 停止当前页面下拉刷新。
function stopPullDownRefresh() {
  setTimeout(() => {
    uni.stopPullDownRefresh();
  }, 1000);
}

// 从本地相册选择图片或使用相机拍照
function chooseImage(options = {}) {
  return new Promise((resolve, reject) => {
    uni.chooseImage({
      ...options,
      success: res => resolve(res),
      fail: err => reject(err),
    })
  })
}
// 富文本标签转义
function setEscape(data,type) {
  data = data.replace(/&lt;/g, '<');
  data = data.replace(/&gt;/g, '>');
  data = data.replace(/&nbsp;/g, ' ');

  if(type){
    //控制小程序中图片大小
    data = data.replace(/<img[^>]*>/gi, function (match, capture) {
      // console.log(match.search(/style=/gi));
  
      if (match.search(/style=/gi) == -1) {
        match = match.replace(/\<img/gi, '<img style=""')
      }
      return match
    })
    data = data.replace(/style="/gi, '$& max-width:100% !important; height:auto !important;')
    data = data.replace(/<br[^>]*\/>/gi, '')
  }

  return data;
}

// 压缩图片接口，可选压缩质量
function compressImage(options) {
  return new Promise((resolve, reject) => {
    uni.compressImage({
      ...options,
      success: res => resolve(res),
      fail: err => reject(err),
    })
  })
}

// 将图片base64压缩 ： 先转字节流-》存临时文件-》读取文件-》压缩-》读取base64-》删除临时文件
async function compressBase64Image(imgBase64) {
  // 将 Base64 字符串转成 ArrayBuffer 对象
  let data = fsm.base64ToArrayBuffer(imgBase64.replace(/[\r\n]/g, ""));
  // console.log('compressBase64Image-data', data)
  // 将图片字节流存入临时文件
  let filePath = `${fsm.USER_DATA_PATH}/${new Date().getTime().toString()}.jpg`;
  // console.log('compressBase64Image-filePath', filePath)
  let writeFileRes = await fsm.writeFile({ filePath, data });
  // console.log('compressBase64Image-writeFile', writeFileRes)
  // 压缩图片临时文件
  let compressImageRes = await client.compressImage({ src: filePath, quality: 20 });
  // console.log('compressBase64Image-compressImage', compressImageRes.length)
  let { data: base64 } = await fsm.readFile({ filePath: compressImageRes.tempFilePath, encoding: 'base64' });
  // console.log('compressBase64Image-readFile', base64.length)
  // let perBase64 = 'data:image/png;base64,' + base64;
  return base64;
  // return perBase64;
}

// 将图片base64压缩 ： 先转字节流-》存临时文件
async function saveTmpImage(base64) {
  let filePath = `${fsm.USER_DATA_PATH}/${new Date().getTime().toString()}.jpg`;
  let data = fsm.base64ToArrayBuffer(base64.replace(/[\r\n]/g, ""));
  let writeFileRes = await fsm.writeFile({ filePath, data });
  return writeFileRes
}

// KPI指标

// 埋点设置
const CustomEventType = {
  // 功能相关 10000
  ENTER: { code: 10000, name: "进入奥园云" },
  ALLOW_ADDRESS: { code: 10010, name: "允许地理授权" },
  WX_ONE_KEY_LOGIN: { code: 10111, name: "微信一键登录" },
  WX_LOGOUT: { code: 10888, name: "微信退出登录" },
  ALLOW_USER_INFO: { code: 10200, name: "授权获取用户个人信息" },
  ADD_ORG_WX: { code: 10300, name: "添加企微" },
  HIDE: { code: 11000, name: "隐藏" },
  SHOW: { code: 11001, name: "显示" },
  SHARE_APP: { code: 12000, name: "发送给朋友" },
  // PAGE_IN:          {code: 18000, name: "进入页面"},
  // PAGE_EXIT:        {code: 18001, name: "离开页面"},
  // 实名认证相关
  REAL_SINGER:  { code: 19010, name: "去实名" },
  REAL_CANCEL:  { code: 19020, name: "取消了实名" },
  REAL_SUCCESS: { code: 19090, name: "实名成功" },
  REAL_FAIL:    { code: 19099, name: "实名失败" },

  // 活动相关 20000
  JOIN_GATHERING: { code: 20001, name: "参与活动" },   //区分活动类型
  // 优惠券
  COUPON_RECEIVE: { code: 20100, name: "领取优惠券" }, //区分券的类型
  COUPON_USE: { code: 20101, name: "使用优惠券" },
  COUPON_WRITE_OFF: { code: 20101, name: "优惠券核销" },
  // 卡包
  CARD_RECEIVE: { code: 20200, name: "领取卡券" }, //卡包
  CARD_USE: { code: 20201, name: "使用卡券" },
  CARD_WRITE_OFF: { code: 20201, name: "卡核销" },
  
  // 楼盘   30000
  PROJECT_LIST: { code: 30000, name: "浏览楼盘列表" },
  CALL_PROJECT_PHONE: { code: 30100, name: "拨打项目电话" },
  // 社交相关 
  RECOMMEND: { code: 40000, name: "推荐客户" },
  INVITE_FRIEND: { code: 40001, name: "邀请好友" },

  // 用户行为相关
  // CLICK:            {code: 90001, name: "点击事件"}  // 点击了什么按钮

// 进入小程序				E0000	
// 转发分享				E0010	转发分享/总点击量
// 浏览/留电	裂变数（浏览）			E0020	裂变数/转发分享数
// 地理位置授权			E0030	地理位置授权/进入小程序
// 点击（参与活动）			E0040	点击参与活动/进入小程序
// 授权电话（留电注册）			E0050	授权电话（留电）/点击参与活动
// 授权微信个人信息			E0060	授权微信个人信息/点击参与活动
// 浏览楼盘（进入项目客户池）			E0070	浏览楼盘/授权电话（留电）
// 领取购房券（报备）			E0080	领取购房券（报备）/浏览楼盘
// 经纪人主动报备			E0090	
// 添加企业微信			E0100	添加企业微信/浏览楼盘

// 跟进/邀约	CALL客邀约	首次CALL客		E0110	CALL客邀约/浏览楼盘
// 二次回CALL		E0120	二次回CALL/浏览楼盘
// 多次回CALL		E0130	多次回CALL/浏览楼盘
// 跟进互动（企微）	一次跟进互动		E0140	跟进互动/浏览楼盘
// 二次跟进互动		E0150	二次跟进互动/浏览楼盘
// 多次跟进互动		E0160	多次跟进互动/浏览楼盘
// 来访	首次来访		E0170	来访/浏览楼盘
// 复访		E0180	复访/浏览楼盘
// 成交/结佣	认筹			E0190	认筹/来访
// 认购/核销			E0200	认购/来访
// 签约			E0210	签约/认购
// 结佣			E0220	结佣/签约
}
/* arrEvents: [
  {
    event: CustomEventType,
    eventCode: 1,
    eventName: '',
    eventTime: 时间搓
    eventCity: '广州市'
    eventParam: {具体参数}
  }
]
this.$client.pushEvent('WX_ONE_KEY_LOGIN',data.data.userInfo) // 埋点

*/
const eeInterval = null
function initEventEngine() {
  if (eeInterval) return
  setInterval(() => {
    trackCustomKVEventNew()
  }, 10000);
}

async function pushEvent(et, param) {
  let arrEvents = await client.getStorage('event')
  if (!arrEvents) {
    arrEvents = []
  }
  param = param ? JSON.stringify(param) : null
  arrEvents.push({
    eventCode: CustomEventType[et].code,
    eventName: CustomEventType[et].name,
    eventTime: new Date().getTime(),
    eventCity: await client.getStorage('location'),
    eventParam: param
  })
  await client.setStorage('event', arrEvents)
}
async function pushEventNew(et, param) {
  let arrEvents = await client.getStorage('eventNew')
  if (!arrEvents) {
    arrEvents = {}
  }
  param = param ? JSON.stringify(param) : null
  if(arrEvents[et]){
    arrEvents[et]++
  }else{
    arrEvents[et] = 1
  }
  await client.setStorage('eventNew', arrEvents)
  // console.log('-----埋点------', et)
}

async function trackCustomKVEvent() {
  let arrEvents = await client.getStorage('event')
  if (!arrEvents || (arrEvents && arrEvents.length == 0)) {
    // console.log('没事发生')
    return
  }
  try {
    let { data } = await client.rpc(interfaces.SAVE_EVENT,
      { monitorPointSaveDtos: arrEvents },
      { hideLoading: true } // 低调上送
    )
    // console.log(`上报 ${arrEvents.length} 条埋点数据`)
    client.setStorage('event', null)
  
    if (data) {
      // TODO：处理错误，万一发生错误，把队列数据转换成json字符串，增加一条新的错误事件，上报
    }
    
  } catch (error) {
    console.log('event-上报错误')
  }
}
async function trackCustomKVEventNew() {
  let arrEvents = await client.getStorage('eventNew')
  if (!arrEvents) {
    // console.log('没事发生')
    return
  }
  // 组装数据
  let param = {
    date: tools.date2Str(new Date(),'YYYY-MM-DD'),
    typeTimes: []
  }
  for (const t in arrEvents) {
    param.typeTimes.push({
      type: t,
      times: arrEvents[t]
    })
  }
  try {
    let { data } = await client.rpc(interfaces.STATIS_EVENT,
      param,
      { hideLoading: true } // 低调上送
    )
    client.setStorage('eventNew', null)
  
    if (data) {
      // TODO：处理错误，万一发生错误，把队列数据转换成json字符串，增加一条新的错误事件，上报
    }
  } catch (error) {
    console.log('eventNew-上报错误')
  }
}


// 微信小程序检测是否有新版本，若有，则提示用户关闭小程序重新打开
function check4Updates() {
  const updateManager = uni.getUpdateManager();
  updateManager.onCheckForUpdate(function (res) {
    // 请求完新版本信息的回调
    if (res.hasUpdate) {
      updateManager.onUpdateReady(function (res2) {
        uni.showModal({
          title: '温馨提示',
          content: '发现新版本，是否重启应用?',
          confirmColor: '#FF0000',
          success(res2) {
            if (res2.confirm) {
              // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
              updateManager.applyUpdate();
            }
          }
        });
      });
    }
  });

  updateManager.onUpdateFailed(function (res) {
    // 新的版本下载失败
    uni.showModal({
      title: '温馨提示',
      content: '检查到有新版本，但下载失败，请检查网络设置',
      success(res) {
        if (res.confirm) {
          // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
          updateManager.applyUpdate();
        }
      }
    });
  });
}

// 检查是否可以通行，需要登录状态，否则跳转到登录
// if(!this.$client.passCheck()) return
function passCheck(){
  let flag = !!client.getStorage('clientToken')
  if(!flag){
    client.pushWindow("/pkPublic/login/login");
    return false
  }
  return true
}


// 实名认证
async function singerReal(isInPersonalPage){
  // 获取最新个人信息
  let { data } = await client.rpc(interfaces.GET_USER_INFO);
  let formData = data.data
  if(formData.verifiedStatus==1){
    client.toast('已实名认证')
    console.log('singerReal-已实名认证')
    return true
  }
  // 判断是否已经完善了信息( 没有 姓名，证件为空)
  if(!formData.name || !formData.certificateVos || (formData.certificateVos && formData.certificateVos.length==0)){
    let toastTxt = '请先完善个人信息'
    if(isInPersonalPage){
      // 来自我的资料认证调用时
      if(!formData.name){ toastTxt='请完善姓名' }
      if(!formData.certificateVos 
        || (formData.certificateVos && formData.certificateVos.length==0)){ toastTxt='请完善身份证号码' }
    }
    setTimeout(() => {
      // 针对上面请求导致一闪而过该弹框
      client.toast(toastTxt)
    }, 300);
    if(!isInPersonalPage){
      client.pushWindow('/pkMine/personal/index', {hasBackBtn:true,showTips: "请先完善个人信息"})
    }
    return;
  }
  // 查找默认证件数据
  let item = formData.certificateVos.find(item=>item.isDefault)
  if (!item) {
    client.alert('找不到默认证件')
    return
  }
  // 检查是否已实名认证
  let idCard = item.certificateNumber
  let name = formData.name
  let phone = formData.phone
  let res = await client.rpc(interfaces.CHECK_REAL,{
    idCard, name, phone
  })
  if(!res.data.success) return true

  // 已认证
  if(res.data.data.status === 1){
    client.toast('已实名认证')
    client.removeStorage('real_info')
    client.setUserInfo({verifiedStatus:1})
    // 补偿提交资料
    client.rpc(interfaces.DO_REAL,{
      "cardNumber": idCard,
      "userName": name
    })
    return true
  }
  // 去认证
  let token = res.data.data.token
  let path = `pages/eidfac/eidfac?realName=${name}&idCard=${idCard}&phone=${phone}&token=${token}`
  let that = this;
  wx.navigateToMiniProgram({
    appId: 'wxab57af387b01ba6d',
    path,
    envVersion: MSG_ENV=='prod' ? 'release' : 'trial', // trial：体验版  release：正式版
    success(res) {
      // 打开成功
      // 先缓认证信息
      client.setStorage('real_info', {name,idCard,phone})
      client.pushEvent('REAL_SINGER') // 埋点
    },
    fail(res) {
      console.log(res)
    }
  })
}

// 选中文件之后，计算一个随机的短文件名
function getRandFileName (filePath) {
  console.log('filePath--',filePath)
  var extIndex = filePath.lastIndexOf('.');
  var extName = extIndex === -1 ? '' : filePath.substr(extIndex);
  if(extName=='.'){
    extName = '.png'
  }
  return parseInt('' + Date.now() + Math.floor(Math.random() * 900 + 100), 10).toString(36) + extName;
}


function unitConvert(num) {
  var moneyUnits = ["元", "万元", "亿元", "万亿"]
  var dividend = 10000;
  var curentNum = num;
  //转换数字
  var curentUnit = moneyUnits[0];
  //转换单位
  for (var i = 0; i < 4; i++) {
    curentUnit = moneyUnits[i]
    if (client.strNumSize(curentNum) < 5) {
      break;
    }
    curentNum = curentNum / dividend
  }
  var m = { num: 0, unit: "" }
  // m.num = curentNum<1000 ? curentNum.toFixed(2) : curentNum
  m.num = parseFloat(curentNum.toFixed(2))
  m.unit = curentUnit;
  return m;
}

function strNumSize(tempNum) {
  var stringNum = tempNum.toString()
  var index = stringNum.indexOf(".")
  var newNum = stringNum;
  if (index != -1) {
    newNum = stringNum.substring(0, index)
  }
  return newNum.length
}


// 公共方法整合
export let client = {
  App,
  $store: null,
  strNumSize, // rmb 转万元
  unitConvert,
  passCheck,
  // 返回上一个页面
  back,
  // 统一弹框
  alert,
  // 统一弹框
  toast,
  // 显示 loading
  showLoading,
  // 隐藏loading
  hideLoading,
  // 拨打电话
  makePhoneCall,
  // 获取服务器时间
  getServerTime,
  // 跳转页面，按照 mPaaS API 规范
  pushWindow,
  // 获取微信验证码
  getCode,
  // 获取页面参数
  getParam,
  setParam,
  // 缓存存储
  setCache,
  // 缓存查询
  getCache,
  // 设置用户信息
  setUserInfo,
  // 查询用户信息
  getUserInfo,
  // 清除用户信息
  clearUserInfo,
  // 实名认证逻辑
  singerReal,
  // 是否已经登录
  isLogin,
  // 复制
  copy,
  // 获取系统信息
  getSystemInfo,
  // 设置缓存
  setStorage,
  // 获取缓存
  getStorage,
  // 删除某条缓存
  removeStorage,
  // 清除所有小程序缓存
  clearStorage,
  // 下载文件
  downloadFile,
  // 打开文档
  openDocument,

  // 自定义事件监听器
  EventListener: new EventListener(),
  // 初始化完成函数
  ready,

  // 停止下拉刷新
  stopPullDownRefresh,
  // 文件管理器
  ...fsm,
  // 拍照
  chooseImage,
  // 压缩图片
  compressImage,
  // 压缩base64图片
  compressBase64Image,
  // 保存临时图片
  saveTmpImage,
  // 扫码
  scanCode,
  // 获取用户信息
  getUserProfile,
  // 埋点数据
  pushEvent,
  initEventEngine,
  trackCustomKVEvent,
  pushEventNew,
  trackCustomKVEventNew,

  // 检查更新
  check4Updates,
  // 加解密
  generatekey,
  encrypt,
  decrypt,
  // 组装分享链接-加密字符串
  getScene,
  setEscape,
  // 选中文件之后，计算一个随机的短文件名
  getRandFileName,
};
/**
 * 适配器层，主要是做和H5离线包调原生方法的适配
 */
export default class {
  constructor(store) {
    this.store = store;
  }
  create(Vue) {
    // 状态管理
    client.$store = this.store;
    // 控制主题
    Vue.prototype.$theme = "app-theme-default";
    // 控制自定义状态栏
    Vue.prototype.$statusbar = uni.getSystemInfoSync().statusBarHeight;
    client = {
      ...client,
      ...require('./request.js')
    };
    // 原生方法
    Vue.prototype.$client = client;
    Vue.prototype.$tools = tools;
    // 全局对象
    Vue.prototype.$global = global;
    // 全局调用api映射
    Vue.prototype.$api = interfaces;

  }
}