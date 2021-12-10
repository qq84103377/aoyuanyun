<template>
  <div class="coupon-container">
    <div
      class="coupon-image"
    >
      <image class="img" mode="widthFix" :src="couponInfo.imgUrl || 'http://img.asset/coupon-bg-default.png'" alt="" />
    </div>
    <!-- 标题栏 + 优惠券类型 -->
    <div class="coupon_detali_top">
      <div class="d-flex">
      {{couponInfo.name || '加载中'}} 
        <!-- <div class="coupon-type" :class="{'type-discount': couponInfo.couponType=='2'}">{{CouponType[couponInfo.couponType]}}</div> -->
      </div>

      <!-- 9.5折、8000元， 无门槛券 -->
      <div class="coupon-val-bar">
        <div class="coupon-num">
          <!-- <div>
            <span class="coupon-value">{{couponInfo.couponType=='2'?couponInfo.discount:couponInfo.offsetAmount}}</span>
            <span class="coupon-unit">{{couponInfo.couponType=='2'?'折':'元'}}</span>
            <span class="min-point">{{couponInfo.minPoint?couponInfo.minPoint:'无门槛'}}</span>
          </div> -->
          <!-- <div class="sunnumber">总计 {{ couponInfo.count || 0 }} 张</div> -->
        </div>
        <!-- 进度条 -->
        <!-- <div class="progress-container">
          <span>已抢</span>
          <div class="progress-bar">
            <div class="progress" :style="{'width': (couponInfo.usageQuantity || 5) + '%'}"></div>
          </div>
          <span>{{couponInfo.usageQuantity || 0}}%</span>
        </div> -->
      </div>
    </div>

    <!-- 使用规则 -->
    <div class="usuer_contant">
      <p class="user_rule">使用规则</p>
      <p class="user_rule_p">
        <span class="user_rule_key">可用时间</span>
        <span> {{couponInfo.startTime && couponInfo.startTime  + ' - '}}{{couponInfo.endTime || '无限制'}}</span>
      </p>
      <!-- <p class="user_rule_p">
        <span class="user_rule_key">所属项目:</span>
        <span> {{couponInfo.useRange}}</span>
      </p> -->
      <p class="user_rule_p">
        <span class="user_rule_key">领取限制</span>
        <span>{{couponInfo.receiveCount}}张</span>
      </p>
    </div>


    <div class="user_konw">
      <p class="user_kowns">使用须知</p>
      <div class="rich_box">
        <rich-text :nodes="couponInfo.description | formatRichText"></rich-text>
      </div>
    </div>

    <div class="footer">
      <div class="bottom" v-if="couponInfo.useStatus == 0" @click="getReceiveCoupon(couponInfo)">立即领取</div>
       <div class="bottom" style="background-color:#D3D3D3;" v-else-if="couponInfo.useStatus == -1">已领光</div>
      <div class="bottom"  style="background-color:#D3D3D3;" v-else-if="couponInfo.useStatus == 2">今日已领完</div>
      <div class="bottom" v-else @click="showQRCode">去使用</div>
    </div>

    <UPopup v-model="isShowQRCode">
      <!-- 优惠券二维码 -->
      <div class="card">
        <img class="coupon-qrcode" :src="couponInfo.qrCodeImage" alt="">
        <div class="copy-bar" @click="copyCode(couponInfo.cardPackHistoryVo.cardPackCode)">
          验证码：<span class="txt-qrcode">{{couponInfo.cardPackHistoryVo.cardPackCode}}</span>
          <span class="icon-copy"></span>
        </div>
        <div class="footer">
          <div class="btn" @click="isShowQRCode = false">关闭</div>
        </div>
      </div>

    </UPopup>
  </div>
</template>

<script>
import UPopup from "@/components/UPopup";
import QRCode from "@/utils/qrcode.js";


