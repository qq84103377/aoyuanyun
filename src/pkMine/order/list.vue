<template>
  <div class="tab-container">
    <u-tab-nav
      :tabs="tabsData"
      :activeIndex.sync="tabIndex"
      @onChange="onTabChange"
    ></u-tab-nav>
    <div class="tab-content">
      <!-- 列表 -->
      <div
        class="coupon-container"
        :style="couponContainerStyle"
        :class="{ 'is-loading': isLoading }"
      >
        <div class="coupon-list" v-for="(items, typeIndex) in mainItems" :key="typeIndex">
          <template v-for="(item, itemIndex) in items">
            <div
              @click="viewDetail(item)"
              class="card coupon-item"
              :key="itemIndex"
            >
              <div class="item-bottom">
                <div class="item-bottom__info">
                  <div class="mb10 order-no"><span class="tag">{{item.channelType == 1 ? '优惠券' : (item.channelType == 2 ? '文旅门票' : '商品订单')}}</span> 订单编号<span>{{item.orderId}}</span></div>
                  <div class="order-time">下单时间 <span>{{formatDate(item.createTime)}}</span></div>
                </div>
                <div class="pay-group">
                  <div class="pay-acount">{{(item.payStatus === 0 && item.orderStatus === 0) ? '待' : '实'}}付款: <span class="price">￥{{item.realPayPrice || 0}}</span></div>
                  <div class="item-bottom__btn" v-if="item.payStatus === 0 && item.orderStatus === 0">去支付</div>
                  <div v-else class="item-bottom__btn grey">{{item.orderStatus === 1 ? '已完成' : '已取消'}}</div>
                </div>
              </div>
              <div class="item-top" v-if="item.externalCouponCode">
                <img class="item-top__img" :src="item.imgUrl" alt="">
                <div class="item-title">
                  <div class="ellipsis item-title__label">{{item.title}}</div>
                  <div class="discount">￥{{item.couponAmount || 0}}</div>
                </div>
