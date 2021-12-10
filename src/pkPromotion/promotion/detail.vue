<!--
 * @Description: 
 * @version: 
 * @Author: gonghonglin
 * @Date: 2021-08-03 20:32:56
 * @LastEditors: gonghonglin
 * @LastEditTime: 2021-11-17 16:13:12
-->
<template>
  <div class="myactivity">
    <div class="myactivity-list">
      <div
        class="myactivity-img"
        :style="{ 'background-image': `url(${curItem.urls})` }"
      ></div>
      <div class="myactivity-box">
        <div class="myactivity-inbox">
          <div class="myactivity-title">{{ curItem.title || "..." }}
            <span class="price">{{ curItem.spend ==0? '免费' :curItem.spend+'元' }}</span>
          </div>
          <div class="myactivity-item">
            <span class="myactivity-address">活动地点</span>
            <span class="myactivity-value">{{ curItem.address || "" }}</span>
          </div>
          <div class="myactivity-item">
            <span>报名时间</span>
            <span class="myactivity-value">{{ curItem._joinTimes }}</span>
          </div>
          <div class="myactivity-item">
            <span>活动时间</span>
            <span class="myactivity-value">{{ curItem._expTimes }}</span>
          </div>

          <div class="myactivity-item">
            <span>报名人数</span>
            <span class="myactivity-value"
              >已报名{{
                curItem.virtualManCount > curItem.manCount
                  ? curItem.virtualManCount
                  : curItem.manCount
              }}人/活动上限{{ curItem.upperLimit || 0 }}人</span
            >
          </div>
        </div>
      </div>
      <div class="action-detail">
        <div class="action-detail-introduce">活动详情介绍</div>
        <div class="rich_box">
          <rich-text class="rich_" :nodes="curItem.detail | formatRichText"></rich-text>
        </div>
      </div>
      <div class="footer">
        <button class="icon-share" data-name="shareBtn" open-type="share">
          <img src="http://img.asset/share.png" />
        </button>
        <div class="phone-service" @click="makePhoneCall()">电话咨询</div>
        <div
          v-if="curItem.areJoin || curItem.areStatus != 2"
          class="phone-sign-up" 
          :class="{
            'phone-sign-up-999': curItem.areStatus != 2,
          }"
        >
          {{ areStatusType[curItem.areStatus]||'我要报名' }}
        </div>
        <div v-else class="phone-sign-up" @click="gotoSignup()">我要报名</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      curItem: {
        title: "",
        address: "",
        virtualManCount: "",
        manCount: "",
        detail: "",
        areJoin: true,
      },
      queryParams: {},
      areStatusType: {
        1: "报名未开始",
        2: "报名中",
        3: "报名已结束",
        4: "活动未开始",
        5: "活动进行中",
        6: "活动已结束",
        7:"已报名"
      },
    };
  },
  mounted() {
    // console.log(this.$client.getParam());
    this.queryParams = this.$client.getParam();
    this.getPromotiondetail();
  },
  onShow() {
    this.getPromotiondetail();
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
    formatRichText(html = "") {
      //控制小程序中图片大小
      let newContent = html.replace(/<img[^>]*>/gi, function (match, capture) {
        // console.log(match.search(/style=/gi));

        if (match.search(/style=/gi) == -1) {
          match = match.replace(/\<img/gi, '<img style=""');
        }
        return match;
      });

      newContent = newContent.replace(
        /style="/gi,
        "$& max-width:100% !important; height:auto !important;"
      );
      newContent = newContent.replace(/<br[^>]*\/>/gi, "");
      return newContent;
    },
  },
  methods: {
    gotoSignup() {

      if (!this.$client.passCheck()) return;
      this.$client.pushWindow("./signup", this.curItem);
    },
    async getPromotiondetail() {
      var { id } = this.queryParams;
      let { data } = await this.$client.rpc(this.$api.PROMOTION_LIST, {
        id,
        page: 1,
        pageSize: 1,
      });
      data.rows[0].detail = this.$client.setEscape(data.rows[0].detail);
      this.$set(this, "curItem", data.rows[0]);
      this.curItem._expTimes =
        this.date2Str(this.curItem.startTime, "YYYY/MM/DD hh:mm") +
        "-" +
        this.date2Str(this.curItem.endTime, "YYYY/MM/DD hh:mm");

      this.curItem._joinTimes =
        this.date2Str(this.curItem.joinStartTime, "YYYY/MM/DD hh:mm") +
        "-" +
        this.date2Str(this.curItem.joinEndTime, "YYYY/MM/DD hh:mm");
    },
    makePhoneCall() {
      let phone = this.curItem.contactPhone;
      this.$client.makePhoneCall(phone);
    },
    // 时间格式的转化---年月日
    date2Str(date, format) {
      return this.$tools.str2DateStr(date, format);
    },
  },
  /**
   * 用户点击右上角分享
   */
  async onShareAppMessage(options) {
    if (!this.$client.passCheck()) return;
    // let imageUrl = "http://img.asset/logo-share.jpg";
    let uid = this.$store.state.userInfo.uid; // 用户id
    let bid = "7"; // 业务类型
    let channelId = "8803"; // 渠道id
    let { id } = this.curItem;
    let { data } = await this.$client.rpc(this.$api.SET_SCENE, {
      scene: `${bid}_${uid}_${id}_${channelId}`,
    });
    let scene = data.data.id;

    let shareObj = {
      title: this.curItem.title || "奥园云活动分享",
      path: "pages/launch/index?scene=" + scene, // 引导页
      // imageUrl,
      // success(res) {
      //   // 转发成功之后的回调
      //   this.$client.pushEvent("SHARE_APP", {
      //     data: "活动分享",
      //     id: this.curItem.id,
      //     title: this.curItem.title,
      //   }); // 埋点
      //   this.$client.pushEventNew(2, {
      //     data: "活动分享",
      //     id: this.curItem.id,
      //     title: this.curItem.title,
      //   }); // 埋点
      //   if (res.errMsg == "shareAppMessage:ok") {
      //   }
      // },
      // fail() {
      //   // 转发失败之后的回调
      //   if (res.errMsg == "shareAppMessage:fail cancel") {
      //     // 用户取消转发
      //   } else if (res.errMsg == "shareAppMessage:fail") {
      //     // 转发失败，其中 detail message 为详细失败信息
      //   }
      // },
      // complete() {
      //   // 转发结束之后的回调（转发成不成功都会执行）
      // },
    };

    // 数据埋点
    this.$client.pushEvent("SHARE_APP", {
      data: "活动分享",
      id: this.curItem.id,
      title: this.curItem.title,
    }); // 埋点
    this.$client.pushEventNew(2, {
      data: "活动分享",
      id: this.curItem.id,
      title: this.curItem.title,
    }); // 埋点

    return shareObj;
  },
};
</script>

