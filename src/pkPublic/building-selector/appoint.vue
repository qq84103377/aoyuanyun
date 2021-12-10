<template>
	<!-- 指定置业顾问 -->
	<div class="page">
		<div class="c-container">
			<div class="tips">
				<p>
					为项目指定置业顾问，报备给该项目的客户将默认分配给该置业顾问跟进
				</p>
			</div>
			<div class="content">
				<div class="no-sel" @tap="nofun">
					<div>不指定置业顾问</div>
					<div class="icon-img">
						<image style="width: 15px;" :src="noSel ? 'http://img.asset/personal/personal06.png' : 'http://img.asset/personal/personal01.png'" mode="widthFix">
						</image>
						<!-- <image style="width: 15px;" src="http://img.asset/personal/personal01.png" mode="widthFix"></image> -->
					</div>
				</div>
				<div class="list">
					<div class="list-item" v-for="(item,index) in counselor" :key="index" @tap="selfun(item)">
						<div class="item-left">
							<img style="width: 40px;height: 40px;border-radius: 50%;" :src="item.avatar || 'http://img.asset/personal/header.png'" />
							<div class="info">
								<text class="name">{{item.name}}</text>
								<text class="iphone" v-if="item.mobile">{{formatData(item.mobile)}}</text>
							</div>
						</div>
						<div class="item-right">
							<image style="width: 15px;" :src="selCoun.includes(item.sale_id) ? 'http://img.asset/personal/personal06.png' : 'http://img.asset/personal/personal01.png'" mode="widthFix">
							</image>
							<!-- <image style="width: 15px;" src="http://img.asset/personal/personal01.png" mode="widthFix"></image> -->
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import apis from "@/apis";
	export default {
		data() {
			return {
				// projectId: '',//楼盘id
				counselor: [],//顾问列表
				noSel: false,//不指定
				selCoun: [],//顾问人员id
				selName: '',//顾问名
			}
		},
		onLoad(option) {
			let param = this.$client.getParam();
			console.log('============='+JSON.stringify(param))
			this.counselor = param.data;
			this.selCoun.push(param.userId)
			// if (option && option.data) {
			// 	this.counselor = JSON.parse(option.data);
			// }
			// if(option && option.userId != ''){
			// 	this.selCoun.push(option.userId)
			// 	console.log(this.selCoun,'lichunsong')
			// }
			
		},
		methods: {
			//不选置业
			nofun(){
				this.noSel = true;
				this.selCoun = [];
				// this.selName = '';
				uni.$emit('selWindow',{});
				uni.navigateBack()
			},
			//选择置业顾问
			selfun(item){
				this.noSel = false;
				this.selCoun = [];
				// this.selName = '';
				// this.selName = item.name;
				this.selCoun.push(item.sale_id);
				uni.$emit('selWindow',item)
				uni.navigateBack()
			},
			//号码隐私
			formatData(str){
				if(str){
					let reg = /(\d{3})\d*(\d{4})/;
					return str.replace(reg, '$1****$2');
				}
				return '';
			},
			//置业顾问列表
			async getCounselor() {
				let res = await this.$client.rpc(apis.QUERY_CENTERLIST, {
					projectId: this.projectId,
				});
				if (res.data.success) {
					this.counselor = res.data.rows;
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page {
		min-height: calc(100vh - 43px);
		background: #F6F6F6;

		.c-container {
			padding: 0 15px;

			.tips {
				color: #999999;
				font-size: 10px;
				padding: 15px;
			}

			.content {
				height: calc(100vh - 100px);
				border-radius: 10px;
				box-shadow: 1px 1px 5px 0px rgba(0, 0, 0, 0.1);
				background: #FFFFFF;
				padding: 0 10px 10px;

				.no-sel {
					height: 50px;
					font-size: 14px;
					color: #F0C17B;
					display: flex;
					align-items: center;
					justify-content: space-between;
					border-bottom: 1px solid #F0C17B;
				}
				.list::-webkit-scrollbar {
				  display: none; /* Chrome Safari */
				}
				.list {
					height: calc(100vh - 151px);
					overflow: auto;
					scrollbar-width: none; /* Firefox */
					-ms-overflow-style: none; /* IE 10+ */
					.list-item {
						height: 62px;
						border-bottom: 1px solid #F0C17B;
						display: flex;
						justify-content: space-between;
						align-items: center;

						.item-left {
							width: 50%;
							display: flex;
							align-items: center;

							.info {
								margin-left: 10px;
								display: flex;
								flex-direction: column;
								justify-content: space-around;

								.name {
									font-size: 14px;
									color: #333333;
								}

								.iphone {
									font-size: 12px;
									color: #D3D3D3;
									margin-top: 10px;
								}
							}
						}
					}
				}
			}
		}
	}
</style>
