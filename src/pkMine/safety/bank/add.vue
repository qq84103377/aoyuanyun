<template>
  <div class="bank_add">
    <u-cell
      title="账户姓名"
      textAlign="right"
      bgColor="white"
      :value="formData.name"
    ></u-cell>
    <u-cell
      title="身份证号码"
      textAlign="right"
      bgColor="white"
      :value="formData.idCard"
    ></u-cell>
    <u-input
      title="银行卡号"
      @onBlur="refreshBankName"
      textAlign="right"
      bgColor="white"
      placeholder="请输入银行卡号"
      require
      v-model="formData.bankCard"
    ></u-input>
    <u-input
      title="银行名称"
      textAlign="right"
      bgColor="white"
      placeholder="请输入银行名称"
      require
      v-model="formData.bankName"
    ></u-input>
    <u-input
      title="预留手机号"
      textAlign="right"
      bgColor="white"
      placeholder="请输入预留手机号"
      require
      v-model="formData.phone"
    ></u-input>

    <div class="back_list">
      <div class="back_item">
        <div class="back_item_l">短信验证码</div>
        <div class="back_item_r">
          <div style="flex: 1">&nbsp;</div>
          <input
            v-if="isSendedCode"
            maxlength="6"
            placeholder="请输入验证码"
            class="input-box"
            type="text"
            v-model="smsCode"
          />
          <span class="btn-get-code" @click="getSMSCode">{{
            intCount ? `${intCount}秒后重新获取` : '获取验证码'
          }}</span>
        </div>
      </div>
    </div>

    <div class="tips_box">
      <div class="tips_name">温馨提示</div>
      <p>1、为保障资金安全，仅支持绑定同一账户身份下的银行账户。</p>
      <p>2、仅支持添加绑定一类储蓄卡或借记卡。</p>
      <p>3、一个账户最多只能绑定5个银行账户。</p>
      <p>
        4、一个账户最多可以进行10次提交绑卡操作，已绑定成功后解除绑定后再次绑定同一银行账号时，不计算次数，只对绑定新卡次数进行计算。
      </p>
      <p>5、单人单卡每次结算限额为10万元，单月限额15万元。</p>
    </div>
    <div class="back_btn">
      <div :class="{ disabled: !checked }" @click="bindCard">绑定银行卡</div>
    </div>
    <div class="back_btn_tips" @click="checked = !checked">
      <div class="check_btn">
        <img v-if="checked" src="http://img.asset/selected_icon.png" alt="" />
      </div>
      <div class="check_text">
        为保障您的个人隐私权益，请在登录前阅读
        <span @click.stop="gotofile(100001)"><br />《奥园云服务协议》</span>
        <span @click.stop="gotofile(100003)">《推荐须知》</span>和
        <br />
        <span @click.stop="gotofile(100002)">《免责条款》</span>
        <span @click.stop="gotofile(100004)">《隐私政策》</span>
      </div>
    </div>
  </div>
</template>

