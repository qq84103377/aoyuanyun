<!--
 * @Description: 楼盘选择页
 * @version: 
 * @Author: gonghonglin
 * @Date: 2021-07-23 16:36:05
 * @LastEditors: gonghonglin
 * @LastEditTime: 2021-09-23 13:57:47
-->
<template>
  <div class="page">
    <!-- 搜索栏 -->
    <div class="nav-search" @click="toSelectCity">
      <div class="nav-container">
        <div class="city-name">
          {{noSearch ? '优惠券' : location}}
          <img class="sanjiao" src="http://img.asset/black_down_jt.png" />
        </div>
        <div class="input">
          <input style="background-ima" v-model="keyword" type="text" placeholder="请输入城市名称">
        </div>
      </div>
    </div>

    <!-- 楼盘列表 -->
    <div class="container">
      <div class="building-group">
        <div class="building-item" :class="{checked: mapSelected[item.projectId]}" @click="switchItem(item)"
          v-for="(item, index) in mainItems" :key="index">
          <div class="check-box"></div>
          <div class="title">{{item.projectName}}</div>
          <div class="content">{{item.provinceName || ""}} | {{item.cityName || ''}}</div>
          <div class="content">{{item.avgPrice||'价格待定'}}{{item.avgPrice ? '万元' : ''}} </div>
          <div class="slogan">靓盘好卖，佣金高8888领取</div>
          <div class="guwen" @click.stop="seleAppoint(item.projectCenterList,item.projectId)">
            <span>指定置业顾问</span>
            <div class="huixian">
              <span class="name">{{item.cstCenter}}</span>
              <image style="width: 20px;" src="http://img.asset/text_icon.png" mode="widthFix"></image>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 确定 -->
    <div class="footer">
      <div class="btn" @click="onSubmit" :class="{disabled}">确定（{{selected.length}}）</div>
    </div>
    <div class="no-record" v-if="! mainItems.length && ! mainItems.length">
    </div>
  </div>
</template>

<script>
export default {
  components: {
  },
  data() {
    return {
      mainItems: [],
      keyword: '',    // 关键字
      selected: [],    // 选中的列表
      mapSelected: {},
      pager: {
        page: 1,
        pageSize: 10
      },
      isFinesh: false,
      iconCheck: require("@/static/icon-check.svg"),
      noSearch: false,
      couponId: '',
    }
  },
  async onLoad(e) {
    // 传入的参数，e.city,keyword
    let param = this.$client.getParam()
    if (Array.isArray(param)) {
      this.selected.push(...param)
      this.mapSelected = {}
      for (const obj of this.selected) {
        this.$set(this.mapSelected, obj.projectId, obj.projectName);
      }
    }
    console.log(e)
    if (e) {
      this.couponId = e.couponId
    }
    this.getNextPage(1)
  },
  //页面滚动到底部的事件
  onReachBottom() {
    if (!this.isFinesh) {
      this.getNextPage()
    }
  },
  computed: {
    location() {
      return this.$store.state.location
    },
    disabled() {
      return this.selected.length < 1 || this.selected.length > 3
    }
  },
  watch: {
    location(newVal, oldVal) {
      if (newVal != oldVal) {
        this.pager.page = 1
        this.getNextPage(1)
      }
    },
  },
  methods: {
    checkIncludes(projectName) {
      this.selected.includes(item => item.projectName == projectName)
    },
    switchItem(item) {
      let index = this.selected.findIndex(s => s.projectId == item.projectId)
      console.log(this.selected);
      if (index != -1) {

        // 找到了，删除
        this.selected.splice(index, 1)
        //清空指定顾问
        this.$set(this.mainItems[index], 'cstCenter', '')
        this.$set(this.mainItems[index], 'cstSaleid', '')
      } else {
        if (this.selected.length == 3) {
          this.$client.toast('最多只能选3个')
        } else {
          this.selected.push(item)
        }
      }
      this.mapSelected = {}
      for (const obj of this.selected) {
        this.$set(this.mapSelected, obj.projectId, obj.projectName)
      }
    },
    // 去选择城市
    toSelectCity() {
      if (this.noSearch) {
        this.$client.toast('指定楼盘不支持搜索')
      } else {
        this.$client.pushWindow('/pkPublic/city-positioning/index')
      }
    },
    //选择指定置业顾问
    seleAppoint(list, project_id) {
      let index = this.selected.findIndex(s => s.projectId == project_id)
      console.log(this.selected)
      if (index == -1) {
        this.$client.toast('请先选择楼盘')
        return
      }
      let _this = this;
      let userId = '';
      uni.$off("selWindow");
      uni.$on("selWindow", function (data) {
        console.log('顾问id+顾问名称' + JSON.stringify(data))
        //列表
        _this.mainItems.forEach((item, index) => {
          if (project_id == item.projectId) {
            item.cstCenter = data.name;
            item.cstSaleid = data.sale_id;
            _this.$set(_this.mainItems, index, item)
            // _this.mainItems[index].cstCenter = data.name;
          }
        })
        //已选楼盘
        _this.selected.forEach((item, index) => {
          if (project_id == item.projectId) {
            _this.selected[index].cstCenter = data.name;
            _this.selected[index].cstSaleid = data.sale_id;
          }
        })
        uni.$off("selWindow");
      });
      this.mainItems.forEach((i, index) => {
        if (project_id == i.projectId) {
          if (i.cstSaleid) {
            userId = i.cstSaleid;
          }
        }
      })
      this.$client.pushWindow('/pkPublic/building-selector/appoint', { data: list, userId: userId })
      // this.$client.pushWindow('/pkPublic/building-selector/appoint?data=' + JSON.stringify(list) + '&userId=' + userId)
      // console.log(userId,'李淳德')
    },
    //获取楼盘列表

    // 获取下一页
    async getNextPage(page = ++this.pager.page) {
      let param = {
        page,
        pageSize: this.pager.pageSize,
        cityName: this.location || ""
      }
      if(this.location == '全部') param.cityName = ''
      // 指定候选楼盘
      if (this.couponId) {
        param.couponId = this.couponId;
        param.cityName = '';
        this.noSearch = true; // 不要搜索功能
        this.keyword = '指定的楼盘列表'
      }
      let { data } = await this.$client.rpc(this.$api.PROJECT_LIST, param);
      console.log(data, '111')
      if (page == 1) {
        // .log(999,data)
        this.mainItems.splice(0, this.mainItems.length, ...data.data.records)
      } else {
        this.mainItems.push(...data.data.records)
      }
      // 已经最后一页了
      if (data.data.pageNo == this.pager.page) {
        this.isFinesh = true;
      }
      //回显顾问
      if (this.selected.length > 0) {
        this.selected.forEach(item => {
          if (item.cstCenter) {
            this.mainItems.forEach((ele, index) => {
              if (item.projectId == ele.projectId) {
                ele.cstCenter = item.cstCenter;
                ele.cstSaleid = item.cstSaleid;
              }
            })
          }
        })
      }
    },
    // 确定返回
    onSubmit() {
      this.$client.setParam({ listSel: this.selected, isShow: true })
      this.$client.back()
    }
  },
}
</script>


