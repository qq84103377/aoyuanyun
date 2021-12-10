<template>
  <div class="w-picker-view">
    <picker-view class="d-picker-view" :indicator-style="itemHeight" :value="valueArr" @change="handlerChange">
      <picker-view-column>
        <view class="w-picker-item" v-for="(item, index) in years" :key="index">
          {{ item }}
          <text class="u-text">年</text>
        </view>
      </picker-view-column>
      <picker-view-column>
        <view class="w-picker-item" v-for="(item, index) in months" :key="index">
          {{ formatNumber(item) }}
          <text class="u-text">月</text>
        </view>
      </picker-view-column>
      <picker-view-column>
        <view class="w-picker-item" v-for="(item, index) in days" :key="index">
          {{ formatNumber(item) }}
          <text class="u-text">日</text>
        </view>
      </picker-view-column>
    </picker-view>
  </div>
</template>

<script>
export default {
  data() {
    return {
      valueArr: [0,0,0],
			years: [],
			months: [],
			days: [],
			year: 0,
			month: 0,
			day: 0,
      checkObj: {},
      startYear: '',
      endYear: ''
    };
  },
  props: {
    itemHeight: {
      type: String,
      default: "44px"
    },
    value: {
      type: [Array, String],
      default: ""
    },
    options: {
      type: Object,
      default: {}
    },
    defaultType: {
      type: String,
      default: "label"
    },
    hideArea: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    value(val) {
      this.initData();
    }
  },
  created() {
    this.startYear = this.options.startYear
    this.endYear = this.options.endYear
    this.initData();
  },
  methods: {
    getData() {
      //用来处理初始化数据
    },
    initData() {
      if(!this.value){
        this.value = this.$tools.date2Str(new Date(),'YYYY-MM-DD')
      }
      let date = this.$tools.str2Date(this.value);
      this.year = this.$tools.getYear(date);
      this.month = this.$tools.getMonth(date);
      this.day = this.$tools.getDay(date);

      this.setYears();
      this.setMonths();
      this.setDays();

    },
    // 生成递进的数组
		generateArray: function(start, end) {
			// 转为数值格式，否则用户给end-year等传递字符串值时，下面的end+1会导致字符串拼接，而不是相加
			start = Number(start);
			end = Number(end);
			end = end > start ? end : start;
			// 生成数组，获取其中的索引，并剪出来
			return [...Array(end + 1).keys()].slice(start);
		},
    getIndex: function(arr, val) {
			let index = arr.indexOf(+val);
			// 如果index为-1(即找不到index值)，~(-1)=-(-1)-1=0，导致条件不成立
			return ~index ? index : 0;
		},
    // 设置picker的某一列值
		setYears() {
			// 获取年份集合
			this.years = this.generateArray(this.startYear, this.endYear);
			// 设置this.valueArr某一项的值，是为了让picker预选中某一个值
			this.valueArr.splice(0, 1, this.getIndex(this.years, this.year));
		},
		setMonths() {
			this.months = this.generateArray(1, 12);
			this.valueArr.splice(1, 1, this.getIndex(this.months, this.month));
		},
		setDays() {
			let totalDays = new Date(this.year, this.month, 0).getDate();
			this.days = this.generateArray(1, totalDays);
			// 当月份变化时，会导致日期的天数也会变化，如果原来选的天数大于变化后的天数，则重置为变化后的最大值
			// 比如原来选中3月31日，调整为2月后，日期变为最大29，这时如果day值继续为31显然不合理，于是将其置为29(picker-column从1开始)
			if(this.day > this.days.length) this.day = this.days.length;
			this.valueArr.splice(2, 1, this.getIndex(this.days, this.day));
		},
    // 小于10前面补0，用于月份，日期，时分秒等
		formatNumber(num) {
			return +num < 10 ? '0' + num : String(num);
		},
    handlerChange(e) {
      // console.log(e)
      this.valueArr = e.detail.value

      this.year = this.years[this.valueArr[0]]
      this.month = this.months[this.valueArr[1]],
      this.day = this.days[this.valueArr[2]]

      let result = this.formatNumber(this.year) + '-' + 
        this.formatNumber(this.month) + '-' + 
        this.formatNumber(this.day)
      let obj = {
        label: result,
        value: result
      }
      this.setDays()
      this.$emit("change", {
        result,
        value: [this.year,this.month,this.day],
        obj: obj
      })
      // console.log(this.valueArr)
    }
  }
}
</script>

<style lang="scss">
@import "./w-picker.scss";
</style>

