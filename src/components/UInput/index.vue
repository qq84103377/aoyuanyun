<template>
  <div :class="getInputWrapClass"
       :style="getInputWrapStyle">
    <div v-if="title || tip || $slots.label"
         class="u-input-left"
         :style="getLeftStyle">
      
      <!-- @slot label:输入框左边标签自定义插槽，必须指定name -->
      <slot name="label">
        <label v-if="title"
               v-html="title"
               :class="getInputLabelClass"
               :for="uuid"></label>
        <span v-if="tip"
              class="u-input-tip app-input-tip">{{
                    tip
                }}</span>
      </slot>
      <div class="require-flag"
           v-if="isRequire">*</div>
    </div>
    <div :class="getInputCenterClass"
         @click="focus">
      <input ref="input"
             class="u-input-real"
             v-model="VALUE"
             :value="VALUE"
             :id="uuid"
             :name="name"
             :type="type"
             v-if="type!='radio'"
             :style="getRealInputStyle"
             :class="getRealInputClass"
             :maxlength="maxlength"
             :autocomplete="autocomplete"
             :autocapitalize="autocapitalize"
             :autocorrect="autocorrect"
             :spellcheck="spellcheck"
             :pattern="pattern"
             :placeholder="placeholder"
             :readonly="readonly"
             :disabled="disabled"
             @focus="onRealInputFocus"
             @blur="onRealInputBlur"
             @keyup="onRealInputKeyUp"
             @input="onRealInput" />
      <!-- radio -->
      <div class="radio-group" v-if="type=='radio'">
        <div class="radio" 
              :class="{active: item.value==VALUE}" 
              v-for="(item,index) in option"
              @click="onChangeRadio(index)"
              :key="index">
              <span class="radio-icon"></span>
              {{item.label}}</div>
      </div>
      <i class="u-input-icon-clear"
         v-if="hasClear && VALUE && !readonly && !disabled && isFocus"
         @click="onClear"></i>
    </div>
    <div v-if="$slots.right"
         class="u-input-right">
      <!-- @slot right:输入框右边自定义插槽，必须指定name -->
      <slot name="right"></slot>
    </div>
  </div>
</template>
<script>
import masker from "./masker";
import validator from "./validator";

/**
 * 输入框组件
 *
 * @component
 *
 * @example <caption>示例</caption>
 *
 * <u-input border="around"></u-input>
 *
 * <u-input title="账号名称" border="around" placeholder="请输入账号名称..."></u-input>
 *
 */
