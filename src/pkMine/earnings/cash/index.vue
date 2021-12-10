<template>
  <div class="cash">
    <div v-if="dataList.length > 0" class="list_box">
      <div
        class="list_item"
        :class="{ active: item.isChecked }"
        v-for="(item, index) in dataList"
        :key="index"
        @click="checkChange(index)"
      >
        <div class="list_name">
          <img class="name_icon" src="http://img.asset/personal/personal05.png" />
          {{item.type!=1? item.couponName:item.goodName }}
        </div>
        <div class="list_id">ID:{{ item.orderNumber }}</div>
        <div class="list_time">
          <span>下单时间</span>
          <span>{{ item.createTime }}</span>
        </div>
        <div class="list_info">
          <img class="info_img" :src="item.imgUrl" />
          <div>
            <div class="info_name">{{ item.goodName }}</div>
            <div class="info_text">
              <span>推荐人</span> {{ item._recommendUserName }}
              <div
                :class="{
                  name_level: true,
                  name_level1: item.recommendLevel == 1,
                  name_level2: item.recommendLevel == 2
                }"
              ></div>
            </div>
            <div class="info_text">
              <span>成交人</span>
              {{ item._buyUserName }}
            </div>
            <div class="info_text">
              <span>成交人电话</span>
              {{ item._buyUserPhone }}
            </div>
          </div>
        </div>
        <div class="list_state">
          <div class="state_num">
            收益金额
            <div>
              <span>￥</span>
              {{ item.preTaxAmount }}
            </div>
          </div>
          <div class="state_text">
            <!-- <span :class="{ state_text_r: index % 2 != 0, state_text_g: index % 2 == 0 }">
              {{ index % 2 != 0 ? '可结算' : '已结算' }}
            </span> -->
            <span class="state_text_r">可结算</span>
          </div>
        </div>
        <div class="list_item_btn" :class="{ list_item_btn_check: item.isChecked }"></div>
      </div>
    </div>
    <div v-else class="iist_not">
      <img src="http://img.asset/not_myActivite.png" />
    </div>
    <div class="total_box">
      <div class="total_all">
        <div
          v-if="dataList.length > 0"
          class="list_item_btn"
          :class="{ list_item_btn_check: checkAll }"
          @click="checkAllChange"
        ></div>
        <div v-else class="list_item_btn"></div>
        <span @click="checkAllChange">全选</span>
      </div>
      <div class="total_count">
        合计：
        <div>
          <span>￥</span>
          {{ amountTo }}
        </div>
      </div>
      <div class="total_submit">
        <div :class="{ disableBtn: checkOrderNumber < 1 }" @click="confirm">
          结算 ({{ checkOrderNumber }})
        </div>
      </div>
    </div>
    <!-- 添加银行卡弹框 -->
    <u-popup v-model="showBindCard" type="center">
      <div class="tips_inbox">
        <div>温馨提示</div>
        <div class="tips_text">结算功能需要绑定您的银行卡</div>
        <div class="tips_btnBox">
          <div class="tips_btn" @click.stop="addCard">去绑卡</div>
          <div class="tips_btn2" @click.stop="showBindCard = false">取消</div>
        </div>
      </div>
    </u-popup>
  </div>
</template>