<!--                <div class="u-set-arrow"></div>-->
              </div>

            </div>
          </template>
          <!-- 无更多记录 -->
          <div class="no-more-record" v-if="items && items.length > 0 && isFinish">
            真的没有更多啦~
          </div>
          <!-- 无数据 -->
          <div class="no-record" v-if="!items.length">
            <div class="empty-tips">暂无订单</div>
          </div>
        </div>
      </div>
    </div>
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
      mainItems: [{}, {}, {}, {}],
      ticketShow: false
    }
  },
  filters: {
    /**
     * 处理富文本里的图片宽度自适应
     * 1.查找img标签有无style属性，如果没有，加上style
     * 2.所有标签style后追加 max-width:100% !important;
     * 4.去掉<br/>标签
     * @param html
     * @returns {void|string|*}
     */
    formatRichText(html = '') {
      //控制小程序中图片大小
      let newContent = html.replace(/<img[^>]*>/gi, function (match, capture) {
        // console.log(match.search(/style=/gi));

        if (match.search(/style=/gi) == -1) {
          match = match.replace(/\<img/gi, '<img style=""')
        }
        return match
      })

      newContent = newContent.replace(/style="/gi, '$& max-width:100% !important;height:auto !important ')
      newContent = newContent.replace(/<br[^>]*\/>/gi, '')
      return newContent
    }
  },
  computed: {
    tabsData() {
      return [
        {
          label: '全部',
          // badge:
          //   this.mainItems[0] && this.mainItems[0].length
          //     ? `(${this.mainItems[0].length}张)`
          //     : ''
        },
        {
          label: '待付款',
          // badge:
          //   this.mainItems[1] && this.mainItems[1].length
          //     ? `(${this.mainItems[1].length}张)`
          //     : ''
        },
        {
          label: '已取消',
          // badge:
          //   this.mainItems[2] && this.mainItems[2].length
          //     ? `(${this.mainItems[2].length}张)`
          //     : ''
        },
        {
          label: '已完成',
          // badge:
          //   this.mainItems[2] && this.mainItems[2].length
          //     ? `(${this.mainItems[2].length}张)`
          //     : ''
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
  mounted() {
    // this.init()
  },
  onShow() {
    this.init()
  },
  methods: {
    gotoAmgOrderDetail(item){
      //待支付的都跳奥买家订单详情
      let viewStatus = ''
      if(item.orderStatus == 0 && item.payStatus == 0) {
        viewStatus = 'wait_pay'
      }else if(item.orderStatus == 1){
        viewStatus = 'finish'
      }else if(item.orderStatus == -2 || item.orderStatus == -1){
        viewStatus = 'canceled'
      }
      console.log(`${item.jumpUrl}?orderId=${item.outOrderId}&groupId=&viewStatus=${viewStatus}`);
      uni.navigateToMiniProgram({
        appId: 'wxd94a16a49ad94404',
        path: `${item.jumpUrl}?orderId=${item.outOrderId}&groupId=&viewStatus=${viewStatus}`, //canceled finish wait_pay
        envVersion: MSG_ENV=='prod' ? 'release' : 'trial',// 打开正式版
        success(res) {
          // 打开成功
        },
        fail: function (err) {
          console.log(err);
        }
      })
    },
    viewDetail(item){
      if(item.payStatus === 0 && item.orderStatus === 0){
        //待支付的都跳奥买家订单详情
        this.gotoAmgOrderDetail(item)
      }else{
        if(item.channelType == 1 || item.channelType == 2){
          // channelType 1 跳自己
          this.$client.pushWindow(`/pkMine/order/detail?id=${item.id}`)
        }else if(item.channelType == 3){
          //2 跳奥买家
          this.gotoAmgOrderDetail(item)
        }
      }
    },
    YYYYMMDD(val) {
      if (!val) return ''
      return this.$tools.str2DateStr(val, 'YYYY-MM-DD hh:mm:ss')
    },
    formatDate(date, fmt = 'yyyy-MM-dd hh:mm:ss'){
        if(!date || date==='0001-01-01T00:00:00'){
          return ''
        }
        date = new Date(date)
        if (/(y+)/.test(fmt)) {
          fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
        }
        let o = {
          'M+': date.getMonth() + 1,
          'd+': date.getDate(),
          'h+': date.getHours(),
          'm+': date.getMinutes(),
          's+': date.getSeconds()
        }
        for (let k in o) {
          if (new RegExp(`(${k})`).test(fmt)) {
            let str = o[k] + ''
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : this.padLeftZero(str))
          }
        }
        return fmt
    },
    padLeftZero (str) {
      return ('00' + str).substr(str.length)
    },
    // 初始化数据
    async init() {
      // 初始化数据
      this.getMyCoupon(0)
      this.getMyCoupon(1)
      this.getMyCoupon(2)
      this.getMyCoupon(3)
    },
    handleType(type){
      let str = ''
      switch (type) {
        case 0:
          str = 'all'
          break
        case 1:
          str = 'toPay'
          break
        case 2:
          str = 'cancel'
          break
        case 3:
          str = 'complete'
          break
      }
      return str
    },
    // 根据状态获取优惠券列表
    async getMyCoupon(userStatus) {
      uni.showLoading({
        title: '加载中...',
        mask: true,
      })
      try{
        let { data } = await this.$client.rpc(apis.ORDER_LIST, {
          // brokerId: '25A72230-61A8-4D77-9351-DFC1029054A1',
          type: this.handleType(userStatus),
          page: 1,
          pageSize: 999
        })
        if (data.success) {
          this.$set(this.mainItems, userStatus, data.rows)
          // this.$set(this.mainItems, userStatus, [{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}])
        }
        uni.hideLoading()
      }catch(e){
        uni.hideLoading()
        this.$set(this.mainItems, userStatus, [])
        console.log(e);
      }

    },
    // 切换tab
    onTabChange(index) {
      // console.log(index)
      //查询用户的优惠卷类型
    },
    // 显示优惠券明细
    async showDetail(item, isShow = !item.isExtended) {
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
      this.$client.pushWindow('/pkCoupon/detail/index?id=' + item.id)
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
    border-color: #999;
  }
  &.rule::after {
    left: 3px;
    top: 4px;
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
      min-width: 3000upx;
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
}

// 优惠券主体部分、抵扣券
.coupon-item {
  margin: 15px;
  color: #333;
  padding: 10px;
  border-radius: 10px;
  .item-top{
    display: flex;
    border-top: 1px solid #eee;
    padding-top: 10px;
    margin-top: 10px;
    &__img{
      width: 125px;
      flex: 0 0 125px;
      height: 92px;
      border-radius: 5px;
    }
    .item-title{
      flex: 1;
      margin: 0 10px;
      font-size: 12px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      &__label{
        font-weight: 500;
        font-size: 14px;
      }
      .discount{
        font-size: 16px;
        color: red;
        text-align: right;
        font-weight: 500;
      }
      .ellipsis{
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        word-break: break-all;
      }
    }
  }
  .item-bottom{
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 12px;
    .pay-group{
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    }
    .pay-acount{
      margin-bottom: 10px;
      font-size: 10px;
      color: #999;
      .price{
        margin-left: 10px;
        font-size: 16px;
        font-weight: 500;
        color: red;
      }
    }
    &__info{

    }
    &__btn{
      background: #F0C17B;
      border-radius: 10px;
      flex: 0 0 18px;
      width: 50px;
      text-align: center;
      line-height: 18px;
      color: #fff;
      font-size: 10px;
      &.grey{
        background: #CBD7E1;
      }
    }
  }
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
    font-size: 30px;
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
      width: 14px;
      height: 14px;
      color: #fff;
      background: #f0c17b;
      border-radius: 20px;

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
      background-image: url('data:image/svg+xml;base64,PHN2ZyBjbGFzcz0iaWNvbiIgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIHZpZXdCb3g9IjAgMCAxMDI0IDEwMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZmlsbD0iIzMzMyIgZD0iTTM5NC42NjcgMTA2LjY2N2g0NDhhNzQuNjY3IDc0LjY2NyAwIDAgMSA3NC42NjYgNzQuNjY2djQ0OEE3NC42NjcgNzQuNjY3IDAgMCAxIDg0Mi42NjcgNzA0aC00NDhBNzQuNjY3IDc0LjY2NyAwIDAgMSAzMjAgNjI5LjMzM3YtNDQ4YTc0LjY2NyA3NC42NjcgMCAwIDEgNzQuNjY3LTc0LjY2NnptMCA2NEExMC42NjcgMTAuNjY3IDAgMCAwIDM4NCAxODEuMzMzdjQ0OEExMC42NjcgMTAuNjY3IDAgMCAwIDM5NC42NjcgNjQwaDQ0OGExMC42NjcgMTAuNjY3IDAgMCAwIDEwLjY2Ni0xMC42Njd2LTQ0OGExMC42NjcgMTAuNjY3IDAgMCAwLTEwLjY2Ni0xMC42NjZoLTQ0OHpNNjQwIDc2OGEzMiAzMiAwIDAgMSA2NCAwdjc0LjY2N2E3NC42NjcgNzQuNjY3IDAgMCAxLTc0LjY2NyA3NC42NjZoLTQ0OGE3NC42NjcgNzQuNjY3IDAgMCAxLTc0LjY2Ni03NC42NjZ2LTQ0OEE3NC42NjcgNzQuNjY3IDAgMCAxIDE4MS4zMzMgMzIwSDI1NmEzMiAzMiAwIDAgMSAwIDY0aC03NC42NjdhMTAuNjY3IDEwLjY2NyAwIDAgMC0xMC42NjYgMTAuNjY3djQ0OGExMC42NjcgMTAuNjY3IDAgMCAwIDEwLjY2NiAxMC42NjZoNDQ4QTEwLjY2NyAxMC42NjcgMCAwIDAgNjQwIDg0Mi42NjdWNzY4eiIvPjwvc3ZnPg==');
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
  background: no-repeat url($ui-asset-url + 'coupon/no-record.png');
  background-size: 80%;
  background-position: top center;
  position: relative;
  .btn {
    position: absolute;
    bottom: 0;
    left: calc(50% - 82.5px);
  }
  .empty-tips{
    text-align: center;
    padding-top: 270px;
    font-size: 12px;
    color: #999;
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
  .mb10{
    margin-bottom: 10px;
  }
  .order-no{
    color: #999;
    font-size: 12px;
    span{
      color: #333;
      font-size: 14px;
      font-weight: 500;
      margin-left: 10px;
    }
    .tag{
      margin-left: 0;
      margin-right: 5px;
      display: inline-block;
      line-height: 16px;
      padding: 0 5px;
      border-radius: 8px;
      background: #ff9c20;
      color: #fff;
      font-size: 10px;
    }
  }
  .order-time{
    font-size: 10px;
    color: #999;
    span{
      margin-left: 10px;
    }
  }
</style>
