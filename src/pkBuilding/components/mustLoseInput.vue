<template>
    <div class="u-money-input">
      <div class="input-frame">
        <div class="icon-text">
          {{cell}}
          <div class="icon" v-show="Star">*</div>
        </div>
        <div style="margin-left: 25px;" v-show="!placeholder && nuber == 0">
            <radio-group  bindchange="handleChange">
              <radio   color="#F0C17B" font-size="14px" value="male" checked="false"></radio><text>男</text>
              <radio  color="#F0C17B" font-size="14px" value="female" checked="false"></radio><text>女</text>
            </radio-group>
        </div>
        <input v-show="placeholder" @input="onInput"
              @blur="onBlur"
              @focus="onFocus"
              :value="VALUE"
              type="digit"
              :placeholder="placeholder"
              placeholder-style="color:#c1c1c1;font-size:14px;" />
      </div>
  </div>
</template>
<script>
    export default {
        name: "mustLoseInpput",
        props: {
            value: {
              type: String,
              default: ''
            },
            placeholder: {
                type: String,
                default: ''
            },
            cell: {
                type: String,
                default: '',
            },
            Star: {
                type: String,
                default: '',
            },
            nuber: {
                type: Number,
                default: 0,
            }
        },
        data () {
          return{
              gender: '',
          }
        },
        methods: {
          /**
           * @description: input输入
           */
          onInput(e) {
              // console.log('=====')
          },
          onBlur() {
            this.$emit('on-blur失焦', this.VALUE);
          },
          /**
           * @description: 获取焦点，直接把格式去掉
           */
          onFocus(e) {
              // console.log('聚焦')
          },
          handleChange(e){
          }
        },
    }
</script>
<style lang="scss" scoped>
.u-money-input {
  margin: 0 15px;
  background-color: #fff;

  .input-frame {
    display: flex;
    justify-content: left;
    align-items: center;
    border-bottom: 1px solid #F3F3F3;
    padding: 10px 0;
    radio {
      transform:scale(0.5);
    }
    text{
      color:#333;
      font-size: 14px;
    }
    .icon-text{
        font-size: 14px;
        color: #666666;
        display: flex;
        .icon {
          color: #FF2525;
        }
    }

    input {
      font-size: 14px;
      flex: 1;
      margin-left: 30px;
    }
  }
}
</style>