
<template>
  <div class="pages_coupon">
    <!-- 卡包 -->
    <div
      class="cardbag-list-content" @click.stop="showCardbackDetail(item)"
      v-for="(item, index) in mainItems"
      :key="index"
      :style="{
        'background-image': `url(${
          item.imgUrl || ''
        })`,
      }"
    >
      <div class="cardbag-list-content-top">
        <div class="cardbag-list-title">{{ item.name }}</div>
        <div class="cardbag-list-time">
          可领取时间：{{ item.enableStartTime||'' }}
          <span v-if="item.enableStartTime">-</span>
          {{ item.enableEndTime || "长期" }}
        </div>
      </div>
      <div class="cardbag-list-content-bottom">
        <div
          class="gotoUser"
          v-if="item.useStatus == 0"
          @click.stop="getReceiveCoupon(item)"
        >
          立即领取
        </div>
        <div
          class="gotoUser"
          style="color:#D3D3D3; border:none"
          v-else-if="item.useStatus == -1"
        >
          已抢光
        </div>
        <div
          class="gotoUser"
          style="color: #d3d3d3; border: none"
          v-else-if="item.useStatus == 2"
        >
          今天已抢光
        </div>

        <div class="gotoUser" v-else @click.stop="showCardbackuser(item, true)">
          去使用
        </div>
        <div class="goto-right">
          <span>查看详情</span>
          <img class="gotoicon" src="http://img.asset/goto.png" />
        </div>
      </div>
    </div>

    <div class="loading">{{ contentText }}</div>
    <div class="no-record" v-if="!mainItems.length && !mainItems.length"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 参数
      pager: {
        page: 1,
        pageSize: 10,
        enableTime: "",
        cardPackStatus: 1,
        publishType: 1
      },
      // CouponType: {
      //   1: '抵扣券',
      //   2: '折扣券',
      //   3: '奖品券'
      // },
      mainItems: [],
      constants: {},
      flag: false,
      contentText: "",
    };
  },
  onLoad() {
    this.getListcardbag();
    uni.startPullDownRefresh(); //开始下拉刷新
  },
  onShow(){
      // this.getListcardbag();

  },

  onPullDownRefresh() {
    this.pager.page = 1;
    this.getListcardbag();
    uni.stopPullDownRefresh(); //停止当前页面下拉刷新
  },
  // 上拉加载
  onReachBottom() {
    uni.showNavigationBarLoading();
    // console.log("reach");
    this.pager.page++;
    this.getListcardbag();
    uni.hideNavigationBarLoading();
  },
  methods: {
    // onPullDownRefresh() {
    //   // 停止下拉刷新，回弹问题
    //   this.$client.stopPullDownRefresh();
    // },
    // 列表数据的数据
    async getListcardbag() {
      this.pager.enableTime = this.$tools.date2Str(
        new Date(),
        "YYYY-MM-DD hh:mm:ss"
      );
      let res = await this.$client.rpc(this.$api.CARDBAG_LIST, this.pager);
      if (res.data.rows.length == 0) {
        this.contentText = "真的没有更多啦~";
        // uni.showToast({ title: "没有更多数据了", icon: "none" });
      }
	  if(this.pager.page == 1 && res.data.rows.length <= this.pager.pageSize){
		  this.contentText = "真的没有更多啦~";
	  }
      res.data.rows.forEach(item => {
        item.enableStartTime = this.date2Str(item.enableStartTime, 'YYYY/MM/DD');
        item.enableEndTime = this.date2Str(item.enableEndTime, 'YYYY/MM/DD');
      });
      if (this.pager.page != 1) {
        this.mainItems = this.mainItems.concat(res.data.rows);
      } else {
        this.mainItems = res.data.rows;
      }
    },

    // 卡包领取
    async getReceiveCoupon(item) {
      let { data } = await this.$client.rpc(this.$api.CARDBAG_GET_RECEIVE, {
        cardPackId: item.id,
        cardPackName: item.name,
      });
      setTimeout(() => {
        if (data.success) {
          this.$client.toast("已领取");
          // console.log('优惠券已领取')
          this.$emit("onRefresh");
          // item.useStatus = 1
          this.pager.page = 1;
          this.getListcardbag(); //再次刷新列表
        } else {
          // console.log("卡包领取失败", data);
        }
      }, 500);
      
    },
    // 去使用
    showCardbackuser(item, isShowQRCode = "") {
      console.log(item);
      // 如果是1 直接跳 腾讯 h5
    
        if (item.type == 1 ){
          if(item.ipAssetVO.awardDetail){
            this.$client.pushWindow(
            '/pages/webView/webView?url=' +
              encodeURIComponent(item.ipAssetVO.awardDetail)
            )
          }else{
            this.$client.pushWindow("/pkMine/cardbag/cardbagdetail/index", {
              id: item.id,
            });
          }
        } else {
          this.$client.pushWindow("/pkCoupon/cardbagdetails/index", {
            id: item.id,
            isShowQRCode,
          });
        }
    },
    // 去详情
    showCardbackDetail(item){
        this.$client.pushWindow("/pkCoupon/cardbagdetails/index", {
            id: item.id,
          });

    },
    // 时间格式的转化---年月日
    date2Str(date, format) {
      return this.$tools.str2DateStr(date, format);
    },
  },
};
</script>
<style >
page {
  background-color: #f8f8f8 !important;
  min-height: 100vh !important;
}
</style>
<style lang="scss">
@import "./index.scss";
</style>