<script>
let BCI = require('./bankCardInfo')
export default {
  data() {
    return {
      formData: {
        bankCard: '',
        idCard: '',
        name: '',
        phone: '',
        bankName: ''
      },
      smsCode: '',
      isSendedCode: false,
      intCountDown: null, // 计时器
      intCount: 0, // 倒数
      checked: false
    }
  },
  async mounted() {
    // 获取最新个人信息
    let { data } = await this.$client.rpc(this.$api.GET_USER_INFO)
    let formData = data.data
    // // 判断是否已经实名认证了
    // let verifiedStatus = this.$client.getUserInfo('verifiedStatus')
    if (formData.verifiedStatus == 0) {
      if (
        !formData.name ||
        !formData.certificateVos ||
        (formData.certificateVos && formData.certificateVos.length == 0)
      ) {
        this.$client.toast('请先完善个人信息')
        setTimeout(() => {
          this.$client.pushWindow('/pkMine/personal/index')
        }, 600)
        return
      }
    }

    // 查找默认证件数据
    let item = formData.certificateVos.find((item) => item.isDefault)
    if (!item) {
      this.$client.alert('找不到默认证件')
      return
    }
    this.formData.name = formData.name
    this.formData.phone = formData.phone
    this.formData.idCard = item.certificateNumber
  },
  methods: {
    refreshBankName() {
      // if(!this.formData.bankCard)
      this.formData.bankCard = this.formData.bankCard.replace(/ /g, '')
      try {
        BCI.getBankBin(this.formData.bankCard, (err, data) => {
          // bankCode: "PSBC"
          // bankName: "中国邮政储蓄银行"
          // cardType: "CC"
          // cardTypeName: "信用卡"
          console.log(err, data)
          if (!err) {
            this.formData.bankName = data.bankName
          } else {
            this.formData.bankName = ''
            this.$client.alert(err)
          }
        })
      } catch (error) {
        this.formData.bankName = ''
        console.log(error)
      }
    },
    isPhone(src) {
      return /^((\+|00)86)?1([358][0-9]|4[579]|6[67]|7[0135678]|9[189])[0-9]{8}$/.test(
        src
      )
    },
    // 获取验证码
    async getSMSCode() {
      if (this.intCount) return
      if (!this.isPhone(this.formData.phone)) {
        this.$client.alert('请正确输入手机号')
        return
      }
      let { data } = await this.$client.rpc(this.$api.GET_SMS_CODE, {
        phone: this.formData.phone,
        type: 1 //1-绑定银行卡
      })
      if (data.success) {
        this.$client.toast('验证码已发送')
        this.isSendedCode = true
        this.beginCountDown()
      }
    },
    // 开始倒计时
    beginCountDown() {
      this.intCount = 60
      this.intCountDown = setInterval(() => {
        if (--this.intCount == 0) {
          clearInterval(this.intCountDown)
        }
      }, 1000)
    },
    // 绑卡
    async bindCard() {
      if (!this.formData.bankCard) {
        this.$client.toast('请输入银行卡号')
        return
      }
      if (!this.formData.bankName) {
        this.$client.toast('请输入银行名称')
        return
      }
      if (!this.checked) {
        this.$client.toast('请先勾选协议')
        return
      }
      if (this.smsCode.length != 6) {
        this.$client.toast('请输入验证码')
        return
      }
      let { data } = await this.$client.rpc(this.$api.BIND_CARD, {
        bankCard: this.formData.bankCard,
        bankName: this.formData.bankName,
        phone: this.formData.phone,
        smsCode: this.smsCode,
        userName: this.formData.name
      })
      if (data.success) {
        this.$client.alert('添加银行卡成功')
        this.$client.back()
      } else {
        this.$client.alert(data.msg)
      }
    },
    gotofile(num) {
      this.$client.pushWindow('/pkPublic/login/file', { code: num })
    }
  }
}
</script>

<style lang="scss" scoped>
.bank_add {
  min-height: 100vh;
  padding: 10px 0 50px;
  background-color: #f8f8f8;
  .back_list {
    padding: 15px 20px 0;
    padding-top: 0;
    background-color: #fff;
    .back_item {
      padding: 15px 0;
      font-size: 14px;
      display: flex;
      border-bottom: 1px solid #f3f3f3;
      .back_item_l {
        color: #666;
      }
      .back_item_r {
        flex: 1;
        text-align: right;
        font-size: 14px;
        color: #333;
        display: flex;
        .input-box {
          margin-right: 10px;
          // border: 1px solid #999;
          width: 100px;
        }
        span {
          color: #f0c17b;
        }
        .success {
          color: #d3d3d0;
        }
        img {
          width: 24px;
          height: 24px;
          vertical-align: sub;
          margin-left: 5px;
          background-color: #949494;
        }
      }
    }
    .back_item:nth-last-child(1) {
      border-bottom: none;
    }
  }
  .tips_box {
    padding: 24px 25px;
    font-size: 12px;
    color: #999;
    .tips_name {
      padding-bottom: 20px;
    }
  }
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
  .back_btn {
    padding-top: 60px;
    div {
      width: 325px;
      margin: 0 auto;
      height: 40px;
      background: #f0c17b;
      border-radius: 10px;
      font-size: 12px;
      text-align: center;
      line-height: 40px;
      color: #fff;
      &.disabled {
        background-color: #d3d3d3;
      }
    }

    p {
      padding-bottom: 2px;
    }
  }
  .back_btn_tips {
    padding: 24px 38px;
    padding-right: 46px;
    display: flex;
    .btn {
      width: 15px;
      height: 15px;
      background-color: #f0c17b;
      border-right: 50%;
    }
    .text {
      flex: 1;
      padding-left: 8px;
      font-size: 12px;
      color: #999;
      text-align: center;
    }
    .check_text {
      flex: 1;
      padding-left: 8px;
      font-size: 12px;
      color: #999;
      text-align: center;
      span {
        color: #f0c17b;
      }
    }
  }
}
</style>