<style lang="scss" scoped>
.myactivity {
  min-height: 100vh;
  .myactivity-list {
    padding-bottom: 150px;
    .myactivity-img {
      background-color: #f0f0f0;
      background-repeat: no-repeat;
      background-size: cover;
      background-position: center;
      height: 145px;
    }
    .myactivity-box {
      background-color: #ffffff;
      padding: 15px 25px;
      font-size: 12px;
      .myactivity-inbox {
        .myactivity-title {
          font-size: 18px;
          font-weight: 600;
          line-height: 1.5em;
          .price{
            margin-left: 4px;
            font-size: 16px;
            color: #F0C17B;
            white-space: nowrap;
          }
        }
        .myactivity-item {
          display: flex;
          padding-top: 10px;
          span {
            display: inline-block;
          }
          span:nth-child(1) {
            width: 60px;
          }
          span:nth-child(2) {
            flex: 1;
            color: #333333;
          }
          .myactivity-value {
            width: 265px;
          }
        }
      }
    }
    .action-detail {
      min-height: 100px;
      background: #ffffff;
      box-shadow: 0px 1px 6px 0px rgba(0, 0, 0, 0.07);
      border-radius: 10px;
      padding: 10px;
      margin: 0 15px;
      font-size: 12px;
      display: flex;
      flex-direction: column;
      .action-detail-introduce {
        color: #333333;
        font-size: 14px;
        font-weight: 900;
        padding-bottom: 10px;
      }
      .action-content {
        line-height: 1.5em;
        overflow: scroll;
        flex: 1;
        color: #333;
      }
      .rich_box {
        font-size: 12px;
        .rich_{
          word-break : break-word 
        }
      }
    }
    .footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #ffffff;
      box-shadow: 0px -1px 6px 0px rgba(0, 0, 0, 0.07);
      padding: 10px 20px;
      // iphone安全距离处理
      padding-bottom: calc(10px + constant(safe-area-inset-bottom));
      padding-bottom: calc(10px + env(safe-area-inset-bottom));

      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      .phone-service {
        width: 135px;
        background: #3c4871;
        border-radius: 25px;
        text-align: center;
        line-height: 50px;
        color: #ffffff;
        &:active {
          background-color: #2f3b62;
        }
      }
      .phone-sign-up {
        width: 135px;
        height: 50px;
        background: #f0c17b;
        border-radius: 25px;
        text-align: center;
        line-height: 50px;
        color: #ffffff;

        &:active {
          background-color: #e0b36f;
        }
      }
      .phone-sign-up-999 {
        background-color: #f1f0ee;
        &:active {
          background-color: #f1f0ee;
        }
      }
      .icon-share {
        background: transparent;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0;
        padding: 0;
        &::after {
          content: none;
        }
        img {
          width: 20px;
          height: 33px;
        }
      }
    }
  }
}
</style>
