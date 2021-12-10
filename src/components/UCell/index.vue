<template>
  <div :style="getCellStyle">
    <div class="u-cell app-cell"
         :class="getCellClass">
      <div class="u-cell-content app-cell-content"
           @click="onClick">
        <!-- 左边部分 -->
        <div class="u-cell-left app-cell-title"
             :style="getLeftStyle">
          <!-- @slot icon-before: 位于标题之前的插槽 -->
          <slot name="icon-before"></slot>
          <!-- @slot title: 标题 -->
          <slot name="title">{{ title }}</slot>
          <div class="require-flag" v-if="isRequire">*</div>
        </div>
        <!-- 右边部分 -->
        <div class="u-cell-right app-cell-value"
             :style="getRightStyle">
          <!-- @slot defalut 内容插槽 -->
          <slot>
            <div :style="getContentStyle" class="u-cell-value" v-if="value != ''">{{ options ? label : value }}</div>
            <div :style="getContentStyle" v-else
                 class="u-cell-placeholder">{{ options && !placeholder ? "请选择" : placeholder }}</div>
          </slot>
          <div class="u-cell-icon-after">
            <!-- @slot icon-after: 内容之后的插槽 -->
            <slot name="icon-after"></slot>
            <div v-if="isLink"
                  :class="{extended: extented}"
                  class="u-set-arrow app-set-arrow"></div>
          </div>
        </div>
      </div>
      <!-- @slot 底部 -->
      <div class="u-cell-bottom"
           v-if="isExtent"
           :class="isExtented"
           :style="getBottomContent">
        <div class="u-cell-bottom-content">
          <slot name="bottom"></slot>
        </div>
      </div>
    </div>
    <!-- 弹出选择框 -->
    <UPicker v-if="options || mode=='region' || mode=='date'"
             :mode="mode"
             :title="title"
             :visible.sync="isShowPicker"
             :value="label"
             :options="options"
             @confirm="onPickerConfirm"
             ref="selector"></UPicker>
  </div>
</template>

<script>
/**
 * @component
 *
 * @example 
 * 一般使用：
 * 			<u-cell title="cell标题" value="cell内容"></u-cell>
 * 弹出选择：
 * 			<u-cell title="收款账户" v-model="params.residentFlag" :options="pickerOptions.residentFlag" isLink></u-cell>
 * 			说明：【options】：选项数组{label:'显示的内容', value:'101'}，组件检测到有此属性，就会调用picker选择器，必须加【isLink】属性
 * 			v-model 可以双向绑定，绑定的值为 value 
 * 			isExtent属性：标记为下拉展开，必须与 isLink 配合使用
 */
import UPicker from '@/components/UPicker';

