<!--
 * @Description: 个人资料，我的资料
 * @version: 
 * @Author: gonghonglin
 * @Date: 2021-07-01 11:43:29
 * @LastEditors: gonghonglin
 * @LastEditTime: 2021-10-29 11:08:56
-->
<template>
  <div class="page">
    <template v-if="!isShowCropper">
      <div class="avatar">
        <div class="title">头像</div>
        <img class="img" @click="changeAvatar" :src="formData.avatarUrl || 'https://img04.aomygod.com/fontend/202179/imgs/user_attr.png'" alt="" />
      </div>

      <template v-if="formData.verifiedStatus">
        <div class="required_box">
          <span class="required required1">*</span>
          <u-cell title="姓名" v-model="formData.name" valueColor="#ccc">
            <template slot="icon-after">
              <div style="color: #ccc;">已认证</div>
            </template>
          </u-cell>
        </div>
      </template>
      <template v-else>
        <div class="required_box">
          <span class="required required1">*</span>
          <u-input title="姓名" placeholder="请填写身份证一致的姓名" v-model="formData.name" 
            @onFocus="backupField(formData.name)" @onBlur="validite('NAME', formData.name)">
            <template slot="right">
              <div style="color: #F0C17B;font-size:12px;" v-if="formData.name" @click="singerReal">去认证</div>
            </template>
          </u-input>
        </div>
      </template>
      <div class="required_box">
          <span class="required required2">*</span>
          <u-cell title="手机号码" placeholder="请输入手机号码" valueColor="#ccc" require v-model="formData.phone"></u-cell>
      </div>

      <u-cell title="性别" :valueColor="formData.verifiedStatus!=0 ? '#ccc' : ''" v-model="formData.sex" :options="SEX" @onChange="validite('SEX', formData.sex)" 
          :isLink="formData.verifiedStatus==0">
      </u-cell>

      <template v-if="formData.verifiedStatus">
        <u-cell title="证件类型" value="身份证":valueColor="formData.verifiedStatus!=0 ? '#ccc' : ''" ></u-cell>
        <div class="required_box">
          <u-cell title="证件号码" valueColor="#ccc" v-model="formData.certificateNumber"></u-cell>
        </div>
      </template>
      <template v-else>
        <u-cell title="证件类型" value="身份证" ></u-cell>
        <!-- <u-cell title="证件类型" v-model="formData.certificateType" :options="CertType" isLink></u-cell> -->
        <div class="required_box">
          <u-input title="证件号码" placeholder="请输入身份证" v-model="formData.certificateNumber"
          @onFocus="backupField(formData.certificateNumber)"
          @onBlur="validite('CERT', formData.certificateNumber)"></u-input>
        </div>
      </template>
      <u-cell title="出生日期" mode="date" v-model="formData.birthDay" :options="BirthdayFlag"
       @onChange="validite('BIRTH',formData.birthDay)"  :isLink="formData.verifiedStatus==0" :valueColor="formData.verifiedStatus!=0 ? '#ccc' : ''"></u-cell>
      <u-input title="邮箱" placeholder="请输入邮箱" v-model="formData.email" @onFocus="backupField(formData.email)"
        @onBlur="validite('EMAIL', formData.email)"></u-input>
      <u-cell title="联系地址" v-model="formData.curAddress.addrAll" @clickHandler="changeAddress" isLink>
      </u-cell>
    </template>
    <div class="ctrl-bar">
      <div class="btn-back" @click="back">确定</div>
    </div>
    <we-cropper :src="tmpAvatar" @confirm="onConfirm"></we-cropper>
    <!-- <UPopup v-model="isShow" type="bottom">
      <div style="background: #fff;height: 50vh">
        1111111111
      </div>
    </UPopup> -->
  </div>
</template>