<style lang="scss">
$active-color: #f0c17b;

.page {
  padding-top: 60px;
  padding-bottom: 90px;
  background: #f3f3f3;
  .nav-search {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background-color: #fff;
    box-shadow: 0px 2px 9px 0px rgba(0, 0, 0, 0.06);
    padding: 10px;
    z-index: 1;
    .nav-container {
      background-color: #f8f8f8;
      padding: 10px;
      border-radius: 20px;
      @include flexLayout(row, flex-start, center);
      flex: 1;
      .city-name {
        position: relative;
        width: 150px;
        border-right: 1px solid #999999;
        .sanjiao {
          position: absolute;
          top: 7px;
          right: 11px;
          width: 11px;
          height: 5px;
        }
      }
      input {
        pointer-events: none;
        background-image: url("http://img.asset/static/icon-search.png");
        background-repeat: no-repeat;
        background-size: 20px 20px;
        background-position: 10px 0px;
        padding-left: 40px;
      }
    }
  }
  .container {
    flex: 1;
    overflow: auto;
    .city-name {
      padding: 10px 15px 0 15px;
    }
    .building-item {
      margin: 15px;
      border-radius: 10px;
      background-color: #fff;
      overflow: hidden;
      position: relative;
      padding: 15px;
      line-height: 1.8em;
      border: 1px solid #fff;

      &:active {
        background-color: rgb(245, 245, 245);
      }

      .check-box {
        position: absolute;
        width: 16px;
        height: 16px;
        top: 49px;
        right: 15px;
        background-color: #d3d3d3;
        border-radius: 50%;
      }
      &.checked {
        border: 1px solid $active-color;
        & > .check-box {
          background: url("http://img.asset/selected_icon.png") no-repeat;
          background-size: 100% 100%;
        }
      }

      .content {
        color: #999;
        font-size: 12px;
      }

      .slogan {
        color: $active-color;
        font-size: 12px;
        @include flexLayout(row, flex-start, center);

        &::before {
          content: "佣";
          color: #fff;
          width: 20px;
          height: 20px;
          background-color: $active-color;
          border-radius: 4px;
          margin-right: 4px;
          @include flexLayout;
        }
      }
    }
  }
  .footer {
    box-shadow: 0px -2px 9px 0px rgba(0, 0, 0, 0.06);
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: #fff;
    display: flex;
    justify-content: center;
    padding: 10px 20px 25px;
    .btn {
      width: 330rpx;
      height: 100rpx;
      background: #f0c17b;
      border-radius: 50rpx;
      text-align: center;
      line-height: 100rpx;
      color: #fff;
      font-size: 32rpx;
      &:active {
        background: #dbaf6d;
      }
      &.disabled {
        pointer-events: none;
        background: #d3d3d3;
      }
    }
  }
  .no-record {
    height: 400px;
    margin-top: 20px;
    background: no-repeat url($ui-asset-url + "no.png");
    background-size: 80%;
    background-position: top center;
    position: relative;
  }
}
.guwen {
  margin-top: 10px;
  height: 38px;
  border-top: 1px solid #f8f8f8;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: #999999;
  .huixian {
    height: 100%;
    display: flex;
    align-items: center;
    .name {
      font-size: 12px;
      color: #f0c17b;
    }
  }
}
</style>
