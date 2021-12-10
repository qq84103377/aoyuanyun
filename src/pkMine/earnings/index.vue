<template>
  <div class="earnings">
    <div class="main_header">
      <div class="money_box">
        <div class="money_count">{{numFormat(walletData.totalCommission)}}</div>
        <div class='tips'>
          <span>总收益(元)</span>
          <img @click="setTips" style="width: 15px;height: 15px;margin-left: 10px;margin-top: 4px;"
            src="@/static/tips-icon.png" />
        </div>
        <div class="money_btn" @tap="showPopup">立即结算</div>
        <div class="money_record" @click="gotoWithdrawalrecord()">结算记录></div>
      </div>
      <div class="money_handle">
        <div class="money_handle_item">
          <div>{{numFormat(walletData.ableWithdrawCount)}}</div>
          <span>可结算</span>
        </div>
        <div class="money_handle_item">
          <div>{{numFormat(walletData.withdrawCount)}}</div>
          <span>已结算</span>
        </div>
      </div>
    </div>
    <div class="tabs_box">
      <div class="tabs">
        <div :class="{selected:tabIndex==1}" @tap="changTab(1)">房产收益</div>
        <div :class="{selected:tabIndex==2}" @tap="changTab(2)">其他收益</div>
      </div>
    </div>
    <div class="list_tabs">
      <div :class="{selected:listTabIndex==0}" @tap="listTab(0)">全部</div>
      <div :class="{selected:listTabIndex==1}" @tap="listTab(1)">可结算</div>
      <div :class="{selected:listTabIndex==2}" @tap="listTab(2)">已结算</div>
    </div>
    <div class="list_box">
      <div class="list_item" v-for="(item,index) in listData" :key="index">
        <div class="list_name">
          <img class="name_icon" src="http://img.asset/personal/personal05.png" />
          {{item.orderVO.type!=1?item.orderVO.couponName:item.orderVO.goodName}}
        </div>
        <div class="list_id">ID:{{item.orderVO.orderNumber}}</div>
        <div class="list_time">
          <span>下单时间</span>
          <span>{{item.orderVO.createTime}}</span>
        </div>
        <div class="list_info">
          <img class="info_img" :src="item.imgUrl ? item.imgUrl : 'http://img.asset/aa3.png'" />
          <div>
            <div class="info_name">{{item.orderVO.goodName}}</div>
            <div class="info_text"><span>推荐人</span>{{item.orderVO.recommendUserName || '无'}}
              <image v-if="item.orderVO.recommendUserName" class="name_level"
                :src="item.recommendLevel == 1 ? 'http://img.asset/personal/personal07.png' : 'http://img.asset/personal/personal03.png'"
                mode=""></image>
            </div>
            <div class="info_text"><span>成交人</span>{{item.orderVO.buyUserName || ''}}</div>
            <div class="info_text"><span>成交人电话</span>{{formatData(item.orderVO.buyUserPhone)}}</div>
          </div>
        </div>
        <div class="list_state">
          <div class="state_num">
            收益金额
            <div> <span>￥</span>{{item.preTaxAmount}}</div>
          </div>
          <div class="state_text">
            <span
              :class="item.withdrawStatus == 1 ? 'state_text_r' : 'state_text_g'">{{item.withdrawStatus == 1 ? '可结算' : item.withdrawStatus == 2 ? '结算中' : item.withdrawStatus == 3 ? '已结算' : ''}}</span>
            <!-- <span class="state_text_g" v-if="item.state == 1">已结算</span> -->
          </div>
        </div>
      </div>
      <div class="loading" v-if="isComplete">真的没有更多啦~</div>
      <div class="noting" v-if="shownoting" style="text-align: center; color: #999999;">
        <img class="noting-img" src="http://img.asset/no.png" />
      </div>
    </div>
    <u-popup v-model="isShowPopup" type="center">
      <div class="popup-container">
        <div class="title">
          选择收益类型 <span class="close" @click="hideUseTips">&times;</span>
        </div>
        <div class="btn-go" @click="goCash(1)">
          <span>房产收益</span>
          <img src="http://img.asset/invite/icon_l.png" />
        </div>
        <div class="btn-go" @click="goCash(2)">
          <span>其他收益</span>
          <img src="http://img.asset/invite/icon_l.png" />
        </div>
      </div>
    </u-popup>
    <u-popup v-model="isTips" type="center" catchtouchmove="true">
      <div class="popup-container-tips">
        <div class="title">
          收益说明<span class="close" @click="isTips = false">&times;</span>
        </div>
        <scroll-view class="content" :scroll-y="true">
            <div style="width:calc(100% - 10px)">
              <div class="both">
                一、分销员说明
              </div>
              <br>
              1.如何成为分销员：进入奥园云平台登录注册或通过分享的链接进入奥园云登录注册的用户便成为分销员；
              <br>
              2.一级分销员：直接进入奥园云平台或种子用户便是一级分销员；
              <br>
              <div style="margin-bottom:10px">
                3.二级分销员：通过一级分销员分享的【优惠券分享】【楼盘项目分享】【邀请分销员】链接登录注册奥园云的新用户，可成为该一级分销员的直属二级分销员；
              </div>
              <br><br>
              <div class="both">
                二、收益说明
              </div>
              <br>
              1.分享优惠券：朋友通过您分享的优惠券，领取并成功消费后，您将获得对应的收益；
              <br>
              2.项目报备：在奥园云成功报备意向客户，并客户成功购买该报备的项目楼盘后，您将获得对应的收益；
              <br>
              3.下级分享优惠券：您的二级分销员分享的优惠券，被领取并成功消费后，您将获得对应的收益；
              <br>
              <div style="margin-bottom:10px">
                4.下级项目报备：您的下级分销员在奥园云成功报备意向客户，并客户成功购买该报备的项目楼盘后，您将获得对应的收益；
              </div>
              <br><br>
              <div class="both">
                三、结算说明
              </div>
              <br>
              1.结算订单提交申请成功后，收益将在1-2天内到账；
              <br>
              2.当出现取消订单、退货退款、或者因订单异常等情况时，将相应扣除收益，实际根据系统结算为准；
              <br>
              3.结算最低金额100元起；
              <br>
              4.单人单次结算金额不超过10万元（含）；
              <br>
              5.单人单月累积结算金额不超过15万元（含）。
            </div>
        </scroll-view>
      </div>
    </u-popup>
  </div>
