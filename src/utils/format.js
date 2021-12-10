/*
 * @Description: 格式化函数
 * @Author: leeyna
 * @Date: 2020-12-31 09:48:46
 * @LastEditTime: 2021-06-17 19:24:07
 * @LastEditors: gonghonglin
 */

/**
 * 数字金额格式化，常用场景在过滤器中
 * @param {String|Number} 金额数字，字符串或者数字类型
 *
 * @param {String}        货币符号，默认¥
 * @param {Number}        小数点后精确的位数，默认2
 * @return {String}       加上了,逗号分隔符和小数点.后的字符串
 */
function currencyFormat(value = "", currencySign = "¥ ", decimals = 2) {
  try {
    value = parseFloat(value);
    if (!isFinite(value) || (!value && value !== 0)) return "";
    const stringified = Math.abs(value).toFixed(decimals);
    const _int = decimals ? stringified.slice(0, -1 - decimals) : stringified;
    const i = _int.length % 3;
    const head = i > 0 ? _int.slice(0, i) + (_int.length > 3 ? "," : "") : "";
    const _float = decimals ? stringified.slice(-1 - decimals) : "";
    const sign = value < 0 ? "-" : "";
    const digitsRE = /(\d{3})(?=\d)/g;
    return (
      sign +
      currencySign +
      head +
      _int.slice(i).replace(digitsRE, "$1,") +
      _float
    );
  } catch (error) {
    console.log('utils.currencyFormat.error')
  }
}

// 金额反格式化
function currencyReformat(value) {
  if (!value) return "";
  let newVal = Number(value.replace(/[^0-9|\.]/g, ""));
  return isNaN(newVal) ? 0 : newVal
}

// 分割卡号
function bankCardSeparated(accountNo) {
  let account = accountNo.replace(/\s/g, "");
  // let bankCard = account.replace(/(^\d{4}|\d{4}\B)/g, "$1 ");
  let bankCard = account.replace(/(\d{4})(?=\d)/g, "$1 ");
  return bankCard;
}

/**
 * 把Number四舍五入为指定小数位数的数字字符串（解决原toFixed四舍五入问题）
 * @param {number} [len=0] 保留小数位数
 * @param {boolean} [round=true] 是否四舍五入（默认进行四舍五入）
 * @param {boolean} [padding=true] 有效数字不足预设小数位数时是否后补0（默认后补）如：_toFixed(1.1,3,true,true) = "1.100"  ;   _toFixed(1.1,3,true,false) = "1.1"
 * @returns {string}
 * @example _toFixed(1.335,2);
 */
function _toFixed(num, len = 2, round = true, padding = true) {
  num = Number(num);
  if (len < 0) {
    throw new RangeError("digits argument must be between 0 and 100");
  }
  let numStr = String(num), //数字转字符串
    pointIndex = numStr.indexOf("."), //小数点下标
    preNumIndex = pointIndex + len + 1; //保留位后一位数字下标
  if (numStr.includes("e") || pointIndex === -1) {
    //遇到科学表示法或整数，直接返回原生toFixed处理结果
    return num.toFixed(len);
  }
  let addZeroCount = len - (numStr.length - pointIndex - 1); //需补0的个数
  if (addZeroCount > 0) {
    numStr += "0".repeat(addZeroCount); //小数位不足后补0
  }
  let numCut = Math.abs(numStr.substring(0, preNumIndex)); //截取保留位（含）前的所有字符
  let res =
    (num < 0 ? "-" : "") +
    (round && numStr[preNumIndex] >= 5 ?
      numCut + 1 / Math.pow(10, len) :
      numCut
    ).toFixed(len); //判断预期小数位后一位是否大于等于5，是则进位
  return padding ? res : String(Number(res));
}

function idToSex(id) {
  let sex = '';
  if (id && id.length == 18) {
    if (String(id).substr(-2)[0] % 2 == 0) {
      sex = '女'
    } else {
      sex = '男'
    }
  }
  return sex;
}
/**
 * 脱敏银行账号 前四后四中间八个*
 * 1234****1234
 * 用法 a|formatBank
 * @param {*} bankcard
 * @param {Boolean} space
 */
function formatBank(bankcard, space) {
  if (typeof bankcard !== "string") {
    return "";
  }
  if (bankcard.length < 8) {
    return bankcard;
  }
  let reg = /^(\d{4})[\s\S]+(\w{4})$/;
  let value;

  if (space) {
    value = bankcard.toString().replace(reg, "$1********$2");
  } else {
    value = bankcard.toString().replace(reg, "$1 **** **** $2");
  }
  return value;
}

export default {
  currencyFormat,
  bankCardSeparated,
  _toFixed,
  idToSex,
  currencyReformat,
  formatBank,
}