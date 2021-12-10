<!--
 * @Description: 
 * @version: 
 * @Author: gonghonglin
 * @Date: 2021-08-03 19:31:22
 * @LastEditors: gonghonglin
 * @LastEditTime: 2021-09-22 18:42:48
-->
<template>
  <div class="page">
    <!-- 头部卡片区域 -->
    <div class="card">
      <div class="card-tips">邀好友注册</div>
      <div class="card_box">
        <div class="card-title">我的邀请战绩</div>
        <div class="card-content">
          <div class="card-item">
            <div class="tips-box" v-if="isTips1">
              <div>直接邀请人数：</div>
              <p>我邀请的注册人员的数量</p>
            </div>
            <div class="card-icon" @click="setTips('isTips1')">
              <img src="http://img.asset/invite/tips_icon.png" alt="" srcset="">
            </div>
            <div class="card-num"><span>{{oneHandCount}}</span>&nbsp;人</div>
            <div class="card-text">直接邀请人数</div>
          </div>
          <div class="card-item">
            <div class="tips-box" v-if="isTips2">
              <div>关联邀请人数：</div>
              <p>我邀请的注册人员再次邀请其他用户的数量</p>
            </div>
            <div class="card-icon" @click="setTips('isTips2')">
              <img src="http://img.asset/invite/tips_icon.png" alt="" srcset="">
            </div>
            <div class="card-num"><span>{{secondHandCount}}</span>&nbsp;人</div>
            <div class="card-text">关联邀请人数</div>
          </div>
        </div>
      </div>
    </div>
    <!-- 已邀请列表 -->
    <div class="list" v-show="!isDetail">
      <div class="list-content">
        <div class="list-title">我的邀请</div>
        <div class="list-item" v-for="(item, index) in invites" :key="index">
          <img class="item-img" :src="item.avatarUrl || 'https://img04.aomygod.com/fontend/202179/imgs/user_attr.png'" alt="">
          <div class="item-info">
            <p>{{item.nickName || '微信用户'}}</p>
            <span>{{item.phone}}</span>
          </div>
          <div class="item-num">
            <p>累计邀请{{item.count}}人</p>
            <span>{{item.createTime}}</span>
            <img class="item-num-icon" src="http://img.asset/invite/icon_l.png" @click="setShow(item)">
          </div>
        </div>
        <div class="data-not" v-if="invites.length == 0">暂无邀请</div>
      </div>
    </div>
    <!-- 关联邀请列表 -->
    <div class="list" v-show="isDetail">
      <div class="list-content">
        <div class="list-title">
          <img class="list-title-icon" src="http://img.asset/invite/icon_r.png" @click="setHich">
          关联邀请
        </div>
        <!-- 父级 -->
        <div class="list-item">
          <img class="item-img" :src="detail.avatarUrl || 'https://img04.aomygod.com/fontend/202179/imgs/user_attr.png'" alt="">
          <div class="item-info">
            <p>{{detail.nickName || '微信用户'}}</p>
            <span>{{detail.phone}}</span>
          </div>
          <div class="item-num">
            <p>累计邀请{{detail.count}}人</p>
            <span>{{detail.createTime}}</span>
          </div>
        </div>
        <!-- 子级 -->
        <div class="list-item junior" v-for="(item, index) in detail.childDetailVos" :key="index">
          <img class="item-img" :src="item.avatarUrl || 'https://img04.aomygod.com/fontend/202179/imgs/user_attr.png'" alt="">
          <div class="item-info">
            <p>{{item.nickName || '微信用户'}}</p>
            <span>{{item.phone}}</span>
          </div>
          <div class="item-num junior1">
            <p v-if="item == 0">累计邀请{{item.count}}人</p>
            <span>{{item.createTime}}</span>
          </div>
        </div>
        <div class="data-not" v-if="detail.childDetailVos.length == 0">暂无邀请</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {
  },
  data() {
    return {
      oneHandCount: 0,
      secondHandCount: 0,
      invites:[],
      pager:{
        page: 1,
        pageSize: 10
      },
      isTips1: false, // 问号提示小弹窗
      isTips2: false, // 问号提示小弹窗
      isDetail: false, // 是否显示详情
      detail: {}, // 关联邀请的数量
    }
  },
  mounted () {
    this.getMainList();
    this.getList();
  },
  methods:{
    async getMainList(){
      let counter = await this.$client.rpc(this.$api.INVITE_COUNT)
      this.oneHandCount = counter.data.data.oneHandCount;
      this.secondHandCount = counter.data.data.secondHandCount;
    },
    async getList() {
      let list = await this.$client.rpc(this.$api.INVITE_DETAIL,{
        ...this.pager
      })
      this.invites = list.data.rows;
    },
    setShow(data) { // 打开关联邀请
      // console.log(data);
      this.detail = data;
      this.isDetail = true;
    },
    setHich() { // 关闭关联邀请
      this.detail = {};
      this.isDetail = false;
    },
    setTips(type) { // 控制提示弹窗
      this[type] = true;
      setTimeout(() => {
        this[type] = false;
      }, 3000)
    }
  }
}
</script>

