<template>
  <div class="personal">
    <div class="mark" @click="login" v-if="!isLogin"></div>

    <div class="personal_header">
      <div class="personal_info" @click="gotoPersonal()">
        <img class="img_heder" :src="userInfo.avatarUrl || 'http://img.asset/personal/header.png'" />
        <div class="info_box">
          <div class="personal_name">
            <template v-if="isLogin">
              <!-- 用户名 -->
              <div class="username_min">
                {{ (userInfo.name || '') | safeName(userInfo.nickName) }}

                <!-- 认证状态 -->
                <div class="personal_icon">
                  <img class="imgren" v-if="userInfo.verifiedStatus == 1"
                    src="http://img.asset/personal/renzheng.png" />
                  <img class="imgren" v-if="userInfo.verifiedStatus == 0"
                    src="http://img.asset/personal/notauthentication.png" @click.stop="singerReal" />
                </div>
              </div>

              <!-- 组织结构 -->
              <div class="org" v-if="userInfo.distributionOrganId">
                <span class="icon-org"></span>
                <span class="org-name">{{
                  userInfo.distributionOrganName || '组织机构'
                }}</span>
              </div>
            </template>
            <div class="username_min login" v-else @click.stop="login">请登录</div>
          </div>
        </div>
        <!-- <img class="img_set" src="http://img.asset/personal/set.png" /> -->
      </div>
      <div class="personal_price">
        <div class="price_label">总收益</div>
        <div class="price_count">
          <span class="rmb" v-if="isLogin && isShowValue">￥</span>
          {{ isLogin && isShowValue ? gettoProfitnum.gettoProfittalo || '0' : '****' }}
          <span class="icon-eye" v-if="isLogin" :class="{ open: isShowValue }"
            @click="isShowValue = !isShowValue"></span>
        </div>
        <div class="price_btn" @click="messageDialog()">立即结算</div>
        <!-- <div class="price_btn" @click="gosettlement()"> 立即结算</div> -->
      </div>
    </div>
    <div class="personal_main">
      <div class="profit_box">
        <div class="profit_take_save">
          <div class="profit_item">
            <div class="profit_count">
              <span v-if="isLogin && isShowValue">￥</span>{{
                isLogin && isShowValue ? gettoProfitnum.ableWithdrawCount || '0' : '****'
              }}
            </div>
            <div class="profit_text">可结算</div>
          </div>
          <div class="profit_item">
            <div class="profit_count">
              <span
                v-if="isLogin && isShowValue">￥</span>{{ isLogin && isShowValue ? gettoProfitnum.withdrawCount || '0' : '****' }}
            </div>
            <div class="profit_text">已结算</div>
          </div>
        </div>
        <div class="profit_btn_box">
          <div class="profit_btn_item" @click="gettoProfit()">
            <img class="profit_icon" src="http://img.asset/personal/profit.png" />
            我的收益
          </div>
          <div class="profit_btn_item" @click="gotoIniteregister()">
            <img class="profit_icon profit_icon_15" src="http://img.asset/personal/initer.png" />
            我的邀请
          </div>
        </div>
      </div>
    </div>
    <div class="personal_initer" @click="gotoIniter()">
      <img src="http://img.asset/personal/friend.png" alt="" />
    </div>
    <div class="card">
      <!-- <u-cell title="扫一扫" :hasBorder="false" isLink @clickHandler="scanCode()" v-if="userInfo.verificationCoupon==1">
        <template slot="icon-before">
          <img class="cell-icon" src="@/static/icon-write-off.png" />
        </template>
      </u-cell> -->

      <u-cell title="我的优惠券" :value="(data || 0) + ' 张'" textAlign="right" :hasBorder="false" isLink
        @clickHandler="gotoconponlist()">
        <template slot="icon-before">
          <img class="cell-icon" src="@/static/icon-invite.png" />
        </template>
      </u-cell>
      <u-cell title="我的订单" textAlign="right" :hasBorder="false" isLink @clickHandler="gotoOrderList()">
        <template slot="icon-before">
          <img class="cell-icon" src="http://img.asset/my_order_icon.png" />
        </template>
      </u-cell>
      <u-cell title="我的权益包" :value="(datacardbag || 0) + ' 张'" textAlign="right" :hasBorder="false" isLink
        @clickHandler="gotocadbaglist()">
        <template slot="icon-before">
          <img class="cell-icon" src="http://img.asset/personal/bg.png" />
        </template>
      </u-cell>
      <!-- <u-cell title="场地预约" :hasBorder="false" isLink @clickHandler="messageDialog">
        <template slot="icon-before">
          <img class="cell-icon" src="http://img.asset/personal/yue.png" />
        </template>
      </u-cell> -->
      <u-cell title="我的活动" :hasBorder="false" isLink @clickHandler="myActivity">
        <template slot="icon-before">
          <img class="cell-icon" src="@/static/icon-promotion.png" />
        </template>
      </u-cell>
      <u-cell title="关注公众号" :hasBorder="false" isLink @clickHandler="focusOfficialAccount">
        <template slot="icon-before">
          <img class="cell-icon" src="@/static/icon-star.png" />
        </template>
      </u-cell>
      <u-cell title="意见反馈" :hasBorder="false" isLink @clickHandler="Myopinion">
        <template slot="icon-before">
          <img class="cell-icon" src="http://img.asset/feel.png" />
        </template>
      </u-cell>
      <u-cell title="安全中心" :hasBorder="false" isLink @clickHandler="safeCenter">
        <template slot="icon-before">
          <img class="cell-icon" src="http://img.asset/personal/security.png" />
        </template>
      </u-cell>
      <u-cell title="关于奥园云" :hasBorder="false" isLink @clickHandler="aboutClick">
        <template slot="icon-before">
          <img class="cell-icon" src="http://img.asset/111.png" />
        </template>
      </u-cell>
      <!-- <u-cell
        title="我的收益"
        :hasBorder="false"
        isLink
        @click="gettoProfit()"
      >
        <template slot="icon-before">
          <img class="cell-icon" src="http://img.asset/111.png" />
        </template>
      </u-cell> -->
    </div>
    <!-- 分润权限 -->
    <div class="tips_box" v-if="userDataState" @click="userDataState = !userDataState">
      <div class="tips_inbox" @click.stop="() => {}">
        <div>温馨提示</div>
        <div class="tips_text">
          您的分销账户已被冻结，无法使用该功能，如有疑问请联系客服！
        </div>
        <div class="tips_btn" @click="userDataState = !userDataState">确定</div>
      </div>
    </div>

    <!-- 未完善信息的提示框 -->
    <u-popup v-model="isShowUserInfoTips" type="center">
      <div class="tips_inbox">
        <div>温馨提示</div>
        <div class="tips_text">
          您还未完善个人信息<span v-if="stateTips">({{ stateTips }})</span>，完善后即可使用推荐、查看佣金等功能
        </div>
        <div class="tips_btn" @click.stop="routerUserInfo">立即完善</div>
      </div>
    </u-popup>

    <!-- 扫码功能 -->
    <scanner ref="scanner" />
  </div>
