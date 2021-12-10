<template>
  <div class="coupon-container">
    <div
      class="coupon-image"
    >
      <image class="img" mode="widthFix" :src="couponInfo.imgUrl || 'http://img.asset/coupon-bg-share2.png111'" alt="" />
    </div>
    <!-- 标题栏 + 优惠券类型 -->
    <div class="coupon_detali_top">
      <div class="">
        <span class="detail_top_title">{{ couponInfo.name || '' }} </span>
        <span
                v-if="couponInfo.couponType"
                class="coupon-type"
                :class="{ 'type-discount': couponInfo.couponType == '2' }"
        >
          {{ CouponType[couponInfo.couponType] || '' }}
        </span>
      </div>

      <!-- 9.5折、8000元， 无门槛券 -->
      <div class="coupon-val-bar">
        <div class="coupon-num">
          <div style="display: flex; align-items: center">
            <div v-if="couponInfo.amount">
              <span class="coupon-value"> {{ unitConvert(couponInfo.amount).num }}</span>
              <span class="coupon-unit">{{
                couponInfo.couponType == '2' ? '折' : unitConvert(couponInfo.amount).unit
              }}</span>
            </div>
            <span class="min-point">{{
              couponInfo.minPoint
                ? `满${unitConvert(couponInfo.minPoint).num}${
                    unitConvert(couponInfo.minPoint).unit
                  }起可用`
                : ''
            }}</span>
            <span class="discount" v-if="changeStatus_momy && couponInfo.expectedAmount > 0"
            ><span>分享预计赚</span
            >{{ unitConvert(couponInfo.expectedAmount).num || 0 }}
              {{ unitConvert(couponInfo.expectedAmount).unit }}
            </span>
          </div>
          <!-- <div class="sunnumber">总计 {{ couponInfo.count }} 张</div> -->
        </div>
      </div>
    </div>
    <!-- 进度条 -->
    <div class="progress-container-wrap">
      <div class="progress-container">
        <span>已抢</span>
        <div class="progress-bar">
          <div
                  class="progress"
                  :style="{ width: (couponInfo.usageQuantity || 0) + '%' }"
          ></div>
        </div>
        <span>{{ couponInfo.usageQuantity || 0 }}%</span>
      </div>
    </div>

    <!-- 使用规则 -->
    <div class="usuer_contant">
      <p class="user_rule">使用规则</p>
      <div class="user_rule_p">
        <span class="user_rule_key">可用时间&emsp;</span>
        <div>
          <div> {{ couponInfo.startTime }} - {{ couponInfo.endTime }}</div>
          <div>{{couponInfo.couponScope == 2 ? '(仅限工作日)' : (couponInfo.couponScope == 3 ? '(仅限周末)' : '')}}</div>
        </div>
      </div>
      <div class="user_rule_p" v-if="couponInfo.verifyScopeList && couponInfo.verifyScopeList.length">
        <div class="disabled-time">
          <span class="user_rule_key">补充说明&emsp;</span>
          <div>
            <div style="color: rgb(180,180,180)">不可用时间范围:</div>
            <div v-for="(item,index) in (couponInfo.verifyScopeList || [])" :key="index"> {{ item.startTime }} - {{ item.endTime }}</div>
          </div>
        </div>
      </div>
      <p class="user_rule_p" v-if="couponInfo.couponClass == 1 && couponInfo.projectName">
        <span class="user_rule_key">所属项目&emsp;</span>
        <span style="min-width: 170px"> {{ couponInfo.projectName }}</span>
      </p>
      <p class="user_rule_p">
        <span class="user_rule_key">领取限制&emsp;</span>
        <span v-if="couponInfo.receiveCount">{{ couponInfo.receiveCount }}张</span>
      </p>
      <div class="user_rule_p">
        <div class="disabled-time" style="width: 100%;">
          <span class="user_rule_key" style="white-space: nowrap">适用店铺&emsp;</span>
          <div style="word-break: break-all;flex: 1">
