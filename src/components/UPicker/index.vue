<template name="w-picker">
  <view class="w-picker"
        :key="createKey"
        :data-key="createKey">
    <view class="mask"
          :class="{'visible':visible}"
          @tap="onCancel"
          @touchmove.stop.prevent
          catchtouchmove="true"></view>
    <view class="w-picker-cnt"
          :class="{'visible':visible}">
      <view class="w-picker-header"
            @touchmove.stop.prevent
            catchtouchmove="true">
        <text class="cancel-btn"
              :style="{'color':cancelColor}"
              @tap.stop.prevent="onCancel">取消</text>
        <text class="title"
              :style="{'color':titleColor}"
              v-if="title">{{title}}</text>
        <slot v-else></slot>
        <text class="confrim-btn"
              :style="{'color':themeColor}"
              @tap.stop.prevent="pickerConfirm">确定</text>
      </view>
      <selector-picker v-if="mode=='selector'"
                       class="w-picker-wrapper"
                       :value="value"
                       :item-height="itemHeight"
                       :options="options"
                       :default-type="defaultType"
                       :default-props="defaultProps"
                       @change="handlerChange"
                       @touchstart="touchStart"
                       @touchend="touchEnd">
      </selector-picker>
      <region-picker v-if="mode=='region'"
                     class="w-picker-wrapper"
                     :value="value"
                     :hide-area="hideArea"
                     :default-type="defaultType"
                     :item-height="itemHeight"
                     @change="handlerChange"
                     @touchstart="touchStart"
                     @touchend="touchEnd">
      </region-picker>
      <date-picker v-if="mode=='date'"
                     class="w-picker-wrapper"
                     :value="value"
                     :hide-area="hideArea"
                     :default-type="defaultType"
                     :item-height="itemHeight"
                     :options="options"
                     @change="handlerChange"
                     @touchstart="touchStart"
                     @touchend="touchEnd">
      </date-picker>
    </view>
  </view>
</template>

<script>
import selectorPicker from "./selector-picker.vue"
import regionPicker from "./region-picker.vue"
import datePicker from "./date-picker.vue"
export default {
  name: "w-picker",
  components: {
    selectorPicker,
    regionPicker,
    datePicker,
  },
  props: {
    mode: {
      type: String,
      default: "selector"
    },
    value: {//默认值
      type: [String, Array, Number],
      default: ""
    },
    current: {//是否默认显示当前时间，如果是，传的默认值将失效
      type: Boolean,
      default: false
    },
    themeColor: {//确认按钮主题颜色
      type: String,
      default: "#1C66D4"
    },
    cancelColor: {//取消按钮主题颜色
      type: String,
      default: "#666666"
    },
    fields: {//日期颗粒度:year、month、day、hour、minute、second
      type: String,
      default: "date"
    },
    disabledAfter: {//是否禁用当前之后的日期
      type: Boolean,
      default: false
    },
    second: {//time-picker是否显示秒
      type: Boolean,
      default: true
    },
    options: {//selector,region数据源,date时候的配置
      type: [Array, Object],
      default() {
        return []
      }
    },
    defaultProps: {//selector,linkagle字段转换配置
      type: Object,
      default() {
        return {
          label: "label",
          value: "value",
          children: "children"
        }
      }
    },
    defaultType: {
      type: String,
      default: "label"
    },
    hideArea: {//mode=region时，是否隐藏区县列
      type: Boolean,
      default: false
    },
    level: {
      //多级联动层级，表示几级联动,区间2-4;
      type: [Number, String],
      default: 2
    },
    timeout: {//是否开启点击延迟,当快速滚动 还没有滚动完毕点击关闭时得到的值是不准确的
      type: Boolean,
      default: false
    },
    expand: {//mode=shortterm 默认往后拓展天数
      type: [Number, String],
      default: 30
    },
    startYear: {
      type: [String, Number],
      default: 1950
    },
    endYear: {
      type: [String, Number],
      default: new Date().getFullYear()
    },
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: "请选择"
    },
    titleColor: {
      type: String,
      default: '#09122B'
    }
  },
  created() {
    this.createKey = Math.random() * 1000;
  },
  data() {
    return {
      itemHeight: `height: ${uni.upx2px(88)}px;`,
      result: {},
      confirmFlag: true,
      cancelOrConfirmFlag: null,//用户操作了，1-取消，或者 2-确认
    };
  },
  methods: {
    touchStart() {
      if (this.timeout) {
        this.confirmFlag = false;
      }
    },
    touchEnd() {
      if (this.timeout) {
        setTimeout(() => {
          this.confirmFlag = true;
        }, 200)
      }
    },
    handlerChange(res) {
      let _this = this;
      this.result = { ...res };
      // 如果已经关闭了选择框，自动再次触发用户上次事件，如果是确认事件才触发
      if(this.mode !== 'region' && !this.visible && this.cancelOrConfirmFlag == 2){
        this.$emit("confirm", this.result);
      }else{
        this.$emit("change", this.result);
      }
    },
    show() {
      this.$emit("update:visible", true);
    },
    hide() {
      this.$emit("update:visible", false);
    },
    onCancel(res) {
      this.cancelOrConfirmFlag = 1
      this.$emit("update:visible", false);
      this.$emit("cancel");
    },
    pickerConfirm() {
      this.cancelOrConfirmFlag = 2
      if (!this.confirmFlag) {
        return;
      };
      this.$emit("confirm", this.result);
      this.$emit("update:visible", false);
    }
  }
}
</script>

<style lang="scss" scoped>
  .w-picker-item {
    text-align: center;
    width: 100%;
    height: 88px;
    line-height: 88px;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 30px;
  }
  .w-picker {
    z-index: 888;
    .mask {
      position: fixed;
      z-index: 1000;
      top: 0;
      right: 0;
      left: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.6);
      visibility: hidden;
      opacity: 0;
      transition: all 0.3s ease;
    }
    .mask.visible {
      visibility: visible;
      opacity: 1;
    }
    .w-picker-cnt {
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      transition: all 0.3s ease;
      transform: translateY(100%);
      z-index: 3000;
      background-color: #fff;
    }
    .w-picker-cnt.visible {
      transform: translateY(0);
    }
    .w-picker-header {
      display: flex;
      height: 50px;
      background-color: #fff;
      position: relative;
      text-align: center;
      font-size: 30px;
      justify-content: space-between;
      border-bottom: solid 1px #eee;
      .w-picker-btn {
        font-size: 30px;
      }
      .title {
        font-size: 14px;
        font-weight: 500;
        height: 50px;
        display: flex;
        align-items: center;
        padding: 0 20px;
      }
    }

    .w-picker-hd:after {
      content: ' ';
      position: absolute;
      left: 0;
      bottom: 0;
      right: 0;
      height: 1px;
      border-bottom: 1px solid #e5e5e5;
      color: #e5e5e5;
      transform-origin: 0 100%;
      transform: scaleY(0.5);
    }
    .cancel-btn,
    .confrim-btn {
      font-size: 14px;
      height: 50px;
      display: flex;
      align-items: center;
      padding: 0 20px;

    }
  }
</style>
