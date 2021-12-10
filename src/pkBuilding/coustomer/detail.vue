<template>
  <div class="coustomer_detail">
    <div class="detail_box">
      <div class="detail_name">
        {{name || '--'}}
        <span>{{phone || '--'}}</span>
      </div>
      <div class="detail_label">流水详情</div>
      <div class="detail_list">
        <div class="detail_item" v-for="(item, index) in listData" :key="index">
          <div class="item_inbox">
            <div>发布于{{item.event_time}}<span v-if="item.event_result">{{item.event_result}}</span></div>
              <div>{{typeData[item.event_type]}}</div>
             <!-- <div>发布于{{item.event_time}}</div> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        name: '',
        phone: '',
        params: {
          page: 1,
          size: 100,
        recommendId: ''
        },
        typeData: {
          '1': '报备',
          '2': '隐号补齐',
          '3': '防截客判定',
          '4': '人工确客',
          '5': '保护期变更',
          '6': '过期',
          '7': '重新报备',
          '8': '发起申诉',
          '9': '申诉审核',
          '10': '解除疑似重复',
          '11': '来访',
          '': '未知'
        },
        listData: []
      }
    },
    mounted () {
      var { name, phone, id } = this.$client.getParam();
      this.name = name; 
      this.phone = phone;
      this.params.recommendId= id;
      this.getList();
    },
    methods: {
      async getList() { // 获取列表
        var { params } = this;
        let res = await this.$client.rpc(this.$api.CUSTOMERFLOW, params);
        this.listData = res.data.data;
      
      },
    },
  }
</script>

<style lang="scss" scoped>
.coustomer_detail {
  min-height: 100vh;
  box-sizing: border-box;
  padding: 15px;
  background-color: #f8f8f8;
  .detail_box {
    font-size: 12px;
    color: #333;
    width: 100%;
    padding: 20px;
    box-sizing: border-box;
    box-shadow: 0px 1px 6px 0px rgba(0, 0, 0, 0.07);
    border-radius: 10px;
    background-color: #fff;
    .detail_name {
      padding-bottom: 15px;
      font-size: 14px;
      border-bottom: 1px solid #F3F3F3;
      span {
        padding-left: 2px;
        font-size: 12px;
        color: #D3D3D3;
      }
    }
    .detail_label {
      padding: 16px 0;
      font-size: 12px;
    }
    .detail_list {
      .detail_item {
        position: relative;
        padding: 0 0 27px 30px;
        margin-top: 16px;
        .item_inbox {
          background-color: #f8f8f8;
          padding: 7px 7px 12px;
          & > div:nth-last-child(1) {
            padding-top: 1px;
            color: #666666;
          }
          div{
            span{
              border:1.5px solid #e88c1d;
              margin-left: 15px;
            

            }
          }
        }
      }
      .detail_item::before {
        content: '';
        left: 10px;
        top: -4px;
        position: absolute;
        width: 3px;
        height: 3px;
        border: 3px solid #3C4871;
        border-radius: 50%;
      }
      .detail_item::after {
        content: '';
        left: 14px;
        top: 11px;
        position: absolute;
        height: 65px;
        border: 1px dashed #3C4871;
        border-left: 1px dashed transparent;
        border-
        : 1px dashed transparent;
        border-left: 1px dashed transparent;
        border-radius: 50%;
      }
      .detail_item:nth-child(1) {
        margin: 0;
      }
      .detail_item:nth-last-child(1) {
        padding-bottom: 0;
        &::after {
          display: none;
        }
      }
    }
  }
}
</style>