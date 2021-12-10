<template>
  <div>
    <div class="page">
      <div class="group1">
        <!-- 轮播图 -->
        <div class="page-section-spacing">
          <div
            style="height: 210px; width: 100%"
            class="end-cont"
            :class="{ dis: btnnum == 0 }"
          >
            <video
              style="height: 100%; width: 100%"
              :src="homeSlide.visual_info.video_urls[0]"
            ></video>
          </div>
          <!-- <div
            style="height: 210px; width: 100%"
            class="end-cont"
            :class="{ dis: btnnum == 1 }"
          >
            　　 {{ homeSlide.visual_info.indoor_vr_urls }}
          </div> -->
          <!-- 图片轮播 -->
          <div
            class="end-cont"
            :class="{ dis: btnnum != 0 }"
            v-if="homeSlide.visual_info"
          >
            　
            <swiper
              class="swiper"
              style="height: 210px"
              autoplay="true"
              @change="swiperChange"
            >
              <swiper-item
                v-for="(item, index) in homeSlide.visual_info.effect_pics"
                :key="index"
              >
                <image class="img_banner" :src="item" mode="aspectFill"></image>
              </swiper-item>
            </swiper>
          </div>
          <ul class="tab-tilte">
            <li
              v-if="homeSlide.visual_info.video_urls.length"
              @click="btnnum = 0"
              :class="{ active: btnnum == 0 }"
            >
              视频
            </li>
            <li
              v-if="homeSlide.visual_info.indoor_vr_urls[0]"
              @click="routerVr"
              :class="{ active: btnnum == 1 }"
            >
              VR
            </li>
            <li @click="btnnum = 2" :class="{ active: btnnum == 2 }">图片</li>
          </ul>
          <!-- {{homeSlide.visual_info.panorama_vr_urls}} -->
          <div
            v-if="btnnum == 2 && homeSlide.visual_info.effect_pics.length"
            class="img_current"
          >
            {{ swiperCur + 1 }}/{{ homeSlide.visual_info.effect_pics.length }}
          </div>
        </div>
        <div class="detail_info">
          <div class="info_title">
            <div>{{ homeSlide.base_info.project_name || '' }}</div>
            <span @click="moreclick()"
              >更多详情<img src="http://img.asset/text_icon.png"
            /></span>
          </div>
          <div class="info_label">
            <div>
              <div class="label_name">备案名称</div>
              <div class="label_text">
                {{ homeSlide.base_info.record_name || '' }}
              </div>
            </div>
            <div>
              <div class="label_name">参考均价</div>
              <div class="label_price">
                {{ homeSlide.base_info.avg_price || '价格待定'
                }}{{
                  homeSlide.base_info.avg_price ? homeSlide.base_info.measure_unit : ''
                }}
              </div>
            </div>
            <div>
              <div class="label_name">楼盘地址</div>
              <div class="label_text">
                {{ homeSlide.base_info.project_name }}
              </div>
            </div>
          </div>
        </div>

        <!-- 户型介绍 -->
        <CardContainer
          border
          title="户型介绍"
          :more="{ label: '更多', link: '' }"
          @onMore="onMore"
          v-if="homeSlide.house_type != ''"
        >
          <div class="hose-container">
            <div
              class="hose-type-img"
              v-for="(item, index) in homeSlide.house_type"
              :key="index"
            >
              <img
                @click="onMore(index)"
                class="swiper-item-background"
                :src="item.classifications[0].images[0].url"
                alt=""
              />
              <div class="hose-explain">
                <span style="font-size: 14px; color: #000000"
                  >{{ item.bedroom_num }}室{{ item.hall_num }}厅</span
                >
                <span style="font-size: 12px; color: #000000"
                  >建面{{ item.building_area }}㎡</span
                ><span
                  :class="{
                    'type type3': item.sales_status == 1,
                    'type type1': item.sales_status == 2,
                    'type type2': item.sales_status == 3,
                    'type type2': item.sales_status == 4,
                    'type type2': item.sales_status == 5
                  }"
                  >{{ belongTyep[item.sales_status] }}</span
                >
                <p style="font-size: 14px; color: #e20000">
                  {{ item.low_prize ? item.low_prize : item.high_prize || '价格待定' }}
                </p>
              </div>
            </div>
          </div>
        </CardContainer>

        <div class="counselor_box">
          <div v-if="couponList.length > 0">
            <div class="counselor_title">限时折扣</div>
            <div class="coupon_detail" v-for="(item, index) in couponList" :key="index">
              <div>
                <div>
                  <div class="title">{{ item.name }}</div>
                  <div v-if="item.shareStatus == 1" class="sub_title">
                    分享预计赚
                    {{ unitConvert(item.expectedAmount).num }}
                    {{ unitConvert(item.expectedAmount).unit }}
                  </div>
                </div>
                <div class="coupon_num" v-show="item.couponType != 5">
                  {{ unitConvert(item.amount).num || '*' }}
                  {{ item.couponType == '2' ? '折' : unitConvert(item.amount).unit }}
                </div>
                <div>
                  <div
                    v-if="item.useStatus == 0"
                    class="btn get"
                    @click="getCoupon(item)"
                  >
                    立即领取
                  </div>
                  <div v-if="item.useStatus == -1" class="btn none">已抢光</div>
                  <div class="btn none" v-if="item.useStatus == 2">今天已抢光</div>
                  <div
                    class="btn get"
                    v-if="item.useStatus == 1"
                    @click="toUseCoupon(item)"
                  >
                    去使用
                  </div>

                  <div class="have">已抢{{ item.usageQuantity || 0 }}%</div>
                  <div class="process_box">
                    <div class="process_num" :style="item._usageQuantity"></div>
                  </div>
                </div>
              </div>
              <div>
                <div class="user_rule" @click="showUseRule(item)">
                  使用规则
                  <img src="http://img.asset/orange_icon.png" />
                </div>
                <div
                  v-if="item.shareStatus == 1"
                  class="share_btn"
                  @click="shareCoupon(item)"
                >
                  立即分享
                </div>
              </div>
            </div>
          </div>
          <div class="counselor_title" v-if="counselor != ''">置业顾问</div>
          <div class="counselor_list">
            <div class="counselor_item" v-for="(item, index) in counselor" :key="index">
              <img
                class="counselor_head"
                :src="item.avatar || 'http://img.asset/header.png'"
                alt=""
                srcset=""
              />
              <span>{{ item.name || item.position || '--' }}</span>
              <!-- <cell class="cell" bind:startmessage='startmessage' blockStyle="bubble" buttonText="3" bind:completemessage="completemessage" plugid='3ec3e20a7e8cfd276ccc19f197e8cf75'/> -->
              <img
                class="counselor_phone"
                v-if="item.qr_code"
                @click="makeCellwx(item)"
                src="http://img.asset/qywx.png"
                alt=""
              />
              <img
                class="counselor_phone"
                @click="makeCell(item.mobile)"
                src="http://img.asset/phone2.png"
                alt=""
              />
            </div>
          </div>
        </div>

        <!-- 项目动态 -->
        <!-- <div class="ystep">
          <CardContainer border title="项目动态">
            <YStep />
          </CardContainer>
        </div> -->

        <div class="Representations" v-if="homeSlide.base_info.introduction != ''">
          <!-- 项目亮点 -->
          <CardContainer title="项目亮点">
            <text class="project-Representations">
              {{ homeSlide.base_info.introduction }}
            </text>
          </CardContainer>
        </div>

        <div class="card-container card_box">
          <!-- 项目区位 -->
          <div class="title">项目区位</div>
          <map
            class="main10_map"
            @click="gotomap()"
            :latitude="homeSlide.base_info.latitude"
            :longitude="homeSlide.base_info.longitude"
            :enable-zoom="false"
            :enable-scroll="false"
            :scale="14"
            :markers="markers"
          >
          </map>
        </div>

        <!-- 
            <div class="project-right" v-for="(item, index) in ProjectNew.data.slice(0, 4)" :key="index">
              <p class="project-time-home">
                <span class="project-news"
                  style="color: #fff; font-size: 10px">{{ item.dynamic_title }}</span>
                <span class="project-time"
                  style="color: #333333; font-size: 12px">{{ item.dynamic_create_time }}</span>
              </p>
              <p class="project-detail">
                <span class="project-time"
                  style="font-size: 12px; color: #333333">{{ item.dynamic_content }}</span><br />
                <span style="font-size: 12px; color: #666666">发布于{{ item.dynamic_create_time }}</span>
              </p>
            </div>
         -->
        <div class="footer">
          <button class="icon-share" @click="showShare">
            <img src="http://img.asset/share.png" />
          </button>

          <div class="call-Phone" @click="makePhoneCall(homeSlide.sale_offices[0])">
            电话咨询
          </div>
          <div class="Recommended-customers" @click="userFrom()">推荐客户</div>
        </div>
      </div>
    </div>
    <UPopup v-model="isShowResult" :maskClick="false">
      <div class="qrcode_box">
        <img class="qrcode_img" :src="qr_code" alt="" @click="perviewImg(qr_code)" />
        <img
          class="close"
          @click="isShowResult = false"
          src="http://img.asset/win_btn.png"
          alt=""
        />
      </div>
    </UPopup>
    <EReporting
      :visabled="isShowReporting && isLogin"
      :isLockProj="true"
      :sceneBrokerId="sceneBrokerId"
      :sceneProjectList="sceneProjectList"
      @onClose="infoClose"
      ref="EReporting"
    ></EReporting>
    <!-- 优惠卷使用规则弹框 -->
    <UPopup v-model="isShowPopup" type="center" catchtouchmove="true">
      <div class="popup-container">
        <div class="title">
          使用规则
          <span class="close" @click="showUseRule">&times; </span>
        </div>
        <scroll-view class="content" scroll-y="true">
          <rich-text :nodes="couponSelect.description"></rich-text>
        </scroll-view>
        <div class="confirmBtn" @click="showUseRule">确定</div>
      </div>
    </UPopup>
    <!-- 优惠卷分享弹框 -->
    <SharePopup
      v-if="showCouponShare"
      v-model="showCouponShare"
      :maskClick="true"
      :title="'奥园云活动分享'"
      :posterUrl="couponPoster"
      :shareData="couponShareData"
      :mode="'widthFix'"
      @onClose="couponShareHide"
    />
    <div class="canvas_box2">
      <canvas style="width: 100%; height: 100%" canvas-id="mycanvas_pk_coupon" />
    </div>
    <!-- 楼盘分享弹框 -->
    <SharePopup
      v-if="isShowShare"
      v-model="isShowShare"
      :maskClick="true"
      :title="homeSlide.base_info.project_name || '奥园云活动分享'"
      :posterUrl="poster"
      :shareData="{
        bType: 8,
        bId: project_id,
        channelId: '8803',
        needLogin: true
      }"
      :mode="'widthFix'"
      @onClose="shareHide"
    />
    <div class="canvas_box">
      <canvas style="width: 100%; height: 100%" canvas-id="mycanvas_pk_detatil" />
    </div>
    <!-- 未登录提示 -->
    <div class="tips_box" v-if="!isLogin && isReady">
      <div class="tips_inbox">
        <div>温馨提示</div>
        <div class="tips_text">请先登录</div>
        <div class="tips_btn" @click="login">立即登录</div>
      </div>
    </div>
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
    <!-- 楼盘已下价提示 -->
    <div v-if="soldOut" class="tips_box" catchtouchmove="true">
      <div class="tips_inbox">
        <div>温馨提示</div>
        <div class="tips_text">该项目已下架</div>
        <div class="tips_btn" @click="backList">确定</div>
      </div>
    </div>
  </div>