<script>
import UCell from "@/components/UCell";
import UInput from "@/components/UInput";
import UPopup from '@/components/UPopup';
// const COS = require('cos-wx-sdk-v5');
import COS from 'cos-wx-sdk-v5';
export default {
  components: {
    UCell,
    UInput,
    UPopup
  },
  props: {},
  data() {
    return {
      isShow: true,
      SEX: [
        { label: "男", value: "1" },
        { label: "女", value: "2" },
      ],
      formData: {
        avatarUrl: "", //用户头像
        name: "", //用户姓名
        nickName: "", //昵称
        phone: "", //客户电话
        sex: "", //客户性别
        cert: "", //身份证
        birthDay: "", //生日
        email: "", //邮箱
        area: [],
        addressVos: [],
        curAddress: {
          area: [],
          address: "",
          city: "",
          country: "",
          id: "",
          isDefault: null,
          province: "",
        },
        certificateVos: [],
        certType: "", //证件类型
        certTypeName: "",

        // ui显示
        certificateId: "",
        certificateNumber: "",
        certificateType: "",
        verifiedStatus: 0,  // 是否已经实名认证
        platform: "2",          // 1-APP，2-小程序  平台
        distributionStatus: 1, // 是否可以分销
        createCity: "",         // 创建的城市
      },
      backupData: "",

      CertType: [],

      BirthdayFlag: {
        startYear: 1960,
        endYear: 2021
      },
      isReady: false,
      tmpAvatar: "",
      isShowCropper: false,
      showTips: '',
      hasBackBtn: false,//是否有返回按钮
      cos: null,
      config: {
        Bucket: 'digital-dev-1306790816', /* 必须 */
        Region: 'ap-guangzhou',     /* 存储桶所在地域，必须字段 */
      }

    };
  },
  onLoad(option) { },
  async mounted() {
    let params = this.$client.getParam()
    if (params && params.showTips) {
      this.showTips = params.showTips;
    }
    if (params && params.hasBackBtn) {
      this.hasBackBtn = params.hasBackBtn;
    }
    // await this.getCertType(); // 获取证件类型
    this.getUserInfo(); // 获取用户信息

    // 初始化cos
    this.initCOS()

  },
  onShow() {
    // 从地址选择回来，获取参数
    let param = this.$client.$store.state.pageParam;
    // console.log(param, 'param');
    this.validite('ADDRESS', param)
  },

  methods: {
    initCOS(){
      // url: https://digital-dev-1306790816.cos.ap-guangzhou.myqcloud.com/
      // storeUrl: /home/ay/aoyuan-admin-web/ay-fs/
      // secretId:  AKIDrWx94i7G8j36sNbZGgphHacU5PSEjxua
      // secretKey: QZOwHL8euud4E7i25qLYVBbkcDXaMr52
      // bucketName: digital-dev-1306790816
      // region: ap-guangzhou

      this.cos = new COS({
        SecretId:  'AKIDrWx94i7G8j36sNbZGgphHacU5PSEjxua',
        SecretKey: 'QZOwHL8euud4E7i25qLYVBbkcDXaMr52',
      });
    },
    async singerReal(){
      let rt = await this.$client.singerReal(true);
      console.log('singerReal',rt)
      if(rt){
        this.formData.verifiedStatus = 1
      }
    },
    // 修改头像
    async changeAvatar() {
      let headRes = await this.$client.chooseImage({ count: 1, sizeType: ['compressed'], sourceType: ['album', 'camera'] });
      this.tmpAvatar = headRes.tempFilePaths[0];
      this.isShowCropper = true;
      this.isReady = false
    },
    async onConfirm(evt) {
      console.log(evt)
      this.isShowCropper = false;
      setTimeout(() => {
        this.isReady = true
      }, 500);
      if (!evt.detail) {
        return
      }
      let tempFilePath = evt.detail.tempFilePath
      // 压缩头像
      let compressImageRes = await this.$client.compressImage({ src: tempFilePath, quality: 20 });
      console.log('compressImageRes', compressImageRes.tempFilePath)

      
      // 调用上传接口-上传头像
      uni.showLoading({ title: '正在上传...' });
      let param = {
        Bucket: this.config.Bucket,
        Region: this.config.Region,
        Key: "/img/" + this.$client.getRandFileName(compressImageRes.tempFilePath),
        FilePath: compressImageRes.tempFilePath,
      }
      console.log(param)
      this.cos.postObject(param, (err, data) => {
        console.log(44444, err, data)
        uni.hideLoading();
        let avatarUrl = '//'+data.Location
        if (data && avatarUrl) {
          wx.showToast({ title: '上传成功', icon: 'success', duration: 2000 });
          this.$client.setUserInfo({ avatarUrl});
          this.formData.avatarUrl = avatarUrl;
          this.updateField('AVATAR', { avatarUrl });
        } else {
          console.log(err)
          this.$client.alert('上传失败')
        }
      });

    },
    async getUserInfo() {
      // 获取用户头像
      let userInfo = await this.$client.getUserInfo()
      this.formData = Object.assign(this.formData, userInfo);
      try {
        // let { data } = await this.$client.rpc(this.$api.GET_USER_INFO);
        // if (!data.data.birthDay) { // 第一次给个默认事件
        //   var today = new Date();
        //   var date = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
        //   data.data.birthDay = date;
        // }
        // data.data.verifiedStatus = 1
        // this.$set(this, "formData", Object.assign(this.formData, data.data));
        setTimeout(() => {
          this.isReady = true
        }, 600);
        // 展开地址数据
        if (this.formData.addressVos.length) {
          // console.log(this.formData.addressVos)
          this.formData.curAddress = Object.assign(this.formData.curAddress, {
            ...this.formData.addressVos[0]
          })
          // 合并地址显示用
          this.formData.curAddress.addrAll = this.formData.curAddress.city + this.formData.curAddress.address
        }
        console.log(this.formData)
        // 查找默认证件数据
        for (const item of this.formData.certificateVos) {
          if (item.isDefault) {
            let { certificateId, certificateNumber, certificateType } = item;
            this.$set(this.formData, "certificateId", certificateId);
            this.$set(this.formData, "certificateNumber", certificateNumber);
            this.$set(this.formData, "certificateType", certificateType);
          }
        }
        // 如果没有头像，则跳其用户授权拿头像
        // console.log(!this.formData.avatarUrl)
        if (!this.formData.avatarUrl) {
          this.getUserProfile()
        }
      } catch (error) {
        // console.log(error)
      }


    },
    // 获取证件类型
    async getCertType() {
      // try {
      //   let { data } = await this.$client.rpc(this.$api.GET_CERT_TYPE);
      //   if (!data.data || data.data.length == 0) {
      //     this.$client.alert("获取证件类型失败");
      //     return;
      //   }
      //   for (const item of data.data) {
      //     this.CertType.push({
      //       label: item.name,
      //       value: item.type.toString(),
      //     });
      //   }
      // } catch (error) { }
    },
    // 备份字段值
    backupField(data) {
      this.backupData = data;
    },
    // 更新指定字段
    async updateField(field, data) {
      console.log("updateField", field, data);
      let fields = ["AVATAR", "ADDRESS", "BIRTH", "CERT", "EMAIL", "SEX", "NAME", "NICK_NAME"];
      if (!fields.includes(field)) {
        console.error("not in fields", field);
        return;
      }
      if(field=="BIRTH"){
        data.birthDay = data.birthDay + ' 11:11:11'
      }

      try {
        let res = await this.$client.rpc(this.$api["UPDATE_" + field], data);
        // console.log(res);
        if(res.data.success){
          // 更新成功了，配合更新出生日期，性别
          if(field=="CERT"){
            let rt = this.getBirthSexById(data.certificateNumber)
            if(this.formData.birthDay != rt.birth){
              this.formData.birthDay = rt.birth
            }
            if(this.formData.sex != rt.sex){
              this.formData.sex = rt.sex
            }
          }
          this.$client.toast("更新成功");
          this.$client.getUserInfo("",true)
        }
      } catch (error) {
        // console.log(error);
        // this.$client.toast("更新失败:" + field);
      }
    },
    // 获取身份证的生日，性别
    getBirthSexById(idNo){
      let y,m,d,sex
      if(idNo.length==15){
        y = '19'+idNo.substr(6,2)
        m = idNo.substr(8,2)
        d = idNo.substr(10,2)
        sex = (+idNo.substr(13,1))%2==0 ? 2 : 1
      }else{
        y = idNo.substr(6,4)
        m = idNo.substr(10,2)
        d = idNo.substr(12,2)
        sex = (+idNo.substr(16,1))%2==0 ? 2 : 1
      }
      return {
        // 生日需要特殊处理，加入时间，不然黄裕平的数据库存储有问题！
        birth: `${y}-${m}-${d} 11:11:11`,
        sex
      }
    },
    // 验证
    async validite(field, data) {
      if (!data || !this.isReady || data === this.backupData) {
        return;
      }
      switch (field) {
        case "NAME":
          if (
            /^[\u4e00-\u9fa5]{1,6}(·[\u4e00-\u9fa5]{1,6}){0,2}$/.test(data) ==
            false
          ) {
            this.$client.alert("请正确输入姓名，必须与身份证一致");
            return;
          } else {
            // let rt = await this.$client.alert({
            //   title: "操作提示",
            //   content: "请确保与身份证一致",
            //   showCancel: true,
            // });
            // console.log(rt)
            // if (rt) {
              this.updateField(field, { name: data });
            // } else {
            //   this.formData.name = this.backupData;
            // }
          }
          break;
        case "NICK_NAME":
          this.updateField(field, { nickName: data });
          break;
        case "SEX":
          this.updateField(field, { sex: data });
          this.formData.sex = data;
          break;
        case "EMAIL":
          if (!data) {
            return;
          }
          if (this.isEmail(data) == false) {
            this.$client.alert("请正确输入邮箱");
            return;
          } else {
            this.updateField(field, { email: data });
          }
          break;
        case "CERT":
          if (!data) {
            return;
          }

          if (!this.isIdcard(data)) {
            this.$client.alert("请正确输入身份证号");
            return;
          }
          this.updateField(field, {
            certificateId: this.formData.certificateId,
            certificateNumber: this.formData.certificateNumber,
            certificateType: "1",//只认身份证
            name: this.formData.name,
          });

          break;
        case "BIRTH":
          this.updateField(field, { birthDay: data });
          break;
        case "ADDRESS":
          this.updateField(field, {
            "address": data.address,
            "city": data.area.result,
            "country": "中国",
            "id": this.formData.curAddress.id,
            "province": data.area.value[0] || this.formData.curAddress.province
          });
          this.formData.curAddress.address = data.address
          this.formData.curAddress.area = data.area.value
          this.formData.curAddress.city = data.area.result
          this.formData.curAddress.addrAll = data.area.result + data.address
          // console.log(11122222, data, this.curAddress)
          break;
        default:
          break;
      }
    },
    // 地址修改后触发
    changeAddress() {
      this.$client.pushWindow("/pkMine/personal/address", this.formData.curAddress);
    },
    isEmail(src) {
      return /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(src);
    },
    isIdcard(src) {
      const re15 =
        /^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$/;
      const re18 =
        /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
      return re15.test(src) || re18.test(src);
    },

    //小程序授权api替换 getUserInfo 替换
    getUserProfile() {
      // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
      // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
      let that = this;
      uni.showModal({
        title: '温馨提示',
        content: '申请授权获取你的昵称、头像',
        success(res) {
          // console.log(res)
          //如果用户点击了确定按钮
          if (res.confirm) {
            uni.getUserProfile({
              desc: '获取你的昵称、头像、地区及性别',
              success: res => {
                // console.log(res);
                let { avatarUrl, nickName, gender } = res.userInfo
                // 更新头像
                that.updateField("AVATAR", { avatarUrl })
                that.$set(that.formData, 'avatarUrl', avatarUrl)
                // 更新姓名
                that.updateField("NICK_NAME", { nickName })
                that.$set(that.formData, 'nickName', nickName)
                // 更新性别
                that.updateField("SEX", { sex: gender })
                that.$set(that.formData, 'sex', gender)
                // 更新缓存
                that.$client.setUserInfo({ avatarUrl, name: nickName, sex: gender })
                // 埋点上报
                that.$client.pushEvent('ALLOW_USER_INFO', { status: '成功', data: res.userInfo.nickName })
                that.$client.pushEventNew(6, { status: '成功', data: res.userInfo.nickName })
              },
              fail: res => {
                // console.log(2);
                // console.log(res)
                //拒绝授权
                uni.showToast({
                  title: '您拒绝了授权',
                  icon: 'error',
                  duration: 2000
                });
                that.$client.pushEvent('ALLOW_USER_INFO', { status: '用户拒绝' })
                return;
              }
            });
          } else if (res.cancel) {
            //如果用户点击了取消按钮
            // console.log('用户点击了取消');
            return;
          }
        }
      });
    },
    back(){
      if (!this.formData.name) {
        this.$client.toast('请输入姓名');
        return;
      } else if (!this.formData.phone) {
        this.$client.toast('请输入手机号码');
        return;
      } else {
        this.$client.back();
      }
    },


  },
};
</script>
<style lang="scss" scoped>
@import "./index.scss";
::v-deep .u-cell-content{
	height: auto !important;
	min-height: 50px !important;
}
.required_box {
  position: relative;
  .required {
    position: absolute;
    top: 50%;
    left: 10px;
    transform: translate(0, -40%);
    font-size: 18px;
    color: #e20000;
  }
  .required1 {
    left: 52px;
  }
  .required2 {
    left: 80px;
  }
  .required3 {
    left: 80px;
  }
}
</style>
