<!--
 * @Description:
 * @version:
 * @Author: gonghonglin
 * @Date: 2021-07-10 17:16:59
 * @LastEditors: gonghonglin
 * @LastEditTime: 2021-11-17 17:51:59
-->
<template>
  <div class="pages_coupon">
    <!-- 顶部导航栏搜索 -->
    <div class="region_list">
      <div class="region_list_item" @click="searchInit('附近优先')">
        <div
          :class="[
            'region_title',
            { 'curr-title': currTitle === '附近优先' || pager.dis }
          ]"
        >
          {{ currNearby }}
        </div>
        <img
          class="region_icon"
          :src="
            currTitle === '附近优先'
              ? 'http://img.asset/seleced_title.png'
              : 'http://img.asset/jt.png'
          "
        />
      </div>
      <div class="region_list_item" @click="searchInit('全部分类')">
        <div
          :class="[
            'region_title',
            { 'curr-title': currTitle === '全部分类' || pager.couponClass }
          ]"
        >
          {{ currAllBy }}
        </div>
        <img
          class="region_icon"
          :src="
            currTitle === '全部分类'
              ? 'http://img.asset/seleced_title.png'
              : 'http://img.asset/jt.png'
          "
        />
      </div>
      <div class="region_list_item" @click="searchInit('综合排序')">
        <div
          :class="[
            'region_title',
            { 'curr-title': currTitle === '综合排序' || pager.orderByCode != 1 }
          ]"
        >
          {{ currComposite }}
        </div>
        <img
          class="region_icon"
          :src="
            currTitle === '综合排序'
              ? 'http://img.asset/seleced_title.png'
              : 'http://img.asset/jt.png'
          "
        />
      </div>
    </div>
    <div v-if="showSearch" class="region_content" @click="hiddenSearch">
      <div @click.stop>
        <div
          v-for="(item, index) in currList"
          :key="index"
          :class="{
            curr_item:
              (currTitle == '附近优先' && item.code == pager.dis) ||
              (currTitle == '全部分类' && item.code == pager.couponClass) ||
              (currTitle == '综合排序' && item.code == pager.orderByCode)
          }"
          @click="searchSel(item)"
        >
          {{ item.label }}
        </div>
      </div>
    </div>

    <div
      class="couponList"
      v-for="(item, index) in mainItems"
      :class="{ disabled: item.useStatus == -1 || item.useStatus == 2 }"
      :key="index"
    >
      <div class="coupon-top" @click="showCouponDetail(item)">
        <!-- 券类型 -->
        <div
          class="coupon-img"
          :style="{
            'background-image': `url(${
              item.imgUrl || 'http://img.asset/coupon-bg-default.png'
            })`
          }"
        >
          <div class="coupon-type" :class="{ 'type-discount': item.couponType == '2' }">
            {{ CouponType[item.couponType] }}
          </div>
        </div>
        <!-- 券主体 -->
        <div class="coupon-ringht">
          <div class="coupon-name">{{ item.name }}</div>
          <div class="con-box">
            <div class="left">
              <div class="use-range">
                <span v-if="item.objectName && item.couponClass == 1"
                  >所属项目 {{ item.objectName }}</span
                >
              </div>
              <div
                class="progress-container"
                :class="{
                  'progress-container-1': item.useStatus == -1 || item.useStatus == 2
                }"
              >
                <span>已抢 &nbsp;{{ item.usageQuantity }}%</span>
                <div class="progress-bar">
                  <div
                    class="progress"
                    :style="{ width: item.usageQuantity + '%' }"
                  ></div>
                </div>
              </div>
            </div>
            <div class="right" :class="{ 'right-1': !item.expectedAmount }">
              <div class="coupon-num">
                <span class="coupon-value" v-if="item.amount">
                  {{ unitConvert(item.amount).num || '*' }}
                  <span class="coupon-unit">
                    {{ item.couponType == '2' ? '折' : unitConvert(item.amount).unit }}
                  </span>
                </span>
              </div>
              <div>
                <span class="fenx" v-if="changeStatus_momy(item) && item.expectedAmount">
                  分享预计赚
                  {{ unitConvert(item.expectedAmount).num }}
                  {{ unitConvert(item.expectedAmount).unit }}
                </span>
              </div>
            </div>
          </div>

          <!-- <div class="copon-time" >有效时期:{{ item._expTimes }}</div> -->
          <!-- 进度条 -->
          <!-- <div class="box">


          </div> -->
        </div>
      </div>
      <div class="receive_coupon_box">
        <div
          class="receive_coupon-share"
          v-if="item.useStatus == 0"
          @click="getReceiveCoupon(item)"
        >
          立即领取
        </div>
        <div class="receive_coupon-share-1" v-else-if="item.useStatus == -1">已抢光</div>
        <div class="receive_coupon-share-1" v-else-if="item.useStatus == 2">
          今天已抢光
        </div>
        <div
          class="receive_coupon-share"
          v-else
          @click="showCouponDetail(item, 'showQRCode')"
        >
          去使用
        </div>
        <div v-if="changeStatus(item)" class="receive_coupon" @click="shareChange(item)">
          立即分享
        </div>
      </div>
      <!-- <div class="not" v-else >已抢光</div> -->
    </div>
    <div class="loading">{{ contentText }}</div>
    <div class="no-record" v-if="!mainItems.length && !mainItems.length"></div>

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
      <canvas style="width: 100%; height: 100%" canvas-id="mycanvas_coupon_list" />
    </div>
  </div>