<!--            <span>{{couponInfo.merchantName}}{{couponInfo.secMerchantList.length ? '->' : ''}}</span>-->
<!--            <span v-if="index < 5" v-for="(item,index) in (couponInfo.secMerchantList || [])" :key="index">{{ item.merchantName }}{{index === couponInfo.secMerchantList.length - 1 ? '' : ','}}</span>-->
<!--            <span v-if="couponInfo.secMerchantList && couponInfo.secMerchantList.length > 5" style="color: #f0c17b" @click="showAllStore">...展示全部</span>-->
            {{couponInfo.merchant.merchantName || ''}}
          </div>
          <div @click="viewStore" class="store-link" v-if="couponInfo.secMerchantList && couponInfo.secMerchantList.length">全部门店共<span style="color: red">{{couponInfo.secMerchantList.length}}</span>家 > </div>
        </div>
      </div>
      <div class="address-detail" @click="viewMap"><img src="@/static/icon-location.png" alt="">{{couponInfo.merchant.province || ''}}{{couponInfo.merchant.city || ''}}{{couponInfo.merchant.area || ''}}{{couponInfo.merchant.detail || ''}}</div>
    </div>

    <div class="user_konw_box">
      <div class="user_konw">
        <p class="user_kowns">使用须知</p>
        <div class="user-description">
          <div class="rich_box">
            <rich-text :nodes="couponInfo.description | formatRichText"></rich-text>
          </div>
        </div>
        <!-- {{couponInfo.description}} -->
        <!--         <p class="user_kownID">1、每个会员ID限领一张</p>-->
        <!--        <p class="user_kown_two"> 2、会员凭优惠券到指定景点售票窗口进行核销</p>-->
        <!--          <p class="user_kown_three"> 3、每张门票仅使用一张优惠券</p>-->
        <!--           <p class="user_kown_fou"> 4、折扣劵无需预约所有门票业务都可使用</p>-->
        <!--            <p class="user_kown_phone"> 5、客服电话：40023292921</p>-->
      </div>
    </div>

    <div class="footer" :class="{ footer_1: couponInfo.shareStatus != 1 }">
      <div
              class="receive_coupon-share"
              v-if="couponInfo.useStatus == 0"
              @click="getReceiveCoupon(couponInfo)"
      >
        立即领取
      </div>
      <div class="receive_coupon-share-1" v-else-if="couponInfo.useStatus == -1">
        已抢光
      </div>
      <div class="receive_coupon-share-1" v-else-if="couponInfo.useStatus == 2">
        今天已抢光
      </div>
      <div class="receive_coupon-share" v-else @click="showQRCode">去使用</div>
      <div class="boxzing">
        <div v-if="couponInfo.shareStatus == 1" class="bottom" @click="openShare">
          立即分享
        </div>
      </div>
    </div>

    <UPopup v-model="couponInfo.couponCode && isShowQRCode" catchtouchmove="true">
      <!-- 优惠券二维码 -->
      <div class="card">
        <img class="coupon-qrcode" :src="couponInfo.qrCodeImage" alt="" />
        <div class="copy-bar" @click="copyCode(couponInfo.couponCode)">
          验证码：<span class="txt-qrcode">{{ couponInfo.couponCode || '' }}</span>
          <span class="icon-copy"></span>
        </div>
        <div
                v-if="couponInfo.couponType == 5"
                class="copy-bar"
                style="color: #f0c17b; margin-top: 10px"
                @click="lookOrderDetail"
        >
          点击查看订单详情
        </div>
        <div class="footer1">
          <div class="btn" @click="isShowQRCode = false">关闭</div>
        </div>
      </div>
    </UPopup>

    <!-- 分享弹框 -->
    <SharePopup
            v-model="isShowShare"
            :maskClick="true"
            :title="'领优惠，赚佣金，上奥园云'"
            :posterUrl="poster"
            :shareData="{
        bType: 6,
        bId: couponInfo.id,
        channelId: '8801'
      }"
            :mode="'widthFix'"
            @onClose="closeShare"
    />
    <div class="canvas_box">
      <canvas style="width: 100%; height: 100%" canvas-id="mycanvas_coupon_detail" />
    </div>
    <EReporting
            :visabled="isShowReporting && isLogin && couponInfo.couponClass == 1"
            ref="EReporting"
            :couponInfo="couponInfo"
            :sceneBrokerId="sceneBrokerId"
            :sceneProjectList="sceneProjectList"
            @onClose="infoClose"
    >
    </EReporting>

    <!-- 未完善信息的提示框 -->
    <u-popup v-model="isShowUserInfoTips" type="center">
      <div class="tips_inbox">
        <div>温馨提示</div>
        <div class="tips_text">
          您还未完善个人信息<span v-if="stateTips">({{ stateTips }})</span
        >，完善后即可使用推荐、查看佣金等功能
        </div>
        <div class="tips_btn" @click.stop="routerUserInfo">立即完善</div>
      </div>
    </u-popup>

    <!-- 文旅券宏里系统弹框 -->
    <UPopup v-model="ticketShow">
      <div
              class="card"
              style="
          display: flex;
          height: 170px;
          flex-direction: column;
          justify-content: space-between;
        "
      >
        <div>
          <div style="margin-bottom: 10px">温馨提示</div>
          <div style="text-align: justify; margin-bottom: 10px">
            优惠券支付地址已通过短信方式下发至您的手机，您只需在短信中完成支付即可拥有此券。
          </div>
        </div>
        <div class="footer1">
          <div class="btn" @click="ticketShow = false">关闭</div>
        </div>
      </div>
    </UPopup>
  </div>