export default {
  components: {
    UPicker,
  },
  name: "UCell",
  props: {
    /**
     * 是否必填
     */
    isRequire: {
      type: Boolean,
      default: false
    },
    /**
     * 是否有border
     */
    hasBorder: {
      type: Boolean,
      default: true
    },
    /**
     * 内容
     */
    value: String,
    /**
     * 标题
     */
    title: String,
    /**
     * 标题字号
     */
    titleFontSize: {
      type: [String, Number],
      default: ""
    },
    /**
     * 标题字色
     */
    titleColor: {
      type: String,
      default: ""
    },
    /**
     * 内容字号
     */
    valueFontSize: {
      type: [String, Number],
      default: ""
    },
    /**
     * 内容字色
     */
    valueColor: {
      type: String,
      default: ""
    },
    /**
     * 是否可点击
     */
    isLink: {
      type: Boolean,
      default: false
    },
    /**
     * 显示背景
     */
    showBg: {
      type: Boolean,
      default: true
    },
    /**
     * 内容字体是否加粗
     */
    isValueBold: {
      type: Boolean,
      default: false
    },

    /**
     * 标题字体是否加粗
     */
    isTitleBold: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: ""
    },
    /**
     * 传入的可选项，用于picker选择
     */
    options: {
      type: [Array,Object],
      default: null,
    },
    mode: {
      type: String,
      default: 'selector'
    },
    /**
     * 是否可展开
     */
    isExtent: {
      type: Boolean,
      default: false
    },

    isRightAlign:{
      type: Boolean,
      default:false
    },
    isSmallSpace:{
      type: Boolean,
      default:false
    },
    bgColor: {
      type: String,
      default: ''
    },
    /**
     * 输入框输入横向对齐方式 textAlign="right" 表示靠右显示;默认靠左
     */
    textAlign: {
      type: String,
      default: "left"
    },
  },
  computed: {
    getContentStyle() {
      let styles = [];
      if (this.textAlign) {
        styles.push(`text-align: ${this.textAlign}`)
      }
      return styles.join(";");
    },
    isExtented() {
      return this.extented ? "extented" : ""
    },
    getBottomContent() {
      return `height: ${this.bottomContentHeight}px`;
    },
    getCellClass() {
      let classes = [];
      if (this.showBg) {
        classes.push("app-cell-bg");
      }
      if (this.isLink) {
        classes.push("app-cell-active");
      }
      if (this.hasBorder) {
        classes.push("has-border");
      }
      if (this.isSmallSpace) {
        classes.push("small-space");
      }
      return classes;
    },
    getCellStyle() {
      let rt = []
      if(this.bgColor){
        rt.push(`background-color: ${this.bgColor}`)
      }
      return rt.join(";");;
    },
    getLeftStyle() {
      const fontSize =
        typeof this.titleFontSize === "number"
          ? this.titleFontSize + "px"
          : this.titleFontSize;
      const fontWeight = this.isTitleBold ? "bold" : "";

      const styles = [];
      if (fontSize) {
        styles.push(`font-size:${fontSize};`);
      }
      if (this.titleColor) {
        styles.push(`color:${this.titleColor};`);
      }
      if (fontWeight) {
        styles.push(`font-weight:${fontWeight};`);
      }
      return styles.join(" ");
    },
    getRightStyle() {
      const fontSize =
        typeof this.valueFontSize === "number"
          ? this.valueFontSize + "px"
          : this.valueFontSize;
      const fontWeight = this.isValueBold ? "bold" : "";
      const styles = [];
      if (fontSize) {
        styles.push(`font-size:${fontSize};`);
      }
      if (this.valueColor) {
        styles.push(`color:${this.valueColor};`);
      }
      if (fontWeight) {
        styles.push(`font-weight:${fontWeight};`);
      }
      if (this.isRightAlign) {
        styles.push(`justify-content: flex-end;`);
      }
      return styles.join(" ");
    },
  },
  watch: {
    value: {
      handler(v) {
        this.emitInput(v);
        this.VALUE = v;
      },
      immediate: true,
    },
    VALUE: {
      handler(nv, ov) {
        // 用于 v-model 更新值
        if (!nv) {
          return;
        }
        // 预处理时间格式输入 '2020-12-12 1:00:00' => '2020-12-12'
        if(this.mode == 'date'){
          nv=this.$tools.str2DateStr(nv,'YYYY-MM-DD')
          this.label = nv;
        }
        if(this.mode == 'region'){
          this.label = nv;
        }
        this.VALUE = nv;
        if (this.options && Array.isArray(this.options)) {
          let item = this.options.find(item => item.value == nv);
          this.label = item ? item.label : "";
        }
        this.emitInput(nv);
        if (this.debounceFunction) {
          this.debounceFunction(()=>{
            this.emitChange({ label: this.label, value: this.VALUE });
          });
        } else {
          this.emitChange({ label: this.label, value: this.VALUE });
        }
      },
      immediate: true,
    },
    isShowPicker(v) {
      this.$emit("onShowPicker", v);
    }
  },
  data() {
    return {
      isShowPicker: false,
      VALUE: "",
      label: "",
      extented: false, // 是否展开--》样式的右侧箭头转动90°
      doValidate: true,
      // bottom content height
      bottomContentHeight: 0,
    };
  },
  methods: {
    debounceFunction(cb){
      let timeout;
      // 防抖处理，修复选择后处理swiper
      return function(event){
        clearTimeout(timeout)
        timeout = setTimeout(()=>{
          cb.call(this, event)
        },300)
      }()
    },
    onPickerConfirm(e) {
      if (this.mode == 'region' || this.mode == 'date') {
        this.VALUE = e.result;
        this.label = e.result;
        // console.log(111,this.VALUE)
      } else {
        this.VALUE = e.value;
      }
      this.$emit("on-confirm", e);
    },
    onClick() {
      if (!this.isLink) {
        return;
      }
      if (this.isExtent) {
        this.extented = !this.extented;
        if (this.extented) {
          // 获取元素高度
          const query = uni.createSelectorQuery().in(this);
          query.select('.u-cell-bottom-content').boundingClientRect(data => {
            this.bottomContentHeight = data.height;
          }).exec();
        } else {
          this.bottomContentHeight = 0;
        }
        return;
      }
      // 如果是选择框，则显示picker
      if (this.options || this.mode == 'region'|| this.mode == 'date') {
        this.isShowPicker = true;
      }
      /**
       * @event clickHandler
       * 点击事件，isLink为false时不生效
       */
      this.$emit("clickHandler", {
        label: this.title,
        value: this.value
      });
    },
    emitInput(v) {
      /**
       * 输入事件
       * @event on-input
       */
      this.$emit("input", v);
    },
    emitChange(v) {
      /**
       * 值改变事件
       * @event on-change
       */
      this.$emit("on-change", v);
    }
  },
  created() {

  },
};
</script>

<style lang="scss" scoped>
  @import './style.scss';
</style>
