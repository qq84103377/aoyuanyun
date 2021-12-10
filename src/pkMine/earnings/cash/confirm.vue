<template>
  <div class="confirm">
    <div class="confirm_info">
      <div class="info_item">
        <div>税前</div>
        <div>￥{{ amountTo || '0.00' }}</div>
      </div>
      <div class="info_item">
        <div>预计到账</div>
        <div>￥{{ pay.afterTaxAmount || '0.00' }}</div>
      </div>
      <div class="info_item">
        <div>税费({{ pay.taxRate || 0 }}%)</div>
        <div>￥{{ pay.total || '0.00' }}</div>
      </div>
      <div class="info_item">
        <div>到账银行</div>
        <div v-if="cardList.length > 0" @click="showSelects">
          {{ queryData.bankName }}({{
            queryData.bankCard.slice(queryData.bankCard.length - 4)
          }})
          <img
            class="jt"
            :class="{
              jtShow: showSelect
            }"
            src="http://img.asset/jt.png"
          />
        </div>
        <!-- <div v-else @click="addCard">添加银行卡</div> -->
      </div>
      <div class="cardListBox" :style="showSelect ? 'height:' + cardHeight + 'px' : ''">
        <div id="cardRef">
          <div v-for="(item, index) in cardList" class="info_item" :key="index">
            <div></div>
            <div style="padding-right: 24px" @click="cardSelect(item)">
              {{ item.bankName }}({{ item.bankCard.slice(item.bankCard.length - 4) }})
            </div>
          </div>
          <!-- <div class="info_item">
            <div></div>
            <div v-if="cardList.length < 5" style="padding-right: 24px" @click="addCard">
              添加银行卡
            </div>
          </div> -->
        </div>
      </div>
    </div>
    <div class="list_box">
      <div class="list_title">结算订单</div>
      <div class="list_item" v-for="(item, index) in orderList" :key="index">
        <div class="list_item_top">
          <div class="list_name">
            <img class="name_icon" src="http://img.asset/personal/personal05.png" />
            {{item.type!=1? item.couponName:item.goodName }}
          </div>
          <div class="list_id">ID:{{ item.orderNumber }}</div>
        </div>
        <div class="list_item_btm">
          <div class="goods_name">{{ item.goodName }}</div>
          <div class="goods_time">
            <span>下单时间</span>
            {{ item.createTime }}
          </div>
          <div class="goods_price">
            <div>收益金额</div>
            <div class="goods_price_num">
              <span>￥</span>
              {{ item.preTaxAmount }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="total_box">
      <div>
        <div class="total_text">
          <div class="total_all">共 {{ orderList.length }} 个订单</div>
          <div class="total_count">
            合计：
            <div>
              <span>￥</span>
              {{ amountTo || '0.00' }}
            </div>
          </div>
        </div>
        <div class="total_agreen">
          <div class="btn" :class="{ btn_act: isAgree }" @click="agreenClick"></div>
          我已阅读并同意
          <div style="color: #f0c17b" @click="showAgreen = true">《结算协议》</div>
        </div>
      </div>
      <div class="total_submit">
        <div
          :class="{
            disableBtn: !isAgree
          }"
          @click="confirmDraw"
        >
          确认结算
        </div>
      </div>
    </div>
    <!-- 结算协议 -->
    <u-popup v-model="showAgreen" :mask="true">
      <div class="popup-container">
        <div class="content">
          <rich-text :nodes="agreenContent"></rich-text>
        </div>
        <div class="footer">
          <div class="btn btn-to-use" @click="showAgreen = false">关闭</div>
        </div>
      </div>
    </u-popup>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cardHeight: 0, // 银行卡渲染高度
      showSelect: false, // 选择银行卡下拉
      cardList: [], // 银行卡数据
      orderList: [], // 订单数据
      queryData: {},
      pay: {
        taxRate: '', // 税率
        tax: 0, // 税费
        afterTaxAmount: '' // 实际到账
      },
      showAgreen: false, // 展示协议弹框
      isAgree: false, // 是否同意结算协议
      agreenContent: '' // 用户协议内容
    }
  },
  computed: {
    // 选中订单金额统计
    amountTo() {
      let amount = this.orderList.reduce((total, item) => {
        total += new Number(item.preTaxAmount || 0)
        return total
      }, 0)
      return amount.toFixed(2)
    }
  },
  onShow() {
    this.init()
  },
  async created() {
    this.orderList = this.$client.getParam()
    let { data } = await this.$client.rpc(this.$api.INTERBANKAGREE, {})
    if (data.success && data.data.status == 1) {
      this.agreenContent = data.data.agreement
    }
  },
  methods: {
    async init() {
      let res = await this.$client.rpc(this.$api.BIND_LIST, {})
      this.cardList = res.data.rows
      this.queryData =
        res.data.rows.length > 0
          ? res.data.rows.find((item) => {
              return item.cardDefault == 1
            })
          : {}
      // 查询银行卡渲染高度，用于加载动画
      this.$nextTick(() => {
        uni
          .createSelectorQuery()
          .in(this)
          .select('#cardRef')
          .boundingClientRect((data) => {
            this.cardHeight = data.height || 100
          })
          .exec()
      })
      // 计算实际到账
      let res2 = await this.$client.rpc(this.$api.COMPUTEDTAX, {
        preTaxAmount: this.amountTo
      })
      res2 = res2.data.data
      res2.total =
        new Number((res2.tax || 0).toFixed(2)) +
        new Number((res2.platFormFee || 0).toFixed(2))
      res2.taxRate = res2.taxRate || 0
      res2.afterTaxAmount = (res2.afterTaxAmount || 0).toFixed(2)

      Object.assign(this.pay, res2)
      // console.log('===', this.pay)
    },
    // 展示下拉银行卡
    showSelects() {
      this.showSelect = !this.showSelect
    },
    // 银行卡选中点击
    cardSelect(item) {
      // console.log('点击', item)
      this.queryData = item
      this.showSelect = false
    },
    // 添加银行卡跳转
    addCard() {
      this.$client.pushWindow('../../safety/bank/add')
    },
    // 勾选结算协议
    agreenClick() {
      this.isAgree = !this.isAgree
    },
    // 确认结算
    async confirmDraw() {
      console.log('-=-', this.$store.state.userInfo)
      // 没有勾选协议
      if (!this.isAgree) {
        return
      }
      if (!this.queryData.bankCard) {
        // 没有绑定卡片
        this.$client.toast('请选择到账银行卡')
        return
      }
      let orderIds = this.orderList.map((item) => {
        let obj = item.orderId
        return obj
      })
      let res = await this.$client.rpc(this.$api.DRAWCONFIRM, {
        orderIds,
        bankCardNo: this.queryData.bankCard,
        page: 1,
        pageSize: 1000
      })
      if (!res.data.success) {
        return
      }

      // 更新用户网银结算协议签约时间
      this.$client.rpc(this.$api.UPDATEINTERBANK, {
        name: this.$store.state.userInfo.name,
        idNumber: this.$store.state.userInfo.certificateVos[0].certificateNumber
      })

      this.$client.pushWindow(
        './result',
        {
          ...this.pay,
          ...this.queryData,
          preTaxAmount: this.amountTo
        },
        { redirect: true }
      )
    }
  }
}
</script>

