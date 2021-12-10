<!--
 * @Description: 活动报名
 * @version: 
 * @Author: gonghonglin
 * @Date: 2021-08-03 20:32:56
 * @LastEditors: gonghonglin
 * @LastEditTime: 2021-10-14 15:42:16
-->
<template>
  <div class="myactivity">
    <div class="myactivity-list">
      <div
        class="myactivity-img"
        :style="{ 'background-image': `url(${curItem.urls})` }"
      ></div>
      <div class="myactivity-box">
        <div class="myactivity-inbox">
          <div class="myactivity-title">{{ curItem.title || '...' }}</div>
          <div class="myactivity-item">
            <span>活动时间</span>
            <span class="myactivity-value">{{ curItem._expTimes }}</span>
          </div>
          <div class="myactivity-item">
            <span>报名时间</span>
            <span class="myactivity-value">{{ curItem._joinTimes }}</span>
          </div>
          <div class="myactivity-item">
            <span class="myactivity-address">活动地点</span>
            <span class="myactivity-value">{{ curItem.address || '' }}</span>
            <div class="number-Applicants">
              已报名
              {{
                curItem.virtualManCount > curItem.manCount
                  ? curItem.virtualManCount
                  : curItem.manCount
              }}
              人
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="Registration">
      <h2>报名信息</h2>
      <div class="input-group" v-for="(item, index) in formData" :key="index">
        <div class="label" :class="{ require: item.require }">
          <span v-for="text in item.label" :key="text">{{ text }}</span>
        </div>
        ：
        <input
          type="text"
          :placeholder="item.plactholder"
          :maxlength="item.type == 0 ? 50 : 20"
          v-model="item.value"
          @input="inputChange($event, index)"
          @blur="inputBlur($event, index)"
        />
      </div>
      <div class="btn" @click="saveRegistration()">确定</div>
    </div>
    <UPopup v-model="isShowResult">
      <div class="registration">
        <div class="card-container card-result">
          <div class="close" @click="hideResult">&times;</div>
          <img class="icon" v-if="isSuccess" src="@/static/icon-success.png" />
          <img class="icon" v-else src="@/static/icon-error.png" />
          <div class="title-x">{{ isSuccess ? '报名成功' : '报名失败' }}</div>
        </div>
      </div>
    </UPopup>
  </div>
</template>

