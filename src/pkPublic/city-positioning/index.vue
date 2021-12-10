<template>
        <CityList :getCity="getCity"></CityList>
</template>
 
<script>
import apis from "@/apis";
import CityList from "@/components/cityList";
export default {
  components: {
    CityList,
  },
  data() {
    return {
      active: "",
      citylist: [],
    };
  },
  onLoad() {
    this.getCitylist();
    // this.init();
  },
  methods: {
    //城市列表数据
    async getCitylist() {
      let { data } = await this.$client.rpc(apis.GETCITY_NAME, {});
      //处理数据数组
      this.$set(this, 'citylist', data.data);
    },
    change(data) {
      // console.log(data);
    },
    selected(name) {
      // console.log(111111);
      this.active = name;
    },
    
  },
};
</script>

<style lang="scss" scoped>
.Common-cities {
  .common-cities-litle {
    padding: 15px;
  }
  .common-cities-list {
    display: flex;
    justify-content: space-between;
    width: 174px;
    height: 50px;
    padding: 24px;
  }
}
.active {
  color:#F0C17B;
}
</style>

