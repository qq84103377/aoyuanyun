<template>
	<div>
      <div class="tab_nav_box">
        <u-tab-nav :tabs="tabsData" :activeIndex.sync="tabIndex" @onChange="onTabChange"></u-tab-nav>
      </div>
		<div class="houses">
		    <div id="tab-content"  @scroll="onScroll">
		        <!--0-->
		        <div class="essentialInformation tab1">
		            <p class="p1">基本信息</p>
		            <p class="p2">
		              <span>物业类型：</span>
		              <text>{{homeSlide.base_info.product_types[productTypes].name|| ''}}</text>
		            </p>
		            <p class="p2">
		              <span>项目特色：</span>
		              <text> {{ homeSlide.base_info.introduction || '' }}</text>
		            </p>
		            <p class="p2">
		              <span>建筑类型：</span>
		                <text>
		                    <span v-for="(item, index) in homeSlide.base_info.product_types" :key="index"> {{item.name}}、</span>
		                </text>
		            </p>
		            <p class="p2">
		              <span>装修状况：</span>
		                <text>{{homeSlide.base_info.decoration_type || ''}}</text>
		            </p>
		            <p class="p2">
		              <span>产权年限：</span>
		              <text>{{homeSlide.base_info.product_types[productTypes].property_year || ''}}年</text>
		            </p>
		            <p class="p2">
		              <span>开发商：</span>
		                <text>{{homeSlide.base_info.developer || ''}}</text>
		            </p>
		            <p class="p2">
		              <span>项目地址：</span>
		              <text>{{homeSlide.base_info.address || ''}}</text>
		            </p>
		            
		        </div>
		        <!--1-->
		        <div class="essentialInformation tab2">
		            <p class="p1">销售信息</p>
		            <p class="p2">
		              <span>开盘时间：</span>
		              <text>{{homeSlide.open_info.open_time || ''}}</text>
		            </p>
		            <p class="p2">
		              <span>交房时间：</span>
		                <text>{{homeSlide.deliver_info.deliver_time || ''}}</text>
		            </p>
		            <p class="p2">
		              <span>楼盘电话：</span>
		                <text>{{homeSlide.sale_offices.telephone || ''}}</text>
		            </p>
		            <p class="p2">
		              <span>销售状态：</span>
		              <text>{{homeSlide.building_list[0].sales_status || ''}}</text>
		            </p>
		        </div>
		        <!--2-->
		        <div class="essentialInformation tab3">
		            <p class="p1">小区概况</p>
		            <p class="p2">
		              <span>容积率：</span>
		              <text>{{homeSlide.over_all_plan.volume_rate || ''}}</text>
		            </p>
		            <p class="p2">
		              <span>绿化率：</span>
		              <text>{{homeSlide.over_all_plan.green_rate || ''}}</text>
		            </p>
		            <p class="p2">
		              <span>楼栋总数：</span>
		                <text>{{homeSlide.over_all_plan.building_num || ''}}</text>
		            </p>
		            <p class="p2">
		              <span>总户数：</span>
		                <text>{{homeSlide.over_all_plan.household_num || ''}}</text>
		            </p>
		            <p class="p2">
		              <span>物业公司：</span>
		              <text>{{homeSlide.base_info.property_company || ''}}</text>
		            </p>
		            <p class="p2">
		              <span>物业费：</span>
		                <text>{{homeSlide.base_info.property_fee || ''}}{{homeSlide.base_info.measure_unit || ''}}</text>
		            </p>
		            <p class="p2">
		              <span>楼层状况：</span>
		              <text>{{homeSlide.building_list[0].sales_status || ''}}</text>
		            </p>
		        </div>
		        <!--3-->
		        <div class="essentialInformation tab4" >
		            <p class="p1">预售许可证</p>
		            <div  v-for="(items, index) in homeSlide.pre_sale_cert" :key="index">
		                <p class="p2">
		                  <span>预售证：</span>
		                    <text>{{items.certify_no || ''}}</text>
		                </p>
		                <p class="p2">
		                  <span>发证时间：</span>
		                    <text>{{items.certify_time || ''}}</text>
		                </p>
		                <p class="p2">
		                  <span>绑定楼栋：</span>
		                    <text>
		                    <span v-for="(item, index) in items.certify_building" :key="index">{{item}}</span>
		                    </text>
		                </p>
		            </div>
		        </div>
		
		    </div>
		</div>
	</div>
  
