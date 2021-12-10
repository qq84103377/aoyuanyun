<template>
  <div class="page-index" :class="{ ios: isIos, 'no-scroll': shopShow1 || shopShow2 || shopShow3 }">
    <div class="mark" @click="login" v-if="!isLogin"></div>
    <UNavbar ref="navbar" :scrollTop="scrollTop" />
    <!-- 头部 -->
    <div class="ad-container">
      <swiper :indicator-dots="list && list.length > 1" class="swiper">
        <swiper-item class="swiper-item" v-for="(item, index) in ads" :key="index">
          <div class="ad-content" @click="onClickAd(item)">
            <img class="ad-img" :src="item.url" alt="" />
          </div>
        </swiper-item>
      </swiper>
    </div>
    <div class="nav_list">
      <ul class="nav_list_item">
        <!-- <li class="nav_list_items" @click="gotoCommission()">
          <img class="icon_list" src="http://img.asset/icon1(4).png" />
          <span class="nav_list_itemss">我的佣金</span>
        </li> -->
        <li class="nav_list_items" @click="gotoReporting()">
          <img class="icon_list" src="http://img.asset/icon1(2).png" />
          <span class="nav_list_itemss">新增报备</span>
        </li>
        <li class="nav_list_items" @click="gotoCustomer()">
          <!-- <li class="nav_list_items" @click="gotoCommission()"> -->
          <img class="icon_list" src="http://img.asset/icon1(3).png" />
          <span class="nav_list_itemss">我的客户</span>
        </li>
        <!-- <li class="nav_list_items" @click="gotoCommission()">
          <img class="icon_list" src="http://img.asset/icon1(4).png" />
          <span class="nav_list_itemss">我的佣金</span>
        </li> -->
      </ul>
    </div>

    <!-- 区域筛选 -->
    <div class="region_wrap">
      <div class="region_list">
        <div class="region_list_item" @click="oncliup(1)">
          <div :class="['region_title', { 'curr-title': currTitle === 1 }]">
            区域
          </div>
          <img class="region_icon" :src="
              currTitle === 1
                ? 'http://img.asset/seleced_title.png'
                : 'http://img.asset/jt.png'
            " />
        </div>
        <div class="region_list_item" @click="onupHouse(2)">
          <div :class="['region_title', { 'curr-title': currTitle === 2 }]">
            户型
          </div>
          <img class="region_icon" :src="
              currTitle === 2
                ? 'http://img.asset/seleced_title.png'
                : 'http://img.asset/jt.png'
            " />
        </div>
        <div class="region_list_item" @click="onPrice(3)">
          <div :class="['region_title', { 'curr-title': currTitle === 3 }]">
            均价
          </div>
          <img class="region_icon" :src="
              currTitle === 3
                ? 'http://img.asset/seleced_title.png'
                : 'http://img.asset/jt.png'
            " />
        </div>
      </div>
    </div>
    <div class="content-1" v-show="shopShow1">
      <div class="modle" @click="oncliup()"></div>
      <div class="area-type">
        <div class="area-types">
          <div :class="[
              'area-item',
              { 'curr-item': formatItem(currAreaItem, index) },
            ]" v-for="(item, index) in getArea" :key="index" @click="selectAreaItem(item, index)">
            <span>{{ item }}</span>
            <img v-if="formatItem(currAreaItem, index)" class="select_icon"
              src="http://img.asset/selected_icon.png" />
            <span v-else class="select"></span>
          </div>
        </div>
        <div class="bottom define_box" style="height: 76px">
          <img class="rest" src="http://img.asset/rest.png" @click="onAreaRest()" />
          <div class="define" @click="queryProject()">确定</div>
        </div>
      </div>
    </div>
    <div class="content-2" v-show="shopShow2">
      <div class="modle" @click="onupHouse()"></div>
      <div class="house-type">
        <div class="house-types">
          <div :class="[
              'house-item',
              { 'curr-item': formatItem(currHouseItem, index) },
            ]" v-for="(item, index) in dictHouseType" :key="index"
            @click="selectHouseItem(item.value, index)">
            <span>{{ item.name }}</span>
            <img v-if="formatItem(currHouseItem, index)" class="select_icon"
              src="http://img.asset/selected_icon.png" />
            <span v-else class="select"></span>
          </div>
        </div>
        <div class="bottom define_box">
          <img class="rest" src="http://img.asset/rest.png" @click="onHouseRest()" />
          <div class="define" @click="queryProject()">确定</div>
        </div>
      </div>
    </div>
    <div class="content-3" v-show="shopShow3">
      <div class="modle" @click="onPrice()"></div>
      <div class="price-type">
        <div class="price-types">
          <div class="price-nav">
            <div :class="['price-nav-item', { 'curr-nav': currNav === 1 }]" @click="selectPriceNav(1)">
              单价
            </div>
            <div :class="['price-nav-item', { 'curr-nav': currNav === 2 }]" @click="selectPriceNav(2)">
              总价
            </div>
          </div>
          <div class="price-list" v-if="currNav == 1">
            <div :class="[
                'price-item',
                { 'curr-item': formatItem(currPriceItem, index) },
              ]" v-for="(item, index) in dictUnitPrice" :key="index"
              @click="selectPriceItem(1, item.value, index)">
              <span>{{ item.name }}</span>
              <img v-if="formatItem(currPriceItem, index)" class="select_icon"
                src="http://img.asset/selected_icon.png" />
              <span v-else class="select"></span>
            </div>
          </div>
          <div class="price-list" v-else>
            <div :class="[
                'price-item',
                { 'curr-item': formatItem(currTotalPriceItem, index) },
              ]" v-for="(item, index) in dictTotalPrices" :key="index"
              @click="selectPriceItem(2, item.value, index)">
              <span>{{ item.name }}</span>
              <img v-if="formatItem(currTotalPriceItem, index)" class="select_icon"
                src="http://img.asset/selected_icon.png" />
              <span v-else class="select"></span>
            </div>
          </div>
        </div>
        <div class="bottom define_box">
          <img class="rest" src="http://img.asset/rest.png" @click="onPriceRest()" />
          <div class="define" @click="queryProject()">确定</div>
        </div>
      </div>
    </div>
    <div class="list_line"></div>

    <!-- 楼盘列表 -->
    <div class="pageslist">
      <div class="pageslist_item" v-for="(item, index) in productList" :key="index"
        @click="details(item.projectId)">
        <img class="pageslist_img"
          :style="{ 'background-image': `url(${item.posterUrl || 'http://img.asset/aa.png'})` }" />
        <div class="pageslist_liter">
          <div class="titer">{{ item.projectName }}</div>
          <div class="min">{{ item.avgPrice || "价格待定" }}{{item.avgPrice ? '元/㎡' : ''}}</div>
          <div class="min_j">
            建面{{item.buildingArea || ''}}{{!item.buildingArea ? '' : item.buildingArea.includes('㎡') ? '' : '㎡'}}
          </div>
          <div class="min_place">{{ item.address }}</div>
        </div>
        <div class="icon_l">
          <!-- 推荐按钮 -->
          <img class="" @click.stop="recommendClick(item)" src="@/static/building/icon-jian.png" />
          <!-- 打电话按钮 -->
          <img @click.stop="makePhoneCall(item)" src="@/static/building/icon-tel.png" />
        </div>
      </div>
    </div>
    <div class="loading">{{ loadingText }}</div>
    <div class="noting" v-show="shownoting" style="text-align: center; color: #999999">
      <img src="http://img.asset/no.png" />
    </div>
    <EReporting :visabled="isShowReporting && isLogin" :sceneBrokerId="sceneBrokerId" :sceneProjectList="sceneProjectList" @onClose="infoClose" ></EReporting>
    <!-- 未完善信息的提示框 -->

    <u-popup v-model="isShowUserInfoTips" type="center">
      <div class="tips_inbox">
        <div>温馨提示</div>
        <div class="tips_text">您还未完善个人信息<span v-if="stateTips">({{stateTips}})</span>，完善后即可使用推荐、查看佣金等功能</div>
        <div class="tips_btn" @click.stop="routerUserInfo">立即完善</div>
      </div>
    </u-popup>

  </div>
