<!--
 * @Description: 首页，读取后管接口，自动配置
 * @version:
 * @Author: gonghonglin
 * @Date: 2021-07-01 15:35:00
 * @LastEditors: gonghonglin
 * @LastEditTime: 2021-11-02 10:45:46
-->
<template>
  <div class="page" :class="{ios: isIos}">
    <UNavbar ref="navbar" :scrollTop="scrollTop" />
    <div v-for="(item, index) in selection" :key="index" @click="checkLogin($event)">
      <!-- banner广告图 -->
      <EBannerAd :class="{'is-guest':!isLogin}" v-if="item.shelfCode=='SEL-BAD' && item.subItems.length" :list="item.subItems">
      </EBannerAd>
      <!-- 平台优惠 -->
      <ECoupon :class="{'is-guest':!isLogin}" v-if="item.shelfCode=='SEL-CP' && item.subItems.length" title="平台优惠"
        @onRefresh="onRefresh" :list="item.subItems"></ECoupon>
      <!-- 页内广告 -->
      <EInnerAd :class="{'is-guest':!isLogin}" v-if="item.shelfCode == 'SEL-AD' && item.subItems.length"
        :list="item.subItems"></EInnerAd>
      <!-- 卡包 -->
      <ECardBag :class="{'is-guest':!isLogin}" v-if="item.shelfCode == 'SEL-CP' && item.subItems2.length >0"
        @onRefresh="onRefresh" title="平台权益" :list="item.subItems2"></ECardBag>
      <!-- 抽奖 -->
      <EInnerLuck :class="{'is-guest':!isLogin}" v-if="item.shelfCode == 'SEL-LUCK' && item.subItems.length" :title="item.shelfName"
        :list="item.subItems"></EInnerLuck>
      <!-- 精选活动 -->
      <EPromotion :class="{'is-guest':!isLogin}" v-if="item.shelfCode == 'SEL-POMO' && item.subItems.length" :title="item.shelfName"
        :list="item.subItems"></EPromotion>
      <!-- 社区资讯 -->
      <ECommunity v-if="item.shelfCode == 'SEL-CMT' && item.subItems.length" title="热门资讯" :list="item.subItems"></ECommunity>
    </div>
    <!-- <EReporting ref="EReporting"></EReporting> -->
  </div>
</template>


<script>
import EBannerAd from "./components/eBannerAd.vue";
import EInnerAd from "./components/eInnerAd";
import ECardBag from "./components/eCardbag";
import ECoupon from "./components/eCoupon.vue";
import EPromotion from "./components/ePromotion.vue";
import ECommunity from "./components/eCommunity.vue";
import EReporting from '@/components/EReporting';