</template>
<script>
import UTabNav from "@/components/UTabNav";
export default {
  components: {
    UTabNav,
  },
  data() {
    return{
        homeSlide: {

        },
        productTypes:0,
        project_id: this.project_id, //列表传过来的id
        tabIndex: 0,
        tabsData:[
            {label:'基本信息', badge: ''},
            {label:'销售信息', badge: ''},
            {label:'小区概况', badge: ''},
            {label:'预售许可证', badge: ''},
        ],
        list: [
            { label: '基本信息',
              label1: '物业类型：', value1: '住宅',
              label2: '项目特色：', value2: '五期叠墅产品所供货量仅80套，是邻里时光目前主打最热销产品。整个叠墅地块位于项目核心之最-元宝之心，是整个广州东部唯一的法式叠墅产品。',
              label3: '建筑类型：', value3: '高层',
              label4: '装修状况：', value4: '精装修',
              label5: '产权年限：', value5: '70年',
              label6: '开发商：', value6: '奥园集团',
              label7: '项目地址：', value7: '广州市番禺区南村镇万博一路奥园国际',},
            { label: '销售信息',
              label1: '开盘时间：', value1: '2018年8月',
              label2: '交房时间：', value2: '2020年9月',
              label3: '楼盘电话：', value3: '020-88888888',
              label4: '销售状态：', value4: '在售',
              // label5: '产权年限：', value5: '70年',
              // label6: '开发商：', value6: '奥园集团',
              // label7: '项目地址：', value7: '广州市番禺区南村镇万博一路奥园国际'
              },
        ]
    }
  },
  // computed: {
  //   tabsData() {
  //     return [
  //       { label: '未使用', badge: this.mainItems[0] && this.mainItems[0].length ? `(${this.mainItems[0].length}张)` : '' },
  //       { label: '已使用', badge: this.mainItems[1] && this.mainItems[1].length ? `(${this.mainItems[1].length}张)` : '' },
  //       { label: '已失效', badge: this.mainItems[2] && this.mainItems[2].length ? `(${this.mainItems[2].length}张)` : '' },
  //     ];
  //   },
  // },
    onLoad(obj) {
        this.project_id = obj.id;
        this.getlistFrom();
    },
  methods: {
      onTabChange(index) {
          let query = wx.createSelectorQuery() //创建节点查询器
          query.select('#tab-content').boundingClientRect() //选择id为comment的节点并查询的它布局位置
          // console.log(query.select('#tab-content').boundingClientRect())
          query.exec(function (res) { //执行请求
            // console.log("高度---》",res[0])
            if(index===0){
                wx.pageScrollTo({
                  scrollTop: 0, //滚动到页面节点的上边界坐标
                  duration: 300 // 滚动动画的时长
                });
            } else if(index===1){
				let view = uni.createSelectorQuery().select('.tab1');
				view.boundingClientRect(function(data){
					console.log('================'+JSON.stringify(data))
					wx.pageScrollTo({
					  scrollTop: data.height, //滚动到页面节点的上边界坐标
					  // scrollTop: 1400, //滚动到页面节点的上边界坐标
					  duration: 280 // 滚动动画的时长
					});
				}).exec();
            }if(index===2){
				let scrHeight = 0;
				let view = uni.createSelectorQuery().select('.tab1');
				view.boundingClientRect(function(data){
					let view1 = uni.createSelectorQuery().select('.tab2');
					view1.boundingClientRect(function(height){
						wx.pageScrollTo({
						  scrollTop: data.height + height.height, //滚动到页面节点的上边界坐标
						  duration: 300 // 滚动动画的时长
						});
					}).exec();
				}).exec();
               
            }else if(index===3){
                wx.pageScrollTo({
                  scrollTop: 700, //滚动到页面节点的上边界坐标
                  duration: 300 // 滚动动画的时长
                });
            }
          })
      },
      //获取楼盘详情的数据
      async getlistFrom(project_id) {
		let res = await this.$client.rpc(this.$api.DEIL_PROJECT, {
			projectId: this.project_id,
		});
		this.homeSlide = res.data.data;
		// console.log(this.homeSlide.house_type);
		this.productTypes=this.homeSlide.base_info.product_types.length-1;
        //   uni.request({
        //       url: "http://172.17.2.22:8019/ay-cloud-ump/detailProject",
        //       method: "post",
        //       data: {
        //           projectId: this.project_id,
        //       },
        //       success: (res) => {
        //           // console.log(res.data.data);
        //           this.homeSlide = res.data.data;
        //           // console.log(this.homeSlide.house_type);
        //           this.productTypes=this.homeSlide.base_info.product_types.length()-1;
        //       },
        //   });
      },
  }
}
</script>
<style lang="scss" scoped>
@import "./style.scss";
</style>