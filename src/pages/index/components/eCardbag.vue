<!--
 * @Description: 
 * @version: 
 * @Author: gonghonglin
 * @Date: 2021-07-09 17:49:34
 * @LastEditors: gonghonglin
 * @LastEditTime: 2021-08-17 20:44:18
-->
<template>
  <CardContainer :title="title" @onMore="gotoCardbagList">
    <div class="eCoupon">
      <ECardbagItem
        class="e-coupon-item-continer"
        @click="onClick(item)"
        @onShowDetail="onShowDetail(item)"
        v-for="(item, index) in list"
        :item="item"
        :key="index"
      >
      </ECardbagItem>
    </div>
  </CardContainer>
</template>

<script>
import CardContainer from "./cardContainer.vue";
import ECardbagItem from "./eCardbagItem.vue";
export default {
  components: {
    CardContainer,
    ECardbagItem,
  },
  props: {
    title: {
      type: String,
    },
    list: {
      type: Array,
      default: [],
    },
  },
  mounted() {
    // console.log('e-coupon-list',this.list)
  },
  methods: {
    // 点击按钮，根据状态，处理是领取还是使用
    // useStatus:0-未领取，1-已领取
    onClick(item) {
      // console.log(item.useStatus)
      if (item.useStatus == 0) {
        this.getReceiveCardbag(item);
      } else {
        this.onShowDetail(item, true); //打开详情后展示二维码
      }
    },

    gotoCardbagList() {
      this.$client.pushWindow("/pkCoupon/cardbag/index");
    },

    // 领取卡包
    async getReceiveCardbag(item) {
      if (!this.$client.passCheck()) return;
      let { data } = await this.$client.rpc(this.$api.CARDBAG_GET_RECEIVE, {
        cardPackId: item.id,
      });
      if (data.success) {
        item.useStatus = 1; //标记为已领取
        this.$client.toast("已领取");
        this.$emit("onRefresh");
        this.$client.pushEvent("CARD_RECEIVE", {
          id: item.id,
          name: item.name,
        }); // 埋点
      } else {
        // console.log('优惠券领取失败',data)
      }
    },
    // 查看卡包券详情
    onShowDetail(item) {
      // 如果是1 直接跳 腾讯 h5
      this.$client.pushWindow("/pkCoupon/cardbagdetails/index", {
        id: item.id,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.eCoupon {
  display: flex;
  flex-direction: row;
  .e-coupon-item-continer {
    width: 50%;
    &:not(:last-child) {
      margin-right: 15px;
    }
  }
}
</style>