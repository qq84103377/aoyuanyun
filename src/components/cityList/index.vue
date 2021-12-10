<template>
  <div class="citylist">
    <div class="search">
      <img src="http://img.asset/area_search.png">
      <input
        type="text"
        placeholder="请输入城市名称"
        placeholder-style="font-size:25rpx"
        v-model="keyword"
      />
    </div>
    <div>
      <div class="city-list-container">
        <div class="area_box area_bd_box" id="location_city">
          <div class="area_name">定位城市</div>
          <div class="area_item area_bd_item">
            <div @click="onSelectCity('全部')">
              <img src="http://img.asset/area_icon.png">
              全部
            </div>
            <div @click="router" v-if="location != '全部'">
              <img src="http://img.asset/area_icon.png">
              {{ location }}
            </div>
          </div>
        </div>
        <div class="area_box" id="location_city">
          <div class="area_name">常用地区</div>
          <div class="area_item">
            <div :class="{'active': index == 0}" @click="onSelectCity(item)" v-for="(item, index) in useCity" :key="index">{{item}}</div>
          </div>
        </div>
        <!-- 城市列表 -->
        <div id="citytitle" class="city-list-content">
          <div
            class="city_title_wrap"
            v-for="(citys, ctIndex) in filterList"
            :key="ctIndex"
          >
            <div class="city-title city-title-letter" :id="citys.firstLetter">
              {{ citys.firstLetter }}
            </div>
            <div class="city-list city-list-block">
              <div
                class="city-item"
                v-for="(item, index) in citys.cityName"
                :key="index"
                @click="onSelectCity(item)"
              >
                {{ item }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 固定顶部 -->
    <!-- <div class="fixtitle" :style="{ transform: fixedStyle }">
      <div class="city-title">{{ fixedTitle }}</div>
    </div> -->
    <!-- 侧边栏导航 -->
    <div class="navrightcity">
      <div
        v-for="(item, index) in citylist"
        :key="index"
        :class="{ active: active == item }"
        @click="onClickLetter(item)"
      >
        {{ item.firstLetter }}
      </div>
    </div>
  </div>
</template>

<script>
import apis from "@/apis";
export default {
  props: {},
  computed: {
    location() {
      return this.$store.state.location;
    },
    useCity() {
      return this.$store.state.useCity;
    },
    // 城市筛选
    filterList() {
      let tmpArray = []
      for (const city of this.citylist) {
        let tmpCity = {
          firstLetter: city.firstLetter,
          cityName: city.cityName.filter(item=>item.includes(this.keyword))
        }
        if(tmpCity.cityName.length){
          tmpArray.push(tmpCity) 
        }
      }
      if(tmpArray.length){
        return tmpArray
      }else{
        return []
      }
    },
  },
  watch: {},
  data() {
    return {
      scrollY: -1, //滚动记录
      diff: -1, //
      citylist: [],
      currentIndex: 0,
      windowH: "",
      scrollTop: 0,
      fixedStyle: "translate3d(0,0,0)",
      fixedTop: 0,
      topSize: [],
      keyword: "",
    };
  },
  methods: {
    async onSelectCity(item='全部') {
      // console.log("onSelectCity", item)
      if(this.useCity.some(key => item == key)) {
        var i = this.useCity.indexOf(item);
        this.useCity.splice(i, 1);
        this.useCity.unshift(item); 
      } else {
        this.useCity.unshift(item); 
      }
      if (this.useCity.length > 5) {
        this.useCity.pop(); 
      }
      this.$store.commit("SET_USECITY", this.useCity);
      this.$store.commit("SET_LOCATION", item);
      this.$client.back();
    },
    router() {
      this.$client.back();
    },
    onClickLetter(item) {
      this.active = item;
      // 容器滚动的高度
      let citylist = uni.createSelectorQuery().in(this).select(".citylist");
      citylist
        .boundingClientRect((data) => {
          // console.log("citylist" + data.top);
          let sTop = data.top;

          // 字母  离顶部的高度
          let view = uni
            .createSelectorQuery()
            .in(this)
            .select("#" + item.firstLetter);
          view
            .boundingClientRect((data) => {
              uni.pageScrollTo({
                scrollTop: Math.abs(sTop) + data.top,
                duration: 300,
              });
            })
            .exec();
        })
        .exec();
    },

    // 初始化数据列表
    async getCitylist() {
      let citylist = this.$client.getStorage("citylist");
      if (!citylist) {
        let { data } = await this.$client.rpc(apis.GETCITY_NAME, {});
        this.$client.setStorage("citylist", data.data);
        this.$set(this, "citylist", data.data);
      } else {
        this.$set(this, "citylist", citylist);
      }
    },

    // 滚动条Y距离
    scroll(e) {
      this.scrollY = e.detail && e.detail.scrollTop;
    },
    // 滚动到指定位置
    scroll_to_city(index) {
      this.scrollTop = this.tops[index];
      this.scrollY = scrollY;
      this.cityScroll.scrollTo(0, -scrollY, 300);
    },
    // 搜索
    // bindinputCitys(e){
    // 	let cities = this.citylist;
    // 	let cyits=[];
    // 	for (let key in cities){
    // 	  for (let i = 0; i < cities[key].length;i++){
    // 	    if (cities[key][i].name.search(e.detail.value) != -1 || cities[key][i].spell.search(e.detail.value) != -1){
    // 	      cyits.push(cities[key][i])
    // 	    };
    // 	  }
    // 	}
    // 	this.search = e.detail.value
    // 	this.cyits = cyits
    // },
  },
  // 页面挂载后进行异步操作
  created() {
    this.getCitylist();
  },
};
</script>

<style lang="scss">
.citylist {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  .search {
    position: relative;
    background-color: #ffffff;
    border: 1px solid #cccccc;
    width: 686rpx;
    border-radius: 100rpx;
    margin: 20rpx auto;
    padding: 4rpx;
    img{
      position:absolute;
      top: 4px;
      left: 10px;

      height: 20px;
      width: 20px;
    }
    input {
      line-height: 60rpx;
      text-align: left;
      padding-left: 72rpx;
    }
  }
}
.city-list-container {
  width: 100%;
  height: 100%;
  background-color: #fff;
  font-size: 14px;
  color: #333;
  .city-list-content {
    margin-right: 25px;
  }
  .city-title {
    padding-left: 15px;
    line-height: 30px;
  }
  .city-list {
    padding-right: 30px;
  }
  .city-title-letter {
    padding-left: 25px;
  }
  .city-list-block {
    background-color: #fff;
    .city-item {
      height: 48px;
      line-height: 48px;
      margin-left: 15px;
      border-bottom: 1px solid #f4f4f4;
      &:last-child {
        border: 1;
      }
    }
  }
  .city-list-inline {
    // background-color: #f5f5f5;
    padding-bottom: 8px;
    overflow: hidden;
    &::after {
      content: "";
      clear: both;
    }
    .location-city,
    .city-item {
      float: left;
      background: #fff;
      // width: 29%;
      // height: 33px;
      margin-top: 15px;
      margin-left: 4%;
      padding: 0 4px;
      // border: 1px solid #e6e6e6;
      border-radius: 3px;
      line-height: 33px;
      text-align: center;
      box-sizing: border-box;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .location-city {
      width: auto;
      min-width: 30%;
      padding: 0 20px;
    }
  }
}
.area_box {
  padding: 0 15px;
  color: #333;
  .area_name {
    font-size: 16px;
  }
  .area_item {
    padding: 20px 0 30px;
    font-size: 14px;
    & > div {
      display: inline-flex;
      margin-right: 30px;
      padding-bottom: 5px;
    }
    .active {
      color: #F0C17B;
    }
  }
}
.area_bd_box {
  .area_bd_item {
    padding: 17px 0;
    & > div {
      padding: 6px 10px;
      background: #F0C17B;
      border-radius: 5px;
      color: #fff;
        line-height: 14px;

      img {
        width: 12px;
        height: 14px;
        margin-right: 6px;
      }
    }
  }
}
.navrightcity {
  position: fixed;
  top: 50%;
  transform: translateY(-40%);
  right: 0;
  width: 35px;
  z-index: 10;
  text-align: center;
  font-size: 12px;
  .nav-item {
    height: 16px;
    height: 2.8vh;
  }
  .active {
    width: 15px;
    margin-left: 15px;
    background-color: #f0c17b;
    height: 15px;
    border-radius: 50%;
  }
}
.fixtitle {
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  overflow: hidden;
  .city-title {
    padding-left: 15px;
    line-height: 30px;
    font-size: 14px;
    color: #333;
    background-color: #ebebeb;
  }
}
.city-list-box {
  padding: 0 !important;
  padding: 20px !important;
  .location-city {
    margin: 0 !important;
    margin-right: 20px !important;
  }
}
</style>