</template>

<script>
import UPopup from '@/components/UPopup'
import apis from '@/apis'
import YStep from '@/components/YStep'
import CardContainer from './components/cardContainer'
import EReporting from '@/components/EReporting'
import SharePopup from '@/components/SharePopup'
import { onShareAppMessage } from '@/utils/share'
export default {
  components: {
    YStep,
    CardContainer,
    UPopup,
    EReporting,
    SharePopup
  },
  data() {
    return {
      unitConvert: this.$client.unitConvert,
      ctx: null, // 画笔
      screenWidth: 375,
      isShowShare: false, // 分享弹框
      back: '',
      userInfo: {},
      poster: '', // 生成本地路径canvas 图片
      qrcode: '', // 绘制二维码本地路径
      tmp: {}, // onload 参数
      stateTips: '',
      userDataState: true, // 用户数据状态

      couponCtx: null,
      showCouponShare: false, // 优惠卷分享弹框
      isShowPopup: false, //  用户优惠卷使用规则弹框
      couponBack: '',
      couponQrcode: '',
      couponPoster: '',
      couponList: [], // 优惠券列表
      couponSelect: {
        description: ''
      },
      couponShareData: { bType: 6, channelId: '8801' }, // 优惠券分享数据
      swiperCur: 0,
      projectStep: [],
      project_id: '', //列表传过来的id
      qr_code: '',
      homeSlide: {
        visual_info: {
          effect_pics: ['http://img.asset/aa.png'],
          panorama_vr_urls: '',
          video_urls: '',
          indoor_vr_urls: ''
        },
        base_info: {
          project_name: '',
          avg_price: '',
          introduction: '',
          // 经纬度
          longitude: '',
          latitude: ' '
          // 经度：data.base_info.longitude
          // 纬度：data.base_info.latitude
        },
        house_type: [
          {
            classifications: [
              {
                images: [
                  {
                    url: ''
                  }
                ]
              }
            ],
            bedroom_num: '',
            hall_num: '',
            building_area: '',
            low_prize: '',
            high_prize: ''
          }
        ]

        //户型列表
      }, // 定义值接收轮播图数据
      ProjectNew: {
        data: [
          {
            dynamic_title: '',
            dynamic_content: '',
            dynamic_image: '',
            dynamic_create_time: ''
          }
        ],
        total: ''
      }, //项目动态

      markers: [], //地图图标
      btnnum: 2,
      items: ['视频', 'VR', '图片'],
      active: 1,
      iconPath: require('@/static/tiop.png'),
      counselor: [],
      isShowResult: false,
      isShowReporting: false, // 是否显示自动报备
      sceneBrokerId: '',
      isReady: false,
      isLogin: false,
      sceneProjectList: [], // 推荐本楼盘
      isShowUserInfoTips: false, // 检测用户信息是否完善
      stateTips: '',
      belongTyep: {
        1: '待售',
        2: '在售',
        3: '售罄',
        4: '非售',
        5: '未知'
      },
      soldOut: false, // 楼盘项目是否下架
      isLoading: false, // 正在加载
    }
  },
  onLoad(obj) {
    const _this = this
    // 查询设备信息，用于canvas px 转换定位
    if (uni.canIUse('getSystemInfo')) {
      uni.getSystemInfo({
        success(res) {
          _this.screenWidth = res.screenWidth
        }
      })
    }

    this.isLogin = !!this.$store.state.userInfo && this.$store.state.userInfo.uid
    this.project_id = obj.id
    // 看看是否推荐进入的，显示自动报备
    // scene = 0业务类型 + 1分享用户id + 2业务Id + 3渠道ID + 4分销机构id
    this.tmp = this.$client.getParam()
    console.log('getParam----', this.tmp)
    this.$client.setParam('')
    // 没登录就先跳去登录
    if (!this.isLogin) {
      this.login()
      return
    }
    setTimeout(() => {
      this.isReady = true
    }, 500)

    this.$client.pushEventNew(7, {}) // 埋点-参与活动
  },
  async onShow() {
    this.isLogin = !!(this.$store.state.userInfo && this.$store.state.userInfo.uid)
    // 点击卡片入当前页面
    let { tmp } = this
    if (this.isLogin && !this.isShowReporting && Object.keys(tmp || {}).length > 0) {
      console.log('this.tmp', tmp)
      console.log('楼盘详情-用户登录信息', this.$store.state.userInfo)

      // 更新页面用户信息
      this.$set(this, 'userInfo', this.$store.state.userInfo)

      let { id, scene } = tmp
      this.project_id = id || ''
      console.log(id, scene)

      // 判断该楼盘是否过期，过期跳出以下逻辑
      let res = await this.$client.rpc(apis.DEIL_PROJECT, {
        projectId: this.project_id,
        page: 1,
        pageSize: 10
      })
      if (res.data.success && res.data.msg == '该楼盘已下架') {
        this.soldOut = true
        return
      }

      if (scene) {
        let arr = scene.split('_')
        let myId = this.$store.state.userInfo.uid
        // 自己的不能报备自己
        if (arr[0] == '8' && myId != arr[1]) {
          // 先判断是否已经报备过了，不用重复报备
          let isReporting = await this.checkReporting()
          console.log('此项目报备状态', isReporting, this.isLogin)
          if (isReporting) {
          } else {
            this.isShowReporting = true
            this.$nextTick(() => {
              // 再更新一次姓名手机号到页面
              this.$refs['EReporting'].refreshData()
            })
            this.sceneBrokerId = arr[1]
          }
        }

        // 扫码楼盘线下码--有渠道号  arr[0] == '4' && 
        if(arr[3]){
          // 区分是否线下渠道 渠道号：（5000 - 5999）
          let isWorksiteScene = +arr[3] >= 5000 && +arr[3] < 6000

          // 如果是线下渠道扫码进入的，添加一次曝光量
          if(isWorksiteScene){
            this.$client.rpc(this.$api.STATISTICS_CHANNEL, {
              "channelCode": arr[3],
              "type": 1  // 类型：1、曝光量；2、点击量
            }, {silent:true}); // 静默处理
          }

          // 无论线上线下，添加一次点击量
          this.$client.rpc(this.$api.STATISTICS_CHANNEL, {
            "channelCode": arr[3],
            "type": 2  // 类型：1、曝光量；2、点击量
          }, {silent:true}); // 静默处理
        }

        // 扫码楼盘线下码--有组织机构号
        if(arr[4]){
        // if(arr[0] == '4' && arr[4]){
          this.$client.rpc(this.$api.JOIN_ORG, {
            distributionOrganId: arr[4]
          }, {silent:true}); // 静默处理
        }

        // 置空scene
        this.$set(this.tmp, 'scene', null)

      }
      console.log('scene--00', tmp, scene)
    }

    if (this.isLogin) {
      // 请求页面接口
      this.getlistFrom()
      this.getlistTrends()
      this.getCounselor()
      this.$client.pushEventNew(7, { id: this.project_id }) // 埋点

      //登陆调用分享绘制接口
      this.getUser()
      // 校验用户资料完善弹框,页面显示时隐藏
      if (!this.userDataState) {
        this.userDataState = true
      }
    }
  },
  mounted() {
    this.ctx = uni.createCanvasContext('mycanvas_pk_detatil')
    this.couponCtx = uni.createCanvasContext('mycanvas_pk_coupon')
  },
  methods: {
    routerVr() {
      this.btnnum = 1
      if (this.homeSlide.visual_info.indoor_vr_urls[0]) {
        this.$client.pushWindow('./vr', {
          url: this.homeSlide.visual_info.indoor_vr_urls[0]
        })
      } else {
        this.$client.toast('暂无数据，稍后再试')
      }
    },
    // 获取用户信息是否完善
    async getUserDataState() {
      let { data } = await this.$client.rpc(this.$api.VALIDATE_USERINFO)
      this.isShowUserInfoTips = !data.data
      this.stateTips = data.msg
      return new Promise((resolve) => resolve(this.isShowUserInfoTips))
    },
    routerUserInfo() {
      this.isShowUserInfoTips = false
      this.$client.pushWindow('/pkMine/personal/index', { hasBackBtn: true })
    },

    async checkReporting() {
      let { data } = await this.$client.rpc(this.$api.QUERY_CLUE, {
        projectId: this.project_id
      })
      return new Promise((resolve) => resolve(data.data))
    },
    perviewImg(current) {
      uni.previewImage({
        current,
        urls: [current]
      })
    },
    startmessage() {
      console.log('startmessage')
    },
    completemessage() {
      console.log('completemessage')
    },
    makeCell(phone) {
      uni.makePhoneCall({
        phoneNumber: phone //仅为示例，并非真实的电话号码
      })
    },
    async getCounselor() {
      let res = await this.$client.rpc(
        apis.QUERY_CENTERLIST,
        {
          projectId: this.project_id,
          page: 1,
          pageSize: 10
        },
        { hideLoading: true }
      )
      if (res.data.success) {
        this.counselor = res.data.rows
      }
    },
    moreclick() {
      uni.navigateTo({
        url: './RealEstateInformation/index?id=' + this.project_id
      })
    },
    //户型详情
    onMore(index) {
      console.log(index)
      this.$client.pushWindow('./hosetypedetail', {
        list: this.homeSlide.house_type,
        index: index
      })
    },
    makePhoneCall(item) {
      let phone = item.telephone
      this.$client.makePhoneCall(phone)
      this.$client.pushEvent('CALL_PROJECT_PHONE', {
        phone,
        projectName: item.projectName
      }) // 埋点
    },
    async userFrom() {
      if (!this.$client.passCheck()) return

      // 检查是否已经完善了信息
      let us = await this.getUserDataState()
      if (us) return

      //把楼盘id和楼盘名称传到下一个页面
      this.$client.pushWindow('/pkBuilding/recommend/index', {
        isShow: true,
        listSel: [
          {
            id: this.homeSlide.base_info.id,
            projectId: this.homeSlide.base_info.project_id,
            projectName: this.homeSlide.base_info.project_name
          }
        ]
      })
    },
    //获取楼盘详情的数据
    async getlistFrom() {
      let res = await this.$client.rpc(apis.DEIL_PROJECT, {
        projectId: this.project_id,
        page: 1,
        pageSize: 10
      })
      if (res.data.success && res.data.msg == '该楼盘已下架') {
        this.soldOut = true
        return
      }
      // console.log('========================================', res)
      // this.homeSlide = res.data.data
      this.$set(this, 'homeSlide', res.data.data)
      // 如果是分享进入的，把本楼盘信息组装成候选信息
      if (this.isShowReporting) {
        this.sceneProjectList = []
        this.sceneProjectList.push({
          projectName: this.homeSlide.base_info.project_name,
          projectId: this.homeSlide.base_info.project_id
        })
      }
      this.markers.push({
        latitude: this.homeSlide.base_info.latitude,
        longitude: this.homeSlide.base_info.longitude,
        iconPath: this.iconPath,
        width: 35,
        height: 45
      })

      // 登录时绘制canvas
      if (this.isLogin) {
        this.getBack()
      }
      // 查询当前楼盘优惠券列表
      this.getCouponList()
    },
    // 获取楼盘优惠券列表
    async getCouponList() {
      let { data: res } = await this.$client.rpc(apis.HOUSES_COUPON, {
        projectId: this.project_id,
        couponClass: 1, // 房产筛选
        couponStatus: 1, // 启用状态筛选
        // addressCodes: 1, // 筛选全国
        page: 1,
        pageSize: 99,
        enableTime: this.$tools.date2Str(new Date(), 'YYYY-MM-DD hh:mm:ss'),
        city: this.homeSlide.base_info.city_name
      })

      this.couponList = (res.rows || []).map((item) => {
        item._usageQuantity = `width:${item.usageQuantity || 0}%`
        return item
      })
    },
    //项目动态数据
    async getlistTrends() {
      let res = await this.$client.rpc(
        apis.BUILDING_DYNAMIC,
        {
          projectId: this.project_id,
          page: 1,
          pageSize: 10
        },
        {
          hideLoading: true
        }
      )
      this.ProjectNew = JSON.parse(JSON.stringify(res.data.data))
    },
    gotomap() {
      uni.openLocation({
        latitude: this.homeSlide.base_info.latitude,
        longitude: this.homeSlide.base_info.longitude,
        scale: 12,
        success: function () {
          // console.log("success");
        }
      })
    },
    hideResult() {
      this.isShowResult = false
    },
    makeCellwx(item) {
      this.qr_code = item.qr_code
      this.isShowResult = true
      this.$client.pushEventNew(10, {}) // 埋点-添加企业微信
    },
    // 关闭分享弹框
    infoClose() {
      this.isShowReporting = false
    },
    login() {
      this.$client.pushWindow('/pkPublic/login/login', { redirect: true })
    },
    traffic(item) {
      if (this.isLogin) {
        itemClick(item)
      } else {
        this.$client.toast('请先登录')
        setTimeout(() => {
          this.login('go')
        }, 300)
      }
    },
    clickPrevent() {},

    // 打开分享弹框
    async showShare() {
      // 检查是否已经完善了信息
      let us = await this.getUserDataState()
      if (us) return

      if (this.poster) {
        this.isShowShare = true
      }
      // // 已实名认证
      // if (this.userDataState) {
      // }
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
    // 获取用户信息
    async getUser() {
      // 获取用户信息
      const $this = this
      let data = await this.$client.getUserInfo()
      data.phone = data.phone
        ? data.phone.slice(0, 3) + '****' + data.phone.slice(data.phone.length - 4)
        : ''
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
      if (data.avatarUrl && data.avatarUrl.indexOf('http://tmp') == -1) {
        uni.downloadFile({
          url: img,
          success: (res) => {
            // console.log('当前用户头像获取',res)
            $this.userInfo.avatarUrl = res.tempFilePath
          }
        })
      }
    },
    //获取背景图
    getBack() {
      const $this = this
      let url =
        this.homeSlide.visual_info.effect_pics[0] ||
        'https://digital-dev-1306790816.cos.ap-guangzhou.myqcloud.com/img/aa.png'
      uni.downloadFile({
        url,
        success: (res) => {
          $this.back = res.tempFilePath
          // console.log('背景图下载成功', $this.back)
          $this.getQrcode()
        },
        fail() {
          console.error('背景图片获取失败')
        }
      })
    },
    // 获取二维码
    async getQrcode() {
      // 获取二维码
      let { uid } = this.$store.state.userInfo // 用户id
      let channelId = '8803' // 渠道id
      let id = this.project_id

      let { data } = await this.$client.rpc(this.$api.SET_SCENE, {
        scene: `8_${uid}_${id}_${channelId}`
      })

      let scene = data.data.id
      var qrcode = await this.$client.rpc(this.$api.CREATE_WXQRCODE, {
        // page: "pages/launch/index", // 开发需要注释掉
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
          // console.log(codeimg, '1111111222222222222222222222')
          $this.qrcode = codeimg
          $this.canvasInit()
        },
        fail() {
          console.error('二维码获取失败')
        }
      })
    },
    // 分享楼盘弹框隐藏
    shareHide() {
      this.isShowShare = false
    },
    // 分享优惠券隐藏
    couponShareHide() {
      this.showCouponShare = false
    },
    // canvas 初始化
    canvasInit() {
      const _this = this
      this.$nextTick(async () => {
        let { ctx, toPx } = _this

        // 画笔使用 xy轴变量
        let canvas_w = await toPx(670),
          canvas_h = await toPx(950),
          _18 = await toPx(18),
          _20 = await toPx(20),
          _24 = await toPx(24),
          _28 = await toPx(28.8),
          _30 = await toPx(30),
          _32 = await toPx(32),
          _40 = await toPx(40),
          _46 = await toPx(46),
          _48 = await toPx(48),
          _50 = await toPx(50),
          _57 = await toPx(57.6),
          _68 = await toPx(68.8),
          _76 = await toPx(76.8),
          _80 = await toPx(80),
          _82 = await toPx(82),
          _116 = await toPx(116),
          _140 = await toPx(140),
          _150 = await toPx(150),
          _156 = await toPx(156),
          _250 = await toPx(250),
          _354 = await toPx(354),
          _522 = await toPx(522),
          _530 = await toPx(530),
          _568 = await toPx(568),
          _600 = await toPx(600),
          _610 = await toPx(610),
          _612 = await toPx(612),
          _630 = await toPx(630),
          _658 = await toPx(658),
          _660 = await toPx(660),
          _705 = await toPx(705),
          _708 = await toPx(708),
          _774 = await toPx(774),
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
        ctx.arc(_68, _76, _28, 0, 2 * Math.PI)
        ctx.clip()
        ctx.drawImage(_this.userInfo.avatarUrl, _40, _48, _57, _57)
        ctx.restore()

        // 绘制用户信息
        ctx.setTextBaseline('top')
        ctx.setTextAlign('left')
        ctx.fillStyle = '#666666'
        ctx.setFontSize(_24)
        ctx.fillText(_this.userInfo.name || '', _116, _46)
        ctx.setFontSize(_18)
        ctx.fillText(_this.userInfo.phone, _116, _82)

        // 绘制用户宣传语
        // ctx.setFontSize(_20)
        // ctx.fillText('邀您一起加入奥园云，分享好房，分享好物，', _250, _50)
        // ctx.fillText('0元创收', _250, _80)

        // 绘制banner
        ctx.drawImage(_this.back, _20, _150, _630, _354)

        // 绘制楼盘文案
        ctx.setFontSize(_32)
        ctx.setTextAlign('left')
        ctx.fillStyle = '#000000'
        let detailText = _this.homeSlide.base_info.project_name || ''
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
              ctx.fillText(str, _20, _530)
              // console.log('当前截取', ctx.measureText(str).width)
            }
          }
          // 绘制第二行
          let twoText = detailText.slice(siliceI, siliceI + 6) + '...'
          ctx.fillText(twoText, _20, _568)
        } else {
          ctx.fillText(detailText, _20, _522)
        }

        // 绘制lable
        ctx.setFontSize(_24)
        ctx.setTextAlign('left')
        ctx.fillStyle = '#333333'
        ctx.fillText('参考均价', _30, _612)
        ctx.fillText('产品类型', _30, _660)
        ctx.fillText('楼盘地址', _30, _708)
        // 绘制右侧参数
        ctx.setFontSize(_28)
        let price =
          (_this.homeSlide.base_info.avg_price || '价格待定') +
          (_this.homeSlide.base_info.avg_price
            ? _this.homeSlide.base_info.measure_unit
            : '')
        ctx.fillText(price, _156, _610)
        let type = (_this.homeSlide.base_info.product_types || [])
          .map((item) => {
            item = item.name
            return item
          })
          .join('、')
        ctx.fillText(type, _156, _658)
        let address = _this.homeSlide.base_info.project_name
        ctx.fillText(address, _156, _705)

        // 绘制二维码
        ctx.drawImage(_this.qrcode, _30, _774, _140, _140)
        // 绘制右下角文案
        ctx.fillStyle = '#666666'
        ctx.setFontSize(_20)
        ctx.setTextAlign('right')
        ctx.fillText('在奥园云', _630, _860)
        ctx.fillText('人人都是健康生活分享家', _630, _890)

        ctx.draw(false, () => {
          console.log('绘制函数生成打印')
          uni.canvasToTempFilePath({
            canvasId: 'mycanvas_pk_detatil',
            success: (res) => {
              _this.poster = res.tempFilePath
              // console.log('canvasToTempFilePath-success', res)
            },
            fail: (err) => {
              // console.log('canvasToTempFilePath-fail', err)
            }
          })
        })
      })
    },
    // 使用规则说明
    showUseRule(item) {
      if (!this.isShowPopup) {
        this.couponSelect = item
        this.couponSelect.description = this.$client.setEscape(item.description, true)
      }
      this.isShowPopup = !this.isShowPopup
    },
    // 领取优惠券
    async getCoupon(item) {
      if(this.isLoading){
        this.$client.toast('正在加载中')
        return
      }
      this.isLoading = true
      try {
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
          this.getCouponList()
          this.$client.pushEvent('COUPON_RECEIVE', item) // 埋点
          this.$client.pushEventNew(8, {}) // 领取购房券（报备）
        }
        this.isLoading = false
      } catch (error) {
        this.isLoading = false
      }
    },
    // 去使用优惠券
    toUseCoupon(item) {
      this.$client.pushWindow(
        '/pkCoupon/detail/index?id=' + item.id + '&isShowQRCode=' + true
      )
    },
    // 分享优惠券分享点击
    shareCoupon(item) {
      const _this = this
      let { imgUrl: url, id } = item
      _this.couponSelect = item
      _this.couponShareData.bId = item.id
      console.log('当前图片资源', url)
      // 装载图片资源
      uni.downloadFile({
        url: url || 'http://img.asset/coupon-bg-default.png',
        success: async (res) => {
          console.log('优惠券背景图下载成功')
          _this.couponBack = res.tempFilePath
          // 优惠券背景图下载成功，开始下载二维码
          const { uid } = _this.$store.state.userInfo // 用户id
          const channelId = '0' // 渠道id

          let { data } = await _this.$client.rpc(this.$api.SET_SCENE, {
            scene: `6_${uid}_${id}_${channelId}`
          })
          let scene = data.data.id
          var qrcode = await _this.$client.rpc(this.$api.CREATE_WXQRCODE, {
            // page: "pages/launch/index", // 开发需要注释掉
            scene
          })
          //将base64图片转网络图片
          const fs = wx.getFileSystemManager()
          var times = new Date().getTime()
          var codeimg = wx.env.USER_DATA_PATH + '/' + times + '.png'
          fs.writeFile({
            filePath: codeimg,
            data: `data:image/png;base64,${qrcode.data.data.base64}`.slice(22),
            encoding: 'base64',
            success: () => {
              _this.couponQrcode = codeimg
              _this.couponInit()
            },
            fail() {
              console.error('二维码获取失败')
            }
          })
        },
        fail() {
          console.error('背景图片获取失败')
        }
      })
    },
    // 优惠卷分享绘制
    couponInit() {
      const _this = this
      this.$nextTick(async () => {
        let { couponCtx: ctx, toPx } = _this
        // 画笔使用 xy轴变量
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
        ctx.drawImage(_this.couponBack, _20, _112, _630, _354)

        // 绘制优惠卷详情文案
        ctx.setFontSize(_32)
        ctx.setTextAlign('left')
        ctx.fillStyle = '#000000'
        let detailText = _this.couponSelect.name || ''
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
          (this.unitConvert(_this.couponSelect.amount).num || '*') +
          (_this.couponSelect.couponType == '2'
            ? '折'
            : this.unitConvert(_this.couponSelect.amount).unit)
        ctx.fillText(money || '', _44, _600)
        var money_w = ctx.measureText(money).width
        ctx.fillStyle = '#333333'
        ctx.setFontSize(_28)
        if (!_this.couponSelect.minPoint) {
          ctx.fillText('无门槛', _64 + money_w, _602)
        } else {
          ctx.fillText(
            `满${this.unitConvert(_this.couponSelect.minPoint).num}${
              this.unitConvert(_this.couponSelect.minPoint).unit
            }起可用`,
            _64 + money_w,
            _602
          )
        }

        // 绘制二维码
        ctx.drawImage(_this.couponQrcode, _20, _680, _140, _140)

        // 绘制右下角文案
        ctx.fillStyle = '#666666'
        ctx.setFontSize(_20)
        ctx.setTextAlign('right')
        ctx.fillText('在奥园云', _630, _760)
        ctx.fillText('人人都是健康生活分享家', _630, _790)

        ctx.draw(false, () => {
          // console.log('绘制函数生成打印', _this.couponSelect.minPoint)
          uni.canvasToTempFilePath({
            canvasId: 'mycanvas_pk_coupon',
            success: (res) => {
              _this.couponPoster = res.tempFilePath
              _this.showCouponShare = true
              // console.log('canvasToTempFilePath-success', res)
            },
            fail: (err) => {
              console.log('canvasToTempFilePath-fail', err)
            }
          })
        })
      })
    },
    // 返回买房页面
    backList() {
      this.$client.pushWindow('/pages/pkBuilding/index', {}, { reLaunch: true })
    },
    // 顶部图片轮播触发
    swiperChange(e) {
      this.swiperCur = e.detail.current
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage
}
</script>

