<template>
  <div class="top-bar" :style="{'padding-top': statusBarHeight, 'background-color': `rgba(255,255,255,${navOpacity})`, 'color': navOpacity ? '#000' : '#fff'}">
    <div class="top-main" :style="{'height': titleBarHeight}">
      <div class="left" :style="{'height': titleBarHeight}">
        <div class="top-back" v-if="isShowBack" @click="onBack"><img class="icon-arrow" :src="iconArrow" alt=""></div>
        <div class="top-address" v-if="isShowAddress" @click="gotoCity">{{location | formatAddress }}</div>
      </div>
      <div class="center">
        <!-- <div class="top-title">{{pageRouter == 'pkBuilding/index' ? '买房' : '优惠'}}</div> -->
      </div>
    </div>
  </div>
</template>
<script>
import QQMapWX from '@/utils/qqmap-wx-jssdk.min.js'
let qqmapsdk = null

/**
 * @component
 * 顶部定位栏，导航栏
 */
export default {
  name: "UNavbar",
  props: {
    scrollTop: Number,
    transition: String,
    /**
     * 导航标题
     */
    title: String,
    /**
     * 返回按钮
     */
    isShowBack: {
      type: Boolean,
      default: false
    },
    isShowAddress: {
      type: Boolean,
      default: true
    },
    /**
     * 返回按钮禁用
     */
    disabled: {
      type: Boolean,
      default: false
    },
    /**
     * 自定义背景色
     */
    customStyle: {
      type: Object,
      default: () => {
        return {};
      }
    },
  },
  data() {
    return {
      pageRouter: '', // 当前路由
      iconArrow: require("./arrow.svg"),
      titleBarHeight: 0,
      statusBarHeight: 0,
      showStatusBar: false,
      discountList: 2,
      navOpacity: 0,
    };
  },
  filters: {
    formatAddress(val='') {
      return val.length > 8 ? val.substring(0, 7)+'...' : val
    }
  },
  computed: {
    location(){
      return this.$store.state.location
    },
    getStatusBarStyle() {
      if (this.$statusbar) {
        this.showStatusBar = true;
        return `height:${this.$statusbar}px;background-color:${this.statusbarBackgroundColor};`;
      }
      this.showStatusBar = false;
      return "";
    },
  },
  watch:{
    location(newVal, oldVal){

    },
    scrollTop(val, oldVal){//普通的watch监听
      if (val < 30 && this.navOpacity != 0.0) {
        this.navOpacity = 0.0
      } else if (val > 40 && this.navOpacity != 0.9) {
        this.navOpacity = 0.9
      }
    },
  },
  created() {},
  async mounted() {
    this.getRouter();
    let res = await this.$client.getSystemInfo();
    if ( res.model.indexOf('iPhone') !== -1 ) {
      this.titleBarHeight = 44 + 'px'
    } else {
      this.titleBarHeight = 48 + 'px'
    }
    this.statusBarHeight = res.statusBarHeight + 'px'
    // console.log(res)

    // 如果缓存有地理信息，则不获取
    if(!this.location){
      // 获取地理位置
      this.getUserLocation()
    }
  },
  methods: {
    getRouter() { // 获取当前路由
      var pages = getCurrentPages();  
      var page = (pages[pages.length - 1]).route;  
      this.pageRouter = page;
    },
    onBack(){
      this.$emit('onBack')
    },
    // 获取用户地址
    getUserLocation() {
      let that = this
      uni.authorize({
        scope: 'scope.userLocation',
        success() {
          // 实例化API核心类
          qqmapsdk = new QQMapWX({
            key: 'UJLBZ-Z43LX-AJ74Y-TTAY5-ZWSQV-VCFHT'
          })
          uni.getLocation({
            type: 'wgs84',
            success(res) {
              qqmapsdk.reverseGeocoder({
                location: {
                  latitude: res.latitude,
                  longitude: res.longitude
                },
                success (res) {
                  console.log('当前位置', res)
                  that.$store.commit('SET_LOCATION',res.result.address_component.city);
                  that.$store.commit("SET_USECITY", [res.result.address_component.city]);

                  that.$store.commit("SET_LOCATIONXY", res.result.location);
                  // console.log('改变位置', that.location)
                  that.$client.pushEvent('ALLOW_ADDRESS',{city:res.result.address_component.city}) // 埋点
                  that.$client.pushEventNew(4, {city:res.result.address_component.city}); // 埋点
                },
              })
            },
            fail(res) {
              console.log(res)
              that.$store.commit('SET_LOCATION', '广州市')
              that.$store.commit("SET_USECITY", ['广州市']);
              that.$store.commit("SET_LOCATIONXY", {
                lat: 22.93772,
                lng: 113.38424
              });
            }
          })
        },
        fail(res) {
          // 用户拒绝了，直接广州市
          // console.log(res)
          that.$store.commit('SET_LOCATION', '广州市')
          that.$store.commit("SET_USECITY", ['广州市']);
          that.$store.commit("SET_LOCATIONXY", {
            lat: 22.93772,
            lng: 113.38424
          });
        }
      })
    },
    /**
     * 返回上一个视图
     */
    back() {
      if (this.disabled) {
        return;
      }
      //TODO 这里调用JSAPI返回上一个页面视图
      /**
       * @event back
       */
      this.$emit("back");
      alert("返回上个视图");
    },
    /**
     * 点击右边按钮
     */
    rightMenuClick(item) {
      if (item.disabled === "disabled") {
        return;
      }
      alert(item.label);
      this.$emit("right-item-click", item.value);
    },
    /**
     * 右侧图标超过3个时点击超出图标触发
     */
    beyondRightClick(item) {
      //TODO 后期加上逻辑，调用JSAPI选择功能
      alert("调用JSAPI弹起PICKER");
      /**
       * @event right-menu-click
       * @returns 点击的对象
       */
      this.$emit("right-menu-click", item);
    },
    gotoCity(){
       this.$client.pushWindow('/pkPublic/city-positioning/index')
    }
  }
};
</script>
<style lang="scss" scoped>
  @import './style.scss';
</style>
