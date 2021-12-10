<template>
  <div class="coupon-item">
    <!-- 图片 -->
    <div
      class="coupon-body"
      @click="onShowDetail"
      :style="{ 'background-image': `url(${item.imgUrl})` }"
    >
      <!-- <div class="coupon-type" :class="{'type-discount': item.couponType=='2'}">{{CouponType[item.couponType]}}</div> -->
      <div class="coupon-name">{{ item.name }}</div>
    </div>

    <!-- 状态 -->
    <div class="coupon-state">
      <div class="progress-container">
        <!-- 进度条 -->
        <!-- <div class="progress-bar" >
          <div
            class="progress"
            :style="{ width: item.usageQuantity + '%' }"
          ></div>
        </div>
        <span>已抢{{ item.usageQuantity }}%</span> -->
      </div>

      <!-- <div>
        <span class="coupon-value">{{item.couponType=='2'?item.discount:item.offsetAmount}}<span class="coupon-unit">{{item.couponType=='2'?'折':'元'}}</span></span>
      </div> -->
    </div>

    <!-- 领取按钮 -->
    <div class="coupon-ctl">
      <div
        class="btn"
        @click="onClick(item)"
        :class="{ active:activeShow,disabled:buttonStatus,border:buttonClassShow }"
      >
        {{ buttonLabel }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ECardbgItem",
  props: {
    item: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      activeShow:false,
      buttonClassShow:false,
      // CouponType:{
      // 	1:'抵扣券',
      // 	2:'折扣券',
      // 	3:'奖品券'
      // }
    };
  },
  computed: {
    buttonLabel() {
      let label = "";
      switch (this.item.useStatus) {
        case -1:
          label = "已抢光";
          break;
        case 0:
          label = "立即领取";
          break;
        case 1:
          label = "去使用";
          this.buttonClassShow=true;

          break;
        case 2:
          label = "今天已抢光";
          break;
        default:
          break;
      }
      return label;
    },
    buttonStatus() {
      return [-1, 2].includes(this.item.useStatus);
    },
  },
  mounted() {
    // console.log('e-coupon-item', this.item)
  },
  methods: {
    onClick(item) {
      if ([0, 1].includes(item.useStatus)) {
        this.$emit("click", item);
      }
    },
    onShowDetail() {
      this.$emit("onShowDetail");
    },
  },
};
</script>
<style lang="scss">
.coupon-item {
  display: flex;
  flex-direction: column;
  box-shadow: 0px 2px 9px 0px rgba(0, 0, 0, 0.06);
  border-radius: 8px;
  padding-bottom: 10px;
  .coupon-body {
    position: relative;
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
    overflow: hidden;
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    height: 120px;
    background-color: #ececec;

    // 类型
    .coupon-type {
      position: absolute;
      top: 0;
      left: 0;
      font-size: 10px;
      color: #ffffff;
      padding: 4px 10px;
      border-top-left-radius: 6px;
      border-bottom-right-radius: 10px;
      background: linear-gradient(180deg, #b5b8c8 0%, #6763a5 100%);

      &.type-discount {
        background: linear-gradient(180deg, #e2ca93 0%, #c9a668 100%);
      }
    }

    .coupon-name {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      color: #fff;
      min-height: 30px;
      display: flex;
      align-items: flex-end;
      font-size: 10px;
      padding: 10px;
      background: linear-gradient(
        180deg,
        rgba(0, 0, 0, 0) 0%,
        rgba(0, 0, 0, 0.8) 100%
      );
    }
  }

  .coupon-state {
    padding: 10px 10px 6px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    // 进度条
    .progress-container {
      width: 60px;
      color: #999999;
      font-size: 10px;
      .progress-bar {
        display: flex;
        background-color: #f1f0ee;
        height: 8px;
        border-radius: 10px;
        overflow: hidden;

        .progress {
          width: 40px;
          border-radius: 10px;
          background-color: #c9a568;
        }
      }
    }
    .coupon-value {
      color: #c9a668;
      font-size: 20px;
      .coupon-unit {
        font-size: 10px;
      }
    }
  }

  // <!-- 领取按钮 -->
  .coupon-ctl {
    display: flex;
    justify-content: center;
    .btn {
     width: 80px;
      height: 30px;
      background: linear-gradient(297deg, #f0c17b 0%, #fadbad 100%);
      border-radius: 18px;
      text-align: center;
      line-height: 30px;
      color: #fff;
      font-size: 12px;
      &:active {
        background-color: rgb(255, 253, 245);
      }
      &.active {
        // border: 1px solid #fff;
        color: #fff;
        background: linear-gradient(297deg, #f0c17b 0%, #fadbad 100%);
        // background: linear-gradient(180deg, #e2ca93 0%, #c9a668 100%);
        &:active {
          background: linear-gradient(297deg, #f0be74 0%, #f3d2a0 100%);
        }
      }
        &.border {
        border: 2px solid #F0C17B;
        background:  #fff;
        color:#f0c17b;
      }
      &.disabled {
        width: 80px;
        height: 30px;
        background: #cbd7e1;
        border-radius: 18px;
        text-align: center;
        line-height: 30px;
      }
    }
  }
}
</style>