</template>

<script>
import apis from "@/apis";
import UPopup from "@/components/UPopup";
export default {
  components: {
    UPopup
  },
  data() {
    return {
      isShowPopup: false,//弹窗
      loadingText: '',
      isComplete: false, // 列表已经加载完成
      total: 0,//列表总数
      walletData: {
        ableWithdrawCount: 0,
        totalCommission: 0,
        withdrawCount: 0
      },//收益数据
      isTips: false,//tips显示
      tabIndex: 1, //tab下标
      listTabIndex: 0, //列表tab
      listData: [],
      shownoting: false,
      //列表请求参数
      paramsList: {
        withdrawStatusList: [],//空=全部，1=可结算，2=结算中，3=已结算
        page: 1,
        pageSize: 10,
        withdrawType: 1,//1=房产收益，2=其他收益
      },
    }
  },
  onLoad() {
    this.getWallet();
    this.getList();
  },
  onPullDownRefresh() {
    this.total = 0;
    this.paramsList.page = 1;
    this.getList();
    // 停止下拉刷新，回弹问题
    this.$client.stopPullDownRefresh();
  },
  //页面滚动到底部的事件
  onReachBottom() {
    this.getList();
  },
  methods: {
    //收益数据
    async getWallet() {
      let res = await this.$client.rpc(apis.MY_EARNINGS);
      console.log('我的收益' + JSON.stringify(res))
      this.walletData = res.data.data;
    },
    //列表数据
    async getList() {
      // 没有数据，或者，已经完成加载了，就不做处理
      if(this.isComplete || this.shownoting) {
        return
      }

      let res = await this.$client.rpc(apis.EARNINGS_LIST, this.paramsList);
      this.total = res.data.total;
      this.listData = this.listData.concat(res.data.rows)

      // 没有数据 -- 显示图片
      if (this.listData.length == 0) {
        this.shownoting = true;   
      }

      // 已加载结束 -- 没有更多数据了
      if (!this.shownoting && this.listData.length == this.total) {
        this.isComplete = true; 
      }

      this.paramsList.page++;
    },

    //tab
    changTab(index) {

      this.listTabIndex = 0;
      this.tabIndex = index;
      this.listData = [];
      this.paramsList.withdrawStatusList = [];
      this.paramsList.withdrawType = index;
      this.paramsList.page = 1;
      this.isComplete = false;
      this.shownoting = false;
      this.getList();
    },
    //全部，可结算，已结算
    listTab(index) {
      this.listTabIndex = index;
      this.listData = [];
      this.isComplete = false;
      this.shownoting = false;
      this.paramsList.page = 1;
      if (index == 0) {
        this.paramsList.withdrawStatusList = [];
      } else if (index == 1) {
        this.paramsList.withdrawStatusList = [1];
      } else if (index == 2) {
        this.paramsList.withdrawStatusList = [3];
      }
      this.getList();
    },
    showPopup() {
      // this.isShowPopup = true;
      // this.$client.toast("敬请期待");
      this.$client.pushWindow('/pkMine/earnings/cash/index')
    },
    hideUseTips() {
      this.isShowPopup = false;
    },
    setTips() {
      this.isTips = true;
      // setTimeout(()=>{
      // 	this.isTips = false;
      // },3000)
    },
    numFormat(num) {
      if (num) {
        let res = num.toString().replace(/\d+/, function (n) { // 先提取整数部分
          return n.replace(/(\d)(?=(\d{3})+$)/g, function ($1) {
            return $1 + ",";
          });
        })
        return res;
      }
      return 0;
    },
    //号码隐私
    formatData(str) {
      if (str) {
        let reg = /(\d{3})\d*(\d{4})/;
        return str.replace(reg, '$1****$2');
      }
      return '';
    },
    goCash(num) {
      this.$client.pushWindow('./cash/index', { withdrawType: num })
    },
    gotoWithdrawalrecord() {
      this.$client.pushWindow('./cashList/index')
    },

  }

}
</script>

