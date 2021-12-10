<template>
  <div class="coustomer">
    <div class="coustomer_header">
      <div class="coustomer_search">
        <input type="text" v-model="params.filter" placeholder="请输入姓名">
        <span @click="searchData">搜索</span>
      </div>
      <div class="coustomer_tabs">
        <div :class="{'coustomer_tabs_item': true, 'choose': params.businessStatus == item.code} "
          v-for="item in tabsData" :key="item.code" @click="tabsChange(item.code)">
          <span>{{item.count}}人</span>
          <p>{{item.name}}</p>
        </div>
      </div>
    </div>
    <div class="coustomer_list">
      <div class="coustomer_list_item" v-for="(item, index) in listData" :key="index" @click="toDetail(item)">
        <div class="list_name">
          <div>{{item.cst_name || '--'}}</div>
          <div class="phone">{{formatData(item.cst_tels)}}</div>
          <div :class="{
            'state1': item.clue_status ==0,
            'state3': item.clue_status ==1,
            'state2': item.clue_status ==2 || item.clue_status ==21 || item.clue_status ==22 || item.clue_status ==23
            }" v-show="params.businessStatus == '2' || params.businessStatus == '6'">
            {{belongTyep[item.clue_status]}}</div>
        </div>
        <div class="list_addr">
          <div>签约项目</div>
          <div>{{item.project_name}}</div>
        </div>
        <div class="list_time" v-if="params.businessStatus == '2'&& item.expiredDay != 0">
          <div>剩余时间</div>
          <div class="data_time">
            <div> <span>{{item.expiredDay}}</span>天</div>
          </div>
        </div>
        <div class="reoom" v-if="item.clue_status =='23'"
          style="color:#3D64EB;display: block;text-align: right" @click.stop="recommend(item.recommend_id)">
          重新报备</div>
        <img class="iist_icon" src="http://img.asset/invite/icon_l.png" />
      </div>
    </div>
    <div class="not_more" v-if="notMore">真的没有更多啦~</div>
    <div class="iist_not" v-if="listData.length == 0">
      <img src="http://img.asset/not_myActivite.png">
    </div>
    <div class="tips_box" v-if="!userDataState">
      <div class="tips_inbox">
        <div>温馨提示</div>
        <div class="tips_text">您还未完善个人信息<span v-if="stateTips">({{stateTips}})</span>，完善后即可使用推荐、查看佣金等功能</div>
        <div class="tips_btn" @click="routerUserInfo">立即完善</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      belongTyep: {
        '0': '待确认',
        '1': '有效',
        '2': '无效',
        '23': '过期',
        '21': '拒收',
        '22': '无效',
      },
      params: {
        filter: '', // 搜索
        businessStatus: '2',
        page: 1,
        size: 10
      },
        tabsData: [
          {
            name: '报备',
            code: '2',
            count: 0
          },
          {
            name: '到访',
            code: '3',
            count: 0
          },
          {
            name: '认筹',
            code: '4',
            count: 0
          },
          {
            name: '认购',
            code: '5',
            count: 0
          },
          {
            name: '签约',
            code: '6',
            count: 0
          }, // tabs数据
        ],
        listData: [],
        notMore: false,
        userDataState:true,
        stateTips: ''
      }
    },
    onShow(){
      this.getUserDataState()
    },
    onPullDownRefresh() {//下拉刷新的方法
      this.params.page = 1;
      this. params.filter= '';
      this.getList();
      // 停止下拉刷新，回弹问题
      this.$client.stopPullDownRefresh();
    },
    onReachBottom() {
      this.getList()
    },
    methods: {
    async getUserDataState() { // 获取用户信息是否完善
      let res = await this.$client.rpc(this.$api.VALIDATE_USERINFO);
      // 是否已经完善个人信息
      // console.log(res, '11111111111111111111111');
      this.userDataState = res.data.data;
      this.stateTips = res.data.msg
      if (res.data.data) {
        this.getCount();
        this.getList();
      }

    },
    routerUserInfo() {
      this.$client.pushWindow("/pkMine/personal/index");
    },
    searchData() {
      this.params.page = 1;
      this.getList()
    },
    async getCount() { // 获取统计人数
      let res = await this.$client.rpc(this.$api.COUNTCUSTOMER);
      var datas=res.data.data||[]
      
      if(datas.length>0){
      this.tabsData = datas;
      }
    },
    async getList() { // 获取列表
      var { params, listData } = this;
      let res = await this.$client.rpc(this.$api.CUSTOMERLIST, params);
      var list = res.data.rows;

      if (params.page > 1 && list.length == 0) {
        this.notMore = true;
      }
      if (params.page == 1) {
        this.listData = list;
      }
      else {
        this.listData = listData.concat(list);
      }
      if (list.length > 0) {
        [
          this.params.page++
        ]
      }
    },
    tabsChange(key) { // tabs事件
      this.params.businessStatus = key;
      this.params.page = 1;
      this.listData = [];
      this.getList();
    },
    toDetail(item) { // 跳详情
      this.$client.pushWindow("./detail", { id: item.recommend_id, name: item.cst_name, phone: item.cst_tels });
    },
    async recommend(id) {
      console.log(id);
      let res = await this.$client.rpc(this.$api.COUNTCUREMOODE, { recommendId: id });
      this.params.page = 1
      console.log(res);
      this.getList();
    },
    //号码加密处理
    formatData(str) {
      if (str) {
        let reg = /(\d{3})\d*(\d{4})/;
        return str.replace(reg, '$1****$2');
      }
      return '';
    },
  },
}
</script>