</template>

<script>
import apis from '@/apis'
import UCell from '@/components/UCell'
import scanner from './scanner'
export default {
  components: {
    UCell,
    scanner
  },
  data() {
    return {
      isLogin: false, //是否已登录
      lngShowTimes: 0, // 第一次进入
      constants: {},
      data: '', //总数
      userInfo: {},
      datacardbag: '', //卡包总数
      gettoProfitnum: {
        ableWithdrawCount: '', //可结算 ,
        withdrawCount: '', //已结算
        gettoProfittalo: '' //总收益
      },

      userDataState: false, // 分润权限弹框
      isShowUserInfoTips: false, // 检测用户信息是否完善
      stateTips: '',
      isShowValue: false /// 是否显示具体的金额
    }
  },
  async onLoad() {
    // this.getMyCoupontotal()
  },
  async onShow(options) {
    let res = await this.$client.getUserInfo()
    if (res && Object.keys(res).length) {
      this.isLogin = true
      this.userInfo = res
    }
    uni.hideHomeButton()

    // let param = this.$client.getParam();
    // if(param.refreshFlag){
    //   this.lngShowTimes = 0
    // }
    this.$nextTick(async () => {
      this.isLogin = this.$store.state.userInfo && this.$store.state.userInfo.uid
      // console.log('this.isLogin', this.isLogin)
      if (this.isLogin) {
        setTimeout(async () => {
          await this.$client.getUserInfo('', true)
          // // this.$set(this, 'userInfo', this.$store.state.userInfo)
          // this.isLogin = true;
          let res = await this.$client.getUserInfo()
          if (res && Object.keys(res).length) {
            this.isLogin = true
            this.userInfo = res
          }
        }, 1000);
        let res = await this.$client.getUserInfo()
        if (res && Object.keys(res).length) {
          this.isLogin = true
          this.userInfo = res
        }
        this.getMyCoupontotal() // 刷新优惠券统计数量
        this.getMycardbagtotal()
        this.getMyprofittotal() //总收益
      } else {
        // 清除缓存
        this.$set(this, 'userInfo', {})
        this.$set(this, 'gettoProfitnum', {
          ableWithdrawCount: '', //可结算 ,
          withdrawCount: '', //已结算
          gettoProfittalo: '' //总收益
        }),
          (this.datacardbag = 0)
        this.data = 0
        // this.login()
      }
    })
  },

  methods: {
    async focusOfficialAccount() {
      // let { data } = await this.$client.rpc(this.$api.FOCUS_OFFICIAL)
      // console.log('-=danqian', data)
      // 'https://mp.weixin.qq.com/s?__biz=MzkxNzIzMDIwMQ==&mid=2247483743&idx=1&sn=60b4c10557d8fbd277c59cf466c7fc66&chksm=c1428649f6350f5f8df792bc39781d919f6566cfb5ed50c704ccca0d460de25aa1213521359a&token=1961042464&lang=zh_CN#rd'
      let tmpUrl = 'https://mp.weixin.qq.com/s/wYLxK5lB-a6yhiq6Y3Dj0g'
      this.$client.pushWindow(
        // '/pages/webView/webView?url=' + encodeURIComponent(data.data.wechatPublicLink),
        '/pages/webView/webView?url=' + encodeURIComponent(tmpUrl),
        {
          reLaunch: true
        }
      )
    },
    // 获取用户信息是否完善
    async getUserDataState() {
      let { data } = await this.$client.rpc(this.$api.VALIDATE_USERINFO)
      this.isShowUserInfoTips = !data.data
      this.stateTips = data.msg
      return new Promise((resolve) => resolve(this.isShowUserInfoTips))
    },
    routerUserInfo() {
      this.isShowUserInfoTips = false
      this.$client.pushWindow('/pkMine/personal/index', { hasBackBtn: true })
    },
    safeCenter() {
      // this.traffic(() => {
      this.$client.pushWindow('/pkMine/safety/index')
      // })
    },
    // 实名认证
    async singerReal() {
      if (this.userInfo.verifiedStatus == 1) {
        this.$client.pushWindow('/pkMine/safety/center', this.userInfo)
        return
      }
      this.$client.singerReal()
      this.userInfo = await this.$client.getUserInfo('', true)
    },
    gotoIniter() {
      this.traffic(async () => {
        // 检查是否已经完善了信息
        let us = await this.getUserDataState()
        if (us) return
        this.$client.pushWindow('/pkSNS/invite/qrcode')
      })
    },
    login(flag) {
      if (!this.lngShowTimes++ || flag)
        this.$client.pushWindow('/pkPublic/login/login', { redirect: true })
    },
    traffic(cb) {
      if (this.isLogin) {
        cb()
      } else {
        this.$client.toast('请先登录')
        setTimeout(() => {
          this.login('go')
        }, 300)
      }
    },
    gotoOrderList() {
      this.traffic(() => {
        this.$client.pushWindow('/pkMine/order/list')
      })
    },
    gotoconponlist() {
      this.traffic(() => {
        this.$client.pushWindow('/pkMine/coupon/list')
      })
    },
    gotocadbaglist() {
      this.traffic(() => {
        this.$client.pushWindow('/pkMine/cardbag/index')
      })
    },
    myActivity() {
      this.traffic(() => {
        this.$client.pushWindow('/pkSNS/promotion/promotion')
      })
    },
    gettoProfit() {
      // 我的结算
      this.traffic(async () => {
        if (this.isLogin) {
          let res = await this.$client.getUserInfo('', true)
          if (res && Object.keys(res).length) {
            this.userInfo = res
          }
        }
        if (this.userInfo.distributionStatus == 0) {
          this.userDataState = true
        } else {
          this.$client.pushWindow('/pkMine/earnings/index')
        }
      })
    },
    gotoPersonal() {
      this.traffic(() => {
        this.$client.pushWindow('/pkMine/personal/index')
      })
    },
    Myopinion() {
      this.traffic(() => {
        this.$client.pushWindow('/pkMine/feedback/feedback')
      })
    },
    aboutClick() {
      this.$client.pushWindow('/pkMine/feedback/about/index')
    },
    // 卡包跳转
    gotoCardbag() {
      this.traffic(() => {
        this.$client.pushWindow('/pkMine/cardbag/index')
      })
    },
    // 邀请好友跳转
    gotoIniteregister() {
      this.traffic(async () => {
        if (this.isLogin) {
          let res = await this.$client.getUserInfo('', true)
          if (res && Object.keys(res).length) {
            this.userInfo = res
          }
        }
        if (this.userInfo.distributionStatus == 0) {
          this.userDataState = true
        } else {
          this.$client.pushWindow('/pkMine/invite/index')
        }
      })
    },
    async messageDialog() {
      if (this.isLogin) {
        let res = await this.$client.getUserInfo('', true)
        if (res && Object.keys(res).length) {
          this.userInfo = res
        }
      }
      // 暂无功能敬请期待
      if (this.userInfo.distributionStatus == 0) {
        this.userDataState = true
      } else {
        // return this.$client.toast("敬请期待")
        this.$client.pushWindow('/pkMine/earnings/cash/index')
      }
    },
    //优惠劵总数
    getMyCoupontotal() {
      this.traffic(async () => {
        let { data } = await this.$client.rpc(this.$api.COUPON_HISTOR_COUNT)
        this.data = data.data
      })
    },
    // 卡包总数
    getMycardbagtotal() {
      this.traffic(async () => {
        let { data } = await this.$client.rpc(apis.CARDBAG_HISTOR_COUNT)
        this.datacardbag = data.data
      })
    },
    //总收益
    getMyprofittotal() {
      this.traffic(async () => {
        let { data } = await this.$client.rpc(apis.ACCOUNTNUM)
        this.gettoProfitnum = data.data
        //总收益
        this.gettoProfitnum.gettoProfittalo =
          this.gettoProfitnum.totalCommission || '0.00'
      })
    },
    gosettlement() {
      this.traffic(() => {
        this.$client.pushWindow('/pkMine/earnings/cash/index')
      })
    },
    writeoffClick() {
      this.traffic(() => {
        this.$client.pushWindow('/pkMine/writeoff/writeoff')
      })
    },
    // 扫码
    async scanCode() {
      this.$refs['scanner'].scanCode()
    }
  }
}
</script>

