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
              <div>二级分销人数：</div>
              <p>我发展分销员的数量。</p>
            </div>
            <div class="card-icon" @click="setTips('isTips1')">
              <img src="http://img.asset/invite/tips_icon.png" alt="" srcset="">
            </div>
            <div class="card-num"><span>{{oneHandCount}}</span>&nbsp;人</div>
            <div class="card-text">二级分销人数</div>
          </div>
          <div class="card-item">
            <div class="tips-box" v-if="isTips2">
              <div>总收益：</div>
              <p>我发展分销员所产生的收益。</p>
            </div>
            <div class="card-icon" @click="setTips('isTips2')">
              <img src="http://img.asset/invite/tips_icon.png" alt="" srcset="">
            </div>
            <div class="card-num"><span>￥{{secondHandCount || 0}}</span></div>
            <div class="card-text">二级分销总收益</div>
          </div>
        </div>
      </div>
    </div>
    <!-- 已邀请列表 -->
    <div class="list">
      <div class="list-content">
        <div class="list-title">我的邀请</div>
        <div class="list-item" :class="{'list_item_ccc': (index+1)%2 == 1}" v-for="(item, index) in invites" :key="index" @click="setShow(item)">
          <img class="item-img" :src="item.avatarUrl || 'https://img04.aomygod.com/fontend/202179/imgs/user_attr.png'" alt="">
          <div class="item-info">
            <div class="item_info_name">{{item.nickName || '微信用户'}}</div>
            <div class="item_info_phone">{{formatData(item.phone) || '11111111111'}}</div>
            <div class="handle_count">
              <div>成交笔数：{{item.totalCount}}</div>
              <div>总收益：￥{{item.totalAmount || 0}}</div>
            </div>
            <div class="item_info_time">注册时间：{{item.createTime}}</div>
          </div>
          <img class="item-num-icon" src="http://img.asset/invite/icon_l.png">
        </div>
		<div class="loading" v-if="invites.length>0">{{ loadingText }}</div>
        <div class="data-not" v-if="invites.length == 0">暂无邀请</div>
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
		loadingText: '',
		total: 0,//列表总数
      oneHandCount: 0,
      secondHandCount: 0,
      invites:[],
      pager:{
        page: 1,
        pageSize: 10
      },
      isTips1: false, // 问号提示小弹窗
      isTips2: false, // 问号提示小弹窗
      // isDetail: false, // 是否显示详情
      detail: {}, // 关联邀请的数量
    }
  },
  mounted () {
    this.getMainList();
    this.getList();
  },
  onPullDownRefresh() {
  	this.loadingText = '';
  	this.total = 0;
  	this.pager.page = 1;
  	this.getList();
  },
  //页面滚动到底部的事件
  onReachBottom() {
  	this.getList();
  },
  methods:{
    async getMainList(){
      let counter = await this.$client.rpc(this.$api.INVITE_COUNT)
      this.oneHandCount = counter.data.data.oneHandCount;
	  let moeny = await this.$client.rpc(this.$api.TWO_AMOUNT)
      this.secondHandCount = moeny.data.data.totalAmount;
    },
    async getList() {
		if (this.pager.page > 1 && this.invites.length == this.total) {
		  //在当前页面隐藏导航条加载动画。
		  this.loadingText = "真的没有更多啦~";
		  return;
		}
      let list = await this.$client.rpc(this.$api.TWO_LIST,{
        ...this.pager
      })
	  this.total =  list.data.total;
	  if(this.pager.page > 1){
	  	this.invites = this.invites.concat(list.data.rows)
	  }else{
	  	this.invites = list.data.rows;
	  }
	  this.pager.page++;
    },
    setShow(item) { // 打开关联邀请
		this.$client.pushWindow('/pkMine/invite/details',{itemInfo:item})
	  // this.$client.pushWindow('/pkMine/invite/details?itemInfo=' + JSON.stringify(item))
    },
    //号码隐私
    formatData(str){
    	if(str){
    		let reg = /(\d{3})\d*(\d{4})/;
    		return str.replace(reg, '$1****$2');
    	}
    	return '';
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
	margin-top: -3px;
    .list-content {
      background-color: #fff;
      border-radius: 10px;
      padding-bottom: 15px;
    }
    .list-title {
      font-size: 16px;
      color: #F0C17B;
      padding: 12px 15px 10px;
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
      padding: 10px 15px;
      padding-right: 30px;
      position: relative;
      display: flex;
      .item-img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
      }
      & > div {
        flex: 1;
      }
    }
    .list_item_ccc {
      background-color: #f8f8f8;
    }
    .junior {
      padding-left: 22px;
    }
    .junior1 {
      padding-top: 20px;
    }
    .item-info {
      padding-left: 10px;
      & > div {
        padding-bottom: 5px;
      }
      .item_info_name {
        font-size: 14px;
        color: #333;
      }
      .item_info_phone {
        font-size: 12px;
        color: #D3D3D3;
      }
      .handle_count {
        font-size: 12px;
        color: #333;
        display: flex;
        & > div {
          flex: 1;
        }
      }
      .item_info_time {
        font-size: 12px;
        color: #333;
      }
    }

    .item-num-icon {
      position: absolute;
      top: 40%;
      right: 15px;
      width: 13px;
      height: 13px;
    }
  }
  .loading{
    text-align: center;
    color: #8F8F94;
    font-size: 12px;
    padding: 10px 0 15px;
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