export default {
  name: "UInput",
  props: {
    /**
     * 是否必填
     */
    isRequire: {
      type: Boolean,
      default: false
    },
    /**
     * 最小输入字符限制
     */
    min: Number,
    /**
     * 最大输入字符限制，等同于maxlength，达到限制到不能再输入
     */
    max: Number,
    /**
     * 最大输入字符限制，等同于maxlength，达到限制到不能再输入
     */
    maxlength: {
      type: Number,
      default: 140
    },
    /**
     * 输入框 name 值
     */
    name: String,
    /**
     * 输入框输入值限制规则，“0-9.”、“0-9”、“a-z”、“0-9|a-z”分别
     * 表示输入数字（包括小数点）、数字、字母、数字和字母
     */
    rule: [String, RegExp],
    /**
     * 输入提示话术
     */
    placeholder: String,
    /**
     * 输入框值，使用v-model绑定
     */
    value: [String, Number],
    /**
     * 禁用
     */
    disabled: {
      type: Boolean,
      default: false
    },
    /**
     * 只读
     */
    readonly: {
      type: Boolean,
      default: false
    },
    /**
     * 自动完成
     */
    autocomplete: {
      type: String,
      default: "off"
    },
    autocapitalize: {
      type: String,
      default: "off"
    },
    /**
     * 自动更正
     */
    autocorrect: {
      type: String,
      default: "off"
    },
    /**
     * 拼写检查
     */
    spellcheck: {
      type: String,
      default: "false"
    },
    /**
     * 输入框后面是否有清除按钮
     */
    hasClear: {
      type: Boolean,
      default: false
    },
    /**
     * 是否必输
     */
    required: {
      type: Boolean,
      default: false
    },
    /**
     * input的type属性，目前支持 text,number,email,password,tel
     * 新增--radio选项，需要配合option给候选参数
     */
    type: {
      type: String,
      default: "text"
    },
    /**
     * 候选参数-用于type=radio
     * 例如：{label:'男',value:'1'}
     */
    option: {
      type: Array,
      default: []
    },
    /**
     * 输入框标题
     */
    title: {
      type: String,
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
     * 输入框小标题
     */
    tip: {
      type: String,
      default: ""
    },
    /**
     * 输入框input样式
     */
    clazz: [String, Object],
    /**
     * 输入框input样式
     */
    styls: [String, Object],
    /**
     * 输入框校验枚举（phone/email/idcard）或自定义校验
     */
    verify: [String, Function],
    /**
     * 目标输入框，可以校验两个输入框输入是否一致
     */
    equalWith: String,
    /**
     * 输入框输入横向对齐方式 textAlign="right" 表示靠右显示;默认靠左
     */
    textAlign: {
      type: String,
      default: "left"
    },
    /**
     * 输入框提示横向对齐方式
     */
    holdAlign: String,
    /**
     * 输入框 change 事件频率
     */
    debounce: Number,
    /**
     * 值格式化，其中 9 表示数字，A 表示大写字母，S 表示数字或者字母
     */
    format: String,
    /**
     * 输入值返回预处理，其中可选值定义为：
     * <p>left ：表示去除左边空白符</p>
     * <p>both ：表示去除左右两边空白符</p>
     * <p>right：表示去除右边空白符</p>
     * <p>all  ：表示去除所有空白符</p>
     */
    trim: {
      type: String,
      default: "both",
      validator(v) {
        return ["left", "both", "right", "all"].includes(v);
      }
    },
    /**
     * 输入框边框，可选值定义为：
     * <p>around ： 四个边框</p>
     * <p>bottom ： 底部边框</p>
     * <p>none   ： 没有边框</p>
     */
    border: {
      type: String,
      default: "none",
      validator(v) {
        return [
          "around",
          "bottom",
          "none",
          "all-line-around",
          "all-line-bottom"
        ].includes(v);
      }
    },
    /**
     * 去除输入框外包装底部边框
     */
    noWrapperBottomBorder: {
      type: Boolean,
      default: false
    },
    /**
     * 是否是金额输入框
     */
    isAmount: {
      type: Boolean,
      default: false
    },
    bgColor: {
      type: String,
      default: ''
    }
  },
  model: {
    prop: "value",
    event: "on-sync"
  },
  data() {
    return {
      uuid: `u-input-${Math.random()
        .toString(36)
        .substring(3, 8)}`,
      doValidate: true,
      pristine: true,
      isFocus: false,
      VALUE: "",
      equeue: [],
      showMarginRigh: false,
    };
  },
  watch: {
    value(v) {
      if (this.pristine === true) {
        this.pristine = false;
      }
      if (!this.handleChangeEvent) {
        this.emitInput(v);
        this.emitChange(v);
      }
      this.VALUE = v;
    },
    format(v) {
      if (v && this.VALUE) {
        this.VALUE = this.maskValue(this.VALUE);
      }
    },
    doValidate() {
      // TODO
    },
    equalWith(v) {
      if (v && this.equalWith) {
        this.validateEqual();
      } else {
        this.validate();
      }
    },
    VALUE(nv, ov) {
      if(!ov){
        ov=""
      }
      // 用于 v-model 更新值
      this.$emit("input", nv);
      if (!nv) {
        return;
      }
      if (!this.equalWith && nv) {
        this.validateEqual();
      }
      if (nv && this.equalWith) {
        this.validateEqual();
      } else {
        this.validate();
      }

      let selection = this.$refs.input
        ? this.$refs.input.selectionStart
        : null;
      let direction = nv.length - ov.length;
      const mvalue = this.maskValue(nv);
      selection = this.getInputSelection(selection, direction, mvalue);
      this.lastDirection = direction;
      this.emitInput(mvalue);
      this.$nextTick(() => {
        if (
          this.$refs.input &&
          this.$refs.input.selectionStart !== selection
        ) {
          this.$refs.input.selectionStart = selection;
          this.$refs.input.selectionEnd = selection;
        }
        if (this.VALUE !== mvalue) {
          this.VALUE = mvalue;
        }
      });

      if (this.debounceFunction) {
        this.debounceFunction();
      } else {
        this.emitChange(nv);
      }
    }
  },
  computed: {
    dirty: {
      get: function () {
        return !this.pristine;
      },
      set: function (v) {
        this.pristine = !v;
      }
    },
    getLeftStyle() {
      const styles = [];
      if (this.titleColor) {
        styles.push(`color:${this.titleColor};`);
      }
      return styles.join(" ");
    },
    getInputWrapStyle() {
      let rt = []
      if(this.bgColor){
        rt.push(`background-color: ${this.bgColor}`)
      }
      return rt.join(";");;
    },
    getInputWrapClass() {
      const classes = [];
      classes.push("u-cell");
      classes.push("u-group-cell");
      classes.push("u-input");
      classes.push("app-input");
      if (!this.noWrapperBottomBorder) {
        classes.push("app-input-wrapper-bottom-line");
      }

      if (this.disabled) {
        classes.push("u-input-disabled");
      }
      if (this.disabled) {
        classes.push("app-input-disabled");
      }

      if (/^all-line-/.test(this.border)) {
        const bd = this.border.replace("all-line-", "");
        classes.push(`app-input-border-${bd}`);
      }
      return classes.join(" ");
    },
    getInputLabelClass() {
      const classes = [];
      classes.push("u-input-label");
      if (this.isAmount) {
        classes.push("u-input-label-amount");
      }
      if (
        (this.$parent && this.$parent.labelAlign === "justify") ||
        (this.$parent &&
          this.$parent.$parent &&
          this.$parent.$parent.labelAlign === "justify")
      ) {
        classes.push("u-input-label-justify");
      }
      classes.push("app-input-label");
      return classes.join(" ");
    },
    getInputCenterClass() {
      const clazz = [];
      clazz.push("u-input-center");
      if (!/^all-line-/.test(this.border)) {
        clazz.push(`app-input-border-${this.border}`);
      }
      return clazz.join(" ");
    },
    getRealInputStyle() {
      let styles = {};
      if (this.textAlign) {
        styles["text-align"] = this.textAlign;
      }
      if (typeof this.styls === "object") {
        styles = Object.assign({}, styles, this.styls);
      }
      let style = "";
      for (const k in styles) {
        style = style + `${k}:${styles[k]};`;
      }
      if (typeof this.styls === "string") {
        style = style + this.styls;
      }
      return style;
    },
    getRealInputClass() {
      const classes = [];
      // if (this.showMarginRigh) {
      //     classes.push("u-input-real-margin-right");
      // }
      if (this.holdAlign) {
        classes.push(`u-input-placeholder-${this.holdAlign}`);
      }
      if (typeof this.clazz === "object") {
        for (const cls in this.clazz) {
          if (this.clazz[cls]) {
            classes.push(cls);
          }
        }
      }
      if (typeof this.clazz === "string") {
        classes.push(this.clazz);
      }
      if (this.isAmount) {
        classes.push("u-input-real-amount");
      }

      return classes.join(" ");
    },
    pattern() {
      return ["number", "tel"].includes(this.type) ? "[0-9]*" : "";
    }
  },
  created() {
    this.equeue = [];
    this.handleChangeEvent = false;
    this.VALUE =
      this.value === undefined || this.value === null
        ? ""
        : this.format
          ? this.maskValue(this.value)
          : this.value;
    if (
      this.required &&
      (typeof this.VALUE === "undefined" || this.VALUE === "")
    ) {
      this.doValidate = false;
    }
    this.handleChangeEvent = true;
    if (this.debounce) {
      this.debounceFunction = lodash.debounce(() => {
        this.emitChange(this.VALUE);
      }, this.debounce);
    }
  },
  mounted() {
    if (window && window.addEventListener) {
      window.addEventListener("resize", this.onResize);
    }
  },
  updated() { },
  beforeDestroy() {
    this.equeue = [];
    if (this.debounceFunction) {
      this.debounceFunction.cancel();
    }
    if (window && typeof window.removeEventListener === "function") {
      window.removeEventListener("resize", this.onResize);
    }
  },
  methods: {
    focus() {
      if (this.readOnly) {
        return;
      }
      if (
        this.$refs.input &&
        typeof this.$refs.input.focus === "function"
      ) {
        this.$refs.input.focus();
      }

      this.isFocus = true;
    },
    blur() {
      if (
        this.$refs.input &&
        typeof this.$refs.input.blur === "function"
      ) {
        this.$refs.input.blur();
      }
    },
    onResize(time = 0) {
      if (
        document &&
        document.activeElement &&
        (document.activeElement.tagName === "INPUT" ||
          document.activeElement.tagName === "TEXTAREA")
      ) {
        const id = setTimeout(() => {
          if (
            this.$refs.input &&
            typeof this.$refs.input.scrollIntoViewIfNeeded ===
            "function"
          ) {
            this.$refs.input.scrollIntoViewIfNeeded(true);
          }
          clearTimeout(id);
        }, time);
      }
    },
    /**
     * 点击清除按钮
     */
    onClear() {
      this.VALUE = "";
      const id = setTimeout(() => {
        this.focus();
        this.emitClear();
        clearTimeout(id);
      }, 801);
    },
    /**
     * 监听原生focus输入事件并对输入值进行预处理
     */
    onRealInputFocus($event) {
      if (this.readOnly) {
        return;
      }
      this.emitFocus(this.VALUE, $event);
      const delay = setTimeout(() => {
        // this.showMarginRigh = true;
        this.isFocus = true;
        if (
          this.$refs.input &&
          typeof this.$refs.input.scrollIntoViewIfNeeded ===
          "function"
        ) {
          this.$refs.input.scrollIntoViewIfNeeded(false);
        }
        clearTimeout(delay);
      }, 800);
    },
    /**
     * 监听原生blur输入事件并对输入值进行预处理
     */
    onRealInputBlur($event) {
      this.validate();
      this.eimtBlur(this.VALUE, $event);
      const delay = setTimeout(() => {
        // this.showMarginRigh = false;
        this.isFocus = false;
        clearTimeout(delay);
      }, 300);
    },
    /**
     * 监听原生keyup输入事件并对输入值进行预处理
     */
    onRealInputKeyUp(e) {
      if (e.key === "Enter") {
        if (e && e.target && typeof e.target.blur === "function") {
          e.target.blur();
        }
        this.emitEnter(this.VALUE, e);
      }
    },
    /**
     * 监听原生input输入事件并对输入值进行预处理
     */
    onRealInput() {
      if (this.rule === "0-9.") {
        this.VALUE = this.VALUE.replace(/[^\d|\\.?]/g, "");
        const vs = this.VALUE.split(".");
        if (this.VALUE.startsWith(".")) {
          this.VALUE = this.VALUE.replace(".", "");
        }
        if (vs.length > 2) {
          this.VALUE = `${parseInt(vs[0])}.${vs.slice(1).join("")}`;
        }
      } else if (this.rule === "0-9") {
        this.VALUE = this.VALUE.replace(/\D/g, "");
      } else if (this.rule === "a-z") {
        this.VALUE = this.VALUE.replace(/[^a-z|A-Z]/g, "");
      } else if (this.rule === "0-9|a-z") {
        this.VALUE = this.VALUE.replace(/[\W|_]/g, "");
      }
    },
    /**
     * 输入框输入值反显格式化
     * @param {String} val 待格式化值
     *
     * @return {String} 格式化后值
     */
    maskValue(val) {
      if (this.format && masker && typeof masker.pattern === "function") {
        return masker.pattern(val, this.format);
      }
      return val;
    },
    /**
     * 处理单选框改变事件
     * @param {String} index option索引
     *
     * @return {String} option的value值给 Value
     */
    onChangeRadio(index) {
      if(!this.readonly){
        this.VALUE = this.option[index].value
      }
    },
    /**
     * 输入值校验
     */
    validate() {
      if (typeof this.equalWith !== "undefined") {
        return this.validateEqual();
      }

      if (!this.VALUE && !this.required) {
        return (this.doValidate = true);
      }

      if (!this.VALUE && this.required) {
        this.equeue.push("输入项必填");
        return (this.doValidate = false);
      }

      const Value = validator[this.verify];
      if (typeof this.verify === "string" && Value) {
        const val = this.VALUE.replace(/\s+/g, "");
        const valid = Value.test(val);
        if (!valid) {
          this.equeue.push(`${Value.tag}格式不正确`);
          return (this.doValidate = valid);
        }
      }

      if (typeof this.verify === "function") {
        const result = this.verify(this.VALUE);
        const valid = typeof result !== "string";
        if (!valid) {
          this.equeue.push(`${result}格式不正确`);
          return (this.doValidate = valid);
        }
      }

      if (this.min && this.VALUE.length < this.min) {
        this.equeue.push(`最少应该输入${this.min}个字符`);
        return (this.doValidate = false);
      }

      if (this.max && this.VALUE.length > this.max) {
        this.equeue.push(`最多可以输入${this.max}个字符`);
        return (this.doValidate = false);
      }

      return (this.doValidate = true);
    },
    /**
     * 比较与目标输入框的输入值是否相等
     */
    validateEqual() {
      if (!this.equalWith && this.VALUE) {
        this.equeue.push("输入不一致");
        return (this.doValidate = false);
      }
      let willCheck =
        this.dirty || this.VALUE.length >= this.equalWith.length;
      // 只在长度符合时显示正确与否
      if (willCheck && this.VALUE !== this.equalWith) {
        this.equeue.push("输入不一致");
        return (this.doValidate = false);
      }
      if (!this.VALUE && this.required) {
        return (this.doValidate = false);
      }
      return (this.doValidate = true);
    },
    /**
     * 处理输入框光标
     */
    getInputSelection(selection, direction, mask, loop) {
      if (!this.format || (loop && direction === 0)) {
        return selection;
      }
      if (direction === 0) {
        /* eslint no-param-reassign:0 */
        direction = this.lastDirection;
      }
      if (direction > 0) {
        const len = this.format.replace(/\s+/g, "").length;
        const ch = this.format.substr(selection - direction, 1);
        if (!ch.match(/[9SA]/) && selection <= len) {
          return this.getInputSelection(
            selection + 1,
            direction,
            mask,
            true
          );
        }
      }
      return selection;
    },
    /**
     * 处理输入值前后的空白符
     *
     * @param {String} v 待处理输入值
     *
     * @returns {String} 处理空白符后值
     */
    handleValue(v) {
      if(typeof v !== "string") return v
      v = v ? v : "";
      if (this.trim === "left") {
        return v.trimLeft();
      } else if (this.trim === "both") {
        return v.trim();
      } else if (this.trim === "right") {
        return v.trimRight();
      } else {
        return v.replace(/\s+/g, "");
      }
    },
    emitClear() {
      /**
       * 清除事件
       * @event on-clear
       */
      this.$emit("on-clear");
    },
    eimtBlur(v, e) {
      /**
       * 失去焦点事件
       * @event on-blur
       */
      this.$emit("on-blur", this.handleValue(v), e);
    },
    emitFocus(v, e) {
      /**
       * 获得焦点事件
       * @event on-focus
       */
      this.$emit("on-focus", this.handleValue(v), e);
    },
    emitEnter(v, e) {
      /**
       * 回车事件
       * @event on-enter
       */
      this.$emit("on-enter", this.handleValue(v), e);
    },
    emitInput(v) {
      /**
       * 输入事件
       * @event on-input
       */
      this.$emit("on-input", this.handleValue(v));
    },
    emitChange(v) {
      /**
       * 值改变事件
       * @event on-change
       */
      this.$emit("on-change", this.handleValue(v));
    }
  }
};
</script>
<style lang="scss" scoped>
  @import './style.scss';
</style>