<style lang="scss" scoped>
.earnings {
  min-height: 100vh;
  padding: 15px;
  box-sizing: border-box;

  .main_header {
    height: 259px;
    border-radius: 10px;
    // background-color: #333f56;
    background-image: url(http://img.asset/personal/card.png);
    background-size: 100% 100%;
    background-position: center;
    background-repeat: no-repeat;
    .money_box {
      position: relative;
      padding: 35px 0 28px;
      color: #fff;
      font-size: 14px;
      text-align: center;

      .tips {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-left: 30px;
      }

      .money_count {
        font-size: 30px;
        padding-bottom: 10px;
      }

      .money_btn {
        margin: 0 auto;
        margin-top: 20px;
        width: 111px;
        height: 30px;
        background: linear-gradient(297deg, #f0c17b 0%, #fadbad 100%);
        border-radius: 15px;
        font-size: 12px;
        color: #333;
        text-align: center;
        line-height: 30px;
      }

      .money_record {
        text-decoration: underline;
        position: absolute;
        font-size: 12px;
        top: 15px;
        right: 20px;
      }
    }

    .money_handle {
      color: #fff;
      display: flex;
      position: relative;

      .money_handle_item {
        flex: 1;
        text-align: center;
        font-size: 18px;
        padding-bottom: 20px;

        div {
          padding-bottom: 10px;
        }

        span {
          font-size: 12px;
        }
      }

      &::before {
        content: "";
        position: absolute;
        width: 1px;
        height: 40px;
        background-color: #fff;
        top: 2px;
        left: 50%;
        transform: translate(-50%);
      }
    }
  }

  .tabs_box {
    padding: 35px 0 15px;
    border-bottom: 1px solid #f5f5f5;

    .tabs {
      width: 170px;
      height: 28px;
      border-radius: 28px;
      font-size: 14px;
      border: 1px solid #31465b;
      display: flex;
      margin: 0 auto;
      overflow: hidden;

      & > div {
        flex: 1;
        text-align: center;
        line-height: 28px;
        color: #999;
      }

      .selected {
        background-color: #31465b;
        color: #fff;
      }
    }
  }

  .list_tabs {
    padding: 0 90px;
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    color: #999;

    & > div {
      height: 48px;
      line-height: 48px;
    }

    .selected {
      color: #f0c17b;
      position: relative;

      &::before {
        content: "";
        position: absolute;
        width: 20px;
        height: 4px;
        background-color: #f0c17b;
        bottom: 0;
        left: 50%;
        border-radius: 4px;
        transform: translate(-50%);
      }
    }
  }

  .list_box {
    padding-top: 15px;

    .list_item {
      border-radius: 10px;
      padding: 12px 10px;
      background-color: #f8f8f8;
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
          background-color: #000;
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
            display: flex;
            align-items: center;
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
              width: 78px;
              height: 20px;
              border-radius: 18px;
              // background-color: #394e75;
              margin-left: 10px;
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
    }

    .list_item:nth-last-child(1) {
      margin: 0;
    }
  }
}
.loading {
  text-align: center;
  color: #8f8f94;
  font-size: 12px;
  padding: 10px 0 30px;
}
.noting-img {
  width: 100%;
  height: 240px;
  object-fit: contain;
  // width: 100%;
  // height: auto;
}
//tips
.popup-container-tips {
  border-radius: 10px;
  width: 300px;
  height: 440px;
  display: flex;
  flex-direction: column;
  padding: 20px 10px 20px 20px;
  font-size: 14px;
  background-color: rgba($color: #fff, $alpha: 1);
  color: #333;
  .title {
    display: flex;
    justify-content: space-between;
    font-size: 16px;
    font-weight: 600;
    padding-bottom: 20px;
    .close {
      color: #333;
    }
  }
  .content{
    max-height: 386px;
    overflow-y: scroll;
    .both{
      font-weight: 600
    }
  }
}
// 选择类型提示提示框
.popup-container {
  background-color: #fff;
  border-radius: 10px;
  width: 300px;
  height: 180px;
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
  .btn-go {
    height: 58px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-top: 1px solid #f3f3f3;
    span {
      font-size: 14px;
      color: #333333;
    }
    img {
      width: 15px;
      height: 15px;
    }
  }
  .btn-go:last-child {
    border-bottom: 1px solid #f3f3f3;
  }
  // .footer {
  //   padding-top: 20px;
  //   display: flex;
  //   justify-content: center;
  // }
}
// 按钮公共样式
// .btn {
//   width: 155px;
//   height: 50px;
//   background: #f0c17b;
//   border-radius: 25px;
//   color: #fff;
//   border: none;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   &:active {
//     background: #d3a869;
//   }
// }
</style>
