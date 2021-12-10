<!--
 * @Description: 
 * @version: 
 * @Author: gonghonglin
 * @Date: 2021-07-09 17:49:34
 * @LastEditors: gonghonglin
 * @LastEditTime: 2021-11-17 17:50:57
-->
<template>
  <CardContainer :title="title" @onMore="gotoCouponList" class="card-container">
      <div class="eCoupon">
        <ECouponItem class="e-coupon-item-continer"
            @click="onClick(item)"
            @onShowDetail="onShowDetail(item)"
            v-for="(item, index) in list" 
            :item="item" :key="index">
        </ECouponItem>
      </div>
  </CardContainer>
</template>

<script>
import  CardContainer  from "./cardContainer.vue";
import  ECouponItem  from "./eCouponItem.vue";
export default {
    components:{
        CardContainer,
        ECouponItem
    },
    props:{
        title:{
          type: String,
        },
        list:{
            type: Array,
            default:[]
        }
    },
    data(){
      return{
        isLoading: false, // 正在加载中
      }
    },
    mounted(){
        // console.log('e-coupon-list',this.list)
    },
    methods:{
        // 点击按钮，根据状态，处理是领取还是使用
        // useStatus:0-未领取，1-已领取
        onClick(item){
            // console.log(item.useStatus)
            if(item.useStatus==0){
                this.getReceiveCoupon(item);
            }else{
                this.onShowDetail(item,true);//打开详情后展示二维码
            }
        },

        gotoCouponList(){
            this.$client.pushWindow('/pkCoupon/index')
        },

        // 领取优惠券
        async getReceiveCoupon(item){
            if(!this.$client.passCheck()) return
            if(this.isLoading){
              this.$client.toast('正在加载中')
              return
            }
            this.isLoading = true
            try {
              let {data} = await this.$client.rpc(this.$api.COUPON_GET_RECEIVE,{
                    couponId :item.id,
              })
              if(data.success){
                  item.useStatus=1; //标记为已领取
                  this.$client.toast('优惠券已领取')
                  this.$emit('onRefresh')
                  this.$client.pushEvent('COUPON_RECEIVE',{id:item.id, name:item.name}) // 埋点
                  this.$client.pushEventNew(24,{}); // 24，领取优惠券
              }else{
                  // console.log('优惠券领取失败',data)
              }
              this.isLoading = false
            } catch (error) {
              this.isLoading = false
            }
        },
        // 查看优惠券详情
        onShowDetail(item, isShowQRCode="") {
            this.$client.pushWindow(
                "/pkCoupon/detail/index?id=" + item.id + "&isShowQRCode=" + isShowQRCode
            );
        },
    }
}
</script>

<style lang="scss" scoped>
    .card-container{
      margin-bottom: 0;
    }
    .eCoupon{
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: space-between;
        .e-coupon-item-continer{
            width: calc(50% - 7.5px);
            // 奇数，左侧一列增加右边的间隙
            // &:nth-child(odd){
            //   margin-right:15px;
            // }
            // 不是最后一行的，都需要底部间隔
            &:not(:nth-last-of-type(-n+2)){
              margin-bottom: 15px;
            }
        }
    }
</style>