</template>
<script>
import EReporting from '@/components/EReporting';
import apis from "@/apis";
import UPopup from "@/components/UPopup";

export default {
  components: {
    EReporting,
    UPopup
  },
  props: {},
  data() {
    return {
      total: 0,//总数
      scrollTop: 0,
      isIos: false,
      totalPages: 1, // 总页数
      isLoadAll: false,
      productList: [], // 列表数据
      loadingText: "",
      page: 1,
      timer: null,
      currTitle: null,
      shopShow1: false, //默认内容不显示区域
      shopShow2: false, //默认内容不显示区域
      shopShow3: false, //默认内容不显示区域
      currAreaItem: [],
      currNav: 1,
      currHouseItem: [],
      currPriceItem: [],
      currTotalPriceItem: [],
      areName: [],
      bedroomNum: [],
      price: [],
      countPrice: [],
      ads: [], //整站广告列表
      AD_TYPE: {
        GUIDE_PAGE: 1, //引导页
        START_PAGE: 2, //启屏页
        SEL_BANNER_AD: 3, //首页banner
        SEL_INNER_AD: 4, //首页横幅广告
        BUY_BANNER_AD: 5, //买房页广告
        POMO_BANNER_AD: 6, //活动页广告
      },
      getArea: [],
      dictHouseType: [],
      dictTotalPrices: [],
      dictUnitPrice: [],
      shownoting: false,
      isShowUserInfoTips: false, // 检测用户信息是否完善
      isLogin: false,
      isShowReporting: false, // 是否显示自动报备
      sceneBrokerId: '', // 推荐人id，从scene拿
      sceneProjectList: [],
      cityAll: false,
      stateTips: ''
    };
  },
  computed: {
    location() {
      return this.$store.state.location;
    },
  },
  watch: {
    location(newVal, oldVal) {
      if (newVal != oldVal) {
        console.log("★★★★更换了城市", newVal);
        // 重设小栏目筛选逻辑 
        this.onPriceRest();
        this.onHouseRest();
        this.onAreaRest();
        this.getList(); // 更换了区域，重新查询，广告接口
        this.getAdByCity();
        this.currTitle = null
        this.shopShow1= false
        this.shopShow2= false
        this.shopShow3= false
      }
    },
  },
  onPageScroll(e) {
    this.scrollTop = e.scrollTop;
  },
  onLoad() {
    // 看看是否推荐进入的，显示自动报备
    // scene = 0业务类型 + 1分享用户id + 2业务Id + 3渠道ID + 4分销机构id
    let {scene} = this.$client.getParam('scene')|| {}
    // console.log('scene--99',scene)
    if(scene){
      let arr = scene.split('_')
      if(arr[0]=="3"){
        this.isShowReporting=true;
        this.sceneBrokerId = arr[1]
      }
    }
    // console.log('scene--99',scene)
    this.$client.setParam('');

    this.isIos = this.$client.setCache("isIphone");
    this.isLogin = !!this.$store.state.userInfo && this.$store.state.userInfo.uid
    // if (!this.isLogin) {
    //   this.login()
    // }
  },
  mounted() {
    this.refreshAd(this.$client.getStorage("ads") || []);
    //获取首页数据
    this.getList();
    this.getHousetype(); //筛选户型
    this.getaverageprice(); //筛选总价
    this.getaveragepriceone(); //筛选单价
    this.onPriceRest();
    this.onHouseRest();
    this.onAreaRest();
    this.shopShow1 = false;
    this.shopShow2 = false;
    this.shopShow3 = false;
    this.$client.pushEvent("PROJECT_LIST"); // 埋点
  },
  async onShow(e){
    // this.$client.setParam('flag-readfile')
    this.isLogin = !!this.$store.state.userInfo && this.$store.state.userInfo.uid
    let param = this.$client.getParam();
    this.$client.setParam('');

    if(param && param.isShow){
      this.$set( this, 'sceneProjectList' , param.listSel)
      return
    }
  },
  onPullDownRefresh() {
    this.loadingText = '';
    this.total = 0;
    this.getList();
    this.getAdByCity();
    // 停止下拉刷新，回弹问题
    this.$client.stopPullDownRefresh();

  },
  //页面滚动到底部的事件
  onReachBottom() {
    if (!this.isLogin || this.shopShow1 || this.shopShow2 || this.shopShow3) return false;
    if (this.timer != null) {
      clearTimeout(this.timer);
    }
    this.timer = setTimeout(() => {
      //加载更多数据
      this.getNextPag();
    }, 100);
  },
  methods: {
    // 获取用户信息是否完善
    async getUserDataState () { 
      let {data} = await this.$client.rpc(this.$api.VALIDATE_USERINFO);
      this.isShowUserInfoTips = !data.data;
      this.stateTips = data.msg;
      return new Promise((resolve)=>resolve(this.isShowUserInfoTips)) 
    },
    routerUserInfo () {
      this.isShowUserInfoTips = false
      this.$client.pushWindow("/pkMine/personal/index", { hasBackBtn: true });
    },
    checkLogin(){
      if(!this.isLogin){
        this.login();
      }else{

      }
    },
    async queryProject() {
      this.getList();
      this.shopShow2 = this.shopShow3 = false;
      this.shopShow1 = false; //使false变为true显示
    },
    // 根据城市名称获取广告列表
    async getAdByCity() {
      let tAds = [];
      let res = await this.$client.rpc(this.$api.AD_BY_CITY, {
        addressName: this.location,
      });
      if (res.data && res.data.rows && res.data.rows.length) {
        tAds = res.data.rows;
        this.$client.setStorage("ads", res.data.rows);
      } else {
        // console.log("getAdByCity,当前城市没有广告", this.location);
        tAds = [];
        this.$client.setStorage("ads", []);
      }
      this.refreshAd(tAds);
    },
    // 刷新广告
    refreshAd(tAds) {
      this.$set(
        this,
        "ads",
        tAds.filter((item) => {
          return item.type == this.AD_TYPE.BUY_BANNER_AD;
        })
      );
      if (this.ads.length == 0) {
        // console.log("默认Banner广告图");
        this.ads.push({
          url: "http://img.asset/banner.png",
          redirectUrl: "",
        });
      }
    },
    onClickAd(item) {
      console.log(item);
      if (item.redirectType == 0) {
        // 跳转首页
        return this.$client.pushWindow(
          `/pages/webView/webView?url=${encodeURIComponent(item.redirectUrl)}`)
      }
      if (item.redirectType == 1) {
        // 跳转首页
        return this.$client.pushWindow('/pages/index/index')
      }
      if (item.redirectType == 2) {
        // 楼盘首页
        return this.$client.pushWindow('/pages/pkBuilding/index')
      }
      if (item.redirectType == 3) {
        // 应用页面
        return this.$client.pushWindow('/pages/serve/serve')
      }
      if (item.redirectType == 4) {
        // 我的页面
        return this.$client.pushWindow('/pages/pkMine/index')
      }
      if (item.redirectType == 5) {
        // 个人信息
        return this.$client.pushWindow('/pkMine/personal/index')
      }
      if (item.redirectType == 6) {
        // 活动页面
        return this.$client.pushWindow('/pkPromotion/promotion/index')
      }
      if (item.redirectType == 7) {
        return this.$client.pushWindow("/pkBuilding/detail?id=" + item.redirectUrl.split('=')[1])
      }
    },
    // 打电话
    makePhoneCall(item) {
      let phone = item.telephone;
      this.$client.makePhoneCall(phone);
      this.$client.pushEvent("CALL_PROJECT_PHONE", {
        phone,
        projectName: item.projectName,
      }); // 埋点
    },
    oncliup(id) {
      // console.log(11111);
      this.currTitle = id;
      this.shopShow2 = this.shopShow3 = false;
      this.shopShow1 = !this.shopShow1; //使false变为true显示
    },
    // 获取城市区域
    async getCityArea() {
      let { data } = await this.$client.rpc(apis.GET_FIND_ADDRESS, {
        name: this.$client.getStorage("location"),
      });
      //处理数据数组
      this.$set(this, "getArea", data.data);
    },
    // 获取户型
    async getHousetype() {
      let { data } = await this.$client.rpc(apis.GET_FIND_HOUSETYPE, {
        parentCode: "houseType",
      });
      // console.log(data);
      //处理数据数组
      this.$set(this, "dictHouseType", data.rows);
    },
    //获取单价
    async getaverageprice() {
      let { data } = await this.$client.rpc(apis.GET_FIND_AVERAGEPRICE, {
        parentCode: "totalPrices",
      });
      // console.log(data);
      //处理数据数组
      this.$set(this, "dictTotalPrices", data.rows);
    },
    async getaveragepriceone() {
      let { data } = await this.$client.rpc(apis.GET_FIND_AVERAGEPRICE, {
        parentCode: "unitPrice",
      });
      // console.log(data);
      //处理数据数组
      this.$set(this, "dictUnitPrice", data.rows);
    },
    onupHouse(id) {
      this.currTitle = id;
      this.shopShow1 = this.shopShow3 = false;
      this.shopShow2 = !this.shopShow2; //使false变为true显示
    },
    onPrice(id) {
      this.currTitle = id;
      this.shopShow1 = this.shopShow2 = false;
      this.shopShow3 = !this.shopShow3; //使false变为true显示
    },
    formatItem(currItem, index) {
      return currItem.includes(index);
    },
    // 选中区域
    selectAreaItem(item, index) {
      this.currAreaItem.includes(index)
        ? (this.currAreaItem = this.currAreaItem.filter((n) => n !== index))
        : this.currAreaItem.push(index);
    },
    // 选中户型
    selectHouseItem(item, index) {
      this.currHouseItem.includes(index)
        ? (this.currHouseItem = this.currHouseItem.filter((n) => n !== index))
        : this.currHouseItem.push(index);
    },
    // 切换均价
    selectPriceNav(index) {
      if (this.currNav === index) return;
      this.currNav = index;
    },
    // 选中均价
    selectPriceItem(isPrice, item, index) {
      if (isPrice == 1) {
        this.currPriceItem.includes(index)
          ? (this.currPriceItem = this.currPriceItem.filter((n) => n !== index))
          : this.currPriceItem.push(index);
      } else {
        this.currTotalPriceItem.includes(index)
          ? (this.currTotalPriceItem = this.currTotalPriceItem.filter(
            (n) => n !== index
          ))
          : this.currTotalPriceItem.push(index);
      }
    },
    onAreaRest() {
      this.currAreaItem = [];
      this.areName = [];
    },
    onHouseRest() {
      this.currHouseItem = [];
      this.bedroomNum = [];
    },
    onPriceRest() {
      this.currPriceItem = [];
      this.currTotalPriceItem = [];
      this.countPrice = [];
      this.price = [];
    },
    async getNextPag() {
      if (this.page > 1 && this.productList.length == this.total) {
        //在当前页面隐藏导航条加载动画。
        this.loadingText = "真的没有更多啦~";
        return;
      }
      this.shownoting = false;
      this.saveList();
      //在当前页面显示导航条加载动画。
      uni.showNavigationBarLoading();
      console.log(this.location)
      let res = await this.$client.rpc(apis.PROJECT_LIST, {
        page: this.page,
        pageSize: 5,
        projectName: "",
        cityName: !this.location || this.location == '全部' ? "" : this.location,
        areName: this.areName,
        bedroomNum: this.bedroomNum,
        price: this.price,
        countPrice: this.countPrice,
      });

      let items = res.data.data.records;
      this.loadingText = "";
      uni.hideNavigationBarLoading();

      this.page++;
      // console.log(res);
      this.productList = this.productList.concat(items);
    },
    async saveList() {
      this.areName = [];
      this.bedroomNum = [];
      this.countPrice = [];
      this.price = [];
      for (var i = 0; i < this.currAreaItem.length; i++) {
        var item = this.currAreaItem[i];
        // console.log(item);
        var area = this.getArea[item];
        this.areName.push(area);
      }
      for (var i = 0; i < this.currHouseItem.length; i++) {
        var item = this.currHouseItem[i];
        // console.log(item);
        var area = this.dictHouseType[item];
        // console.log(area);
        this.bedroomNum.push(area.value);
      }
      for (var i = 0; i < this.currTotalPriceItem.length; i++) {
        var item = this.currTotalPriceItem[i];
        // console.log(item);
        var area = this.dictTotalPrices[item];
        // console.log(area);
        this.countPrice.push(area.value);
      }
      for (var i = 0; i < this.currPriceItem.length; i++) {
        var item = this.currPriceItem[i];
        // console.log(item);
        var area = this.dictUnitPrice[item];
        // console.log(area);
        this.price.push(area.value);
      }
    },
    async getList() {
      this.shownoting = false;
      this.page = 1;
      uni.showNavigationBarLoading();
      this.saveList();
      let res = await this.$client.rpc(apis.PROJECT_LIST, {
        page: this.page,
        pageSize: 5,
        projectName: "",
        // cityName: this.cityAll ? '' : (!this.location || this.location == '全部' ? "" : this.location),
        cityName: !this.location || this.location == '全部' ? "" : this.location,
        areName: this.areName,
        bedroomNum: this.bedroomNum,
        price: this.price,
        countPrice: this.countPrice,
      });
      // console.log(res.data.data.total,this.location, '李春松');
      //区域选择没数据显示全国
       if(res.data.data.total == 0 && !this.cityAll){//查询数量0，并且选择了地区
        this.areName = [];
        // this.$store.commit("SET_LOCATION", '全部');;
        this.cityAll = true;
        this.getList();
        return
      }
      this.page++;
      var toalnum = res.data.data
      this.total = toalnum.total;
      this.productList = toalnum.records;
      if (this.productList.length == 0) this.shownoting = true;

      // console.log(this.productList);
      uni.hideNavigationBarLoading();
      uni.stopPullDownRefresh();
      this.getCityArea();
    },
    // 点击跳转到详情页
    details(project_id) {
      this.$client.pushWindow("/pkBuilding/detail?id=" + project_id);
    },
    //点击列表里的推荐推荐
    async recommendClick(item) {
      // 检查是否登陆了
      if (!this.$client.passCheck()) return;
      // 检查是否已经完善了信息
      let us = await this.getUserDataState()
      if (us) return
      this.$client.pushWindow("/pkBuilding/recommend/index", {isShow:true, listSel: [item]});
    },
    // 去新增报备的页面
    async gotoReporting() {
      if (!this.$client.passCheck()) return;
      this.$client.pushWindow("/pkBuilding/recommend/index");
    },
    //跳转我的佣金的页面
    gotoCommission() {
      // this.$client.toast("敬请期待");
      // if(!this.$client.passCheck()) return
      this.$client.pushWindow("/pkBuilding/commission/index");
    },
    gotoCustomer() {
      this.$client.pushWindow("/pkBuilding/coustomer/index");
    },
    login(flag) {
      if (!this.lngShowTimes++ || flag)
        this.$client.pushWindow('/pkPublic/login/login', { redirect: true })
    },
    traffic(item) {
      if (this.isLogin) {
        itemClick(item)
      } else {
        this.$client.toast('请先登录')
        setTimeout(() => {
          this.login('go')
        }, 300);
      }
    },
    // 关闭分享弹框
    infoClose(){
      this.isShowReporting = false
    }
  },
};
</script>
<style lang="scss" scoped>
@import "./style.scss";
$height: 210px;
.ad-container {
  height: $height;
  .swiper {
    height: $height;
    background: #eee;
  }
  .ad-content {
    overflow: hidden;
    height: $height;
    .ad-img {
      width: 100%;
      height: $height;
    }
  }
}
.location {
  position: fixed;
  border-radius: 20px;
  padding: 5px;
  padding-right: 6px;
  z-index: 100;
  top: 25px;
  left: 20px;
  background-color: rgba(255, 255, 255, 0.3);
  color: #fff;
  display: flex;
  align-items: center;
  font-size: 14px;
  overflow: hidden; /*超出部分隐藏*/
  white-space: nowrap; /*不换行*/
  text-overflow: ellipsis; /*超出部分文字以...显示*/

  &::before {
    content: "";
    width: 36upx;
    height: 36upx;
    display: inline-block;
    margin-right: 4upx;
    background: url(https://img04.aomygod.com/fontend/202178/imgs/ic_location.png)
      no-repeat;
    background-size: 100% 100%;
  }

  &:active {
    background-color: rgba(255, 255, 255, 0.2);
  }
}
.modle {
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
}
</style>