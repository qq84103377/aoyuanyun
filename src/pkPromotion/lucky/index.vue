<!--
 * @Description: 抽奖页面
 * @version: 
 * @Author: gonghonglin
 * @Date: 2021-07-09 18:30:30
 * @LastEditors: gonghonglin
 * @LastEditTime: 2021-09-23 16:34:51
-->
<template>
  <div class="page" :style="{ 'background-image': `url(${pomoInfo.backgroundImgUrl})` }">
    <!-- 抽奖 -->
    <div
      class="lucky-draw-container"
      :style="{
        'background-image': `url(${pomoInfo.frameImgUrl})`,
        'background-size': `${pomoInfo.frameImgUrl ? 'contain' : ''}`
      }"
    >
      <div class="title">
        您还可以抽奖
        <span class="count">{{ pomoInfo.count || 0 }}</span> 次
      </div>
      <div class="tips" style="color: #fff">
        活动时间：{{ pomoInfo.startTime || '' }} - {{ pomoInfo.endTime || '' }}
      </div>
      <div class="lucky-draw">
        <div
          class="lucky-btn-container"
          v-for="item in intProductBox"
          :key="item"
          @click="onDraw(item)"
        >
          <div
            class="lucky-btn"
            :id="'btn' + item.id"
            :class="{ active: highlightProductIndex == item.id }"
          >
            <img class="btn-img" :src="item.img" />
          </div>
        </div>
      </div>
      <div class="my-lucky-list">
        <span v-if="myLuckyHistoryNum" style="margin-right: 10px">
          已抽奖{{ myLuckyHistoryNum }}次
        </span>
        <span @click="isShowMyLuckyHistory = true" style="text-decoration: underline">
          查看获奖记录
        </span>
      </div>

      <!-- 活动规则 -->
      <div class="btn-rule" @click="isShowRule = true">活动规则</div>
    </div>

    <div class="btn_box">
      <!-- <div class="lucky-h"><img src="http://img.asset/personal/lucky1.png" @click="isShowMyLuckyHistory = true;" alt=""></div> -->
      <button class="lucky-sha" data-name="shareBtn" open-type="share"></button>
      <!-- <img src="http://img.asset/shar12.png" /> -->
    </div>

    <UPopup v-model="isShowRule" type="center" catchtouchmove="true">
      <div class="pop-rule">
        <div class="title">活动规则</div>
        <div class="content">
          <p class="big_text">
            "818发烧购物节"买指定自营家电单笔订单在线实付满4999元送价值1999元手持吸尘器，满9999元送价值4999元空气净化器。规则如下：
          </p>
                    
          <p class="big_text">一、活动时间：</p>
          <p class="small_text" style="color: #e20000">8月14日0:00:00-8月20日23:59:59</p>
          <p class="big_text">二、参与条件：</p>
                    
          <p class="small_text">
            1、所购买商品为指定自营家用电器和家装建材（含彩电、冰洗、厨卫、空调、生活电器、建材六个品类，不含虚拟商品）；
          </p>
                    
          <p class="small_text">
            2、参与步骤：选择参与活动的家电→加入购物车→去结算→提交订单→支付完成→获得赠品返券→购买商品选择券全额支付；购买单笔家电订单实际支付金额满4999元送价值1999元惠而浦手持吸尘器等值易券；购买单笔家电订单实际支付金额满9999元送价值4999元惠而浦空气净化器等值易券。实际支付金额指提交订单时结算的应付金额，不包含优惠券、云钻、礼品卡、满减折扣等等值优惠，单笔订单未满金额门槛，视同不参加活动，不返券。
          </p>
                    
          <p class="small_text">
            3、支付方式选择在线支付：网银支付、快捷支付、易付宝支付、零钱宝支付、任性付支付、支付宝支付、微信支付的订单，不支持货到付款、礼品卡支付、门店付款，下单及支付完成时间需在活动时间范围内（预定商品只需支付定金时间在活动期，支付定金时间不在活动期的商品不参加本次活动），活动结束后下单支付不返券；
          </p>
                    
          <p class="small_text">
            4、本活动每位会员仅限参与三次，三次以上即无法再参与此活动。已提交的家电订单（包含提交订单未支付、提交订单已支付）即获取并占用返券资格，订单退货默认已使用资格；
          </p>
                    
          <p class="small_text">
            5、赠品券有效期为自获得之日起到8月23日，过期无效，不予延期；
          </p>
                    
          <p class="small_text">
            6、抢购、团购、大聚惠、掌上抢、固定套餐、渠道专享、扫码购等特惠活动及部分特价商品会不支持订单满额返券，已参加其他返券活动商品不支持订单满额返券，具体以下单时商品四级页面促销信息提示为准；
          </p>
                    
          <p class="small_text">
            7、本次活动只对普通消费者，参与活动仅支持开具普通发票，不支持开具增值税发票，渠道经销商、批发商等不享受优惠，一经发现违规苏宁易购有权取消购买资格。
          </p>
        </div>
        <div class="footer">
          <div class="btn" @click="isShowRule = false">关闭</div>
        </div>
      </div>
    </UPopup>

    <!-- 中奖记录 -->
    <UPopup v-model="isShowMyLuckyHistory" type="center">
      <div class="pop-history">
        <div class="title">中奖记录</div>
        <div class="content">
          <div class="header d-flex">
            <div style="font-size: 14px; font-weight: 900">抽奖时间</div>
            <div style="font-size: 14px; font-weight: 900">获得奖励</div>
          </div>
          <div
            class="content-item d-flex1"
            v-for="(item, index) in myLuckyHistory"
            v-show="item.prizeType != 3"
            :key="index"
          >
            <div class="host" style="display: flex; justify-content: space-between">
              <div style="color: #999; font-size: 16px">
                {{ item.createTime_YMD }}
              </div>
              <p style="font-size: 14px; font-weight: 600">{{ item.prizeName }}</p>
            </div>
            <div class="host" style="justify-content: space-between; display: flex">
              <div style="color: #999; font-size: 12px">
                {{ item.createTime_hms }}
              </div>
              <div>
                <p
                  @click="toView(item.relationId)"
                  style="font-size: 14px; color: #f0c17b"
                  v-if="item.prizeType != 3"
                >
                  去查看>>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="footer">
          <div class="btn" @click="isShowMyLuckyHistory = false">关闭</div>
        </div>
      </div>
    </UPopup>

    <!-- 恭喜！ -->
    <UPopup v-model="isShowCongratulations" type="center">
      <div class="pop-congratulations">
        <div class="title" v-show="isThanks">恭喜，你抽中了</div>
        <div>
          <div
            class="prize-img"
            :style="{ 'background-image': `url(${prizeImg || ''})` }"
          ></div>
          <div class="tips" v-if="myLucky.type != 3">{{ prizeName }}</div>
        </div>
        <div class="ctl-bar" v-if="myLucky.type != 3">
          <div class="btn" @click="toUse(prizeId)">去使用</div>
        </div>
        <div class="close" @click="hideCongratulations">
          <img src="http://img.asset/win_btn.png" alt="" />
        </div>
      </div>
    </UPopup>
  </div>
