<!--
 * @Description: 优惠券列表页
 * @version:
 * @Author: gonghonglin
 * @Date: 2021-07-01 11:43:29
 * @LastEditors: gonghonglin
 * @LastEditTime: 2021-10-19 15:12:59
-->
<template>
  <div class="tab-container">
    <!-- tab组件 未使用、已使用、已失效-->
    <u-tab-nav :tabs="tabsData" :activeIndex.sync="tabIndex" @onChange="onTabChange"></u-tab-nav>
    <div class="tab-content">
      <!-- 列表 -->
      <div class="coupon-container" :style="couponContainerStyle" :class="{ 'is-loading': isLoading }">
        <div class="coupon-list" v-for="(items, typeIndex) in mainItems" :key="typeIndex">
          <template v-for="(item, itemIndex) in items">
            <div class="card coupon-item" :class="{
                disabled: typeIndex != 0,
                active: item.isExtended
              }" :key="itemIndex">
              <!-- 优惠券主体 -->
              <div class="card-content" @click="gotodetilcoupon(item.couponVo)">
                <div class="coupon-content">
                  <div class="cc-title">
                    <div class="cc-icon">
                      {{ COUPON_TYPE[item.couponVo.couponType] }}
                    </div>
                    <!-- <span class="rmb"></span> -->
                    <div class="title">{{ item.couponVo.name }}</div>
                  </div>
                  <!-- <span class="cc-description">
                   满 {{item.couponVo.minPoint || 0}}可抵{{item.couponVo.offsetAmount || 0}}
                  </span> -->
                  <div v-if="item.couponVo.couponClass == 1 && item.couponVo.objectName">
                    <span class="field">所属项目</span>
                    <span>{{ item.couponVo && item.couponVo.objectName }}</span>
                  </div>
                  <div>
                    <span class="field">使用期限</span><span
                      class="cc-date">{{ YYYYMMDD(item.couponVo.startTime) }} -
                      {{ YYYYMMDD(item.couponVo.endTime) }}</span>
                  </div>
                  <div v-if="!(item.couponVo.couponClass == 1 && item.couponVo.objectName)" style="height:20px"></div>
                </div>
                <div class="coupon-value">
                  {{ unitConvert(item.couponVo.amount || 0).num }}
                  <span class="unit">
                    {{
                      item.couponVo.couponType == 2 ? '折' : unitConvert(item.couponVo.amount || 0).unit
                    }}
                  </span>
                </div>
              </div>
              <!-- 操作栏 -->
              <div class="card-footer">
                <div class="use-tips" @click="showUseTips(item)">
                  使用规则
                  <div class="icon-arrow-right u-set-arrow rule"></div>
                </div>
                <div class="coupon-btn u-set-arrow" v-if="item.useStatus == 0" :class="{
                    u_arrow_up: item.isExtended,
                    u_arrow_down: !item.isExtended,
                    disabled: item.useStatus != 0
                  }" @click="showDetail(item)">
                  去使用
                </div>
              </div>
              <!-- 优惠券二维码 -->
              <div class="card-extanded" :class="{ extanded: item.isExtended }">
                <img class="coupon-qrcode" :src="item.qrCodeImage" alt="" />
                <div class="copy-bar" @click="copyCode(item.couponCode)">
                  验证码：<span class="txt-qrcode">{{ item.couponCode }}</span>
                  <span class="icon-copy"></span>
                </div>
                <div v-if="item.couponType == 5" class="copy-bar" style="color: #f0c17b; margin-top: 10px"
                  @click="lookOrderDetail(item)">
                  点击查看订单详情
                </div>
              </div>
            </div>
          </template>
          <!-- 无更多记录 -->
          <div class="no-more-record" v-if="items.length > 0 && isFinish">
            真的没有更多啦~
          </div>
          <!-- 无数据 -->
          <div class="no-record" v-if="items.length == 0">
            <div class="btn" v-if="tabIndex == 0" @click="signUp()">去领取</div>
          </div>
        </div>
      </div>
    </div>
    <!-- 使用规则提示 -->
    <u-popup v-model="isShowPopup" type="center">
      <div class="popup-container">
        <div class="title">
          使用规则 <span class="close" @click="hideUseTips">&times;</span>
        </div>
        <div class="content">
          <rich-text v-if="curItem" :nodes="curItem.couponVo.description || ''">
          </rich-text>
        </div>
        <div class="footer">
          <div class="btn btn-to-use" @click="toUse()">
            {{ curItem.useStatus == 0 ? '去使用' : '关闭' }}
          </div>
        </div>
      </div>
    </u-popup>

    <!-- 文旅券宏里系统弹框 -->
    <UPopup v-model="ticketShow">
      <div style="
          display: flex;
          height: 170px;
          flex-direction: column;
          justify-content: space-between;
          background-color: #fff;
          border-radius: 12px;
          padding: 20px;
          width: 80vw;
        ">
        <div>
          <div style="text-align: center; margin-bottom: 10px">温馨提示</div>
          <div style="text-align: justify; margin-bottom: 10px">
            优惠券支付地址已通过短信方式下发至您的手机，您只需在短信中完成支付即可拥有此券。
          </div>
        </div>
        <div class="footer1">
          <div class="btn" style="margin: auto" @click="ticketShow = false">关闭</div>
        </div>
      </div>
    </UPopup>
  </div>