<style lang="scss" scoped>
.username_min {
  display: flex;
  align-items: center;
}
.org {
  font-size: 12px;
  display: flex;
  align-items: center;
  color: #666666;
  margin-top: 4px;
  .icon-org {
    width: 18px;
    height: 18px;
    background-image: url("../../static/mine/icon-group.png");
    display: inline-block;
    background-repeat: no-repeat;
    background-size: 18px;
    background-position: center;
    margin-right: 5px;
  }
}
.icon-eye {
  background-image: url("../../static/mine/icon-eye-close.png");
  height: 32px;
  width: 32px;
  display: inline-block;
  background-repeat: no-repeat;
  background-size: 18px;
  background-position: center;
  margin-left: 15px;
  &.open {
    background-image: url("../../static/mine/icon-eye-open.png");
  }
}
.mark {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 9999999999;
}
.personal {
  min-height: 100vh;
  background: #f6f6f6;
  display: flex;
  flex-direction: column;
  padding-bottom: 25px;
  .personal_header {
    position: relative;
    background-color: #fff;
    padding: 20px;
    padding-bottom: 52px;
    box-sizing: border-box;
    background-image: url("http://img.asset/personal/personal-b.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    .personal_info {
      position: relative;
      display: flex;
      padding-bottom: 20px;
      box-sizing: border-box;
      align-items: center;
      padding-top: 38px;
      .img_heder {
        width: 55px;
        height: 55px;
        margin-right: 10px;
        border-radius: 50%;
      }
      .info_box {
        flex: 1;
        display: flex;
        align-items: center;
        .personal_name {
          font-size: 18px;
          color: #333;
          font-weight: 400;
          margin-right: 6px;
        }
        .personal_icon {
          width: 62px;
          height: 20px;
          display: inline-block;
          margin-left: 10px;
          img {
            width: 62px;
            height: 20px;
          }
        }
      }
      .img_set {
        width: 20px;
        height: 20px;
      }
    }
    .personal_price {
      width: 355px;
      height: 52px;
      position: absolute;
      bottom: -2px;
      left: 50%;
      transform: translate(-50%);
      display: flex;
      align-items: center;
      color: #fff;
      background-image: url("http://img.asset/personal/baer.png");
      background-repeat: no-repeat;
      background-size: 100% 100%;

      border-radius: 10px 10px 0 0;
      padding: 0 10px 0 15px;
      box-sizing: border-box;
      justify-content: space-between;
      .price_label {
        font-size: 14px;
        width: 52px;
      }
      .price_count {
        flex: 1;
        font-size: 18px;
        display: flex;
        align-items: center;
        & > span {
          font-size: 12px;
        }
        .rmb {
          padding-top: 5px;
        }
      }
      .price_btn {
        width: 70px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        background: linear-gradient(297deg, #f0c17b 0%, #fadbad 100%);
        border-radius: 10px;
        font-size: 12px;
        color: #333;
      }
    }
  }
  .personal_main {
    padding: 0px 10px 0px;
    .profit_box {
      background-color: #fff;
      border-radius: 0 0 10px 10px;
      .profit_take_save {
        display: flex;
        align-items: center;
        padding: 10px 0 15px;
        border-bottom: 1px solid #f8f8f8;
        .profit_item {
          flex: 1;
          text-align: center;
          .profit_count {
            color: #333;
            font-size: 16px;
            span {
              font-size: 12px;
            }
          }
          .profit_text {
            font-size: 12px;
            color: #333;
          }
        }
      }
      .profit_btn_box {
        height: 42px;
        display: flex;
        align-items: center;
        .profit_btn_item {
          flex: 1;
          text-align: center;
          font-size: 14px;
          color: #333;
          .profit_icon {
            width: 16px;
            height: 16px;
            margin-right: 5px;
            vertical-align: -2px;
          }
          .profit_icon_15 {
            width: 15px;
            height: 15px;
          }
        }
      }
    }
  }
  .personal_initer {
    padding: 10px;
    text-align: center;
    img {
      height: 80px;
      width: 355px;
    }
  }
  .cell-icon {
    height: 18px;
    width: 18px;
    padding-right: 9px;
    vertical-align: bottom;
  }

  .card {
    background-color: #ffff;
    border-radius: 10px;
    margin: 0 10px;
    padding: 20px 0;
  }
  .user-default {
    font-size: 36upx;
    color: #000000;
    display: flex;
    align-items: center;
  }
}

.tips_box {
  z-index: 50;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  .tips_inbox {
    border-radius: 10px;
    background-color: #fff;
    text-align: center;
    width: 250px;
    padding: 20px;
    border-radius: 10px;
    position: absolute;
    top: 50%;
    left: 50%;
    color: #333;
    font-size: 18px;
    transform: translate(-50%, -50%);
    background-color: #fff;
    font-weight: 600;
    .tips_text {
      font-weight: 400;
      font-size: 14px;
      color: #666;
      padding: 20px 20px 40px;
    }
    .tips_btn {
      background-color: #f0c17b;
      width: 150px;
      height: 35px;
      border-radius: 35px;
      line-height: 35px;
      text-align: center;
      font-size: 14px;
      color: #fff;
      margin: 0 auto;
    }
  }
}
.tips_inbox {
  border-radius: 10px;
  background-color: #fff;
  text-align: center;
  width: 250px;
  padding: 20px;
  border-radius: 10px;
  position: absolute;
  top: 50%;
  left: 50%;
  color: #333;
  font-size: 18px;
  transform: translate(-50%, -50%);
  background-color: #fff;
  font-weight: 600;
  .tips_text {
    font-weight: 400;
    font-size: 14px;
    color: #666;
    padding: 20px 20px 40px;
  }
  .tips_btn {
    background-color: #f0c17b;
    width: 150px;
    height: 35px;
    border-radius: 35px;
    line-height: 35px;
    text-align: center;
    font-size: 14px;
    color: #fff;
    margin: 0 auto;
  }
}
</style>