<style lang="scss" scoped>
.page {
  padding-bottom: 150px;
  width: 100vw;
  overflow: hidden;
}
.group1 {
  width: 100%;
  height: 100%;
}

// 置业顾问
.consultant {
  padding: 25px;
  padding-bottom: 0;
  color: #333;
  .title {
    font-weight: 600;
    margin-bottom: 8px;
  }
  .content {
    display: flex;
    align-items: center;
    .cell {
      flex: 1;
    }
    .tel {
      width: 50px;
      height: 50px;
      align-items: center;
      justify-content: center;
      display: flex;
    }
  }
}
.detail-House-type {
  margin-top: 20px;
  padding: 25px;
  /* width: 345px; */
  height: 256px;
  background: #ffffff;
  box-shadow: 0px 1px 6px 0px rgba(0, 0, 0, 0.07);
  border-radius: 10px;
}
.detail-Hose-title {
  font-weight: 900;
  font-size: 14px;
}
.swiper-item-background {
  height: 146px;
  width: 197px;
  margin-right: 10px;
}
.project-News {
  margin-top: 20px;
  /* width: 345px; */
  height: 320px;
  background: #ffffff;
  box-shadow: 0px 1px 6px 0px rgba(0, 0, 0, 0.07);
  border-radius: 10px;
  padding: 25px;
}
.project-News-top {
  padding: 0 10px;
  display: flex;
  justify-content: space-between;
}
.project-title {
  font-size: 14px;
  color: #000000;
  font-weight: 900;
}
.project-Representations {
  font-size: 14px;
  color: #333333;
  // display: -webkit-box;
  // -webkit-box-orient: vertical;
  // -webkit-line-clamp: 4;
  // overflow: hidden;
  // overflow: auto;
}
.project-highlights {
  padding: 15px;
}
.project-highlights-title {
  margin-left: 25px;
  margin-top: 10px;
  color: #000000;
  font-size: 14px;
  font-weight: 900;
}
.project-Location {
  margin-top: 12px;
  padding: 15px;
  margin-bottom: 110px;
  /* width: 345px; */
  height: 205px;
  background: #ffffff;
  box-shadow: 0px 1px 6px 0px rgba(0, 0, 0, 0.07);
  border-radius: 10px;
}
.project-Location-top {
  display: flex;
  justify-content: space-between;
}
.project-Location-title {
  font-size: 14px;
  color: #333333;
  font-weight: 900;
  margin-left: 13px;
}
.project--Location-title-more {
  font-size: 12px;
  color: #999999;
}
.footer {
  /* width: 375px; */
  height: 100px;
  background: #ffffff;
  box-shadow: 0px -1px 6px 0px rgba(0, 0, 0, 0.07);
  justify-content: space-between;
  display: flex;
  position: fixed;
  left: 0px;
  bottom: 0px;
  width: 100%;
  background-color: #fff;
  z-index: 50;
}
.Recommended-customers {
  width: 150px;
  height: 50px;
  background: #f0c17b;
  border-radius: 25px;
  text-align: center;
  line-height: 50px;
  color: #fff;
  font-size: 16px;
  margin-right: 15px;
  margin-top: 10px;
}
.call-Phone {
  width: 150px;
  height: 50px;
  background: #3c4871;
  border-radius: 25px;
  text-align: center;
  line-height: 50px;
  color: #fff;
  font-size: 16px;
  margin-left: 15px;
  margin-top: 10px;
}
.hose-explain-top {
  width: 100%;
}
.type {
  display: inline-block;
  width: 30px;
  height: 17px;
  background: #f0c17b;
  text-align: center;
  border-radius: 5px;
  color: #ffff;
  font-size: 10px;
  margin-left: 5px;
}
.type1 {
  background: #f0c17b;
}
.type2 {
  background: #ededed;
}
.type3 {
  background: #3c4871;
}
.main10_map {
  height: 150px;
  width: auto;
}
.introduce_swiper {
  display: flex;
  justify-content: space-around;
  width: 345px;
  height: 256px;
  background: #ffffff;
  box-shadow: 0px 1px 6px 0px rgba(0, 0, 0, 0.07);
  border-radius: 10px;
  margin-top: 20px;
  margin-left: 15px;
  overflow-x: auto;
}

