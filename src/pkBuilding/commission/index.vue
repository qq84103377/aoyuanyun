<template>
  <div class="myCommission">
    <!-- 佣金总额 -->
    <div class="myCommission-img">
      <div
        class="myCommission-total"
        :style="{ 'background-image': `url(${tmpImg})` }"
      >
        <p class="total-330000">{{ commissiontotal|| 0 }}</p>
        <p class="total-company">佣金总额(元)</p>
      </div>
    </div>
    <div class="box">
      <div class="total-300000-30000">
        <div class="total-300000-item">
          <p class="received-300000">{{Receivedcommissiontotal|| 0}}</p>
          <p class="received">已收佣金(元)</p>
        </div>
        <div class="total-30000-item">
          <p class="tobereceived-30000">{{notReceivedcommissiontotal|| 0}}</p>
          <p class="tobereceived">未收佣金(元)</p>
        </div>
      </div>
      <div class="line"></div>
      <!-- 已发佣金与代发佣金来回切换 -->
      <div class="end-title">
        　　
        <div @tap="change(0)" :class="{ btna: btnnum == 0 }">已发放佣金</div>
        　
        <div @tap="change(1)" :class="{ btna: btnnum == 1 }">待发放佣金</div>
        　　
      </div>
    </div>
    <div class="end-cont" :class="{ dis: btnnum == 0 }">
      <div
        class="end-cont-commios"
        v-for="(item, index) in commissionList"
        :key="index"
      >
        <div class="commission-item">
          <span>{{ item.cst_name }} &nbsp;{{ item.mobile_tels }}</span>
          <span style="color: #07962d">已发放</span>
        </div>
        <div class="commission-item" style="color: #999999">
          <span>签约项目</span>
          <span>{{ item.project_name }}</span>
        </div>
        <div class="commission-item" style="color: #999999">
          <span>签约时间</span>
          <span>{{ item.create_time }}</span>
        </div>
        <div class="commission-item">
          <span>佣金奖励</span>
          <span style="color: #e20000">￥{{ commissiontotal }}</span>
        </div>
      </div>
      <div class="iist_not" v-if="commissionList.length == 0">
        <img src="http://img.asset/not_myActivite.png">
      </div>
    </div>
    <div class="end-cont" :class="{ dis: btnnum == 1 }">
      <div
        class="end-cont-commios"
        v-for="(item, index) in notcommissionList"
        :key="index"
      >
        <div class="commission-item">
          <span>{{ item.cst_name }} &nbsp;{{ item.mobile_tels }}</span>
          <span style="color: #f0c17b">待发放</span>
        </div>

        <div class="commission-item" style="color: #999999">
          <span>签约项目</span>
          <span>{{ item.project_name }}</span>
        </div>
        <div class="commission-item" style="color: #999999">
          <span>签约时间</span>
          <span>{{ item.create_time }}</span>
        </div>
        <div class="commission-item">
          <span>佣金奖励</span>
          <span style="color: #e20000">{{ notcommissiontotal }}</span>
        </div>
      </div>
      <div class="iist_not" v-if="notcommissionList.length == 0">
        <img src="http://img.asset/not_myActivite.png">
      </div>
    </div>
    <div v-if="isUpNoMore" class="upwarp-nodata">真的没有更多啦~</div>
  </div>
</template>

