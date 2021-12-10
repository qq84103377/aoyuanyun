<template>
  <div class="cash_box">
    <div class="cash_tabs">
      <div
        :class="{
          cash_tabs_item: true,
          choose: params.withdrawBatchStatus == item.code
        }"
        v-for="item in tabsData"
        :key="item.code"
        @click="tabsChange(item.code)"
      >
        <div>{{ item.name }}</div>
      </div>
    </div>
    <div v-if="listData.length > 0" class="cash_list">
      <div
        class="cash_list_item"
        v-for="(item, index) in listData"
        :key="index"
        @click="toDetail(item)"
      >
        <div class="list_info_item list_info_fw">
          <div>税后金额</div>
          <div v-show="item.afterTaxAmount">￥{{ item.afterTaxAmount }}</div>
        </div>
        <div class="list_info_item">
          <div>税前金额</div>
          <div v-show="item.preTaxAmount">￥{{ item.preTaxAmount }}</div>
        </div>
        <div class="list_info_item">
          <div>发起时间</div>
          <div>{{ item.createTime }}</div>
        </div>
        <div
          v-if="
            item.withdrawBatchStatus == 1 ||
            item.withdrawBatchStatus == 3 ||
            item.withdrawBatchStatus == 4
          "
          class="list_info_item"
        >
          <div>
            {{ item.withdrawBatchStatus | manageTextFilter }}
          </div>
          <div>{{ item.endTime }}</div>
        </div>
        <div class="list_info_item">
          <div>结算流水号</div>
          <div>{{ item.withdrawBatchNo }}</div>
        </div>
        <img class="iist_icon" src="http://img.asset/invite/icon_l.png" />
        <img class="iist_state" :src="item.withdrawBatchStatus | statuImgFilter" />
      </div>
      <div v-if="notMore" class="not_more">我是有底线的</div>
    </div>
    <div v-else class="iist_not">
      <div v-if="!params.withdrawBatchStatus" class="not_more">暂无结算记录~</div>
      <div v-if="params.withdrawBatchStatus == 1" class="not_more">暂无已结算记录~</div>
      <div v-if="params.withdrawBatchStatus == 2" class="not_more">暂无审核中记录~</div>
      <div v-if="params.withdrawBatchStatus == 4" class="not_more">暂无结算失败记录~</div>
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
      belongTyep: {
        0: '审核中',
        1: '有效',
        2: '无效'
      },
      notMore: false,
      params: {
        withdrawBatchStatus: '',
        page: 1,
        pageSize: 10
      },
      tabsData: [
        {
          name: '全部',
          code: ''
        },
        {
          name: '已结算',
          code: '1'
        },
        {
          name: '审核中',
          code: '2'
        },
        {
          name: '结算失败',
          code: '4'
        } // tabs数据 code--空、全部，1、已结算，2、审核中，4、结算失败
      ],
      listData: []
    }
  },
  onShow() {
    this.getList(true)
  },
  onPullDownRefresh() {
    this.getList(true)
    uni.stopPullDownRefresh()
  },
  onReachBottom() {
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
      let res = await this.$client.rpc(this.$api.DRAW_LIST, params)
      // 处理返回数据格式
      var list = res.data.rows.map((item) => {
        item.afterTaxAmount = item.afterTaxAmount.toFixed(2)
        item.preTaxAmount = item.preTaxAmount.toFixed(2)
        // item.createTime = this.formatTime(item.createTime)
        // item.endTime = this.formatTime(item.endTime)
        item.tax = item.tax.toFixed(2)
        item.bankCardNo = item.bankCardNo.slice(item.bankCardNo.length - 4)
        return item
      })
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
    },
    tabsChange(key) {
      // tabs事件
      this.params.withdrawBatchStatus = key
      this.getList(true)
    },
    toDetail(item) {
      // 跳详情
      this.$client.pushWindow('./detail', item)
    },
    // // 格式化时间
    // formatTime(time) {
    //   if (!time) return
    //   let date = new Date(time)
    //   let year = date.getFullYear()
    //   let month = date.getMonth() + 1
    //   month = month > 9 ? month : '0' + month
    //   let day = date.getDate()
    //   day = day > 9 ? day : '0' + day
    //   let hour = date.getHours()
    //   hour = hour > 9 ? hour : '0' + hour
    //   let minute = date.getMinutes()
    //   minute = minute > 9 ? minute : '0' + minute
    //   let second = date.getSeconds()
    //   second = second > 9 ? second : '0' + second
    //   return `${year}/${month}/${day} ${hour}:${minute}:${second}`
    // }
  }
}
</script>

<style lang="scss" scoped>
.cash_box {
  background-color: #f8f8f8;
  min-height: 100vh;
  padding-top: 48px;
  box-sizing: border-box;
  .cash_tabs {
    position: fixed;
    width: 100%;
    top: 0;
    z-index: 9;
    box-sizing: border-box;
    background-color: #fff;
    font-size: 14px;
    display: flex;
    justify-content: space-between;
    padding: 15px 20px 0;
    .cash_tabs_item {
      text-align: center;
      color: #999;
      padding-bottom: 14px;
      span {
        font-size: 10px;
      }
      p {
        font-size: 12px;
      }
    }
    .choose {
      position: relative;
      font-weight: 600;
      color: #333;
      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translate(-50%);
        background-color: #f0c17b;
        width: 20px;
        height: 4px;
        border-radius: 4px;
      }
    }
  }
  .cash_list {
    padding: 15px;
    .cash_list_item {
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
      .list_info_item {
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
      .list_info_fw {
        & > div:nth-child(1) {
          color: #333;
          font-size: 14px;
        }
      }
      .iist_icon {
        width: 13px;
        height: 13px;
        position: absolute;
        right: 20px;
        top: 50%;
        transform: translate(0, -50%);
      }
      .iist_state {
        position: absolute;
        width: 80px;
        height: 80px;
        top: -10px;
        right: -10px;
      }
    }
    .cash_list_item:nth-last-child(1) {
      margin-bottom: 0;
    }
    .cash_list_item:hover {
      background: #f5f5f5;
    }
  }
  .iist_not {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
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