</template>

<script>
import UTabNav from '@/components/UTabNav'
import UPopup from '@/components/UPopup'
import QRCode from '@/utils/qrcode.js'
import apis from '@/apis'
export default {
  components: {
    UTabNav,
    UPopup
  },
  data() {
    return {
      unitConvert: this.$client.unitConvert,
      tabIndex: 0, // 当前tab
      isFinish: true, // 已经加载完成所有数据
      isLoading: false, // 正在加载
      isShowPopup: false, // 显示使用规则提示框
      curItem: null, // 当前Item
      COUPON_TYPE: {
        1: '抵扣券',
        2: '折扣券',
        3: '礼品券',
        4: '停车券',
        5: '文旅劵'
      },
      mainItems: [{}, {}, {}],
      ticketShow: false
    }
  },
  computed: {
    tabsData() {
      return [
        {
          label: '未使用',
          badge:
            this.mainItems[0] && this.mainItems[0].length
              ? `(${this.mainItems[0].length}张)`
              : ''
        },
        {
          label: '已使用',
          badge:
            this.mainItems[1] && this.mainItems[1].length
              ? `(${this.mainItems[1].length}张)`
              : ''
        },
        {
          label: '已失效',
          badge:
            this.mainItems[2] && this.mainItems[2].length
              ? `(${this.mainItems[2].length}张)`
              : ''
        }
      ]
    },
    // 左右切换的样式
    couponContainerStyle() {
      let left = this.tabIndex * 750
      return `transform: translate(-${left}rpx, 0)`
    }
  },
  async onPullDownRefresh() {
    await this.init()
    // 停止下拉刷新，回弹问题
    this.$client.stopPullDownRefresh()
  },
  // mounted() {
  //   this.init()
  // },
  onShow() {
    this.init()
  },
  methods: {
    YYYYMMDD(val) {
      if (!val) return ''
      return this.$tools.str2DateStr(val, 'YYYY/MM/DD')
    },
    // 初始化数据
    async init() {
      // 初始化数据
      this.getMyCoupon(0)
      this.getMyCoupon(1)
      this.getMyCoupon(2)
    },

    // 根据状态获取优惠券列表
    async getMyCoupon(userStatus) {
      let { data } = await this.$client.rpc(apis.COUPON_HISTORY_LIST, {
        brokerId: '25A72230-61A8-4D77-9351-DFC1029054A1',
        userStatus,
        page: 1,
        pageSize: 999
      })
      if (data.success) {
        this.$set(this.mainItems, userStatus, data.rows)

      }
      var datas = data.rows || []
      datas.forEach((item) => {
       item.couponVo.description = this.$client.setEscape(item.couponVo.description, true)
        if (item.couponVo.projectName) {
          var arr = item.couponVo.projectName.split(',')
          if (arr.length == 1) {
            item.couponVo.objectName = arr[0]
          } else {
            item.couponVo.objectName = arr[0] + '...'
          }
        }
      })
      // console.log(this.mainItems)
    },

    // 切换tab
    onTabChange(index) {
      // console.log(index)
      //查询用户的优惠卷类型
    },
    // 显示优惠券明细
    async showDetail(item, isShow = !item.isExtended) {
      if (item.couponVo && item.couponVo.couponVerifierType == 2) {
        if(item.couponVo.payStatus === null) {
          uni.navigateToMiniProgram({
            appId: 'wxd94a16a49ad94404',
            path: `pages/search/index/index?filter={"couponId":"${item.couponVo.cpnsId || ''}"}`,
            envVersion: MSG_ENV == 'prod' ? 'release' : 'trial', // 打开正式版
            success(res) {
              // 打开成功
            },
            fail: function (err) {
              console.log(err)
            }
          })
        }else if (item.couponVo.payStatus === 0){
          uni.navigateToMiniProgram({
            appId: 'wxd94a16a49ad94404',
            path: `${item.couponVo.jumpUrl}?orderId=${item.couponVo.outOrderId}&groupId=&viewStatus=wait_pay`, //canceled finish wait_pay
            envVersion: MSG_ENV=='prod' ? 'release' : 'trial',// 打开正式版
            success(res) {
              // 打开成功
            },
            fail: function (err) {
              console.log(err);
            }
          })
        }else if (item.couponVo.payStatus === 1){
          this.handleCoupon(item, isShow)
        }
      } else {
        this.handleCoupon(item, isShow)
      }
    },
    async handleCoupon(item, isShow){
      if (item.useStatus != 0) return
      // 判断优惠券文旅券
      if (item.couponType == 5) {
        console.log('当前优惠券是文旅券', item)
        let { data } = await this.$client.rpc(this.$api.COUPON_TYPE, {
          couponCode: item.couponCode,
          phone: this.$store.state.userInfo.phone
        })
        if (data.success) {
          // 短信发送成功，判断宏理系统订单是否支付成功
          if (data.extParams && data.extParams.entryCode) {
            // 订单已成功支付,修改展示二维码 链接
            this.$set(item, '_entryCode', data.extParams.entryCode)
            this.$set(item, '_qrCodeImage', data.extParams.detailUrl)
          } else {
            // 订单未支付
            this.ticketShow = true
            return
          }
        } else {
          // 接口调用失败
          this.$client.toast(data.msg || '发送短信失败')
          return
        }
      }

      this.$set(item, 'isExtended', isShow) //插入可监控的值

      if (!item.qrCodeImage) {
        let CP = 'CP_' //优惠券前缀 coupon 简写 CP
        let mode = ['Numeric', 'Alphanumeric', 'Byte', 'Kanji'][2]
        let errorCorrectionLevel = ['L', 'M', 'Q', 'H'][0]
        let qr = QRCode(0, errorCorrectionLevel)
        qr.addData(item._entryCode ? item._entryCode : CP + item.couponCode, mode)
        qr.make()
        // let rt =  qr.createTableTag();
        // let rt =  qr.createSvgTag();
        // let rt =  qr.createImgTag();
        let rt = qr.createDataURL(5, 10) //输出base64地址
        this.$set(item, 'qrCodeImage', rt)
      }
    },
    // 复制验证码
    async copyCode(txt) {
      await this.$client.copy(txt)
      this.$client.toast('验证码已复制')
    },
    // 弹出使用规则提示框
    showUseTips(item) {
      this.curItem = item
      this.isShowPopup = true
    },
    hideUseTips() {
      this.isShowPopup = false
    },
    // 去使用
    toUse() {
      // 先隐藏弹框，然后打开二维码详情
      this.hideUseTips()
      setTimeout(() => {
        this.showDetail(this.curItem, true)
      }, 300)
    },
    // 参加活动
    signUp() {
      this.$client.pushWindow('/pkCoupon/index')
    },
    gotodetilcoupon(item) {
      if (item.couponVo && item.couponVo.couponVerifierType == 2) {
        //奥买家核销
        if(item.couponVo.payStatus === null) {
          uni.navigateToMiniProgram({
            appId: 'wxd94a16a49ad94404',
            path: `pages/search/index/index?filter={"couponId":"${item.couponVo.cpnsId || ''}"}`,
            envVersion: MSG_ENV == 'prod' ? 'release' : 'trial', // 打开正式版
            success(res) {
              // 打开成功
            },
            fail: function (err) {
              console.log(err)
            }
          })
        }else if (item.couponVo.payStatus === 0){
          uni.navigateToMiniProgram({
            appId: 'wxd94a16a49ad94404',
            path: `${item.couponVo.jumpUrl}?orderId=${item.couponVo.outOrderId}&groupId=&viewStatus=wait_pay`, //canceled finish wait_pay
            envVersion: MSG_ENV=='prod' ? 'release' : 'trial',// 打开正式版
            success(res) {
              // 打开成功
            },
            fail: function (err) {
              console.log(err);
            }
          })
        }else if (item.couponVo.payStatus === 1){
          //奥园云核销
          this.$client.pushWindow('/pkCoupon/detail/index?id=' + item.id)
        }
      }else{
        //奥园云核销
        this.$client.pushWindow('/pkCoupon/detail/index?id=' + item.id)
      }

    },
    // 查看文旅券 订单详情
    lookOrderDetail(item) {
      console.log('当前页面item', item)
      this.$client.pushWindow(
        '/pages/webView/webView?url=' + encodeURIComponent(item._qrCodeImage)
      )
    }
  }
}
</script>
<style>
/* 页面样式 */
page {
  height: 100%;
  overflow: hidden;
  background-color: #f8f8f8;
  /* background-color: #b1afaf; */
}
</style>
<style lang="scss" scoped>
// 箭头
// 用于设置箭头
.u-set-arrow {
  &::after {
    border-width: 1px 1px 0 0;
    border-color: #fff;
  }
  &.rule::after {
    left: 3.82px;
    top: 3.85px;
  }
}