</template>

<script>
import apis from '@/apis'
import UPopup from '@/components/UPopup'
const btnDraw = require('./btn-draw.png')
// 活动详情
// 'LUCKY_ITEM': 'lucky/queryById',
// 抽奖
// 'LUCKY_DRAW': 'lucky/luckDraw'
export default {
  components: {
    UPopup
  },
  data() {
    return {
      // 抽奖框背景图--以后要配置
      bgDraw: 'http://img.asset/image/SEL-POMO/20210714111612.gif',
      // 活动详情
      pomoInfo: {},
      myLuckyHistoryNum: 0,
      // 宫格序号
      intProductBox: [
        { id: 1, pid: 0, name: '', img: '' },
        { id: 2, pid: 0, name: '', img: '' },
        { id: 3, pid: 0, name: '', img: '' },
        { id: 8, pid: 0, name: '', img: '' },
        { id: 0, img: btnDraw },
        { id: 4, pid: 0, name: '', img: '' },
        { id: 7, pid: 0, name: '', img: '' },
        { id: 6, pid: 0, name: '', img: '' },
        { id: 5, pid: 0, name: '', img: '' }
      ],
      // UI中当前高亮的产品
      highlightProductIndex: 0,
      intID: null,

      isShowCongratulations: false, // 显示中奖信息
      prizeImg: '',
      prizeName: '',
      myLucky: {},

      isShowRule: false, // 显示规则
      isShowMyLuckyHistory: false, // 显示中奖记录
      myLuckyHistory: [], // 我的中奖记录
      isReady: false, // 是否已经完成初始化
      luckId: '', // 当前活动ID
      prizeId: 0,
      isThanks: true,
      isLogin: false
    }
  },
  async onLoad(e) {
    // console.log(e);
    this.isLogin = !!(await this.$client.getUserInfo())
    this.routeParam = Object.assign(e, this.$client.getParam())
    this.luckId = this.routeParam.id // '1454985301811687426' //
    // console.log("routeParam", this.routeParam);
    this.getMainItem(this.luckId)
    this.$client.pushEvent('JOIN_GATHERING', {
      type: '查看抽奖活动',
      data: this.luckId
    })
    this.showMyLuckyHistory()
  },
  async onPullDownRefresh() {
    this.luckId = this.routeParam.id
    this.getMainItem(this.luckId)
    this.$client.pushEvent('JOIN_GATHERING', {
      type: '刷新抽奖活动信心',
      data: this.luckId
    })
    // 停止下拉刷新，回弹问题
    this.$client.stopPullDownRefresh()
  },
  methods: {
    // 去使用, 根据奖品类型 type: 1-优惠券，2-IP资产， 3-谢谢参与
    toUse(prizeId) {
      if (this.myLucky.type == 1) {
        this.$client.pushWindow(
          // "/pkCoupon/detail/index?id=" + prizeId + "&isShowQRCode=true"
          '/pkCoupon/detail/index',
          { id: prizeId, isShowQRCode: true }
        )
      } else {
        this.$client.pushWindow('/pkMine/cardbag/cardbagdetail/index', { id: prizeId })
      }
    },
    toView(relationId) {
      if (this.myLucky.type == 1) {
        this.$client.pushWindow('/pkCoupon/detail/index?id=', { id: relationId })
      } else {
        this.$client.pushWindow('/pkCoupon/cardbagdetails/index', { id: relationId })
      }
    },

    onDraw(item) {
      if (item.id == 0) {
        // 判断是否已经登录了
        if (!this.isLogin) {
          this.$client.pushWindow('/pkPublic/login/login')
          return
        }
        // 判断是否正在进行中
        let now = new Date().getTime()
        let startTime = new Date(this.pomoInfo.startTime).getTime()
        let endTime = new Date(this.pomoInfo.endTime).getTime()
        if (now < startTime) {
          this.$client.toast('活动未开始')
          this.stopLuckyDraw()
          return
        }
        if (now > endTime) {
          this.$client.toast('活动已结束')
          this.stopLuckyDraw()
          return
        }
        // 看看还有没有抽奖次数
        if (this.pomoInfo.emainingRimes <= 0) {
          this.$client.toast('您的抽奖次数已用完')
          return
        }
        this.beginLuckyDraw()
      }
    },
    date2Str(date, format) {
      if (!date) {
        return ''
      }
      var ret = ''
      var date = new Date(date)
      var obj = {}
      obj.year = date.getFullYear()
      obj.month =
        date.getMonth() + 1 > 9 ? date.getMonth() + 1 : '0' + date.getMonth() + 1
      obj.day = date.getDate() > 9 ? date.getDate() : '0' + date.getDate()
      obj.hour = date.getHours() > 9 ? date.getHours() : '0' + date.getHours()
      obj.minutes = date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes()
      obj.seconds = date.getSeconds() > 9 ? date.getSeconds() : '0' + date.getSeconds()

      if (format == 'YYYY/MM/DD') {
        ret = `${obj.year}/${obj.month}/${obj.day}`
      }
      if (format == 'hh:mm:ss') {
        ret = `${obj.hour}:${obj.minutes}:${obj.seconds}`
      }
      return ret
    },
    // 开始抽奖
    beginLuckyDraw() {
      if (this.intID || !this.isReady) return
      this.intID = setInterval(() => {
        this.highlightProductIndex++
        if (this.highlightProductIndex > 8) {
          this.highlightProductIndex = 1
        }
      }, 150)

      setTimeout(async () => {
        let rt = await this.luckyDraw()
        if (rt) {
          let item = this.intProductBox.find(
            (item) => item.id == this.highlightProductIndex
          )
          // console.log('uiafhuisgiahusifaisfigi1');

          this.prizeImg = item.img
          this.prizeName = item.name
          this.isShowCongratulations = true
          this.$client.pushEvent('JOIN_GATHERING', {
            type: '抽奖-中奖',
            data: item.name
          })
        }
        this.showMyLuckyHistory()
        clearInterval(this.intID)
        this.intID = null
      }, 3000)
    },

    stopLuckyDraw() {
      try {
        clearInterval(this.intID)
        this.intID = null
      } catch (error) {
        console.log(error)
      }
    },
    // 获取活动详情
    async getMainItem(id) {
      let { data } = await this.$client.rpc(apis.LUCKY_ITEM, {
        id
      })
      console.log('抽奖详情-', data)
      if (data.success) {
        this.pomoInfo = data.data

        // 组装 九宫格
        this.intProductBox = this.intProductBox.map((item) => {
          let findItem = this.pomoInfo.lotteryPrizeList.find((sub) => {
            return sub.sort == item.id
          })
          if (findItem) {
            item.img = findItem.imgUrl
            item.name = findItem.name
            item.pid = findItem.id
          }
          return item
        })
        // for (const item of this.intProductBox) {
        //   if (item.id != 0 && this.pomoInfo.prizeVoList.length >= item.id) {
        //     item.img = this.pomoInfo.prizeVoList[item.id - 1].imgUrl
        //     item.name = this.pomoInfo.prizeVoList[item.id - 1].name
        //     item.pid = this.pomoInfo.prizeVoList[item.id - 1].id
        //   }
        // }
        // 标记已经初始化完成了
        this.isReady = true
      } else {
        // console.log("抽奖详情获取失败", data);
        this.$client.toast('抽奖详情获取失败')
      }
    },

    // 抽奖
    async luckyDraw() {
      try {
        let { data } = await this.$client.rpc(apis.LUCKY_DRAW, {
          id: this.luckId
        })
        // console.log("抽奖结果-", data, data.success);
        if (data && data.success) {
          // console.log(data.data);
          this.pomoInfo.emainingRimes = data.data.emainingRimes
          this.myLucky = data.data
          this.prizeImg = data.data.imgUrl
          this.prizeName = data.data.name
          let pid = data.data.relationId //抽中的产品ID
          this.prizeId = pid
          // console.log(this.myLucky);
          if (this.myLucky.type == 3) {
            this.isThanks = false
          }
          // 设置索引
          let item = this.intProductBox.find((x) => x.pid == data.data.id)
          if (!item) {
            console.error('中奖索引无效')
          }
          // console.log(pid, item, data);
          this.highlightProductIndex = item.id
          return true
        } else {
          this.$client.toast(data.msg)
          this.highlightProductIndex = 0
          return false
        }
      } catch (error) {
        clearInterval(this.intID)
        this.intID = null
        this.highlightProductIndex = 0
      }
    },

    // 显示活动规则
    showRule() {
      this.isShowRule = true
    },

    // 显示中奖页面
    showCongratulations() {
      this.isShowCongratulations = true
    },

    // 隐藏中奖页面
    hideCongratulations() {
      this.isShowCongratulations = false
    },

    // 中奖记录
    async showMyLuckyHistory() {
      // 判断是否已经登录了
      if (!this.isLogin) {
        this.$client.pushWindow('/pkPublic/login/login')
        return
      }
      let { data } = await this.$client.rpc(apis.LUCKY_HISTORY, {
        id: this.luckId,
        page: 1,
        pageSize: 10
      })
      // console.log("中奖记录", data);
      for (const item of data.rows) {
        item.createTime_YMD = this.date2Str(item.createTime, 'YYYY/MM/DD')
        item.createTime_hms = this.date2Str(item.createTime, 'hh:mm:ss')
      }
      this.$set(this, 'myLuckyHistory', data.rows)
      this.$set(this, 'myLuckyHistoryNum', data.total)
    },
    /**
     * 用户点击右上角分享
     */
    async onShareAppMessage(options) {
      // let imageUrl = "http://img.asset/logo-share.jpg";
      let { uid } = this.$store.state.userInfo // 用户id
      let { id } = this.pomoInfo
      let { data } = await this.$client.rpc(this.$api.SET_SCENE, {
        scene: `2_${uid}_${id}_0_0`
      })
      let scene = data.data.id
      let shareObj = {
        title: '奥园云分享抽奖活动',
        path: 'pages/launch/index?scene=' + scene // 默认当前页面
        // imageUrl,
        // success(res) {
        //   // 转发成功之后的回调
        //   this.$client.pushEvent("SHARE_APP", {
        //     data: "抽奖页",
        //     id: this.pomoInfo.id,
        //     title: this.pomoInfo.title,
        //   }); // 埋点
        //   this.$client.pushEventNew(2, {
        //     data: "抽奖页",
        //     id: this.pomoInfo.id,
        //     title: this.pomoInfo.title,
        //   }); // 埋点
        //   if (res.errMsg == "shareAppMessage:ok") {
        //   }
        // },
        // fail() {
        //   // 转发失败之后的回调
        //   if (res.errMsg == "shareAppMessage:fail cancel") {
        //     // 用户取消转发
        //   } else if (res.errMsg == "shareAppMessage:fail") {
        //     // 转发失败，其中 detail message 为详细失败信息
        //   }
        // },
        // complete() {
        //   // 转发结束之后的回调（转发成不成功都会执行）
        // },
      }

      this.$client.pushEvent('SHARE_APP', {
        data: '抽奖页',
        id: this.pomoInfo.id,
        title: this.pomoInfo.title
      }) // 埋点
      this.$client.pushEventNew(2, {
        data: '抽奖页',
        id: this.pomoInfo.id,
        title: this.pomoInfo.title
      }) // 埋点

      return shareObj
    }
  },
  async onShow() {
    this.isLogin = !!(await this.$client.getUserInfo())
    if (this.pomoInfo.createTime) {
      this.getMainItem(this.luckId)
    }
  },
  /**
   * 用户点击右上角分享
   */
  async onShareAppMessage(options) {
    this.onShareAppMessage(options)
  }
}
</script>

<style>
page {
  height: 100%;
  display: flex;
  overflow: auto;
}
</style>
<style lang="scss" scoped>
@import './index.scss';
.btn_box {
  height: 60px;
  width: 276px;
  background: url(http://img.asset/shar12.png);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  margin: 40px auto 0;
}
</style>
