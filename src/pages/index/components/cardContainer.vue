<!--
 * @Description: 
 * @version: 
 * @Author: gonghonglin
 * @Date: 2021-07-09 17:49:34
 * @LastEditors: gonghonglin
 * @LastEditTime: 2021-09-24 09:16:08
-->
<template>
  <div class="card-container">
	  <div class="card-header">
		  <div class="title">
			  <span>{{title}}</span>
		  </div>
		  <div class="more" @click="onMore">
			  <span>{{more.label}}</span>
				<img class="icon-arrow" src="http://img.asset/jt.png" />
		  </div>
	  </div>
	  <div class="card-content">
		  <slot></slot>
	  </div>
  </div>
</template>

<script>
export default {
	props:{
		title:{
			type:String,
			default: "标题"
		},
		more:{
			type:Object,
			default:
				{
					label:'更多',
					link:''
				}


		},
		
	},
	methods:{
		onMore(){
			this.$emit('onMore')
		}
	}

}
</script>

<style lang="scss">
.card-container{
	background-color:#FFF;
	margin: 15px;
  margin-top:0;

	.card-header{
		position: relative;
		color: #666666;

		.title{
			padding: 10px 0px;
			display: flex;
			align-items: center;
    	justify-content: center;

			&::before, &::after{
				height: 12px;
				width: 40px;
				content: "";
				background-image: url(http://img.asset/index/dec_left2x.png);
				background-repeat: no-repeat;
				background-size: contain;
				background-position: center;
				margin: 0 6px;
			}
			&::after{
				background-image: url(http://img.asset/index/dec_right2x.png);
			}
		}

		.more{
			position: absolute;
			right: 0;
			top:4px;
			font-size: 12px;
			padding: 8px 6px;
			padding-right: 0;
			display: flex;
			align-items: center;

			.icon-arrow{
				width:15px;
				height: 15px;
				transform: rotate(-90deg);
			}
		}

	}


}
</style>