</template>

<script>
import SharePopup from '@/components/SharePopup'
import { onShareAppMessage } from '@/utils/share'
export default {
  components: { SharePopup },
  data() {
    return {
      unitConvert: this.$client.unitConvert,
      ctx: null, // 画笔
      screenWidth: 375,
      isShowShare: false,
      qrcode: null, // 二维码
      userInfo: {}, // 用户信息
      poster: null, // 海报
      back: null,
      couponInfo: {},
      // 参数
      isNotData: false,
      pager: {
        page: 1,
        pageSize: 10,
        enableTime: '',
        couponStatus: 1,
        publishType: 1,
        city: this.$store.state.location, //当前城市

        dis: '', // 附近优先
        couponClass: '', // 分类
        orderByCode: '1' // 综合排序
      },
      isComplete: false, //标记已经加载完成了
      CouponType: {
        1: '抵扣券',
        2: '折扣券',
        3: '礼品券',
        4: '停车券',
        5: '文旅劵'
      },
      mainItems: [],
      constants: {},
      flag: false,
      contentText: '',
      isShowUserInfoTips: false, // 检测用户信息是否完善
      stateTips: '',

      // 顶部搜索功能
      showSearch: false, // 顶部导航栏搜索
      currTitle: '',
      nearbyList: [
        { label: '全部', code: '' },
        { label: '1公里', code: '1' },
        { label: '3公里', code: '3' },
        { label: '5公里', code: '5' },
        { label: '10公里', code: '10' }
      ],
      allList: [
        { label: '全部', code: '' },
        { label: '房产类', code: '1' },
        { label: '医疗美容', code: '2' },
        { label: '美食', code: '3' },
        { label: '文旅/景点', code: '4' },
        { label: '酒店', code: '5' },
        { label: '生活服务', code: '6' },
        { label: '娱乐休闲', code: '7' },
        { label: '丽人美发', code: '8' },
        { label: '电影演出', code: '9' },
        { label: '学习培训', code: '10' },
        { label: '其他', code: '11' }
      ],
      compositeList: [
        { label: '畅销热卖', code: '1' },
        { label: '新券上新', code: '2' }
      ],
      isLoading: false, // 正在加载中
    }
  },
  computed: {
    // 顶部搜索框实际渲染的搜索列表
    currList() {
      let ret = []
      switch (this.currTitle) {
        case '附近优先':
          ret = this.nearbyList
          break
        case '全部分类':
          ret = this.allList
          break
        case '综合排序':
          ret = this.compositeList
          break
        default:
          break
      }
      return ret
    },
    // 附近优先选中
    currNearby() {
      let find = this.nearbyList.find((item) => {
        return item.code && item.code == this.pager.dis
      })
      return find ? find.label : '附近优先'
    },
    // 全部分类选中
    currAllBy() {
      let find = this.allList.find((item) => {
        return item.code && item.code == this.pager.couponClass
      })
      return find ? find.label : '全部分类'
    },
    // 综合排序选中
    currComposite() {
      let find = this.compositeList.find((item) => {
        return item.code != 1 && item.code == this.pager.orderByCode
      })
      return find ? find.label : '综合排序'
    }
  },
  onLoad() {
    const _this = this
    // 查询设备信息，用于canvas px 转换定位
    if (uni.canIUse('getSystemInfo')) {
      uni.getSystemInfo({
        success(res) {
          _this.screenWidth = res.screenWidth
        }
      })
    }
    // 搜索参数经纬度注入
    let { lat, lng } = this.$client.getStorage('locationXY')
    this.pager.longitude = lng
    this.pager.latitude = lat

    this.getListcoupon()
  },
  onShow() {
    this.getUser()
  },
  mounted() {
    // 初始化画笔
    this.ctx = uni.createCanvasContext('mycanvas_coupon_list')
  },
  methods: {
    // 列表数据的数据
    async getListcoupon() {
      this.pager.enableTime = this.$tools.date2Str(new Date(), 'YYYY-MM-DD hh:mm:ss')
      this.pager.city = this.pager.city == '全部' ? '' : this.pager.city
      let res = await this.$client.rpc(this.$api.COUPON_LISTNEW, this.pager)
      var data = res.data.rows || []

      data.forEach((item) => {
        // item._expTimes =
        //   this.date2Str(item.startTime, 'YYYY/MM/DD') +
        //   '-' +
        //   this.date2Str(item.endTime, 'YYYY/MM/DD')
        if (item.projectName) {
          var arr = item.projectName.split(',')
          if (arr.length == 1) {
            item.objectName = arr[0]
          } else {
            item.objectName = arr[0] + '...'
          }
        }
      })
      if (this.pager.page != 1) {
        this.mainItems = this.mainItems.concat(data)

        if (data.length == 0) {
          this.contentText = '真的没有更多啦~'
        }
      } else {
        this.mainItems = data
        if (data.length == 0) {
          this.isNotData = true
        }
      }
      // 标记已经加载完成了
      if (this.mainItems.length == res.data.total) {
        this.isComplete = true
      }
    },

    // 领取优惠券
    async getReceiveCoupon(item) {
      if(this.isLoading){
        this.$client.toast('正在加载中')
        return
      }
      this.isLoading = true
      try {
        let { data } = await this.$client.rpc(this.$api.COUPON_GET_RECEIVE, {
          couponId: item.id
        })
        if (data.success) {
          this.$client.toast('已领取成功')
          // item.useStatus =1,
          this.pager.page = 1
          this.getListcoupon() //再次刷新列表
          this.$client.pushEventNew(24, {}) // 24，领取优惠券
  
          this.$emit('onRefresh')
        } else {
          // console.log('优惠券领取失败', data)
        }
        this.isLoading = false
      } catch (error) {
        this.isLoading = false
      }
    },
    showCouponDetail(item, isShowQRCode = '') {
      this.$client.pushWindow(
        './detail/index?id=' + item.id + '&isShowQRCode=' + isShowQRCode
      )
    },
    // 时间格式的转化---年月日
    date2Str(date, format) {
      return this.$tools.str2DateStr(date, format)
    },
    // 根据状态显示 0 不可分享   1可分享
    changeStatus(item) {
      var showRentPrise
      if (item.shareStatus == 1) {
        showRentPrise = true
      } else {
        showRentPrise = false
      }
      return showRentPrise
    },
    // 展示分享弹框
    async shareChange(item) {
      // 如果没有登录的，先去登录，返回来再领取
      if (!this.$client.passCheck()) return
      // 检查是否已经完善了信息
      if (item.couponClass == 1) {
        let us = await this.getUserDataState()
        if (us) return
      }
      this.couponInfo = item
      this.getBack()
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
    changeStatus_momy(item) {
      var showPrise
      if (item.shareStatus == 1) {
        showPrise = true
      } else {
        showPrise = false
      }
      return showPrise
    },
    // 获取用户信息
    async getUser() {
      const $this = this
      let data = await this.$client.getUserInfo()
      console.log('data=', data)
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
          }
        })
      }
    },
    // 获取背景图
    getBack() {
      const $this = this
      uni.downloadFile({
        url: this.couponInfo.imgUrl || 'http://img.asset/coupon-bg-default.png',
        success: (res) => {
          $this.back = res.tempFilePath
          $this.getQrcode()
        },
        fail(err) {
          console.error('背景图片获取失败')
          $this.getQrcode()
        }
      })
    },
    // 获取二维码
    async getQrcode() {
      let { uid } = this.$store.state.userInfo // 用户id
      let { id } = this.couponInfo
      let { data } = await this.$client.rpc(this.$api.SET_SCENE, {
        scene: `6_${uid}_${id}_8801_0`
      })
      let scene = data.data.id
      var qrcode = await this.$client.rpc(this.$api.CREATE_WXQRCODE, {
        page: 'pages/launch/index', //TODO--生产改成 pages/launch/index
        scene
      })
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
          // console.log(codeimg)
          $this.qrcode = codeimg
          $this.init()
        },
        fail() {
          console.error('二维码获取失败')
        }
      })
    },
    // canvas绘制
    init() {
      const _this = this
      this.$nextTick(async () => {
        let { ctx, toPx, couponInfo } = this
        let canvas_w = await toPx(670),
          canvas_h = await toPx(844),
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
          _490 = await toPx(490),
          _530 = await toPx(530),
          _596 = await toPx(596),
          _600 = await toPx(600),
          _602 = await toPx(602),
          _630 = await toPx(630),
          _680 = await toPx(680),
          _760 = await toPx(760),
          _790 = await toPx(790)
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
        ctx.drawImage(_this.back, _20, _112, _630, _354)

        // 绘制优惠卷详情文案
        ctx.setFontSize(_32)
        ctx.setTextAlign('left')
        ctx.fillStyle = '#000000'
        let detailText = couponInfo.name
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
              ctx.fillText(str, _20, _490)
              // console.log('当前截取', ctx.measureText(str).width)
            }
          }
          // 绘制第二行
          let twoText = detailText.slice(siliceI, siliceI + 6) + '...'
          ctx.fillText(twoText, _20, _530)
        } else {
          ctx.fillText(detailText, _20, _490)
        }

        // 绘制折扣
        ctx.fillStyle = '#E20000'
        ctx.setTextAlign('left')
        ctx.setFontSize(_40)
        var money =
          (this.unitConvert(couponInfo.amount).num || '*') +
          (couponInfo.couponType == '2' ? '折' : this.unitConvert(couponInfo.amount).unit)
        ctx.fillText(money || '', _44, _596)
        var money_w = ctx.measureText(money).width
        ctx.fillStyle = '#333333'
        ctx.setFontSize(_28)
        if (!couponInfo.minPoint) {
          ctx.fillText('无门槛', _64 + money_w, _602)
        } else {
          ctx.fillText(
            `满${this.unitConvert(couponInfo.minPoint).num}${
              this.unitConvert(couponInfo.minPoint).unit
            }起可用`,
            _64 + money_w,
            _602
          )
        }

        // 绘制二维码
        ctx.drawImage(_this.qrcode, _20, _680, _140, _140)

        // 绘制右下角文案
        ctx.fillStyle = '#666666'
        ctx.setFontSize(_20)
        ctx.setTextAlign('right')
        ctx.fillText('在奥园云', _630, _760)
        ctx.fillText('人人都是健康生活分享家', _630, _790)
        ctx.draw(false, () => {
          uni.canvasToTempFilePath({
            canvasId: 'mycanvas_coupon_list',
            success: (res) => {
              console.log('绘制函数生成打印', _this.couponInfo.minPoint)
              _this.poster = res.tempFilePath
              _this.isShowShare = true
              // console.log('canvasToTempFilePath-success', res)
            },
            fail: (err) => {
              // console.log('canvasToTempFilePath-fail', err)
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
    // 顶部排序点击
    searchInit(type) {
      // console.log('当前点击', type)
      this.currTitle = !this.showSearch ? type : ''
      this.showSearch = !this.showSearch
    },
    // 排序点击选中
    searchSel(item) {
      // console.log(`当前${this.currTitle}选中`)
      switch (this.currTitle) {
        case '附近优先':
          this.pager.dis = item.code
          break
        case '全部分类':
          this.pager.couponClass = item.code
          break
        case '综合排序':
          this.pager.orderByCode = item.code
          break
        default:
          break
      }
      // 清空标题选中状态、隐藏遮罩
      this.currTitle = ''
      this.showSearch = false
      // 重置页码、查询列表
      this.pager.page = 1
      // console.log('当前筛选参数对象', JSON.parse(JSON.stringify(this.pager)))
      this.getListcoupon()
    },
    // 遮罩点击隐藏
    hiddenSearch() {
      this.currTitle = ''
      this.showSearch = false
    }
  },
  // 上拉加载
  onReachBottom() {
    if (this.isComplete) return
    uni.showNavigationBarLoading()
    this.pager.page++
    this.getListcoupon()
    uni.hideNavigationBarLoading()
  },
  onPullDownRefresh() {
    uni.stopPullDownRefresh() //停止当前页面下拉刷新
    this.pager.page = 1
    this.isComplete = false
    this.getListcoupon()
  },
  // 分享回调
  onShareAppMessage
}
</script>

<style lang="scss">
@import './index.scss';
.not {
  text-align: center;
  font-size: 12px;
  color: #cbd7e1;
  padding: 12px 0;
}
.con-box {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  .left {
    // min-height: 57px;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .progress-container {
      // min-width: 130px;
      color: #999999;
      font-size: 10px;
      display: flex;
      align-items: center;
      justify-content: space-around;
      span {
        color: #f97b7b;
      }
      .progress-bar {
        flex: 1;
        display: flex;
        background-color: #f8f8f8;
        height: 8px;
        border-radius: 10px;
        margin: 0 10px;
        overflow: hidden;
        .progress {
          width: 40px;
          border-radius: 10px;
          background-color: #e20000;
        }
      }
    }
    .progress-container-1 {
      width: 160px;
      color: #999999;
      font-size: 10px;
      display: flex;
      align-items: center;
      justify-content: space-around;
      span {
        color: #cbd7e1;
      }
      .progress-bar {
        flex: 1;
        display: flex;
        background-color: #eeeeee;
        height: 8px;
        border-radius: 10px;
        margin: 0 10px;
        overflow: hidden;
        .progress {
          width: 40px;
          border-radius: 10px;
          background-color: #cbd7e1;
        }
      }
    }
  }
  .left-1 {
    justify-content: flex-end;
  }
  .right {
    // height: 57px;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: flex-end;
    .fenx {
      font-size: 10px;
      color: #e20000;
    }
  }
  .right-1 {
    margin-bottom: 18px;
  }
}
.not-data {
  text-align: center;
  img {
    width: 304px;
    height: 304px;
  }
}
</style>
