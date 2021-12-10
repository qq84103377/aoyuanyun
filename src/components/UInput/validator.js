function isEmail(src) {
  return /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/.test(src);
}

function isPhone(src) {
  return /^((\+|00)86)?1([358][0-9]|4[579]|6[67]|7[0135678]|9[189])[0-9]{8}$/.test(src);
}

function isIdcard(src) {
  const re15 = /^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$/;
  const re18 = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
  return re15.test(src) || re18.test(src);
}

export default {
  email: {
    test: isEmail,
    tag: '邮箱账号'
  },
  phone: {
    test: isPhone,
    tag: '手机号码'
  },
  idcard: {
    test: isIdcard,
    tag: '身份证号码'
  }
};