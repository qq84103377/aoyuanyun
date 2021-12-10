<template>
  <div class="hosetype">
    <div class="hose_box">
      <swiper class="swiper" v-show="cur == 2">
        <swiper-item
          class="swiper-item"
          v-for="(item, index) in info.classifications[0].images"
          :key="index"
        >
          <img
            class="swiper-item-background"
            @click="clickImg(item.url)"
            :src="item.url"
            alt=""
          />
        </swiper-item>
      </swiper>
      <!-- <div v-show="cur == 1" v-if="flast">内容三</div>
      <div v-show="cur == 2" v-if="flast">内容四</div>
      <ul class="tab-tilte">
        <li @click="cur = 0" v-if="flast" :class="{ active: cur == 0 }">视频</li>
        <li @click="cur = 1" v-if="flast" :class="{ active: cur == 1 }">VR</li>
        <li @click="cur = 2" :class="{ active: cur == 2 }">图片</li>
      </ul> -->
    </div>
    <div class="type_hose">
      <div class="type-top">
        <div>
          <span class="room_floor"
            >{{ info.bedroom_num || '' }}室{{ info.hall_num || '' }}厅</span
          ><span :class="{
            'type type3': info.sales_status == 1, 
            'type type1': info.sales_status == 2, 
            'type type2': info.sales_status == 3, 
            'type type2': info.sales_status == 4, 
            'type type2': info.sales_status == 5, 
          }">{{ info.typeName  || ''  }}</span>
        </div>
        <span class="money">
          {{
            info.low_prize
              ? info.low_prize
              : info.high_prize || "价格待定"
          }}</span
        >
      </div>
      <span class="building">建面 {{ info.building_area  || ''  }}㎡</span>
    </div>
    <div class="house_detail">
      <div class="title">户型简介</div>
      <div class="Introduction">
        {{ info.description  || ''  }}
      </div>
    </div>
    <div class="box_hose">
      <CardContainer border title="其他户型介绍">
        <div class="hose-container">
          <div class="hose-type-img" v-for="(item, index) in list" :key="index">
            <img   @click="updateIndex(index)"
              class="swiper-item-background"
              :src="item.classifications[0].images[0].url"
              alt=""
            />
            <div class="hose-explain"   @click="updateIndex(index)">
              <span style="font-size: 14px; color: #000000"
                >{{ item.bedroom_num }}室{{ item.hall_num }}厅</span
              >
              <span style="font-size: 12px; color: #000000"
                >建面{{ item.building_area }}㎡</span
              ><span :class="{
                'type type3': item.sales_status == 1, 
                'type type1': item.sales_status == 2, 
                'type type2': item.sales_status == 3, 
                'type type2': item.sales_status == 4, 
                'type type2': item.sales_status == 5, 
              }">{{ item.typeName }}</span>
              <p style="font-size: 14px; color: #e20000">
                {{
                  item.low_prize
                    ? item.low_prize
                    : item.high_prize || "价格待定"
                }}
              </p>
            </div>
          </div>
        </div>
      </CardContainer>
    </div>
  </div>
</template>

<script>
import CardContainer from "./components/cardContainer";
export default {
  components: {
    CardContainer,
  },
  data() {
    return {
      homeSlide: {
        house_type: {},
      },
      list: "",
      _index:0,
      info:{},
      belongTyep: {
        1: "待售",
        2: "在售",
        3: "售罄",
        4: "非售",
        5: "未知",
      },
      cur: 2, //默认选中第一个tab
    };
  },
  onLoad() {
    this.list = this.$client.getParam().list; //接外面的参数
    this._index = this.$client.getParam().index || 0; //接外面的参数
    this.info=this.list[this._index];
    this.list.forEach((item) => {
      item.typeName = this.belongTyep[item.sales_status];
    });
  },
  methods: {
    clickImg(current) {
      console.log(current);
      uni.previewImage({
        urls: [current], //需要预览的图片http链接列表，多张的时候，url直接写在后面就行了
        current, // 当前显示图片的http链接，默认是第一个
      });
    },
    updateIndex(index){
      this._index=index;
      this.info=this.list[index];
    }
  },
};
</script>

<style lang="scss">
.hosetype {
  .swiper {
    height: 280px;
  }
  .type_hose {
    .type-top {
      display: flex;
      justify-content: space-between;
      padding: 20px 25px 0px 25px;
      .room_floor {
        font-size: 18px;
        color: #000;
        font-weight: bold;
      }
      .type {
        display: inline-block;
        width: 30px;
        height: 17px;
        text-align: center;
        border-radius: 5px;
        color: #ffff;
        font-size: 10px;
        margin-left: 5px;
      }
      .type1 {
        background: #f0c17b;
      }
      .type2 {
        background: #ededed;
      }
      .type3 {
        background: #3C4871;
      }

      .money {
        color: #e20000;
        font-size: 14px;
      }
    }
  }
  .building {
    padding-left: 25px;
    color: #666666;
    font-size: 14px;
  }
  .house_detail {
    padding: 0 25px;
    .title {
      padding: 20px 0 0 0;
      color: #333333;
      font-size: 16px;
    }
    .Introduction {
      margin-top: 7px;
      font-size: 14px;
      color: #666666;
    }
  }
  .box_hose {
    padding-bottom: 43px;
    margin-top: 20px;
    .hose-container {
      width: 100%;
      display: flex;
      flex-direction: row;
      overflow: auto;
      .hose-type-img {
        .swiper-item-background {
          height: 146px;
          width: 197px;
          margin-right: 10px;
        }
      }
    }
    .type {
      display: inline-block;
      width: 30px;
      height: 17px;
      background: #f0c17b;
      text-align: center;
      border-radius: 5px;
      color: #ffff;
      font-size: 10px;
      margin-left: 5px;
    }
    .type1 {
        background: #f0c17b;
      }
      .type2 {
        background: #ededed;
      }
      .type3 {
        background: #3C4871;
      }
  }
  .swiper-item-background {
    height: 280px;
    width: 100%;
  }
  .tab-tilte {
    position: absolute;
    top: 250px;
    left: 50%;
    transform: translate(-50%);
    height: 23px;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 13px;
    display: flex;
    justify-content: space-around;
    color: #ffff;
    line-height: 23px;
    font-size: 10px;
    padding: 2px;
    
    .active {
      width: 44px;
      height: 23px;
      background: linear-gradient(297deg, #f0c17b 0%, #fadbad 100%);
      border-radius: 11px;
      text-align:center ;
    }
  }
}
</style>