// tab容器部分
.tab-container {
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  .tab-content {
    flex: 1;
    overflow: hidden;
    display: flex;
    .coupon-container {
      display: flex;
      overflow: hidden;
      min-width: 2250upx;
      transition: 0.2s ease;
      .coupon-list {
        min-width: 750upx;
        overflow-x: hidden;
        overflow-y: auto;
      }
    }
  }
}

// 优惠券 卡片模板
.card {
  background-color: #fff;
  border-radius: 12px;
  transition: 0.2s box-shadow;
  &.active {
    // box-shadow: 0 0 10px #969696;
  }
  .card-content {
    border-bottom: 1px solid #f3f3f3;
    position: relative;
  }
  .card-extanded {
    padding: 0;
    height: 0px;
    overflow: hidden;
    transition: 0.2s ease;
    text-align: center;
    &.extanded {
      height: 240px;
    }
  }
}

// 优惠券主体部分、抵扣券
.coupon-item {
  margin: 15px;
  color: #333;
  .card-content,
  .card-footer {
    padding: 20px;
  }
  .card-content {
    padding-bottom: 10px;
  }
  .cc-icon {
    width: 44px;
    height: 17px;
    background: linear-gradient(297deg, #f0c17b 0%, #fadbad 100%);
    border-radius: 0px 9px 9px 9px;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    font-weight: 600;
    color: #fff;
    display: flex;
    margin-right: 6px;
  }
  .coupon-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    line-height: 1.7em;
    font-size: 12px;
    .field {
      padding-right: 6px;
    }
    .cc-title {
      font-weight: 600;
      font-size: 16px;
      display: flex;
      align-items: center;
      margin-bottom: 4px;
      .title {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 260px;
      }
    }
    .rmb {
      font-size: 10px;
    }
    .cc-description,
    .cc-date {
      font-size: #666;
    }
  }
  .coupon-value {
    font-size: 20px;
    color: #f0c17b;
    position: absolute;
    top: calc(50%);
    right: 15px;
    font-weight: 700;
    .unit {
      font-size: 10px;
      font-weight: 400;
    }
  }
  .card-footer {
    font-size: 11px;
    display: flex;
    justify-content: space-between;
  }
  .coupon-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    background: #f0c17b;
    border-radius: 20px;
    padding: 1px 20px 1px 8px;
    width: auto;
    &.disabled {
      // background: #686565;
      // pointer-events: none;
    }
    &:active {
      background: #e2b571;
    }
  }
  .use-tips {
    display: flex;
    align-items: center;
    .icon-arrow-right {
      margin-left: 2px;
      width: 12px;
      height: 12px;
      color: #fff;
      background: #f0c17b;
      border-radius: 50%;
      line-height: 12px;
      text-align:center;

      &:active {
        background: #e2b571;
      }
      &::after {
        height: 4px;
        width: 4px;
      }
    }
  }
  .coupon-qrcode {
    height: 180px;
    width: 180px;
  }
  .copy-bar {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    .txt-qrcode {
      width: 100px;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .icon-copy {
      width: 20px;
      height: 20px;
      color: #000;
      fill: black;
      background-size: contain;
      background-image: url("data:image/svg+xml;base64,PHN2ZyBjbGFzcz0iaWNvbiIgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIHZpZXdCb3g9IjAgMCAxMDI0IDEwMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZmlsbD0iIzMzMyIgZD0iTTM5NC42NjcgMTA2LjY2N2g0NDhhNzQuNjY3IDc0LjY2NyAwIDAgMSA3NC42NjYgNzQuNjY2djQ0OEE3NC42NjcgNzQuNjY3IDAgMCAxIDg0Mi42NjcgNzA0aC00NDhBNzQuNjY3IDc0LjY2NyAwIDAgMSAzMjAgNjI5LjMzM3YtNDQ4YTc0LjY2NyA3NC42NjcgMCAwIDEgNzQuNjY3LTc0LjY2NnptMCA2NEExMC42NjcgMTAuNjY3IDAgMCAwIDM4NCAxODEuMzMzdjQ0OEExMC42NjcgMTAuNjY3IDAgMCAwIDM5NC42NjcgNjQwaDQ0OGExMC42NjcgMTAuNjY3IDAgMCAwIDEwLjY2Ni0xMC42Njd2LTQ0OGExMC42NjcgMTAuNjY3IDAgMCAwLTEwLjY2Ni0xMC42NjZoLTQ0OHpNNjQwIDc2OGEzMiAzMiAwIDAgMSA2NCAwdjc0LjY2N2E3NC42NjcgNzQuNjY3IDAgMCAxLTc0LjY2NyA3NC42NjZoLTQ0OGE3NC42NjcgNzQuNjY3IDAgMCAxLTc0LjY2Ni03NC42NjZ2LTQ0OEE3NC42NjcgNzQuNjY3IDAgMCAxIDE4MS4zMzMgMzIwSDI1NmEzMiAzMiAwIDAgMSAwIDY0aC03NC42NjdhMTAuNjY3IDEwLjY2NyAwIDAgMC0xMC42NjYgMTAuNjY3djQ0OGExMC42NjcgMTAuNjY3IDAgMCAwIDEwLjY2NiAxMC42NjZoNDQ4QTEwLjY2NyAxMC42NjcgMCAwIDAgNjQwIDg0Mi42NjdWNzY4eiIvPjwvc3ZnPg==");
    }
  }
  &.disabled {
    pointer-events: none;
    //已使用，或失效也高量显示
    // color: #d3d3d3 !important;
    .cc-icon {
      background: linear-gradient(297deg, #d3d3d3 0%, #d3d3d3 100%);
    }
    .coupon-value {
      color: #d3d3d3 !important;
    }
    .icon-arrow-right {
      background-color: #d3d3d3 !important;
    }
  }
}

// 折扣券
.coupon-item.type-discount {
  .coupon-btn {
    background-color: #f0c17b;
    &:active {
      background-color: #f0c17b;
    }
  }
  .cc-icon {
    background: linear-gradient(135deg, #f0c17b 0%, #fadbad 100%);
  }
  .icon-arrow-right {
    background-color: #f0c17b;
    &:active {
      background-color: #f0c17b;
    }
  }
  .coupon-value {
    color: #f0c17b;
  }
}

// 没有更多
.no-more-record {
  text-align: center;
  padding: 10px;
  color: #999;
  font-size: 12px;
}

// 没有数据
.no-record {
  height: 400px;
  margin-top: 20px;
  background: no-repeat url($ui-asset-url + "coupon/no-record.png");
  background-size: 80%;
  background-position: top center;
  position: relative;
  .btn {
    position: absolute;
    bottom: 0;
    left: calc(50% - 82.5px);
  }
}

// 使用规则提示框
.popup-container {
  background-color: #fff;
  border-radius: 10px;
  width: 300px;
  height: 350px;
  display: flex;
  flex-direction: column;
  padding: 20px;
  .title {
    display: flex;
    justify-content: space-between;
    font-size: 16px;
    font-weight: 600;
    padding-bottom: 20px;
    .close {
      color: #d8d8d8;
    }
  }
  .content {
    flex: 1;
    overflow-y: scroll;
    color: #666;
    font-size: 12px;
    p {
      line-height: 1.8em;
      margin-bottom: 10px;
    }
    font-size: 12px;
    padding-top: 10px;

    .setColor {
      color: #e20000;
    }
  }
  .footer {
    padding-top: 20px;
    display: flex;
    justify-content: center;
  }
}

// 按钮公共样式
.btn {
  width: 165px;
  height: 50px;
  background: #f0c17b;
  border-radius: 25px;
  color: #fff;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  &:active {
    background: #d3a869;
  }
}
</style>
