<template>
  <div class="cash_detail">
    <div class="detail_info">
      <div class="detail_info_item detail_info_fw">
        <div>税后金额</div>
        <div v-if="propData.afterTaxAmount" style="font-size: 14px">
          ￥{{ propData.afterTaxAmount }}
        </div>
      </div>
      <div class="detail_info_item">
        <div>税前金额</div>
        <div v-if="propData.preTaxAmount">￥{{ propData.preTaxAmount }}</div>
      </div>
      <div class="detail_info_item">
        <div>发起时间</div>
        <div>{{ propData.createTime }}</div>
      </div>
      <div
        v-if="
          propData.withdrawBatchStatus == 1 ||
          propData.withdrawBatchStatus == 3 ||
          propData.withdrawBatchStatus == 4
        "
        class="detail_info_item"
      >
        <div>
          {{ propData.withdrawBatchStatus | manageTextFilter }}
        </div>
        <div>{{ propData.endTime }}</div>
      </div>
      <div class="detail_info_item">
        <div>结算流水号</div>
        <div>{{ propData.withdrawBatchNo }}</div>
      </div>
      <img class="iist_state" :src="propData.withdrawBatchStatus | statuImgFilter" />
    </div>
    <div class="detail_info2">
      <div class="detail_info2_item">
        <div>税费</div>
        <div>
          ￥{{
            (
              new Number(propData.tax || 0) + new Number(propData.platformFee || 0)
            ).toFixed(2)
          }}
        </div>
      </div>
      <div class="detail_info2_item">
        <div>实际到账</div>
        <div v-if="propData.afterTaxAmount">￥{{ propData.afterTaxAmount }}</div>
      </div>
      <div class="detail_info2_item">
        <div>到账账户</div>
        <div v-if="propData.bankName && propData.bankCardNo">
          {{ propData.bankName }}({{ propData.bankCardNo }})
        </div>
      </div>
    </div>
    <div class="list_box">
      <div v-if="listData.length > 0">
        <div class="list_title">结算订单</div>
        <div class="list_item" v-for="(item, index) in listData" :key="index">
          <div class="list_item_top">
            <div class="list_name">
              <img class="name_icon" src="http://img.asset/personal/personal05.png" />
              {{ item.type != 1 ? item.couponName : item.goodName }}
            </div>
            <div class="list_id">ID:{{ item.orderNumber }}</div>
          </div>
          <div class="list_item_btm">
            <div v-if="item.goodName" class="goods_name">
              {{ item.goodName }}
            </div>
            <div class="goods_time">
              <span>下单时间</span>
              {{ item.createTime }}
            </div>
            <div class="goods_price">
              <div>收益金额</div>
              <div v-if="item.preTaxAmount" class="goods_price_num">
                <span>￥</span>
                {{ item.preTaxAmount.toFixed(2) }}
              </div>
            </div>
          </div>
        </div>
        <div v-if="notMore" class="not_more">我是有底线的</div>
      </div>
      <div v-else>
        <div class="list_title">结算订单</div>
        <div class="iist_not">
          <img src="http://img.asset/not_myActivite.png" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  filters: {
    statuImgFilter(val) {
      let src = ''
      switch (val) {
        case 1:
          src = 'success'
          break
        case 2:
          src = 'pending'
          break
        case 3:
          src = 'success'
          break
        case 4:
          src = 'fail'
          break
        default:
          break
      }
      src = src ? `http://img.asset/draw-cash/draw_${src}.png` : ''
      return src
    },
    manageTextFilter(val) {
      let text = ''
      switch (val) {
        case 1:
          text = '到账时间'
          break
        case 3:
          text = '到账时间'
          break
        case 4:
          text = '失败时间'
          break
        default:
          break
      }
      return text
    }
  },
  data() {
    return {
      params: {
        withdrawBatchStatus: [],
        page: 1,
        pageSize: 10
      },
      propData: {},
      listData: [],
      notMore: false
    }
  },
  mounted() {
    this.propData = this.$client.getParam()
    this.params.withdrawBatchId = this.propData.id
    if(this.propData.withdrawBatchStatus==1||this.propData.withdrawBatchStatus==3){
      this.params.withdrawBatchStatus = [1,3]
    }else{
      this.params.withdrawBatchStatus = [this.propData.withdrawBatchStatus]
    }
    this.getList()
  },
  onPullDownRefresh() {
    this.getList(true)
    uni.stopPullDownRefresh()
  },
  onReachBottom(e) {
    this.getList()
  },
  methods: {
    async getList(isReset = false) {
      // 是否重置页码参数 isReset true-重置
      if (isReset) {
        this.notMore = false
        this.listData = []
        this.params.page = 1
      }
      if (this.notMore) return
      // 获取列表
      var { params, listData } = this
      let res = await this.$client.rpc(this.$api.DRAWORDERHISTORY, params)
      var list = res.data.rows
      if (isReset) {
        this.listData = list
      } else {
        this.listData = listData.concat(list)
      }
      if (this.listData.length == res.data.total) {
        this.notMore = true
      }
      if (list.length > 0) {
        this.params.page++
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.cash_detail {
  background-color: #f8f8f8;
  min-height: 100vh;
  padding: 15px;
  box-sizing: border-box;

  .detail_info {
    overflow: hidden;
    position: relative;
    background-color: #fff;
    border-radius: 10px;
    padding: 15px 53px 15px 10px;
    margin-bottom: 15px;
    & > div {
      display: flex;
      padding-bottom: 10px;
    }
    .detail_info_item {
      font-size: 12px;
      & > div:nth-child(1) {
        color: #999;
        padding-right: 10px;
        min-width: 60px;
      }
      & > div:nth-child(2) {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    .detail_info_fw {
      & > div:nth-child(1) {
        color: #333;
        font-size: 14px;
      }
    }
    .iist_state {
      position: absolute;
      width: 80px;
      height: 80px;
      top: 15px;
      right: 15px;
    }
  }
  .detail_info2 {
    overflow: hidden;
    position: relative;
    background-color: #fff;
    border-radius: 10px;
    padding: 15px 10px;
    margin-bottom: 15px;
    & > div {
      display: flex;
      padding-bottom: 15px;
    }
    .detail_info2_item {
      font-size: 12px;
      display: flex;
      & > div:nth-child(1) {
        color: #999;
        padding-right: 10px;
        min-width: 60px;
      }
      & > div:nth-child(2) {
        flex: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        text-align: right;
      }
    }
    .detail_info2_item:nth-last-child(1) {
      padding-bottom: 0;
    }
  }
  .list_box {
    height: 100%;
    box-sizing: border-box;
    .list_title {
      font-size: 16px;
      color: #333;
      padding: 10px 0 15px 10px;
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
  .not_more {
    margin: 0 14px;
    border-top: 1px solid #ededed;
    color: #d1d1d1;
    font-size: 12px;
    text-align: center;
    padding: 13px 0;
  }
}
</style>
