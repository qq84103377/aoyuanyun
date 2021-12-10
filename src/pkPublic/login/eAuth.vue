<template>
  <UPopup v-model="copyValue"
          type="center">
    <div class="u-model">
      <div class="title">{{title}}</div>
      <div v-if="$slot.content">
        <slot name="content"></slot>
      </div>
      <div class="content"
           v-else>{{content}}</div>
      <div class="btn-line"></div>
      <div class="footer-btn">
        <template v-if="showCancel">
          <button class="cancel-btn"
                  :style="getCancelBtnStyle"
                  @click="handelCancel">{{cancelText}}</button>
          <div class="vertical-line"></div>
        </template>
        <button class="confirm-btn"
                :style="getConfirmBtnStyle"
                :open-type="openType"
                @click="handelConfirm"
                @getuserinfo="getUserInfo"
                @getphonenumber="getPhoneNumber">{{confirmText}}</button>
      </div>
    </div>
  </UPopup>
</template>

<script>
import UPopup from '@/components/UPopup';
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '温馨提示'
    },
    content: {
      type: String,
      default: ''
    },
    confirmText: {
      type: String,
      default: '确定'
    },
    cancelText: {
      type: String,
      default: '取消'
    },
    confirmColor: {
      type: String,
      default: '#F23D59'
    },
    cancelColor: {
      type: String,
      default: '#888888'
    },
    showCancel: {
      type: Boolean,
      default: true
    },
    openType: {
      type: String,
      default: '',
    },

  },
  components: {
    UPopup
  },
  watch: {
    value: {
      handler(n) {
        this.copyValue = n;
      },
      immediate: true
    },
    copyValue: {
      handler(n) {
        this.$emit('input', n);
      }
    }
  },
  computed: {
    getCancelBtnStyle() {
      let styleObj = {
        color: this.cancelColor
      };
      let styleArr = [];
      for (const key in styleObj) {
        styleArr.push(key + ':' + styleObj[key])
      }
      return styleArr.join(';');
    },
    getConfirmBtnStyle() {
      let styleObj = {
        color: this.confirmColor
      };
      let styleArr = [];
      for (const key in styleObj) {
        styleArr.push(key + ':' + styleObj[key])
      }
      return styleArr.join(';');;
    },
  },
  data() {
    return {
      copyValue: false,
    }
  },
  methods: {
    handelCancel() {
      this.copyValue = false;
      this.$emit('cancel');
    },
    handelConfirm() {
      this.copyValue = false;
      this.$emit('confrim');
    },
    getUserInfo(evt) {
      this.$emit('getUserInfo', evt);
    },
    getPhoneNumber(evt) {
      this.$emit('getPhoneNumber', evt);
    }
  }
}
</script>

<style lang="scss" scoped>
.u-model {
  position: fixed;
  left: 32px;
  right: 32px;
  top: 50%;
  transform: translateY(-50%);
  background-color: #fff;
  box-shadow: 0px 4px 40px 0px rgba(176, 176, 176, 0.4);
  border-radius: 24px;

  .title {
    margin: 0 88px;
    font-size: 16px;
    color: #09122B;
    margin: 30px 0 30px;
    text-align: center;
    font-weight: 600;
  }

  .content {
    margin: 0 88px;
    font-size: 14px;
    font-weight: 400;
    color: #333333;
    text-align: center;
  }

  .btn-line {
    background-color: #eee;
    height: 2px;
    margin-top: 30px;
  }

  .footer-btn {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .cancel-btn,
    .confirm-btn {
      font-size: 16px;
      font-weight: 600;
      flex: 1;
      background-color: #fff;
    }

    button::after {
      border: none;
    }

    .vertical-line {
      width: 2px;
      background-color: #eee;
      height: 100px;
    }
  }
}
</style>