<script>
export default {
  data() {
    return {
      withdrawType: 1, // 1==房产收益，2==其他收益
      dataList: [], // 订单数据
      checkList: [], // 选中订单
      minNum: 0, // 最小结算值
      maxNum: 0, // 最大结算值
      showBindCard: false // 展示绑定银行卡弹框
    }
  },
  computed: {
    // 选中订单金额统计
    amountTo() {
      let amount = this.dataList.reduce((total, item) => {
        if (item.isChecked) {
          total += new Number(item.preTaxAmount || 0)
        }
        return total
      }, 0)
      return parseFloat(amount.toFixed(2))
    },
    // 选中订单统计
    checkOrderNumber() {
      let isCheck = this.dataList.filter((item) => {
        return item.isChecked
      })
      return isCheck.length
    },
    // 全选选中状态
    checkAll() {
      let isCheck = this.dataList.filter((item) => {
        return !item.isChecked
      })
      return isCheck.length > 0 ? false : true
    }
  },
  onShow() {
    let param = this.$client.getParam() || {}
    this.withdrawType = param.withdrawType
    this.init()
  },
  methods: {
    // 初始化页面
    async init() {
      // 银行卡查询,用于绑定银行卡后的隐藏弹框
      let cardData = await this.$client.rpc(this.$api.BIND_LIST, {})
      if (cardData.data.rows.length > 0) {
        this.showBindCard = false
      }

      // 结算区间限制
      let setData = await this.$client.rpc(this.$api.QUERYSET, {})
      // console.log('setData', setData.data.rows)
      if (setData.data.success && setData.data.rows.length > 0) {
        // 后管设置了金额限制， 0为不限制提现金额
        this.minNum = new Number(setData.data.rows[0].availableWithdrawCount)
        this.maxNum = new Number(setData.data.rows[0].availableWithdrawUpperLimit)
      }

      let res = await this.$client.rpc(this.$api.DRAWORDER, {
        page: 1,
        pageSize: 1000,
        withdrawStatus: [1],
        isWithdrawAble: 1,
        withdrawType: this.withdrawType //提现类型
      })
      this.dataList = res.data.rows.map((item) => {
        item.orderVO.orderId = item.orderId
        item.orderVO.imgUrl = item.imgUrl
        item.orderVO.preTaxAmount = item.preTaxAmount.toFixed(2)
        item = item.orderVO
        item._recommendUserName = item.recommendUserName
          ? item.recommendUserName.slice(0, 1) +
            (item.recommendUserName.length > 2 ? '**' : '*')
          : '无'
        item._buyUserName = item.buyUserName
          ? item.buyUserName.slice(0, 1) + (item.buyUserName.length > 2 ? '**' : '*')
          : ''
        item._buyUserPhone = item.buyUserPhone
          ? item.buyUserPhone.slice(0, 3) +
            '****' +
            item.buyUserPhone.slice(item.buyUserPhone.length - 4)
          : ''
        return item
      })
      // console.log('当前参数值', res)
    },
    // 选中改变
    checkChange(i) {
      this.dataList = this.dataList.map((item, index) => {
        if (index == i) {
          item.isChecked = !item.isChecked
        }
        return item
      })
    },
    // 全选改变
    checkAllChange() {
      // 修改全选中状态
      this.dataList = this.dataList.map((item) => {
        item.isChecked = !this.checkAll
        return item
      })
    },
    // 结算点击
    async confirm() {
      // 未选择结算单
      if (this.checkOrderNumber < 1) {
        this.$client.toast('请选择结算的订单')
      } else {
        let { minNum, maxNum, amountTo } = this
        if (minNum !== 0 && amountTo < minNum) {
          // 提现最小限制
          this.$client.toast(`佣金满${minNum}元才可结算`)
          return
        }
        if (maxNum !== 0 && amountTo > maxNum) {
          // 没有提现最大限制
          this.$client.toast(`佣金最高可结算${maxNum}元`)
          return
        }

        // 实名校验
        if (this.$store.state.userInfo.verifiedStatus != 1) {
          this.$client
            .alert({
              content: '根据国家法律法规要求，结算需要您实名认证以便核实您的身份',
              showCancel: true,
              confirmText: '去认证'
            })
            .then(async (rt) => {
              if (rt) this.$client.singerReal()
              this.userInfo = await this.$client.getUserInfo('', true)
            })
          return
        }
        // 判断用户是否绑定银行卡
        let res = await this.$client.rpc(this.$api.BIND_LIST, {})
        if (res.data.rows.length < 1) {
          this.showBindCard = true
          return
        }

        // 过滤条件通过，跳转页面
        let data = this.dataList.filter((item) => {
          return item.isChecked
        })
        this.$client.pushWindow('./confirm', data)
      }
    },
    // 跳转绑定银行卡
    addCard() {
      this.$client.pushWindow('../../safety/bank/add')
    }
  }
}
</script>