</template>

<script>
  import UPopup from '@/components/UPopup'
  import QRCode from '@/utils/qrcode.js'
  import SharePopup from '@/components/SharePopup'
  import { onShareAppMessage } from '@/utils/share'
  import EReporting from '@/components/EReporting'

  export default {
    components: {
      UPopup,
      EReporting,
      SharePopup
    },
    data() {
      return {
        unitConvert: this.$client.unitConvert,
        ctx: null, // 绘制海报打印
        screenWidth: 375,
        qrcode: null, // 二维码
        userInfo: {}, // 用户信息
        back: null,
        poster: null, // 海报

        isShowQRCode: false, // 显示二维码
        isShowShare: false, // 显示分享
        queryParams: {},
        couponInfo: {
          couponClass: null, //1-楼盘优惠券
          name: '',
          count: '',
          usageQuantity: '',
          startTime: '',
          endTime: '',
          useRange: '',
          receiveCount: '',
          description: '',
          expectedAmount: '',
          amount: '',
          minPoint: ''
        },
        CouponType: {
          1: '抵扣券',
          2: '折扣券',
          3: '礼品券',
          4: '停车券',
          5: '文旅劵'
        },
        isLogin: false,
        curId: null,

        projectIds: '', // 优惠券楼盘列表
        isShowReporting: false,
        sceneProjectList: [], //返回的楼盘列表
        sceneBrokerId: null,
        sceneObj: {
          scene: '',
          id: ''
        },
        isInitAutoReporting: false, // 是否已经初始化过了
        isFirstTime: false,
        isReady: false, // 是否已经初始化完成了
        isShowUserInfoTips: false, // 检测用户信息是否完善
        stateTips: '',
        ticketShow: false, // 文旅券短信弹框
        isLoading: false, // 正在加载中
      }
    },
    computed: {
      changeStatus_momy() {
        var showPrise = false
        if (this.couponInfo.shareStatus == 1) {
          showPrise = true
        } else {
          showPrise = false
        }
        return showPrise
      }
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
      formatRichText(html = '') {
        //控制小程序中图片大小
        let newContent = html.replace(/<img[^>]*>/gi, function (match, capture) {
          // console.log(match.search(/style=/gi));

          if (match.search(/style=/gi) == -1) {
            match = match.replace(/\<img/gi, '<img style=""')
          }
          return match
        })

        newContent = newContent.replace(
          /style="/gi,
          '$& max-width:100% !important; height:auto !important; '
        )
        newContent = newContent.replace(/<br[^>]*\/>/gi, '')
        return newContent
      }
    },
    async onLoad(option) {
      const _this = this
      // 查询设备信息，用于canvas px 转换定位
      if (uni.canIUse('getSystemInfo')) {
        uni.getSystemInfo({
          success(res) {
            _this.screenWidth = res.screenWidth
          }
        })
      }
      this.queryParams = option

      // // #### TODO 测试，模拟
      // this.$client.setParam({
      //   scene:'6_2391635_' + this.queryParams.id + '_8801_0',
      //   id:this.queryParams.id
      // })
      // // #### TODO 测试，模拟

      this.sceneObj = await this.$client.getParam()
      console.log('this.sceneObj', this.sceneObj)
      if (this.sceneObj && this.sceneObj.id) {
        this.queryParams.id = this.sceneObj.id
      }
    },
    async onShow() {
      // 如果是推荐跳进来的
      await this.$client.getUserInfo('', true)
      this.isLogin = !!(this.$store.state.userInfo && this.$store.state.userInfo.uid)

      if (!this.isLogin) {
        this.isFirstTime = true
        this.$client.pushWindow('/pkPublic/login/login', { redirect: true })
        return
      }

      // 从选择楼盘返回的
      let param = this.$client.getParam()
      if (param && param.isShow) {
        this.$set(this, 'sceneProjectList', param.listSel)
        return
      }
      // if (param && param.storeList && param.storeList.length) {
      //   this.$client.setParam({ storeList: [] })
      //   return
      // }

      this.getCouponInfo(this.queryParams.id, this.queryParams.isShowQRCode)
    },
    mounted() {
      // 生成画笔指向
      this.ctx = uni.createCanvasContext('mycanvas_coupon_detail')
    },
    methods: {
      viewMap(){
         uni.openLocation({
            latitude: this.couponInfo.merchant.latitude * 1,
            longitude: this.couponInfo.merchant.longitude * 1,
            name: this.couponInfo.merchant.merchantName,
            address: this.couponInfo.merchant.province + this.couponInfo.merchant.city + this.couponInfo.merchant.area + this.couponInfo.merchant.detail
          })
        // this.$client.pushWindow(`/pkCoupon/detail/map?longitude=${this.couponInfo.merchant.longitude}&latitude=${this.couponInfo.merchant.latitude}`)
      },
      viewStore(){
        this.$client.pushWindow('/pkCoupon/detail/storeList', { storeList: this.couponInfo.secMerchantList || []  })
      },
      // 获取用户信息是否完善
      async getUserDataState() {
        let { data } = await this.$client.rpc(
          this.$api.VALIDATE_USERINFO,
          {},
          { hideLoading: true }
        )
        this.isShowUserInfoTips = !data.data
        this.stateTips = data.msg
        return new Promise((resolve) => resolve(this.isShowUserInfoTips))
      },
      routerUserInfo() {
        this.isShowUserInfoTips = false
        this.$client.pushWindow('/pkMine/personal/index', { hasBackBtn: true })
      },
      async autoReporting() {
        // 如果当前优惠券是2-非房产券，则不执行
        // couponClass (integer, optional): 优惠券优惠券种类 1：房产类 2：非房产类 ,
        if (this.couponInfo.couponClass !== 1) return

        // scene = 0业务类型 + 1分享用户id + 2业务Id + 3渠道ID + 4分销机构id
        if (this.sceneObj && this.sceneObj.scene) {
          let { id, scene } = this.sceneObj
          this.queryParams.id = id
          if (scene) {
            let arr = scene.split('_')
            this.sceneObj.perentId = arr[1] //先记录推荐人的id，后面领券的时候会用到
            if (arr[0] == '6') {
              // 先判断是否已经报备过了，不用重复报备
              let isReporting = await this.checkReporting()
              if (isReporting) {
                console.log('此项目已经报备过了')
              } else {
                // 推荐人id
                this.sceneBrokerId = arr[1]

                // 如果楼盘多于3，就要用户选
                let projArray = this.projectIds.split(',')
                let projNameArray = this.couponInfo.projectName.split(',')
                if (!this.projectIds || (this.projectIds && projArray.length > 3)) {
                  this.isShowReporting = true
                  this.$nextTick(() => {
                    // 再更新一次姓名手机号到页面
                    this.$refs['EReporting'].refreshData()
                  })
                } else {
                  // 直接把3个以内的,直接组装好楼盘列表，传入组件
                  this.sceneProjectList = []
                  for (const index in projArray) {
                    this.sceneProjectList.push({
                      projectId: projArray[index],
                      projectName: projNameArray[index]
                    })
                  }
                  this.$nextTick(() => {
                    this.$refs['EReporting'].submit('autorun')
                  })
                }
              }
            }
          }
        }
        this.isInitAutoReporting = true
      },

      // 检查是否已经报备过，传入楼盘id
      async checkReporting() {
        let { data } = await this.$client.rpc(
          this.$api.QUERY_CLUE,
          {
            projectId: this.projectIds
          },
          { hideLoading: true }
        )
        return data.data
      },
      async openShare() {
        // 如果没有登录的，先去登录，返回来再领取
        if (!this.$client.passCheck()) return
        // 检查是否已经完善了信息
        if (this.couponInfo.couponClass == 1) {
          let us = await this.getUserDataState()
          if (us) return
        }
        if (this.poster) {
          this.isShowShare = true
        }
      },
      // 获取优惠券详情
      async getCouponInfo(id, isShowQRCode) {
        // 如果没有登录的，先去登录，返回来再领取
        if (!this.$client.passCheck()) return

        let { data } = await this.$client.rpc(this.$api.COUPON_DETAIL, { id })
        if (data.success) {
          data.data.description = this.$client.setEscape(data.data.description)
          data.data.startTime = this.date2Str(data.data.startTime, 'YYYY/MM/DD hh:mm')
          data.data.endTime = this.date2Str(data.data.endTime, 'YYYY/MM/DD hh:mm')
          if(data.data.verifyScopeList && data.data.verifyScopeList.length) {
            data.data.verifyScopeList.forEach(v => {
              v.startTime = this.date2Str(v.startTime, 'YYYY/MM/DD hh:mm')
              v.endTime = this.date2Str(v.endTime, 'YYYY/MM/DD hh:mm')
            })
          }
          data.data.imgUrl = data.data.imgUrl
            ? data.data.imgUrl
            : 'http://img.asset/coupon-bg-share2.png'
          this.$set(this, 'couponInfo', data.data)
          this.projectIds = this.couponInfo.projectId //关联的楼盘列表
          this.isShowQRCode = false // 展示页面隐藏二维码弹框


          // 是否展示优惠券核销二维码
          if (isShowQRCode) {
            setTimeout(() => {
              this.showQRCode()
            }, 600)
          }

          // 绘制canvas
          this.getUser()
        } else {
          this.$client.alert('优惠券详情获取失败')
        }
      },

      // 显示优惠券明细
      async showQRCode() {
        if (this.couponInfo.couponVerifierType == 2) {
          if(this.couponInfo.payStatus === null) {
            uni.navigateToMiniProgram({
              appId: 'wxd94a16a49ad94404',
              path: `pages/search/index/index?filter={"couponId":"${this.couponInfo.cpnsId || ''}"}`,
              envVersion: MSG_ENV == 'prod' ? 'release' : 'trial', // 打开正式版
              success(res) {
                // 打开成功
              },
              fail: function (err) {
                console.log(err)
              }
            })
          }else if (this.couponInfo.payStatus === 0){
            uni.navigateToMiniProgram({
              appId: 'wxd94a16a49ad94404',
              path: `${this.couponInfo.jumpUrl}?orderId=${this.couponInfo.outOrderId}&groupId=&viewStatus=wait_pay`, //canceled finish wait_pay
              envVersion: MSG_ENV=='prod' ? 'release' : 'trial',// 打开正式版
              success(res) {
                // 打开成功
              },
              fail: function (err) {
                console.log(err);
              }
            })
          }else if (this.couponInfo.payStatus === 1){
            this.handleCoupon()
          }
        } else {
          this.handleCoupon()
        }
      },
      async handleCoupon(){
        // 1：抵扣券 2：折扣券  3：礼品券 4：停车券5：文旅券
        // 当当前优惠券是 文旅券
        if (this.couponInfo.couponType == 5) {
          let { data } = await this.$client.rpc(this.$api.COUPON_TYPE, {
            couponCode: this.couponInfo.couponCode,
            phone: this.$store.state.userInfo.phone
          })
          console.log('当前短信发送', data, this.couponInfo)
          if (data.success) {
            // 短信发送成功，判断宏理系统订单是否支付成功
            if (data.extParams && data.extParams.entryCode) {
              // 订单已成功支付,修改展示二维码 链接
              this.$set(this.couponInfo, '_entryCode', data.extParams.entryCode)
              this.$set(this.couponInfo, '_qrCodeImage', data.extParams.detailUrl)
            } else {
              // 订单未支付
              this.ticketShow = true
              return
            }
          } else {
            // 接口调用失败
            this.$client.toast(data.msg || '发送短信失败')
            return
          }
        }

        this.isShowQRCode = true
        if (!this.couponInfo.qrCodeImage) {
          let mode = ['Numeric', 'Alphanumeric', 'Byte', 'Kanji'][2]
          let errorCorrectionLevel = ['L', 'M', 'Q', 'H'][0]
          let qr = QRCode(0, errorCorrectionLevel)
          // 根据入参生成图片
          qr.addData(
            this.couponInfo._entryCode
              ? this.couponInfo._entryCode
              : 'CP_' + this.couponInfo.couponCode,
            mode
          )
          qr.make()
          // let rt =  qr.createTableTag();
          // let rt =  qr.createSvgTag();
          // let rt =  qr.createImgTag();
          let rt = qr.createDataURL(5, 10) //输出base64地址
          this.$set(this.couponInfo, 'qrCodeImage', rt)
          this.$client.pushEvent('COUPON_RECEIVE', {
            type: '显示优惠券二维码',
            data: this.couponInfo.couponCode
          }) // 埋点
        }
      },
      // 复制验证码
      async copyCode(txt) {
        await this.$client.copy(txt)
        this.$client.toast('验证码已复制')
      },
      // 领取优惠券
      async getReceiveCoupon(item) {
        // 如果没有登录的，先去登录，返回来再领取
        if (!this.isLogin) {
          this.$client.pushWindow('/pkPublic/login/login', { redirect: true })
          return
        }
        if(this.isLoading){
          this.$client.toast('正在加载中')
          return
        }
        this.isLoading = true
        try {
          if (this.sceneObj && this.sceneObj.scene) {
            let { scene } = this.sceneObj
            if (scene) {
              let arr = scene.split('_')
              this.sceneObj.perentId = arr[1] //先记录推荐人的id，后面领券的时候会用到
            }
          }

          let { data } = await this.$client.rpc(
            this.$api.COUPON_GET_RECEIVE,
            {
              couponId: item.id,
              shareUserId: this.sceneObj ? this.sceneObj.perentId : null
            },
            { hideLoading: true }
          )
          if (data.success) {
            this.$client.toast('已领取成功')
            this.getCouponInfo(this.queryParams.id, this.queryParams.isShowQRCode)

            this.autoReporting()

            // console.log("优惠券已领取");
            this.$emit('onRefresh')
            this.$client.pushEvent('COUPON_RECEIVE', item) // 埋点
            this.$client.pushEventNew(24, {}) // 24，领取优惠券
          } else {
            // console.log("优惠券领取失败", data);
          }
          this.isLoading = false
        } catch (error) {
          this.isLoading = false
        }
      },
      // 时间格式的转化---年月日
      date2Str(date, format) {
        return this.$tools.str2DateStr(date, format)
      },
      async getUser() {
        // 获取用户信息
        const $this = this
        let data = await this.$client.getUserInfo()
        data.phone =
          data.phone.slice(0, 3) + '****' + data.phone.slice(data.phone.length - 4)
        data.name = data.name
          ? data.name.slice(0, 1) + '*'.repeat(data.name.length - 1)
          : ''
        data.name =
          data.name ||
          (data.nickName
            ? data.nickName.length > 6
              ? data.nickName.slice(0, 6) + '...'
              : data.nickName
            : '') ||
          '微信用户'
        this.userInfo = data
        var img =
          data.avatarUrl || 'https://img04.aomygod.com/fontend/202179/imgs/user_attr.png'
        if (data.avatarUrl.indexOf('http://tmp') == -1) {
          uni.downloadFile({
            url: img,
            success: (res) => {
              $this.userInfo.avatarUrl = res.tempFilePath
              $this.getBack()
            },
            fail: (res) => {
              console.error('用户头像图片获取失败')
              $this.getBack()
            }
          })
        }
      },
      //获取优惠劵二维码
      getBack() {
        const $this = this
        uni.downloadFile({
          url: this.couponInfo.imgUrl,
          success: (res) => {
            $this.back = res.tempFilePath
            // console.log('_=-=-', $this.back)
            $this.getQrcode()
          },
          fail(err) {
            console.error('背景图片获取失败')
            $this.getQrcode()
          }
        })
      },
      async getQrcode() {
        // 获取二维码
        const { uid } = this.$store.state.userInfo // 用户id
        const channelId = '0' // 渠道id
        const id = this.couponInfo.id

        let { data } = await this.$client.rpc(
          this.$api.SET_SCENE,
          {
            scene: `6_${uid}_${id}_${channelId}`
          },
          { hideLoading: true }
        )
        let scene = data.data.id
        var qrcode = await this.$client.rpc(
          this.$api.CREATE_WXQRCODE,
          {
            // page: "pages/launch/index", // 开发需要注释掉
            scene
          },
          { hideLoading: true }
        )
        // console.log(qrcode);
        this.send_code(`data:image/png;base64,${qrcode.data.data.base64}`)
      },
      send_code(code) {
        //将base64图片转网络图片
        const $this = this
        const fs = wx.getFileSystemManager()
        var times = new Date().getTime()
        var codeimg = wx.env.USER_DATA_PATH + '/' + times + '.png'
        fs.writeFile({
          filePath: codeimg,
          data: code.slice(22),
          encoding: 'base64',
          success: () => {
            // console.log(codeimg, '1111111222222222222222222222')
            $this.qrcode = codeimg
            $this.canvasInit()
          },
          fail() {
            console.error('二维码获取失败')
          }
        })
      },
      canvasInit() {
        const _this = this
        this.$nextTick(async () => {
          let { ctx, toPx } = _this
          // 画笔使用 xy轴变量
          let canvas_w = await toPx(670),
            canvas_h = await toPx(944),
            _18 = await toPx(18),
            _20 = await toPx(20),
            _24 = await toPx(24),
            _28 = await toPx(28.8),
            _30 = await toPx(30),
            _32 = await toPx(32),
            _40 = await toPx(40),
            _44 = await toPx(44),
            _57 = await toPx(57.6),
            _60 = await toPx(60.8),
            _64 = await toPx(64),
            _65 = await toPx(65),
            _66 = await toPx(66),
            _68 = await toPx(68.8),
            _112 = await toPx(112),
            _116 = await toPx(116),
            _140 = await toPx(140),
            _250 = await toPx(250),
            _354 = await toPx(354),
            _455 = await toPx(455),
            _490 = await toPx(490),
            _530 = await toPx(530),
            _590 = await toPx(590),
            _596 = await toPx(596),
            _600 = await toPx(600),
            _602 = await toPx(602),
            _630 = await toPx(630),
            _680 = await toPx(680),
            _702 = await toPx(702),
            _760 = await toPx(760),
            _780 = await toPx(780),
            _790 = await toPx(790),
            _860 = await toPx(860),
            _890 = await toPx(890)

          // 重置清除画布
          ctx.clearRect(0, 0, canvas_w, canvas_h)
          ctx.draw()

          // 设置白色背景
          ctx.setFillStyle('#fff')
          ctx.fillRect(0, 0, canvas_w, canvas_h)

          // 绘制头像
          ctx.save() // 先保存状态 已便于画完圆再用
          ctx.beginPath() //开始绘制
          ctx.arc(_68, _60, _28, 0, 2 * Math.PI)
          ctx.clip()
          ctx.drawImage(_this.userInfo.avatarUrl, _40, _32, _57, _57)
          ctx.restore()

          // 绘制用户信息
          ctx.setTextBaseline('top')
          ctx.setTextAlign('left')
          ctx.fillStyle = '#666666'
          ctx.setFontSize(_24)
          ctx.fillText(_this.userInfo.name || '', _116, _30)
          ctx.setFontSize(_18)
          ctx.fillText(_this.userInfo.phone, _116, _66)

          // 绘制用户宣传语
          // ctx.setFontSize(_20)
          // ctx.fillText('邀您一起加入奥园云，分享好房，分享好物，', _250, _30)
          // ctx.fillText('0元创收', _250, _65)

          // 绘制banner
          ctx.drawImage(_this.back, _20, _112, _630, _455)

          // 绘制优惠卷详情文案
          ctx.setFontSize(_32)
          ctx.setTextAlign('left')
          ctx.fillStyle = '#000000'
          let detailText = _this.couponInfo.name
          let length = ctx.measureText(detailText).width
          let maxLength = _600
          let isFirstSlice = false // 是否第一次截取
          let siliceI = 0 // 第一次截取下标
          // 长度够换行时执行
          if (length > maxLength) {
            for (let index = 0; index < detailText.length; index++) {
              let str = detailText.slice(0, index + 1)
              if (ctx.measureText(str).width > maxLength && !isFirstSlice) {
                isFirstSlice = true
                siliceI = index
                // 绘制第一行
                ctx.fillText(str, _20, _590)
                // console.log('当前截取', ctx.measureText(str).width)
              }
            }
            // 绘制第二行
            let twoText = detailText.slice(siliceI, siliceI + 6) + '...'
            ctx.fillText(twoText, _20, _530)
          } else {
            ctx.fillText(detailText, _20, _590)
          }

          // 绘制折扣
          ctx.fillStyle = '#E20000'
          ctx.setTextAlign('left')
          ctx.setFontSize(_40)
          var money =
            (this.unitConvert(_this.couponInfo.amount).num || '*') +
            (_this.couponInfo.couponType == '2'
              ? '折'
              : this.unitConvert(_this.couponInfo.amount).unit)
          ctx.fillText(money || '', _44, _702)
          var money_w = ctx.measureText(money).width
          ctx.fillStyle = '#333333'
          ctx.setFontSize(_28)
          if (!_this.couponInfo.minPoint) {
            ctx.fillText('无门槛', _64 + money_w, _702)
          } else {
            ctx.fillText(
              `满${this.unitConvert(_this.couponInfo.minPoint).num}${
                this.unitConvert(_this.couponInfo.minPoint).unit
              }起可用`,
              _64 + money_w,
              _702
            )
          }

          // 绘制二维码
          ctx.drawImage(_this.qrcode, _20, _780, _140, _140)

          // 绘制右下角文案
          ctx.fillStyle = '#666666'
          ctx.setFontSize(_20)
          ctx.setTextAlign('right')
          ctx.fillText('在奥园云', _630, _860)
          ctx.fillText('人人都是健康生活分享家', _630, _890)
          ctx.draw(false, () => {
            console.log('绘制函数生成打印', _this.couponInfo.minPoint)
            uni.canvasToTempFilePath({
              canvasId: 'mycanvas_coupon_detail',
              success: (res) => {
                _this.poster = res.tempFilePath
                // console.log('canvasToTempFilePath-success', res)
              },
              fail: (err) => {
                console.log('canvasToTempFilePath-fail', err)
              }
            })
          })
        })
      },
      // 关闭分享弹框
      closeShare() {
        this.isShowShare = false
      },
      //rpx --> px 转换canvas 适配px 像素
      toPx(data) {
        let format = parseFloat(this.screenWidth / 750)
        return parseFloat(data * format)
      },
      //px --> rpx 转换canvas 适配rpx 像素
      toRpx(data) {
        let format = parseFloat(this.screenWidth / 750)
        return parseFloat(data / format)
      },
      // 关闭分享弹框
      infoClose() {
        this.isShowReporting = false
      },
      // 查看文旅券 订单详情
      lookOrderDetail() {
        this.$client.pushWindow(
          '/pages/webView/webView?url=' + encodeURIComponent(this.couponInfo._qrCodeImage)
        )
      }
    },
    // 页面分享
    onShareAppMessage
  }
</script>
<style>
  page{
    height: 100%;
    overflow: hidden;
  }
</style>
<style lang="scss" scoped>
  @import './index.scss';
</style>
