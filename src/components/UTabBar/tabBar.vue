<!--
 * @Description: 
 * @version: 
 * @Author: gonghonglin
 * @Date: 2021-07-19 12:32:14
 * @LastEditors: gonghonglin
 * @LastEditTime: 2021-09-10 10:33:45
-->
<template>
	<div class="uni-tabbar" >
		<div class="uni-tabbar__item" v-for="(item, index) in tabbar" :key="index" @tap="changeTab($event,item)">
			<div class="uni-tabbar__bd">
				<div class="uni-tabbar__icon">
					<img v-if="item.shelfSeq == currId" class="icon_checked" mode="aspectFit" :src="`${imgPath}${item.selectImg}`"></img>
					<img v-else class="icon_check" mode="aspectFit" :src="`${imgPath}${item.shelfImg}`"></img>
				</div>
			</div>
			<div class="uni-tabbar__label" :class="{'active': item.shelfSeq == currId}">
				{{item.shelfName}}
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name:"tabBar",
		props: {
		},
		data() {
			return {
				currId: '',
				imgPath: 'http://img.asset',
			}
		},
		computed:{
			tabbar(){
				return this.$store.state.queryHome
			},
		},
		async mounted() {
			this.currId = this.$client.getStorage('menuCode') || '1'
			let res = await this.$client.getSystemInfo();
			if ( res.model.indexOf('iPhone') !== -1 ) {
				this.isIOS = true;
			}
		},
		methods: {
			async changeTab ($event,item) {
      	$event.preventDefault()
      	$event.stopPropagation()

				// 判断是否已经登录
				if(item.shelfSeq != 1  && !this.$store.state.userInfo.uid){
					this.$client.pushWindow("/pkPublic/login/login")
					return;
				}
				// console.log(item.shelfUrl)
				if (item.shelfSeq === this.currId) return
				this.currId = item.shelfSeq
				this.$client.setStorage('menuCode', item.shelfSeq)
				this.$client.pushWindow(item.shelfUrl, {}, {redirect:true})
			}
		}
	}
</script>

<style lang="scss" scoped>
 .uni-tabbar {
	position: fixed;
	left: 0;
	bottom: 0;
	z-index: 999;
	width: 100%;
	display: flex;
	justify-content: center;
	padding: 24upx 0 10upx 0;
	box-sizing: border-box;
	box-shadow: 0 -1px 2px rgba(0,0,0,0.1);
	background-color: #fff;
	// iphone安全距离处理
  padding-bottom: calc(10px + constant(safe-area-inset-bottom));
	padding-bottom: calc(10px + env(safe-area-inset-bottom));

	.uni-tabbar__item {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	.uni-tabbar__icon {
		width: 43upx;
		height: 43upx;
		text-align: center;
		.icon_check, .icon_checked {
			width: 43upx;
			height: 43upx;
		}
	}
	.icon {
		display: inline-block;
	}
	.uni-tabbar__label {
		text-align: center;
		font-size: 22upx;
		color: #676767;
		margin-top: 5upx;
		&.active {
				color: #F0C17B;
		}
	}
}
</style>
