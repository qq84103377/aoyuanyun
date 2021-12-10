/*
 * @Description: 
 * @version: 
 * @Author: gonghonglin
 * @Date: 2021-07-01 14:42:30
 * @LastEditors: gonghonglin
 * @LastEditTime: 2021-11-17 17:41:00
 */
import {client} from './adapter';
import md5 from './utils/md5';
import apis from './apis';
let kclientId = ''
let kclientKey = ''

if (process.env.NODE_ENV === 'development') {
  console.log('开发环境')
  kclientId = 'customer001'
  kclientKey = 'customer001-1234%^&*'
  // kclientId = 'aycloud'
  // kclientKey = '4dZdXg7XanxafyROcxnz'
} else {
  kclientId = 'customer001'
  kclientKey = 'customer001-1234%^&*'

  // kclientId = 'aycloud'
  // kclientKey = '4dZdXg7XanxafyROcxnz'
  console.log('生产环境')
}

let apiCount = 0;
/**
 * 网络请求库封装
 * @param {String} key 接口
 * @param {Object} value 请求参数 {key:"api.do", value:{...}}
 * @param {Object} options 请求 Header
 * @param {Function} action 回调函数
 */
function rpc(api, param, options = {
  after: data => data,
  before: param => param,
  result: data => data,
  silent: false, // 沉默的，不报任何错误
}) {

  return new Promise((resolve, reject) => {
    const option = {};
    // 服务器接口地址
    // authorization:62375c6f6eae4260a317a7995d9b27ae
    // AuthorizationType:CLIENTTOKEN
    option.url = /(http)\S*/.test(api.url) ? api.url : API_URL + api.url;
    option.baseData = {
      'clientId': kclientId,
      'clientKey': kclientKey
    }
    // 设置请求的 header，header 中不能设置 Referer。
    option.data = {
      // 渠道code：小程序：AYCL0001, 安卓：AYCL0002, IOS：AYCL0003
      channelCode: 'AYCL0001',
      clientId: CLIENT_ID,
      ...param
    };
    option.method = options.method ? options.method : "POST";
    option.header = {...option.header}
    option.timeout = options.timeout;
    // !options.hideLoading && client.App.loadingCounter.plusOne();
    
    // 处理添加签名
    aySign(option)

    let tmp = JSON.parse(JSON.stringify(option));
    tmp = rtFriendlyObj(tmp);
    console.warn(`【${api.name}】 ⬆️`, tmp)

    option.success = async res => {
      let tmp = JSON.parse(JSON.stringify(res));
      tmp = rtFriendlyObj(tmp);
      console.warn(`【${api.name}】  ⬇️`, tmp)

      // 静默模式，不弹框提示
      if(options.silent){
        resolve(res);
        return;
      }
      // 静默模式，不弹框提示

      // ❌ 处理处理client失效，清空clientToken重新登录
      if ((!res || (res && res.statusCode == 401)) && api.name=='续约TOKEN') {
        client.setStorage('clientToken','')
        console.error('续约TOKEN失败')
        client.pushWindow('/pkPublic/login/login');
        return;
      }

      // ❌ 处理处理client失效，重新获取
      if (res && res.statusCode == 401) {
        console.log('client失效')
        // return
        let clientToken = client.getStorage('clientToken')
        // 等待静默续签token
        await rpc(apis.TOKEN, {}, {
          method : "GET",
          header: {
            AuthorizationType: 'CLIENTTOKEN',
            authorization: clientToken
          }
        })
        // 重新执行之前的请求
        await rpc(api, param, options)
        return;
      }
      // ❌ 处理网络错误
      if (res && res.data && res.data.code == 500) {
        client.alert(res.data.code + ' ' + res.data.msg);
        reject(res);
        return;
      }
      // ❌ 处理系统错误
      if (!res || (res && res.statusCode != 200)) {
        // client.alert('网络请求异常，请稍后再试' + res.statusCode);
        client.alert('系统维护中');
        reject(res);
        return;
      }
      // ❌ 处理网络错误
      if (!res || (res && res.statusCode != 200)) {
        // client.alert('网络请求异常，请稍后再试' + res.statusCode);
        client.alert('系统维护中');
        reject(res);
        return;
      }

      // ❌ 系统级错误
      // msg:系统异常,code:AYCLE001
      // msg:登录异常,code:AYCLE002
      // msg:参数校验异常,code:AYCLE002
      // 参数检验异常，code:AYCLE003
      // 埋点入库异常，code:AYCLE004
      // 账号已被禁用，请联系客服处理，code:AYCLE005
      // 设备已被禁用，请联系客服处理，code:AYCLE006
      // 短信发送失败，请稍后再试，code:AYCLE007
      // 短信验证码已过期，请重新发送，code:AYCLE008
      // 业务提示错误，code:AYCLE009
      // 失效 clientToken
      let code = res.data.code || ''
      if (code && ('AYCLE003'.includes(code))) {
        console.log('参数校验异常')
        // client.alert('系统维护中');
        reject(res)
        return
      }
      if (code && ('AYCLE004'.includes(code))) {
        console.log('埋点入库异常')
        reject(res)
        return
      }
      if (code && ('AYCLE002'.includes(code))) {
        console.log('登录失败')
        // client.alert('登录失败')
        client.pushWindow('/pkPublic/login/login');
        reject(res)
        return
      }
      if (code && ('AYCLE005'.includes(code))) {
        client.setStorage('clientToken','')
        // client.pushWindow('/pkPublic/login/login');
        client.alert('账号已被禁用，请联系客服处理')
        reject(res)
        return
      }
      if (code && ('AYCLE006'.includes(code))) {
        client.alert('设备已被禁用，请联系客服处理')
        reject(res)
        return
      }
      if (code && ('AYCLE007'.includes(code))) {
        client.alert('短信发送失败，请稍后再试')
        reject(res)
        return
      }
      if (code && ('AYCLE008'.includes(code))) {
        client.alert('短信验证码已过期，请重新发送')
        reject(res)
        return
      }
      if (code && ('AYCLE009'.includes(code))) {
        client.alert(res.data.msg || '请联系客服')
        reject(res)
        return
      }
      
      if (code && ('40003,40004,40005,AYCLE002'.includes(code)) && 
        !option.url.includes('accessToken')) {
        client.clearUserInfo();
        // await client.toast('请重新登录');
        client.pushWindow('/pkPublic/login/login');
        return
      }

      
      if(res.data && res.data.success===false){
        reject(res)
        let msg = res.data.msg?res.data.msg: res.data.extParams.msg
        if('AYCLE001'.includes(code)){
          console.log('系统维护中', msg)
          // client.alert(msg || '系统维护中');
        }else{
          console.log('系统维护中相反code', msg)
          // client.alert(msg||"")
        }
      }

      // 处理获取TOKEN，存到store
      if(option.header.AuthorizationType == 'SIGN'){
        client.setStorage('accessTokenKey', res.data.accessToken)
      }
      
      // 处理获取TOKEN，存到store
      if(option.header.AuthorizationType == 'ACCESSTOKEN'){
        client.setStorage('clientToken', res.data.clientToken)
      }

      resolve(res);
    };
    option.fail = error => {
      console.error(`${api.name} rpc failure: `, error);
      // client.alert(error.errMsg); // 提示错误
      client.alert('网络异常，请稍后再试')
      reject(error);
    };
    option.complete = () => {
      !options.hideLoading && client.App.loadingCounter.minusOne();
    }
    uni.request(option);
  });
}

