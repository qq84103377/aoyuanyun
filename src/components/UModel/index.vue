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
  @import './style.scss';
</style>