<script>
import UPopup from '@/components/UPopup'
import apis from '@/apis'
export default {
  components: {
    UPopup
  },
  props: {},
  data() {
    return {
      formData: [],
      curItem: {},
      isSuccess: false,
      isShowResult: false,
      gatheringHistoryInsert: {},
      id: '',
      isReady: false,
      userInfo: {
        sex: {
          1: '男',
          2: '女'
        }
      }
    }
  },
  onShow() {
    if (this.isReady && this.id == '') {
      uni.navigateBack()
    }
  },
  async onLoad() {
    this.id = this.curItem.id
    this.curItem = this.$client.getParam()
    var arr = JSON.parse(this.curItem.formData)
    var list = []
    arr.forEach((item) => {
      item.show && list.push(item)
    })
    // this.formData = list

    // 获取个人信息
    let { data } = await this.$client.rpc(this.$api.GET_USER_INFO)
    this.$set(this, 'userInfo', data.data)

    // 自动填充个人信息
    // let _formData = JSON.parse(JSON.stringify(this.formData))
    for (const item of list) {
      if (item.auto) {
        if (item.type == 1) {
          item.value = this.userInfo.name
        }
        if (item.type == 2) {
          item.value = this.userInfo.phone
        }
        if (item.type == 3 && this.userInfo.certificateVos.length) {
          item.value = this.userInfo.certificateVos[0].certificateNumber
        }
        if (item.type == 4 && this.userInfo.addressVos.length) {
          item.value =
            this.userInfo.addressVos[0].city + this.userInfo.addressVos[0].address
        }
      }
    }

    this.formData = list
    // 标记已经加载完成
    this.isReady = true
  },
  methods: {
    inputChange(e, index) {
      this.$set(this.formData[index], 'value', e.detail.value)
    },
    inputBlur(e, index) {
      if (this.formData[index].type == 4) {
        // 地址不去全部空格
        this.$set(this.formData[index], 'value', e.detail.value.trim())
      } else {
        this.$set(this.formData[index], 'value', e.detail.value.replace(/\s+/g, ''))
      }
    },
    async getPromotiondetail(id) {
      let { data } = await this.$client.rpc(this.$api.PROMOTION_LIST, {
        gatheringStatus: 1,
        id,
        page: 1,
        pageSize: 1
      })
      this.$set(this, 'curItem', data.rows[0])
      this.curItem._expTimes =
        this.date2Str(this.curItem.startTime, 'YYYY/MM/DD') +
        '-' +
        this.date2Str(this.curItem.endTime, 'YYYY/MM/DD')
    },
    // 时间格式的转化---年月日
    date2Str(date, format) {
      return this.$tools.str2DateStr(date, format)
    },

    //  新增活动报名
    async getnewPromotion() {
      let { data } = await this.$client.rpc(apis.PROMOTION_INSERT, {})
      this.$set(this, 'promotionList', data.rows)
    },
    async saveRegistration() {
      for (let item of this.formData) {
        if (item.require && !item.value) {
          this.$client.toast('请输入' + item.label)
          return
        } else {
          // 1-姓名，
          if (item.type == 1 && item.value && item.value.length > 10) {
            this.$client.toast('请输入正确的姓名')
            return
          }
          // 2-手机号，
          if (item.type == 2 && item.value) {
            let regTel = /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/
            if (!regTel.test(item.value)) {
              this.$client.toast('请输入正确的手机号码')
              return
            }
          }
          //身份证验证
          if (item.type == 3 && item.value) {
            const re15 = /^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$/
            const re18 = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
            if (!re15.test(item.value) && !re18.test(item.value)) {
              this.$client.toast('请输入正确的身份证号码')
              return
            }
          }
          // // 性别
          // if(item.type == 3 && item.value){

          //   return
          // }
        }
      }

      var gatheringId = this.curItem.id
      var formJson = JSON.stringify(this.formData)
      let { data } = await this.$client.rpc(apis.PROMOTION_INSERT, {
        formData: formJson,
        gatheringId: gatheringId
      })
      // console.log(data);
      this.isSuccess = true
      this.isShowResult = true
      this.id = ''
      setTimeout(() => {
        this.$client.pushWindow('/pkSNS/promotion/signup', {
          id: gatheringId
        })
      }, 2000)
      this.$client.pushEventNew(5, {}) // 埋点-参与活动
    },
    // async saveRegistration() {
    //   let data = this.keyword;

    // console.log(JSON.stringify(data));

    //   if (!this.canSubmit) {
    //     this.$client.alert("请填写报名信息");
    //     return;
    //   }
    //   this.showResult();
    // },

    // 结果
    showResult(isSuccess = true) {
      this.isSuccess = isSuccess
      this.isShowResult = true
      this.$client.pushEventNew(5, {
        success: true,
        id: this.id
      }) // 埋点
    },
    hideResult() {
      this.isShowResult = false
      this.$client.pushEventNew(5, {
        success: false,
        id: this.id
      }) // 埋点
    }
  }
}
</script>
<style>
page {
  background: #f8f8f8;
}
</style>
<style lang="scss" scoped>
.myactivity {
  padding: 15px;
  padding-bottom: 120px;
  background: #f8f8f8;
  .myactivity-list {
    padding: 10px;
    background-color: #ffffff;
    .myactivity-img {
      background-color: #f0f0f0;
      background-repeat: no-repeat;
      background-size: cover;
      background-position: center;
      height: 138px;
    }
    .myactivity-box {
      background-color: #ffffff;
      font-size: 12px;
      .myactivity-inbox {
        .myactivity-title {
          font-size: 14px;
          font-weight: 600;
          line-height: 1.5em;
          padding-top: 10px;
          color: #333;
        }
        .myactivity-item {
          display: flex;
          span {
            display: inline-block;
          }
          span:nth-child(1) {
            width: 60px;
          }
          span:nth-child(2) {
            flex: 1;
            color: #333333;
          }
          .myactivity-value {
            width: 265px;
          }
        }
      }
    }
    .myactivity-bottom {
      background-color: #ffffff;
      padding-left: 10px;
      .myactivity-bottom-litle {
        font-size: 14px;
        color: #333333;
        padding-top: 15px;
      }
      .myactivity-bottom-time {
        color: #999999;
        font-size: 12px;
        padding-top: 5px;
      }
      .myactivity-bottom-place {
        display: flex;
        justify-content: space-around;
        color: #999999;
        font-size: 12px;
        padding-top: 5px;
        .number-Applicants {
          font-size: 12px;
          color: #333333;
          padding-right: 10px;
          span {
            color: #f0c17b;
          }
        }
      }
    }
  }
  .Registration {
    margin-top: 20px;
    background: #ffffff;
    border-radius: 10px;
    padding-bottom: 20px;
    h2 {
      text-align: center;
      padding: 25px 0;
    }
    .input-group {
      display: flex;
      height: 40px;
      background: #f8f8f8;
      border-radius: 10px;
      line-height: 40px;
      margin: 0 20px 20px;
      align-items: center;
      padding: 0 10px;
      font-size: 14px;
      .label {
        position: relative;
        min-width: 60px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-right: 5px;
        margin-right: 10px;
        font-weight: 600;
      }
      .label.require::after {
        content: '*';
        color: #e20000;
        position: absolute;
        top: 50%;
        right: -7px;
        transform: translate(0, -40%);
      }
      input {
        flex: 1;
      }
    }
    .btn {
      width: 160px;
      height: 50px;
      background: #f0c17b;
      border-radius: 25px;
      color: #ffffff;
      @include flexLayout;
      position: fixed;
      bottom: 40px;
      left: calc(50% - 80px);
      &:active {
        background: #d8ab68;
      }
      &.disabled {
        background: #d3d3d3;
      }
    }
  }
  .registration {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 315px;
    height: 315px;
    background: #ffffff;
    box-shadow: 0px 6px 22px 0px rgba(162, 101, 10, 0.4);
    border-radius: 10px;
    .card-result {
      width: 240px;
      height: 240px;
      position: relative;
      @include flexLayout(column, center, center);
      .icon {
        margin-bottom: 20px;
        height: 100px;
        width: 100px;
      }
      .close {
        width: 20px;
        height: 20px;
        font-size: 20px;
        @include flexLayout(row, center, center);
        position: absolute;
        right: -34px;
        top: -33px;
        color: #d8d8d8;
      }
      .title-x {
        font-size: 16px;
        font-weight: 600;
      }
    }
  }
}
</style>