<style lang="scss">
.page{
  min-height: 100vh;
  .card{
    padding: 0 15px;
    box-sizing: border-box;
    width: 100%;
    height: 312px;
    background-color: #ffedd9;
    background: url(http://img.asset/invite/head-bg.png.png);
    background-size: contain;
    background-repeat: no-repeat;
  }
  .card-tips {
    padding: 45px 0 58px;
    text-align: center;
    font-size: 40px;
    width: 100%;
    height: 50px;
    line-height: 52px;
    color: #fff;
    font-weight: 600;
  }
  .card_box {
     position: relative;
  }
  .card-title {
    position: absolute;
    top: -3px;
    left: 50%;
    transform: translate(-50%);
    width: 200px;
    height: 44px;
    line-height: 36px;
    text-align: center;
    color: #fff;
    font-size: 18px;
    font-weight: 600;
    background: url(http://img.asset/invite/title_bg.png);
    background-size: contain;
    background-repeat: no-repeat;
  }
  .card-content {
    width: 100%;
    height: 160px;
    border-radius: 10px;
    display: flex;
    background-color: #fff;
    box-sizing: border-box;
    padding: 51px 15px 20px;
    .card-item {
      position: relative;
      flex: 1;
      text-align: center;
      background-color: #F8F8F8;
      border-radius: 8px;
      color: #333;
      .card-num {
        font-size: 10px;
        padding: 15px 0 12px;
        span {
          font-size: 18px;
          color: #F0C17B;
          font-weight: 600;
        }
      }
      .card-text {
        font-size: 14px;
      }
    }
    .card-item:nth-child(1) {
      margin-right: 15px;
    }
    .card-icon {
      position: absolute;
      right: 10px;
      top: 5px;
      & > img {
        width: 15px;
        height: 15px;
      }
    }
    .tips-box {
      position: absolute;
      right: 15px;
      top: -105px;
      padding: 15px 10px;
      box-sizing: border-box;
      border-radius: 10px 10px 0 10px;
      width: 160px;
      height: 90px;
      background-color: rgba($color: #000000, $alpha: 0.5);
      color: #fff;
      font-size: 14px;
      text-align: left;
      & > div {
        font-size: 16px;
        padding-bottom: 4px;
      }
    }
    .tips-box::before {
      content: '';
      position: absolute;
      bottom: -20px;
      right: 0;
      border: 10px solid rgba($color: #000000, $alpha: 0.5);
      border-left-color: rgba($color: #000000, $alpha: 0);
      border-bottom-color: rgba($color: #000000, $alpha: 0);
    }
  }
  .list {
    min-height: calc(100vh - 330px);
    padding: 15px;
    background-color: #ffedd9;
    .list-content {
      padding: 0 15px 15px;
      background-color: #fff;
      border-radius: 10px;
    }
    .list-title {
      font-size: 16px;
      color: #F0C17B;
      padding: 12px 0 10px;
      border-bottom: 1px solid rgba($color: #F0C17B, $alpha: 0.2);
    }
    .list-title {
      & > .list-title-icon {
        width: 13px;
        height: 13px;
        border-radius: 50%;
        margin-right: 5px;
      }
    }
    .list-item {
      padding: 10px 0 12px;
      display: flex;
      border-bottom: 1px solid rgba($color: #F0C17B, $alpha: 0.2);
      .item-img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
      }
      & > div {
        flex: 1;
      }
    }
    .junior {
      padding-left: 22px;
    }
    .junior1 {
      padding-top: 20px;
    }
    .item-info,
    .item-num {
      p {
        font-size: 14px;
        color: #333;
        padding-bottom: 2px;
      }
      span {
        font-size: 12px;
        color: #D3D3D3;
      }
    }
    .item-info {
      padding-left: 10px;
    }
    .item-num {
      text-align: right;
      padding-right: 30px;
      position: relative;
      .item-num-icon {
        position: absolute;
        top: 40%;
        right: 0;
        width: 13px;
        height: 13px;
      }
    }
  }
  .data-not {
    font-size: 14px;
    color: #999;
    width: 100%;
    height: 150px;
    text-align: center;
    line-height: 150px;
  }
}
</style>