<style lang="scss" scoped>
.cash {
  min-height: 100vh;
  padding-bottom: 80px;
  box-sizing: border-box;
  background-color: #f8f8f8;
  .list_box {
    height: 100%;
    padding: 15px;
    box-sizing: border-box;
    .list_item {
      position: relative;
      border-radius: 10px;
      border: 1px solid transparent;
      padding: 12px 10px;
      background-color: #fff;
      margin-bottom: 10px;
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
        padding-bottom: 20px;
      }
      .list_time {
        color: #999;
        font-size: 10px;
        span {
          padding-right: 10px;
        }
        padding-bottom: 10px;
      }
      .list_info {
        display: flex;
        border-bottom: 1px solid #f5f5f5;
        .info_img {
          width: 125px;
          height: 92px;
          border-radius: 5px;
        }
        & > div {
          flex: 1;
          padding-left: 15px;
          .info_name {
            font-size: 14px;
            color: #000;
            padding-bottom: 12px;
          }
          .info_text {
            font-size: 12px;
            color: #333;
            padding-bottom: 5px;
            span {
              font-size: 10px;
              color: #999;
              display: inline-block;
              padding-right: 10px;
            }
            .name_level {
              display: inline-block;
              width: 80px;
              height: 20px;
              border-radius: 18px;

              margin-left: 10px;
            }
            .name_level1 {
              background: url('http://img.asset/draw-cash/referre1.png') no-repeat;
              background-size: 100% 100%;
            }
            .name_level2 {
              background: url('http://img.asset/draw-cash/referre2.png') no-repeat;
              background-size: 100% 100%;
            }
          }
        }
      }
      .list_state {
        display: flex;
        padding-top: 10px;
        .state_num {
          flex: 1;
          font-size: 12px;
          color: #333;
          & > div {
            padding-left: 5px;
            display: inline-block;
            color: #e20000;
            font-size: 16px;
            span {
              font-size: 10px;
            }
          }
        }
        .state_text {
          font-size: 14px;
          .state_text_r {
            color: #e20000;
          }
          .state_text_g {
            color: #07962d;
          }
        }
      }
      .list_item_btn {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background-color: #d3d3d3;
        position: absolute;
        top: 50%;
        right: 10px;
        transform: translate(0, -50%);
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
    width: 100%;
    height: 60px;
    position: fixed;
    bottom: 0;
    left: 0;
    background-color: #fff;
  }
  .total_box {
    padding-bottom: 10px;
    display: flex;
    align-items: center;
    & > div {
      flex: 1;
      color: #333;
      font-size: 14px;
    }
    .total_all {
      display: flex;
      align-items: center;
      padding-left: 25px;
      & > div {
        width: 16px;
        height: 16px;
        background-color: #d3d3d3;
        border-radius: 50%;
        margin-right: 15px;
        display: inline-block;
      }
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
      }
      .disableBtn {
        background: #d3d3d3;
      }
    }
  }
  .list_item_btn_check {
    background: url('http://img.asset/selected_icon.png') no-repeat;
    background-size: 100% 100%;
  }
  .iist_not {
    text-align: center;
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
  .tips_btnBox {
    display: flex;
    justify-content: space-between;
  }
  .tips_btn {
    background-color: #f0c17b;
    width: 120px;
    height: 35px;
    border-radius: 35px;
    line-height: 35px;
    text-align: center;
    font-size: 14px;
    color: #fff;
  }
  .tips_btn2 {
    border: 1px solid #f0c17b;
    width: 120px;
    height: 35px;
    border-radius: 35px;
    line-height: 35px;
    text-align: center;
    font-size: 14px;
    color: #f0c17b;
  }
}
</style>