export default {
  data() {
    return {
      isShowQRCode: false,// 显示二维码
      isLogin: false,
      queryParams: {},
      couponInfo: {
         name: '',
        count:'',
        usageQuantity:'',
        startTime:'',
        endTime:'',
        useRange:'',
        receiveCount:'',
        description:'',

      },
      CouponType:{
				1:'抵扣券',
				2:'折扣券',
				3:'礼品券',
        4:'停车劵'
			},
    };
  },
  components:{
    UPopup
  },
  filters: {
    /**
     * 处理富文本里的图片宽度自适应
     * 1.查找img标签有无style属性，如果没有，加上style
     * 2.所有标签style后追加 max-width:100% !important;
     * 4.去掉<br/>标签
     * @param html
     * @returns {void|string|*}
     */
    formatRichText(html = "") {
      //控制小程序中图片大小
      let newContent = html.replace(/<img[^>]*>/gi, function (match, capture) {
        // console.log(match.search(/style=/gi));

        if (match.search(/style=/gi) == -1) {
          match = match.replace(/\<img/gi, '<img style=""');
        }
        return match;
      });

      newContent = newContent.replace(
        /style="/gi,
        "$& max-width:100% !important; height:auto !important;"
      );
      newContent = newContent.replace(/<br[^>]*\/>/gi, "");
      return newContent;
    },
  },
  methods: {
    onLoad(option) {
      this.queryParams = this.$client.getParam();
      this.getCouponInfo(this.queryParams.id, this.queryParams.isShowQRCode);
      this.isLogin = this.$store.state.userInfo && this.$store.state.userInfo.uid
    },

    // 获取优惠券详情
    async getCouponInfo(id, isShowQRCode) {
      let { data } = await this.$client.rpc(this.$api.CARDPACK_DETAIL, { id })
      if (data.success) {
        data.data.description = this.$client.setEscape(data.data.description);
        data.data.startTime = this.date2Str(data.data.startTime, 'YYYY/MM/DD hh:mm');
        data.data.endTime = this.date2Str(data.data.endTime, 'YYYY/MM/DD hh:mm');
        this.$set(this, 'couponInfo', data.data);
        if(isShowQRCode){
          setTimeout(() => {
            this.showQRCode();
          }, 600);
        }
      } else {
        this.$client.alert('优惠券详情获取失败')
      }
    },
    // 时间格式的转化---年月日
    date2Str(date, format) {
      return this.$tools.str2DateStr(date, format);
    },
    // 显示优惠券明细
    showQRCode(){
      // 如果是IP资产，去兑换页面
      if(this.couponInfo.type==1){
        if(this.couponInfo.ipAssetVO.awardDetail){
          this.$client.pushWindow(
            '/pages/webView/webView?url=' +
              encodeURIComponent(this.couponInfo.ipAssetVO.awardDetail)
          )
        }else{
          this.$client.pushWindow("/pkMine/cardbag/cardbagdetail/index",{id:this.couponInfo.id});
        }
        return
      }
      if(!this.couponInfo.qrCodeImage){
        let mode = ['Numeric', 'Alphanumeric', 'Byte', 'Kanji'][2]
        let errorCorrectionLevel = ['L', 'M', 'Q', 'H'][0]
        let qr = QRCode(0, errorCorrectionLevel)
        qr.addData('CP_'+this.couponInfo.cardPackHistoryVo.cardPackCode, mode)
        qr.make();
        // let rt =  qr.createTableTag();
        // let rt =  qr.createSvgTag();
        // let rt =  qr.createImgTag();
        let rt =  qr.createDataURL(5,10); //输出base64地址
        this.$set(this.couponInfo, 'qrCodeImage', rt)
      }
      this.isShowQRCode = true
    },
    // 复制验证码
    async copyCode(txt){
      await this.$client.copy(txt);
      this.$client.toast('验证码已复制')
    },

    // 领取卡包
     async getReceiveCoupon(item) {
      if(!this.isLogin){
        this.$client.pushWindow('/pkPublic/login/login', { redirect: true })
        return;
      }
      let { data } = await this.$client.rpc(this.$api.CARDBAG_GET_RECEIVE, {
        cardPackId: item.id,
      })
      if (data.success) {
         setTimeout(() => {
          this.$client.toast('已领取')
      }, 2000);
        this.getCouponInfo(this.queryParams.id, this.queryParams.isShowQRCode)
        // console.log('优惠券已领取')
        this.$emit('onRefresh')
      } else {
        // console.log('优惠券领取失败', data)
      }
    },
  },
};
</script>


<style lang="scss" scoped>
@import "./index.scss";
</style>