export default {
  components: {
    EReporting,
    ECoupon,
    EPromotion,
    EBannerAd,
    EInnerAd,
    ECardBag,
    ECommunity
  },
  data() {
    return {
      selection: [],
      isReady: false,
      isLoaded: false,
      scrollTop: 0,
      isIos: false,
      ads: [
        // advertisingStatus: 1
        // endTime: "2021-08-27 16:53:28"
        // id: "1419977969451208705"
        // redirectUrl: null
        // sort: null
        // startTime: "2021-07-27 16:53:28"
        // title: "测试标题"
        // type: null
        // urls: "www.baidu.com"
      ],
      AD_TYPE: {
        'GUIDE_PAGE': 1,//引导页
        'START_PAGE': 2,//启屏页
        'SEL_BANNER_AD': 3,//首页banner
        'SEL_INNER_AD': 4, //首页横幅广告
        'BUY_BANNER_AD': 5,//买房页广告
        'POMO_BANNER_AD': 6//活动页广告
      },
      isLogin: false,
    };
  },
  computed: {
    location() {
      return this.$store.state.location || "广州市"
    },
  },
  watch: {
    location(newVal, oldVal) {
      if (newVal != oldVal) {
        // console.log('★★★★更换了城市', newVal)
        this.onRefresh();   // 更换了区域，重新查询，广告接口
      }
    },
  },

  /**
 * 用户点击右上角分享
 */
  async onShareAppMessage(options) {
    if (!this.$client.passCheck()) return

    let uid = this.$store.state.userInfo.uid // 用户id
    let bid = uid ? '3' : '1'  // 业务类型
    let channelId = '8803' // 渠道id

    let {data} = await this.$client.rpc(this.$api.SET_SCENE, {scene:`${bid}_${uid}_0_${channelId}`})
    let scene = data.data.id

    console.error('转发', options);
    let shareObj = {
      title: "欢迎使用奥园云",
      path: 'pages/launch/index?scene=' + scene, // 默认当前页面
      imageUrl: 'http://img.asset/logo-share.jpg',
      // success(res) {
      //   // 转发成功之后的回调
      //   this.$client.pushEvent('SHARE_APP', { data: '首页' }) // 埋点
      //   this.$client.pushEventNew(2, { data: '首页' }) // 埋点
      //   if (res.errMsg == 'shareAppMessage:ok') {
      //   }
      // },
      // fail() {
      //   // 转发失败之后的回调
      //   if (res.errMsg == 'shareAppMessage:fail cancel') {
      //     // 用户取消转发
      //   } else if (res.errMsg == 'shareAppMessage:fail') {
      //     // 转发失败，其中 detail message 为详细失败信息
      //   }
      // },
      // complete() {
      //   // 转发结束之后的回调（转发成不成功都会执行）
      // }
    };

    // 数据埋点
    this.$client.pushEvent('SHARE_APP', { data: '首页' }) // 埋点
    this.$client.pushEventNew(2, { data: '首页' }) // 埋点

    return shareObj;
  },
  async onShow() {
    this.isLogin = !!this.$store.state.userInfo && this.$store.state.userInfo.uid
    if (!this.isLoaded) return
    let data = this.$client.getStorage('queryHome')
    this.renderPage(data, 0)  // 有缓存，直接渲染

    // 刷新广告问题
    this.getAdByCity()
  },
  async onLoad() {
    this.isLogin = !!this.$store.state.userInfo && this.$store.state.userInfo.uid
    // console.log('onLoad',333333333333)
    const sys = uni.getSystemInfoSync();
    this.isIos = sys.model.includes('iPhone');
    this.ads = this.$client.getStorage('ads') || []
    let data = this.$client.getStorage('queryHome')
    if (data) {
      this.renderPage(data, 0)  // 有缓存，直接渲染
    } else {
      this.onRefresh()          // 没有缓存，拉取最新数据
    }
  },
  mounted(){
    this.$client.pushEventNew(3); // 进入首页
  },
  onPageScroll(e) {
    this.scrollTop = e.scrollTop
  },
  methods: {
    checkLogin($event) {
      // console.log(9999, this.$store.state.userInfo)
      if (this.isLogin) return;
      this.$client.pushWindow("/pkPublic/login/login")
      $event.preventDefault()
      $event.stopPropagation()
    },
    async onPullDownRefresh() {
      await this.getAdByCity()
      await this.getShelves();
      // 停止下拉刷新，回弹问题
      this.$client.stopPullDownRefresh();
    },
    async onRefresh() {
      // console.log('onRefresh',6666666)
      await this.getAdByCity()
      await this.getShelves();
      await this.getCouponList();
      // console.log('onRefresh',7777777777)
    },
    feedbackClick() {
      uni.navigateTo({
        url: "../feedback/feedback",
      });
    },
    gotoMyCoupon() {
      this.$client.pushWindow("/pkMine/coupon/list");
    },
    gotodelits() {
      this.$client.pushWindow("/pages/index/couponindex/index");
    },

    // 获取首页架子信息
    async getShelves() {
      let queryHome = this.$client.getStorage('queryHome')  //架子数据

      // 如果有架子数据，先渲染
      if (queryHome) {
        this.renderPage(queryHome)
      }


      // 看看有没有新的架子信息，有则更新
      let { data } = await this.$client.rpc(this.$api.QUERY_HOME, {
        env: "0",  // 环境
        mallId: "35721d40-4b02-44ca-886b-27fdfe4e81f7", // 应用id
        updateTime: queryHome ? new Date().getTime() : ''
      });
      if (!data.data || data.data.length == 0) {
        // console.log('没有更新精选内容');
      } else {
        this.renderPage(data.data, 1)
      }
      this.isReady = true;
    },
    // 渲染页面 data 传入数据， index 判断是缓存数据还是最新的数据
    async renderPage(data, index) {
      // console.log('renderPage',data)
      this.isReady = true;
      if (!data) {
        // console.log('没有框架内容');
        data = []
      }
      // 抽取精选页的信息
      let selList = data.filter(item => item.shelfType == "SELECTION");
      if (selList.length == 0) {
        // console.log('没有精选内容');
        return;
      }

      // 获取货架内容列表 shelfCode: [SEL-POMO，SEL-CP，SEL-CMT，SEL-BAD，SEL-AD]
      let { chidrenShelfList } = selList[0];

      // 需要单独拉取内容的货架 SEL-CMT，SEL-POMO，SEL-CP
      for (const item of chidrenShelfList) {
        item.subItems = []
        item.subItems2 = []

        // 优惠券
        if (item.shelfCode == 'SEL-CP') {
          item.subItems = await this.getCouponList(item);
          item.subItems2 = await this.getCardList(item);
          // console.log('获取的优惠券---',item.subItems)

        }

        // 活动
        if (item.shelfCode == 'SEL-POMO') {
          item.subItems = await this.getPomoList(item);
          // console.log('获取的活动---',item.subItems)
        }
        // 卡包
        if (item.shelfCode == 'SEL-CARD') {
          item.subItems = await this.getCardList(item);
          // console.log('获取的卡包---',item.subItems)
        }

        // 资讯
        if (item.shelfCode == 'SEL-CMT') {
          item.subItems = await this.getCommunityList(item);
          // console.log('获取的卡包---',item.subItems)
        }

        // BANNER 广告
        if (item.shelfCode == 'SEL-BAD') {
          item.subItems = this.ads.filter(item => {
            return item.type == this.AD_TYPE.SEL_BANNER_AD
          })
          if (item.subItems.length == 0) {
            // console.log('默认Banner广告图')
            item.subItems.push({
              url: "http://img.asset/sel-banner@2x.png",
              redirectUrl: ""
            })
          }
        }
        // 行内广告
        if (item.shelfCode == 'SEL-AD') {
          item.subItems = this.ads.filter(item => {
            return item.type == this.AD_TYPE.SEL_INNER_AD
          })
          // console.log('获取的行内广告---',item.subItems)
        }
      }

      this.$set(this, 'selection', chidrenShelfList)

      for (const item of data) {
        if (item.shelfType == "SELECTION") {
          item.chidrenShelfList = chidrenShelfList
        }
      }
      //存业务数据
      this.$store.commit('SET_QUERY_HOME', data)
      this.isLoaded = true
      // console.log('renderPage',4444444444)
    },

    // 根据城市名称获取广告列表
    async getAdByCity() {
      let res = await this.$client.rpc(this.$api.AD_BY_CITY, {
        addressName: this.location == '全部' ? "" : this.location
      })
      if (res.data && res.data.rows && res.data.rows.length) {
        this.$client.setStorage('ads', res.data.rows)
        // console.log('更新广告',res.data.rows)
        this.$set(this, 'ads', res.data.rows)
      } else {
        // console.log('getAdByCity,当前城市没有广告',this.location)
        this.$client.setStorage('ads', [])
        this.$set(this, 'ads', [])
      }
      // console.log('---完成获取广告')
    },

    // 获取优惠券
    async getCouponList() {
      let res = await this.$client.rpc(this.$api.COUPON_LIST, {
        page: 0,
        pageSize: 4,
        enableTime: this.$tools.date2Str(new Date(), 'YYYY-MM-DD hh:mm:ss'),
        couponStatus: 1,
        publishType: 1,
        city: this.location == '全部' ? "" : this.location
      })
      if (res.data && res.data.rows && res.data.rows.length) {
        return res.data.rows
      } else {
        // console.log('getCouponList，没有优惠券')
        return []
      }
    },
    // 获取卡包列表
    async getCardList() {
      let res = await this.$client.rpc(this.$api.CARDBAG_LIST, {
        cardPackStatus: 1,
        page: 0,
        pageSize: 2,
        publishType: 1,
        enableTime: this.$tools.date2Str(new Date(), 'YYYY-MM-DD hh:mm:ss'),
      })
      if (res.data && res.data.rows && res.data.rows.length) {
        return res.data.rows
      } else {
        // console.log('getCouponList，没有卡包列表')
        return []
      }
    },


    // 获取资讯列表
    async getCommunityList() {
      let res = await this.$client.rpc(this.$api.COMMUNITY_LIST, {
        informationStatus: 1,
        page: 1,
        pageSize: 1
      })
      if (res.data && res.data.rows && res.data.rows.length) {
        for (let item of res.data.rows) {
          item._createTime = this.$tools.str2DateStr(item.createTime, 'YYYY/MM/DD hh:mm')
        }
        // console.log(res.data)
        return res.data.rows
      } else {
        return []
      }
    },

    // 获取活动列表
    async getPomoList() {
      let res = await this.$client.rpc(this.$api.PROMOTION_LIST, {
        gatheringStatus: 1,
        page: 1,
        pageSize: 2
      })
      if (res.data && res.data.rows && res.data.rows.length) {
        for (const item of res.data.rows) {
          // 展示用活动报名时间段
          item._date = this.$tools.str2DateStr(item.startTime, 'YYYY/MM/DD hh:mm') + ' - ' +
            this.$tools.str2DateStr(item.endTime, 'YYYY/MM/DD hh:mm')
             item._dates = this.$tools.str2DateStr(item.joinStartTime, 'YYYY/MM/DD hh:mm') + ' - ' +
            this.$tools.str2DateStr(item.joinEndTime, 'YYYY/MM/DD hh:mm')
          //显示用主图
          item._img = item.urls ? item.urls.split(',')[0] : ''
        }
        // console.log(res.data)
        return res.data.rows
      } else {
        // console.log('getPomoList，没有活动')
        return []
      }
    }
  },
};
</script>
<style lang="scss" scoped>
@import "index.scss";
.page{
  padding-bottom: 20px;
  // padding-bottom: calc(60px + constant(safe-area-inset-bottom));
	// padding-bottom: calc(60px + env(safe-area-inset-bottom));
}
</style>