<script>
import apis from "@/apis";
export default {
  data() {
    return {
      tmpImg: "http://img.asset/Card-bag/commios.png",
      btnnum: 0, //默认Tab
      commissionList: [], //已发放佣金列表
      notcommissionList: [], //待发放佣金列表
      commissiontotal: "", //总额
      notcommissiontotal: "", //总额
      isNotData: false,
      isUpNoMore: false,
      isGet: false,
      page: 1,
      Receivedcommissiontotal:'',
      notReceivedcommissiontotal:''
    };
  },
  onShow() {
    this.getMycommission();
    this.notgetMycommission();
  },
  onReachBottom() {
    if (this.isGet) {
      // 正在获取数据
      return;
    }
    this.getMycommission();
    this.notgetMycommission();
  },
  methods: {
    // 切换待发已发
    change(e) {
      this.btnnum = e;
      // console.log(this.btnnum);
    },
    //已发放列表数据
    async getMycommission() {
      var { page, commissionList } = this;
      this.isGet = true;
      let { data } = await this.$client.rpc(apis.GET_FIND_GETDEALLIST, {
        page, //页码
        size: 5, //每页条数 ,
        status: 1, //佣金状态
      });
      // 上拉刷新下一页
        if (page > 1) {
          this.isUpNoMore = true;
        } else {
          this.isNotData = true;
        }
      if (page == 1) {
        this.$set(this, "commissionList", data.data.list);
        this.commissiontotal = data.data.offeredAmount;
      } else {
        this.commissionList = commissionList.concat(data.data.list);
      }
      this.page = page + 1;
      this.isGet = false;
    },
    //待发放列表数据
    async notgetMycommission() {
      let { data } = await this.$client.rpc(apis.GET_FIND_GETDEALLIST, {
        page: 1, //页码
        size: 5, //每页条数 ,
        status: 2, //佣金状态
      });
      this.$set(this, "notcommissionList", data.data.list);
      this.notcommissiontotal = data.data.offeredAmount;
      this.Receivedcommissiontotal = data.data.offeredAmount;
      this.notReceivedcommissiontotal = data.data.total;
    },
  },
};
</script>

<style lang="scss" scoped>
.myCommission {
  background-color: #f8f8f8;
  .myCommission-img {
    padding: 15px 15px 0 15px;
    .myCommission-total {
      height: 131px;
      background-size: 100%;
      background-repeat: no-repeat;
      .total-330000 {
        font-size: 30px;
        color: #fff;
        font-weight: 900;
        text-align: center;
        padding-top: 60rpx;
      }
      .total-company {
        font-size: 14px;
        color: #fff;
        padding: 10px 132px;
      }
    }
  }
  .box {
    width: 100%;
    background-color: #fff;
    box-shadow: 0px -3px 10px 0px rgba(0, 0, 0, 0.1);
    .total-300000-30000 {
      display: flex;
      justify-content: space-around;
      background-color: #fff;

      .total-300000-item {
        text-align: center;
        padding-top: 21px;
        .received-300000 {
          font-size: 24px;
          color: #000;
          font-weight: 900;
        }
        .received {
          font-size: 14px;
          color: #f0c17b;
          padding-top: 10px;
        }
      }
      .total-30000-item {
        padding-top: 21px;
        .tobereceived-30000 {
          font-size: 24px;
          color: #000;
          font-weight: 900;
          text-align: center;
        }
        .tobereceived {
          font-size: 14px;
          color: #f0c17b;
          padding-top: 10px;
          padding-left: 10px;
        }
      }
    }
    .line {
      width: 345px;
      border: 1px solid #f3f3f3;
      margin-top: 20px;
      transform: scale(1, -0.5);
    }
    .end-title {
      display: flex;
      justify-content: space-around;
      padding: 40px 0 15px;

      // background-color: #fff;
      // box-shadow: 0px -3px 10px 0px rgba(0, 0, 0, 0.1);
    }
  }
  .end-title div {
    text-align: center;
  }
  .end-cont {
    // margin-top: 10px;
    display: none;
    margin-top: 15px;
    .end-cont-commios {
      // height: 146px;
      margin: 15px;
      background: #fff;
      padding: 20px;
      .commission-item {
        padding-top: 10px;
        display: flex;
        justify-content: space-between;
      }
      .commission-item:nth-child(1) {
        padding-top: 0;
      }
      .commission-item:nth-child(2) {
        word-wrap: break-word;
        word-break: normal;
      }
    }
  }
  .btna {
    position: relative;
    &::after {
      content: "";
      position: absolute;
      height: 4px;
      width: 20px;
      bottom: -10px;
      left: 50%;
      transform: translate(-50%);
      background-color: #f0c17b;
      border-radius: 2px;
    }

    // border-bottom: 4px solid #f0c17b;
  }
  .dis {
    display: block;
  }
  .iist_not {
    text-align: center;
  }
  .upwarp-nodata{
    text-align: center;
  }
}
</style>