<style lang="scss" scoped>
.confirm {
  min-height: 100vh;
  padding-bottom: 80px;
  box-sizing: border-box;
  background-color: #f8f8f8;
  .confirm_info {
    background-color: #fff;
    padding: 15px 25px;
    .info_item {
      font-size: 14px;
      color: #333;
      display: flex;
      padding-bottom: 15px;
      & > div:nth-child(1) {
        flex: 1;
        color: #999;
      }
      & > div:nth-child(2) {
        flex: 1;
        text-align: right;
      }
    }
    .info_item:nth-last-child(1) {
      padding-bottom: 0;
    }
    .jt {
      width: 16px;
      height: 16px;
      vertical-align: middle;
      margin-left: 8px;
      transition: all 0.3s;
    }
    .jtShow {
      transform: rotateZ(180deg);
    }
    .cardListBox {
      transition: all 0.3s;
      height: 0;
      overflow: hidden;
    }
  }
  .list_box {
    height: 100%;
    padding: 15px;
    box-sizing: border-box;
    .list_title {
      font-size: 16px;
      color: #333;
      padding: 0 0 15px 10px;
    }
    .list_item {
      background-color: #fff;
      border-radius: 10px;
      padding: 15px 10px;
      margin-bottom: 10px;
      .list_item_top {
        border-bottom: 1px solid #f5f5f5;
        .list_name {
          font-size: 12px;
          color: #333;
          padding-bottom: 5px;
          .name_icon {
            vertical-align: sub;
            width: 16px;
            height: 16px;
          }
        }
        .list_id {
          font-size: 10px;
          color: #999;
          padding-bottom: 10px;
        }
      }
      .list_item_btm {
        padding-top: 10px;
        .goods_name {
          font-size: 14px;
          color: #000;
          padding-bottom: 13px;
        }
        .goods_time {
          font-size: 10px;
          color: #999;
          padding-bottom: 10px;
          span {
            display: inline-block;
            padding-right: 10px;
          }
        }
        .goods_price {
          div {
            display: inline-block;
            font-size: 10px;
            color: #999;
            padding-right: 10px;
          }
          .goods_price_num {
            color: #e20000;
            font-size: 16px;
            span {
              font-size: 10px;
            }
          }
        }
      }
    }
    .list_item:nth-last-child(1) {
      margin: 0;
    }
    .active {
      border: 1px solid #f0c17b;
    }
  }
  .total_box {
    position: fixed;
    bottom: 0;
    left: 0;
    display: flex;
    align-items: center;
    width: 100%;
    height: 60px;
    background-color: #fff;
    padding-bottom: 10px;
    & > div {
      flex-shrink: 0;
      color: #333;
      font-size: 14px;
    }
    & > div:first-child {
      flex-grow: 1;
    }
    .total_text {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-right: 10px;
      margin-bottom: 4px;
    }
    .total_agreen {
      display: flex;
      align-items: center;
      font-size: 12px;
      color: #666;
      padding-left: 26px;
      .btn {
        width: 16px;
        height: 16px;
        border-radius: 4px;
        background-color: #d3d3d3;
        margin-right: 4px;
      }
      .btn_act {
        background: url('http://img.asset/selected_icon.png') no-repeat;
        background-size: 100% 100%;
      }
    }
    .total_all {
      padding-left: 26px;
      font-size: 14px;
      color: #333;
    }
    .total_count {
      color: #333;
      & > div {
        color: #e20000;
        display: inline-block;
        font-size: 16px;
        span {
          font-size: 12px;
        }
      }
    }
    .total_submit {
      & > div {
        width: 110px;
        height: 40px;
        background: linear-gradient(297deg, #f0c17b 0%, #fadbad 100%);
        border-radius: 20px;
        color: #fff;
        font-size: 16px;
        text-align: center;
        line-height: 40px;
        margin-right: 6px;
      }
      .disableBtn {
        background: #d3d3d3;
      }
    }
  }
  .popup-container {
    display: flex;
    flex-direction: column;
    width: 300px;
    height: 350px;
    padding: 20px;
    border-radius: 10px;
    background-color: #fff;
    .content {
      flex-grow: 1;
      overflow: hidden;
    }
    .footer {
      padding-top: 20px;
      display: flex;
      justify-content: center;
    }

    .btn {
      flex-shrink: 0;
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
  }
}
</style>
