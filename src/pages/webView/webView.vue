<template>
	<div>
		<div>
			<web-view :src="url" :progress="false"></web-view>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				titleBarHeight: 0,
				statusBarHeight: 0,
				url: ''
			}
		},
		onLoad(val) {
			// console.log(val)
			this.url = decodeURIComponent(val.url)
			let urlObj = val.urlObj
			if ( urlObj != undefined && urlObj ) {
				urlObj = JSON.parse(urlObj)
				if ( urlObj.url != undefined ) {
					this.url = decodeURIComponent(urlObj.url)
				}
			}
			var that = this;
			uni.getSystemInfo({
				success: function(res) {
					if ( res.model.indexOf('iPhone') !== -1 ) {
						that.titleBarHeight = 44 + 'px'
					} else {
						that.titleBarHeight = 48 + 'px'
					}
					that.statusBarHeight = res.statusBarHeight + 'px'
				}
			})
		}
	}
</script>

<style>
	.status-bar {
		width: 100%;
		background: #007AFF;
		top: 0;
		position: fixed;
		z-index: 100;
		left: 0;
	}
	.status-bar-title {
		position: absolute;
		left: 0;
		right: 0;
		margin: auto;
		font-size: 34rpx;
		color: #FFFFFF;
		text-align: center;
	}

</style>

