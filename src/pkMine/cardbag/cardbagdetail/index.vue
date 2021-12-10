<template>
  <div class="content">
    <div class="cardbag-vip">
      <div class="cardbag-img" :style="{ 'background-image': `url(${cardbagInfo.imgUrl})` }">
        <!-- <div class="user-explain">
          <img class="icon-card" src="http://img.asset/icon-card.png" alt="" />
          <span style="font-size: 14px" @click="isShowPopup = true">使用说明</span>
        </div> -->
      </div>
      <!-- <u-cell title="数量" :isSmallSpace="true" titleColor="#333"  textAlign='right' v-model="cardbagInfo.number"></u-cell> -->
      <u-cell title="有效期" :isSmallSpace="true" titleColor="#333" textAlign='right' :hasBorder="false" v-model="cardbagInfo._expTimes">
      </u-cell>

    </div>
      <div class="user_konw_box">
        <div class="user_konw">
        <p class="user_kowns">使用说明</p>
        <div class="user-description">
           <div class="rich_box">
          <rich-text :nodes="cardbagInfo.description"></rich-text>
        </div>
        </div>
      </div>
    </div>
    <div class="vip-bottom">
      <p>兑换账号</p>
      <input type="text" v-model="excDetail" placeholder="请输入相关兑换账号" />
      <div class="bottom" @click="writeOff">确定</div>
    </div>
    <!-- 使用规则提示 -->
    <!-- <u-popup v-model="isShowPopup" type="center">
      <div class="popup-container">
        <div class="title">
          使用说明 <span class="close" @click="isShowPopup = false">&times;</span>
        </div>
        <div class="rich_box">
          <rich-text :nodes="cardbagInfo.description"></rich-text>
        </div>
      </div>
    </u-popup> -->
      <!-- <div class="user_konw_box">
        <div class="user_konw">
        <p class="user_kowns">使用说明</p>
        <div class="user-description">
           <div class="rich_box">
          <rich-text :nodes="cardbagInfo.description"></rich-text>
        </div>
        </div>
      </div>
    </div> -->
  </div>
</template>

<script>
import UPopup from "@/components/UPopup";
import apis from "@/apis";
export default {
  components: {
    UPopup,
  },
  data() {
    return {
      isShowPopup: false,
      tmpImg4: "http://img.asset/Card-bag/vip.png",
      cardbagInfo: {}, //卡包详情信息
      excDetail: "",
      queryParams: null,
    };
  },
  mounted() { },
  methods: {
    onLoad(option) {
      this.queryParams = this.$client.getParam()
      this.getCardbackInfo(this.queryParams.id);
    },
    async getCardbackInfo() {
     var{id} = this.$client.getParam()
    
      let { data } = await this.$client.rpc(apis.CARDPACK_DETAIL, { id});
      if (data.success) {
        data.data.description = this.$client.setEscape(data.data.description,true);
        data.data._expTimes =  data.data.endTime && data.data.startTime ? this.date2Str(data.data.startTime, "YYYY/MM/DD") + '- ' + this.date2Str(data.data.endTime, "YYYY/MM/DD") : '长期';
          // data.data.number=1
           this.$set(this, "cardbagInfo", data.data);
      }
    },
    // 时间格式的转化---年月日
    date2Str(date, format) {
      return this.$tools.str2DateStr(date, format);
    },
    // 核销
    async writeOff() {
      // this.showResult();
      if (!this.excDetail) {
        this.$client.alert("请输入兑换账号");
      } else {
        let res = await this.$client.rpc(this.$api.MYCARDBAG_WRITE, {
          excDetail: this.excDetail,
          cardPackHistoryId: this.cardbagInfo.cardPackHistoryVo.id
        })
        if(!res.data.data.award_detail){
          // 没有跳转链接时，终止
          return this.$client.alert('兑换成功')
        }
        // console.log(res.data.data.award_detail)
        this.$client.pushWindow("/pages/webView/webView?url=" + encodeURIComponent(res.data.data.award_detail),{reLaunch:true});
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.content {
  background: #f8f8f8;
  padding: 15px;
  min-height: calc(100vh - 30px);
  .cardbag-vip {
    background: #ffffff;
    border-radius: 10px;
    padding: 20px;
    .cardbag-img {
      height: 150px;
      border-radius: 10px;
      background-size: 100% 150px;
      margin-bottom: 10px;
      .user-explain {
        padding-top: 108px;
        span {
          font-size: 14px;
          color: #ffffff;
        }
        .icon-card {
          height: 15px;
          width: 15px;
          margin-left: 17px;
        }
      }
    }
    .number-vip {
      padding: 20px;
      .number {
        display: flex;
        justify-content: space-between;
        padding: 20px;
      }
      .time {
        display: flex;
        justify-content: space-between;
        width: 100%;
      }
    }
  }
  .vip-bottom {
    padding: 20px;
    background: #ffffff;
    border-radius: 10px;
    border-color: red 1px solid;
    margin-top: 10px;

    p {
      text-align: center;
      margin-top: 20px;
      color: #333333;
      font-size: 14px;
    }
    input {
      height: 40px;
      background: #f8f8f8;
      border-radius: 10px;
      padding-left: 10px;
      margin: 20px auto;
    }
    .bottom {
      width: 165px;
      height: 50px;
      background: #f0c17b;
      border-radius: 25px;
      text-align: center;
      line-height: 50px;
      color: #f8f8f8;
      margin: 20px auto;
    }
  }
  // 使用规则提示框
.popup-container {
  background-color: #fff;
  border-radius: 10px;
  width: 300px;
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
}
.user_kowns{
  padding: 15px 0 10px;
  font-size: 12px;
  color: #333333;
}
 .rich_box {
    font-size: 12px;
    color: #999999;
  }
}
</style>

