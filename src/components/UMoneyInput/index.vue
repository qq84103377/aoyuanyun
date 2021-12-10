<template>
  <div class="u-money-input">
    <div class="input-frame">
      <div class="icon"></div>
      <input @input="onInput"
             @blur="onBlur"
             @focus="onFocus"
             :maxlength="maxlength"
             :value="VALUE"
             type="digit"
             :placeholder="placeholder"
             placeholder-style="color:#c1c1c1;font-size:24px;" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: '请输入'
    },
    // 格式化后的最长长度
    maxlength: {
      type: String,
      default: '17'
    },
    // 格式化前的最长长度
    maxlength2: {
      type: String,
      default: '13'
    },
    // 是否拥有尾巴（小数位）
    hasTail: true,
  },
  data() {
    return {
      VALUE: '',
    };
  },
  watch: {
    value: {
      handler(v) {
        this.VALUE = v;
      },
      immediate: true,
    },
    VALUE: {
      handler(v) {
        this.$emit("input", v);
        this.$emit('on-change', v);
      },
      immediate: true,
    }
  },
  created() {
    this.VALUE = this.value === undefined || this.value === null ? "" : this.value;
  },
  methods: {
    /**
     * @description: 获取焦点，直接把格式去掉
     */
    onFocus(e) {
      this.VALUE = this.refundAmoutInput(e.detail.value);
    },
    /**
     * @description: input输入
     */
    onInput(e) {
      let tmp = this.refundAmoutInput(e.detail.value);
      tmp = tmp.slice(0, +this.maxlength2);
      this.VALUE = tmp;
      // this.VALUE = this.getThousandNum(this.VALUE);
      this.$emit('on-input', this.VALUE);
      // 只有return才能限制输入格式化，小程序的坑？
      return {
        value: this.VALUE
      }
    },
    /**
     * @description: 金额输入格式化
     */
    refundAmoutInput(value) {
      value = value.replace(/[^\d\.]|^\./g, '').replace(/\.{2}/g, '.').replace(/^([1-9]\d*|0)(\.\d{1,2})(\.|\d{1})?$/, '$1$2').replace(/^0\d{1}/g, '0');
      // 处理尾巴（小数点）
      if (this.hasTail === false) {
        value = value.replace(/\./g, '');
      }
      return value
    },
    /**
     * @description: 金额千位分隔
     */
    getThousandNum(num) {
      return (num || '').toString().replace(/\d+/, function (n) {
        var len = n.length;
        if (len % 3 === 0) {
          return n.replace(/(\d{3})/g, ',$1').slice(1);
        } else {
          return n.slice(0, len % 3) + n.slice(len % 3).replace(/(\d{3})/g, ',$1');
        }
      });
    },
    onBlur() {
      this.$emit('on-blur', this.VALUE);
    }
  },
};
</script>

<style lang="scss" scoped>
  @import './style.scss';
</style>
