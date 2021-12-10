<!--
 * @Description: 我的银行卡列表，已绑定的银行卡
 * @version: 
 * @Author: gonghonglin
 * @Date: 2021-08-30 09:32:54
 * @LastEditors: gonghonglin
 * @LastEditTime: 2021-09-10 16:53:45
-->
<template>
  <div class="bank">
    <div class="back_header">
      <div class="header_text">我的卡</div>
      <!-- <div class="header_btn">解绑银行卡</div> -->
    </div>
    <div class="back_card" v-for="(item, index) in bankList" :key="index">
      <img src="http://img.asset/bank_list_icon.png" class="background_bank" />
      <div class="card_name">
        {{ item.bankName }}
        <span class="badge">{{ item.cardDefault ? '默认' : '' }}</span>
      </div>
      <div class="card_text">{{ item.cardTypeName || '储蓄卡' }}</div>
      <div class="card_num">{{ item.bankCard }}</div>
    </div>
    <!-- 无数据 -->
    <div class="no-record" v-if="!bankList.length"></div>
    <div v-if="bankList.length < 5" class="back_btn" @click="add">
      <span>+</span>
      绑定银行卡
    </div>
  </div>
</template>

<script>
let BCI = require('./bankCardInfo')
export default {
  data() {
    return {
      bankList: [
        // {
        //   bankCard: "789561234565"
        //   bankName: "交通银行"
        //   cardDefault: 1
        //   id: "3"
        // }
      ]
    }
  },
  // mounted() {
  //   this.$set(this, 'bankList', this.$client.getParam())
  //   this.refreshBankTypeName()
  // },
  async onShow() {
    let { data } = await this.$client.rpc(this.$api.BIND_LIST)
    if (data.success) {
      this.$set(
        this,
        'bankList',
        data.rows.map((item) => {
          item.bankCard =
            item.bankCard.slice(0, 4) +
            ' **** **** ' +
            item.bankCard.slice(item.bankCard.length - 4)
          return item
        })
      )
    }
    this.refreshBankTypeName()
  },
  methods: {
    async refreshBankTypeName() {
      // console.log('bankList=',this.bankList)
      for (const item of this.bankList) {
        if (item.bankCard.length >= 16 && item.bankCard.length <= 18) {
          let cardInfo = await this.getBankInfo(item.bankCard)
          this.$set(item, 'cardTypeName', cardInfo.cardTypeName || '')
          // item = Object.assign(item, {cardTypeName: cardInfo.cardTypeName || ''})
        }
      }
      // this.$set(this,'bankList', this.bankList.concat([]))
      // console.log(111,this.bankList)
    },
    add() {
      this.$client.pushWindow('./add')
    },
    getBankInfo(bankCard) {
      try {
        return new Promise((resolve, reject) => {
          BCI.getBankBin(bankCard, (err, data) => {
            // bankCode: "PSBC"
            // bankName: "中国邮政储蓄银行"
            // cardType: "CC"
            // cardTypeName: "信用卡"
            if (!err) {
              resolve(data)
            } else {
              reject(err)
              // this.formData.bankName = ''
              // this.$client.alert(err)
            }
          })
        })
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.bank {
  min-height: 100vh;
  background-color: #fff;
  box-sizing: border-box;
  padding: 10px 25px;
  padding-bottom: 30px;
  .back_header {
    padding-bottom: 14px;
    font-size: 12px;
    color: #333;
    display: flex;
    .header_text {
      padding-left: 2px;
      flex: 1;
    }
    .header_btn {
      border: 1px solid #cbd7e1;
      width: 70px;
      height: 17px;
      line-height: 17px;
      text-align: center;
      font-size: 10px;
      color: #cbd7e1;
      border-radius: 17px;
    }
  }
  .back_card {
    position: relative;
    border-radius: 8px;
    background-color: #f0c17b;
    color: #fff;
    padding: 15px 20px 25px;
    margin-bottom: 30px;
    &:active {
      background-color: #ecba70;
    }
    .card_name {
      font-size: 16px;
      line-height: 23px;
      .badge {
        margin-left: 10px;
        font-size: 12px;
        opacity: 0.4;
      }
    }
    .card_text {
      font-size: 12px;
      padding-bottom: 13px;
      line-height: 17px;
    }
    .card_num {
      font-size: 20px;
      line-height: 29px;
    }
  }
  .back_btn {
    margin-top: 50px;
    width: 100%;
    height: 50px;
    line-height: 50px;
    text-align: center;
    font-size: 12px;
    color: #f0c17b;
    border: 1px solid #f0c17b;
    border-radius: 10px;
    &:active {
      background-color: #f6f6f6;
    }
    span {
      display: inline-block;
      padding-right: 5px;
      font-size: 15px;
    }
  }
}
.no-record {
  height: 300px;
  margin-top: 20px;
  background: no-repeat url($ui-asset-url + 'coupon/no-record.png');
  background-size: 80%;
  background-position: top center;
  position: relative;
}
.background_bank {
  position: absolute;
  top: 0;
  right: 20px;
  width: 120px;
  height: 120px;
}
</style>