.end-title {
  position: absolute;
  height: 23px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 13px;
  top: 173px;
  left: 128px;
  display: flex;
  font-size: 14px;
}

.page-section-spacing {
  position: relative;
  .tab-tilte {
    position: absolute;
    bottom: 10px;
    left: 50%;
    transform: translate(-50%);
    height: 23px;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 13px;
    display: flex;
    justify-content: space-around;
    color: #ffff;
    line-height: 23px;
    font-size: 10px;
    li {
      padding: 0 10px;
    }
    .active {
      width: 44px;
      height: 23px;
      background: linear-gradient(297deg, #f0c17b 0%, #fadbad 100%);
      border-radius: 11px;
      text-align: center;
    }
  }
  .img_current {
    position: absolute;
    bottom: 10px;
    right: 20px;
    color: #fff;
    font-size: 12px;
    line-height: 23px;
  }
}

.detail_info {
  padding: 15px 25px 20px;
  .info_title {
    display: flex;
    align-items: flex-end;
    padding-bottom: 15px;
    div {
      flex: 1;
      font-size: 18px;
      color: #000;
      font-weight: 600;
    }
    span {
      text-align: right;
      padding-bottom: 2px;
      font-size: 12px;
      color: #999;
      img {
        width: 15px;
        height: 15px;
        vertical-align: -3px;
      }
    }
  }
  .info_label {
    & > div {
      display: flex;
      align-items: center;
      .label_name {
        font-size: 12px;
        color: #666;
        padding-right: 15px;
      }
      .label_text {
        font-size: 14px;
        color: #333;
      }
      .label_price {
        color: #e20000;
      }
    }
    & > div:nth-child(2) {
      padding: 8px 0;
    }
  }
}
.ystep {
  padding-top: 20px;
}
.Representations {
  padding-top: 10px;
}
.img_banner {
  // height: 210px;
  height: 100%;
  width: 100%;
}
.hose-container {
  width: 100%;
  display: flex;
  flex-direction: row;
  overflow: auto;
}

.end-title .end-title-sub {
  /* flex-grow: 1; */
  text-align: center;
  height: 21px;
  border-radius: 11px;
}

.end-cont {
  display: none;
  background: #c8c7cc;
}

.btna {
  color: #ffffff;
  background: #f0c17b;
}

.dis {
  display: block;
}
/* 项目动态 */
.card-container {
  background-color: #fff;
  border-radius: 20rpx;
  margin: 0 30rpx;
  border-radius: 20rpx;
  padding: 20rpx;
  box-shadow: 0px 1px 6px 0px rgba(0, 0, 0, 0.07);
}
.card_box {
  font-weight: 600;
  margin-top: 10px;
  .title {
    padding-bottom: 10px;
  }
}

.counselor_box {
  padding: 10px 15px 0;
  font-size: 16px;
  .counselor_title {
    color: #333;
    font-weight: 600;
    padding-bottom: 10px;
  }
  .counselor_list {
    .counselor_item {
      display: flex;
      padding-bottom: 15px;
      align-items: center;
      .counselor_head {
        width: 40px;
        height: 40px;
        border-radius: 40px;
      }
      span {
        color: #000;
        display: inline-block;
        padding-left: 10px;
        flex: 1;
      }
      .counselor_phone {
        width: 36px;
        height: 36px;
        margin-left: 10px;
      }
    }
    .counselor_item:nth-last-child(1) {
      padding-bottom: 0;
    }
  }
  .coupon_detail {
    // height: 106px;
    background: linear-gradient(270deg, #f3d6a5 0%, #fdebd0 100%);
    box-shadow: 1px 1px 10px 0px rgba(0, 0, 0, 0.05);
    border-radius: 10px;
    margin-bottom: 10px;
    padding: 10px 10px 0;
    & > div:first-child {
      display: flex;
      justify-content: space-between;
      width: 100%;
      height: 68px;
      border-bottom: 1px solid #f8f8f8;
      padding-bottom: 10px;
      & > div:first-child {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }
      .title {
        min-width: 100px;
        font-size: 14px;
        color: #222222;
        line-height: 19px;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        margin: 0 10px 6px 0;
      }
      .sub_title {
        font-size: 10px;
        color: #222222;
        line-height: 13px;
      }
      .coupon_num {
        flex-shrink: 0;
        font-size: 18px;
        color: #f96464;
        line-height: 25px;
        margin-right: 10px;
      }

      & > div:last-child {
        flex-shrink: 0;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        width: 60px;
        .btn {
          width: 60px;
          height: 18px;
          line-height: 18px;
          border-radius: 10px;
          font-size: 10px;
          text-align: center;
        }
        .get {
          border: 1px solid #fb5d5d;
          color: #fa6464;
        }
        .none {
          color: #ccc;
          border: 1px solid #ccc;
        }
        .have {
          width: 100%;
          text-align: center;
          font-size: 10px;
          color: #ffffff;
          line-height: 13px;
          margin: 5px 0;
        }
        .process_box {
          position: relative;
          width: 100%;
          height: 6px;
          background: #eeeeee;
          border-radius: 3px;
          overflow: hidden;
        }
        .process_num {
          position: absolute;
          top: 0;
          left: 0;
          width: 0;
          height: 6px;
          background: linear-gradient(297deg, #fd9423 0%, #fb5d5d 100%);
          border-radius: 3px;
          transition: all 0.3s;
        }
      }
    }
    & > div:last-child {
      height: 28px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .user_rule {
        display: flex;
        align-items: center;
        font-size: 10px;
        color: #fa6464;
        img {
          width: 10px;
          height: 10px;
          vertical-align: middle;
          margin-left: 5px;
        }
      }
      .share_btn {
        width: 60px;
        height: 18px;
        text-align: center;
        line-height: 18px;
        background: linear-gradient(297deg, #fd9423 0%, #fb5d5d 100%);
        box-shadow: 0px 0px 2px 0px rgba(0, 0, 0, 0.1);
        border-radius: 11px;
        font-size: 10px;
        color: #ffffff;
      }
    }
  }
  .coupon_detail:last-child {
    margin-bottom: 20px;
  }
}
.qrcode_box {
  width: 275px;
  height: 314px;
  background-color: #fff;
  position: relative;
  background-image: url('http://img.asset/qc_bg.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  padding: 43px 47.5px 0;
  box-sizing: border-box;
  border-radius: 20px;
  .qrcode_img {
    width: 180px;
    height: 180px;
  }
  .close {
    width: 20px;
    height: 20px;
    position: absolute;
    bottom: -40px;
    left: 50%;
    transform: translate(-50%);
  }
}
.icon-share {
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 0;
  height: 50px;
  margin-top: 15px;
  margin-left: 15px;
  &::after {
    content: none;
  }
  img {
    width: 20px;
    height: 33px;
  }
}
.canvas_box {
  position: fixed;
  top: 0;
  left: 999px;
  width: 335px;
  height: 475px;
}
.canvas_box2 {
  position: fixed;
  top: 0;
  left: 999px;
  width: 335px;
  height: 422px;
}

.tips_box {
  z-index: 50;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  .tips_inbox {
    border-radius: 10px;
    background-color: #fff;
    text-align: center;
    width: 250px;
    padding: 20px;
    border-radius: 10px;
    position: absolute;
    top: 50%;
    left: 50%;
    color: #333;
    font-size: 18px;
    transform: translate(-50%, -50%);
    background-color: #fff;
    font-weight: 600;
    .tips_text {
      font-weight: 400;
      font-size: 14px;
      color: #666;
      padding: 20px 20px 40px;
    }
    .tips_btn {
      background-color: #f0c17b;
      width: 150px;
      height: 35px;
      border-radius: 35px;
      line-height: 35px;
      text-align: center;
      font-size: 14px;
      color: #fff;
      margin: 0 auto;
    }
  }
}
.tips_inbox {
  border-radius: 10px;
  background-color: #fff;
  text-align: center;
  width: 250px;
  padding: 20px;
  border-radius: 10px;
  position: absolute;
  top: 50%;
  left: 50%;
  color: #333;
  font-size: 18px;
  transform: translate(-50%, -50%);
  background-color: #fff;
  font-weight: 600;
  .tips_text {
    font-weight: 400;
    font-size: 14px;
    color: #666;
    padding: 20px 20px 40px;
  }
  .tips_btn {
    background-color: #f0c17b;
    width: 150px;
    height: 35px;
    border-radius: 35px;
    line-height: 35px;
    text-align: center;
    font-size: 14px;
    color: #fff;
    margin: 0 auto;
  }
}
// 使用规则提示框
.popup-container {
  background-color: #fff;
  border-radius: 10px;
  width: 300px;
  height: 350px;
  display: flex;
  flex-direction: column;
  padding: 20px;
  .title {
    display: flex;
    justify-content: space-between;
    font-size: 16px;
    font-weight: 600;
    padding-bottom: 20px;
    .close {
      color: #d8d8d8;
    }
  }
  .content {
    height: 240px;
    color: #666;
    font-size: 12px;
    p {
      line-height: 1.8em;
      margin-bottom: 10px;
    }
  }
  .confirmBtn {
    width: 160px;
    height: 50px;
    line-height: 50px;
    text-align: center;
    border-radius: 25px;
    color: #fff;
    background: #f0c17b;
    margin: 20px auto 0;
  }
}
</style>
