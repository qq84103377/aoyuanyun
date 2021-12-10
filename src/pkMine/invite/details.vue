<template>
	<!-- 关联邀请 -->
	<div class="page">
		<div class="c-container">
			<div class="top-card">
				<div class="user-info">
					<img class="img" :src="info.avatarUrl || 'https://img04.aomygod.com/fontend/202179/imgs/user_attr.png'" />
					<div class="name">
						<div class="span-1">{{info.nickName || '微信用户'}}</div>
						<div class="span-2">{{formatData(info.phone) || '1111'}}</div>
					</div>
				</div>
				<div class="box-bottom">
					<div>成交笔数：{{info.totalCount || 0}}</div><div class="shou">总收益：￥{{info.totalAmount || 0}}</div>
				</div>
				<div class="box-bottom">注册时间：{{info.createTime || ''}}</div>
			</div>
			<div class="list">
				<div class="list_item" v-for="(item,index) in list" :key="index">
					<div class="list_name">
						<img class="name_icon" src="http://img.asset/personal/personal05.png" />
						{{item.orderVO.type!=1?item.orderVO.couponName:item.orderVO.goodName}}
					</div>
					<div class="list_id">ID:{{item.orderVO.orderNumber}}</div>
					<div class="info_name">{{item.orderVO.goodName}}</div>
					<div class="list_time">
						<span>下单时间</span>
						<span>{{item.orderVO.createTime}}</span>
					</div>
					<div class="list_info">
						<div>
							<div class="info_text"><span>收益金额</span>￥{{item.preTaxAmount}}</div>
						</div>
					</div>
					
				</div>
				<div class="loading" v-if="list.length>0">{{ loadingText }}</div>
				<div class="noting" v-show="list.length == 0" style="text-align: center; color: #999999;">
				  <img  src="http://img.asset/no.png" />
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				info:{
					
				},
				list:[],
				page: 1,
				pageSize: 10,
				total: 0,
				loadingText: '',
			}
		},
		onLoad(option) {
			let param = this.$client.getParam();
			this.info = param.itemInfo;
			this.getList()
			// if(option && option.itemInfo){
			// 	this.info = JSON.parse(option.itemInfo);
			// 	this.list = this.info.childDetailVos;
			// }
		},
		onPullDownRefresh() {
			this.loadingText = '';
			this.total = 0;
			this.page = 1;
			this.getList();
		},
		//页面滚动到底部的事件
		onReachBottom() {
			this.getList();
		},
		methods: {
			async getList() {
				this.loadingText= '';
				if (this.page > 1 && this.list.length == this.total) {
				  //在当前页面隐藏导航条加载动画。
				  this.loadingText = "真的没有更多啦~";
				  return;
				}
				let res = await this.$client.rpc(this.$api.EARNINGS_LIST,{
					page: this.page,
					pageSize: this.pageSize,
					twoLevelId: this.info.id
				})
				  this.total =  res.data.total;
				  if(this.page > 1){
					this.list = this.list.concat(res.data.rows)
				  }else{
					this.list = res.data.rows;
				  }
				  this.page++;
			},
			//号码隐私
			formatData(str){
				if(str){
					let reg = /(\d{3})\d*(\d{4})/;
					return str.replace(reg, '$1****$2');
				}
				return '';
			},
		}
	}
</script>

<style lang="scss" scoped>
	.page {
		min-height: calc(100vh - 43px);
		background: #F6F6F6;
		padding: 13px;
		box-sizing: border-box;
		.c-container{
			.top-card{
				height: 100px;
				padding: 18px;
				background-image: url(http://img.asset/personal/guanlian.png);
				background-size: 100% 100%;
				background-position: center;
				background-repeat: no-repeat;
				// background-color: #333f56;
				font-size: 14px;
				color: #FFFFFF;
				border-radius: 10px;
				.user-info{
					height: 45px;
					display: flex;
					align-items: center;
					.img{
						width: 40px;
						height: 40px;
						border-radius: 50%;
					}
					.name{
						display: flex;
						flex-direction: column;
						justify-content: center;
						margin-left: 10px;
						.span-1{
							flex: 1;
							font-size: 14px;
						}
						.span-2{
							margin-top: 5px;
							font-size: 12px;
						}
					}
				}
				.box-bottom{
					height: 30px;
					display: flex;
					align-items: center;
					font-size: 12px;
					.shou{
						font-size: 12px;
						margin-left: 34px;
					}
				}
			}
			.list{
				.list_item {
					border-radius: 10px;
					padding: 12px 10px;
					background-color: #FFFFFF;
					margin-top: 13px;
				
					.list_name {
						font-size: 12px;
						color: #333;
						padding-bottom: 5px;
				
						.name_icon {
							vertical-align: sub;
							width: 16px;
							height: 16px;
						}
					}
				
					.list_id {
						font-size: 10px;
						color: #999;
						padding-bottom: 10px;
						border-bottom: 2px solid #f5f5f5;
					}
					.info_name {
						font-size: 14px;
						color: #000;
						padding: 10px 0;
					}
					.list_time {
						color: #999;
						font-size: 10px;
				
						span {
							padding-right: 10px;
						}
				
						padding-bottom: 10px;
					}
				
					.list_info {
						display: flex;
						.info_img {
							background-color: #000;
							width: 125px;
							height: 92px;
							border-radius: 5px;
						}
				
						&>div {
							flex: 1;
							.info_text {
								display: flex;
								align-items: center;
								font-size: 14px;
								color: #E20000;
								padding-bottom: 5px;
				
								span {
									font-size: 10px;
									color: #999;
									display: inline-block;
									padding-right: 10px;
								}
							}
						}
					}
				}
			}
		}
	}
	.loading{
	  text-align: center;
	  color: #8F8F94;
	  font-size: 12px;
	  padding: 10px 0 15px;
	}
</style>