<style lang="scss" scoped>
.coustomer {
  background-color: #f8f8f8;
  min-height: 100vh;
  .coustomer_header {
    padding: 10px 15px 0;
    background-color: #fff;
  }
  .coustomer_search {
    display: flex;
    padding-bottom: 15px;
    align-items: center;
    input {
      flex: 1;
      padding: 4px 28px;
      font-size: 14px;
      height: 28px;
      border-radius: 28px;
      line-height: 28px;
      box-sizing: border-box;
      background-color: #f8f8f8;
    }
    span {
      color: #f0c17b;
      padding-left: 15px;
    }
  }
  .coustomer_tabs {
    display: flex;
    justify-content: space-between;
    .coustomer_tabs_item {
      width: 28px;
      text-align: center;
      color: #999;
      padding-bottom: 14px;
      span {
        font-size: 10px;
      }
      p {
        font-size: 12px;
      }
    }
    .choose {
      position: relative;
      font-weight: 600;
      color: #333;
      &::after {
        content: "";
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translate(-50%);
        background-color: #f0c17b;
        width: 20px;
        height: 4px;
        border-radius: 4px;
      }
    }
  }
  .coustomer_list {
    padding: 15px;
    .coustomer_list_item {
      font-size: 14px;
      position: relative;
      background-color: #fff;
      border-radius: 10px;
      padding: 15px 53px 15px 20px;
      margin-bottom: 15px;
      & > div {
        display: flex;
        padding-bottom: 10px;
        color: #333;
      }
      .list_name {
        .phone {
          color: #d3d3d3;
          font-size: 12px;
          flex: 1;
          padding-left: 10px;
        }
        .state1 {
          color: #07962d;
        }
        .state2 {
          color: #999999;
        }
        .state3 {
          color: #f0c17b;
        }
      }
      .list_addr {
        & > div:nth-child(1) {
          color: #666666;
          padding-right: 10px;
          min-width: 60px;
        }
        & > div:nth-child(2) {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
      .list_time {
        & > div:nth-child(1) {
          color: #666666;
          padding-right: 10px;
        }
        span {
          color: #f0c17b;
        }
        .data_time {
          display: flex;
          justify-content: space-around;
        }
      }
      .iist_icon {
        width: 13px;
        height: 13px;
        position: absolute;
        right: 20px;
        top: 50%;
        transform: translate(0, -50%);
      }
    }
    .coustomer_list_item:nth-last-child(1) {
      margin-bottom: 0;
    }
  }
  .iist_not {
    text-align: center;
  }
  .not_more {
    color: #d1d1d1;
    font-size: 12px;
    text-align: center;
    padding: 13px 0;
  }
  .tips_box {
    z-index: 50;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    .tips_inbox {
      border-radius: 10px;
      background-color: #fff;
      text-align: center;
      width: 250px;
      padding: 20px;
      border-radius: 10px;
      position: absolute;
      top: 50%;
      left: 50%;
      color: #333;
      font-size: 18px;
      transform: translate(-50%, -50%);
      background-color: #fff;
      font-weight: 600;
      .tips_text {
        font-weight: 400;
        font-size: 14px;
        color: #666;
        padding: 20px 20px 40px;
      }
      .tips_btn {
        background-color: #f0c17b;
        width: 150px;
        height: 35px;
        border-radius: 35px;
        line-height: 35px;
        text-align: center;
        font-size: 14px;
        color: #fff;
        margin: 0 auto;
      }
    }
  }
}
</style>