// 签名方式sign=MD5(timestamp:XXX+clientId:XXX+clientKey:XXX+key1:value1+key2:value1value2...)其中：key1:value1为具体参数，升序排序
function aySign(options) {
  let accesstoken = client.getStorage('accessTokenKey')
  // 用户登录信息
  let clientToken = client.getStorage('clientToken')
  // console.log('accesstoken,clientToken-------',accesstoken,clientToken)

  let timestamp = new Date().getTime()

  if(!options.header){
    options.header = {}
  }
  if (options && options.url && options.url.includes('accessToken')) {
    let data = options.data
    let str = ''
    if (data && data != undefined) {
      for (let key in data) {
        str += key + ':' + data[key]
      }
    }
    let clientId = 'clientId:' + kclientId
    let clientKey = 'clientKey:' + kclientKey
    str = clientId + clientKey + str
    str = 'timestamp:' + timestamp + str
    let md5Str = md5.hex_md5(str)
    options.header.sign = md5Str
    options.header.AuthorizationType = 'SIGN'
  } else if (clientToken && clientToken != undefined) {
    options.header.AuthorizationType = 'CLIENTTOKEN'
    options.header.authorization = clientToken
  } else if (accesstoken && accesstoken != undefined) {
    options.header.AuthorizationType = 'ACCESSTOKEN'
    options.header.authorization = accesstoken
  }
  options.header.timestamp = timestamp
}

// 返回一个友好的对象，处理过长的字符串
function rtFriendlyObj(obj) {
  for (var v in obj) {
    if (typeof obj[v] == "object") {
      rtFriendlyObj(obj[v])
    } else {
      if (typeof obj[v] == "string" && obj[v].length > 100) {
        obj[v] = obj[v].slice(0, 30) + "[.." + (obj[v].length - 60) + "..]" + obj[v].slice(obj[v].length - 30)
      }
    }
  }
  return obj;
}

// 获取userToken
async function getUserToken(options = {}) {
  let token = 'token-123123'
  // let token = await rpc("getUserToken", {}, options);
  // if (token && token.body) {
  //   token = token.body.userToken
  // }
  client.$store.dispatch("setUserInfo", {
    token
  });
}

// 上传图片
function uploadFile(options = {data:{},header:{}}) {
  return new Promise((resolve, reject) => {
    aySign(options) // 处理签名
    options.url = API_URL + 'ay-cloud-ump/feedBack/upload';
    uni.uploadFile({
      url: options.url,
      ...options,
      success(res) {
        resolve(res)
      },
      fail(err) {
        reject(err)
      }
    })
  })
}


module.exports = {
  uploadFile,
  rpc,
  getUserToken,
}
