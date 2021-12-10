<!--
 * @Description: 
 * @version: 
 * @Author: gonghonglin
 * @Date: 2021-07-09 17:49:34
 * @LastEditors: gonghonglin
 * @LastEditTime: 2021-09-24 10:26:45
-->
<template>
  <div class="card-container" :class="{border}">
	  <div class="card-header">
		  <div class="title">
			  <span>{{title}}</span>
		  </div>
		  <div class="more  moreclass" v-if="more.label" @click="onMore">
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
		border:{
			type: Boolean,
			default: false,
		},
		title:{
			type:String,
			default: "标题"
		},
		more:{
			type:Object,
			default:
				{
					label:'',
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
	border-radius: 10px;
	margin: 0 15px;
	border-radius: 10px;
	padding: 10px;
  margin-top:0;
	&.border{
		box-shadow: 0px 1px 6px 0px rgba(0, 0, 0, 0.07);
	}

	.card-header{
		position: relative;
		color: #333333;

		.title{
			padding: 0 0 10px;
			display: flex;
			align-items: center;
    		justify-content: flex-start;
			font-weight: 600;
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
		.moreclass{
				position: absolute;
			right: 0;
			top:4px;
			font-size: 12px;
			padding: 0px 6px;
			padding-right: 0;
			display: flex;
			align-items: center;

		}

	}


}
</style>