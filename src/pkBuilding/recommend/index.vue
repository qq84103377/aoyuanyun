<!--
 * @Description: 推荐客户
 * @version: 
 * @Author: gonghonglin
 * @Date: 2021-07-15 14:46:02
 * @LastEditors: gonghonglin
 * @LastEditTime: 2021-10-26 10:13:27
-->
<template>
  <div class="page">
      <u-input title="客户姓名" placeholder="请输入姓名" isRequire maxlength="100" v-model="formData.cstName">
      </u-input>
      <u-input title="客户性别" isRequire type="radio" :option="SEX_OPTION" v-model="formData.cstGender">
      </u-input>
      <u-input title="手机号码" placeholder="请输入手机号码" type="number" maxlength="11" isRequire
        v-model="formData.cstTels"></u-input>
      <u-input title="身份证后6位" placeholder="请输入身份证后6位" maxlength="6" v-model="formData.cstIdNo"></u-input>
      <div class="cell" @click="addProj">
        <div class="title">意向楼盘 <span class="red">*</span></div>
        <div class="proj-list">
          <div class="proj-name" v-for="(item,index) in listSel" :key="index">{{item.projectName}}</div>
          <img class="proj-list-mg" src="http://img.asset/add.png" alt="">
        </div>
      </div>

      <div class="remarks">
        <text>备注:</text>
        <textarea v-model="formData.cstDescription" maxlength="500"></textarea>
      </div>
      <div class="text">
        <text class="text-item1">温馨提示:</text>
        <text class="text-item2">请按项目要求进行提前报备，不可提前到访，否则无效，详情请查询项目详情页</text>
        <text class="text-rule" @click="gotofile(100003)">《推荐须知》</text>
      </div>
      <button class="sumit" @click="createCustomer">推荐客户</button>

    <!-- 活动规则 -->
    <!-- <UPopup v-model="isShowRule" type="center">
      <div class="pop-rule">
        <div class="title">《推荐须知》</div>
        <div class="content">
           <RuleContent></RuleContent>
        </div>
        <div class="footer">
          <div class="btn" @click="isShowRule = false">关闭</div>
        </div>
      </div>
    </UPopup> -->

    <!-- 成功 -->
    <UPopup v-model="isShowResult" @input="onClose" type="center">
      <div class="card-succcess" @click="onClose">
        <!-- <img class="close" @click="onClose" src="@/static/icon-close.png" /> -->
        <img class="img" src="http://img.asset/recommend-result-success.png" alt="">
      </div>
    </UPopup>
    <u-popup v-model="isShowUserInfoTips" type="center">
      <div class="tips_inbox">
        <div>温馨提示</div>
        <div class="tips_text">您还未完善个人信息<span v-if="stateTips">({{stateTips}})</span>，完善后即可使用推荐、查看佣金等功能</div>
        <div class="tips_btn" @click.stop="routerUserInfo">立即完善</div>
      </div>
    </u-popup>
  </div>
</template>
<script>
import UCell from "@/components/UCell";
import UInput from "@/components/UInput";
import UButton from "@/components/UButton";
import UPopup from "@/components/UPopup";
import RuleContent from './rule';

export default {
  components: {
    UCell,
    UInput,
    UButton,
    UPopup,
    RuleContent,
  },
  data() {
    return {
      isShowResult: false, //成功结果
      SEX_OPTION: [
        { label: "男", value: 0 },
        { label: "女", value: 1 },
      ],
      formData: {
        cstProjectList: [],//楼盘绑定顾问
        // cstProjName: "", //项目名称
        cstProj: "", //项目
        cstProjs: [],   //楼盘名称，多个
        cstName: "", //客户名称
        cstTels: "", //客户电话
        cstGender: 0, //客户性别
        cstDescription: "", //客户描述
        cstIdNo: "",
      },
      listSel: [],
      isShowRule: false,
      paramProjects: [], // 参数，楼盘对象集
      userDataState: true,
      isShowUserInfoTips: false, // 检测用户信息是否完善
      stateTips: '',
    };
  },
  async onShow() {
    // 检查是否已经完善了信息
    let us = await this.getUserDataState()
    if (us) return

    this.paramProjects = this.$client.getParam();
    console.log(this.paramProjects);
    if (this.paramProjects && this.paramProjects.isShow) {
      this.listSel = this.paramProjects.listSel;
      if (Array.isArray(this.paramProjects.listSel)) {
        this.formData.cstProjs = this.listSel.map(item => item.projectId);
        this.formData.cstProjectList = [];
        this.listSel.forEach(ele => {
          if (ele.cstSaleid) {
            this.formData.cstProjectList.push({ cstCenter: ele.cstSaleid, cstProject: ele.projectId })
          } else {
            this.formData.cstProjectList.push({ cstProject: ele.projectId })
          }
        });
      }
    }
  },

  methods: {
    // 获取用户信息是否完善
    async getUserDataState () { 
      let {data} = await this.$client.rpc(this.$api.VALIDATE_USERINFO);
      this.isShowUserInfoTips = !data.data;
      this.stateTips = data.msg;
      return new Promise((resolve)=>resolve(this.isShowUserInfoTips)) 
    },
    routerUserInfo () {
      this.isShowUserInfoTips = false
      this.$client.pushWindow("/pkMine/personal/index", { hasBackBtn: true });
    },
    routerUserInfo() {
      this.$client.pushWindow("/pkMine/personal/index", { hasBackBtn: true });
    },
    addProj() {
      this.$client.pushWindow('/pkPublic/building-selector/building-selector', this.listSel)
    },
    validate() {
      this.formData.cstName = this.formData.cstName.replace(/(^\s*)|(\s*$)/g, "");
      if (!this.formData.cstName) {
        this.$client.toast('请输入客户姓名')
        return
      }
      let regTel = /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/
      if (!this.formData.cstTels || !regTel.test(this.formData.cstTels)) {
        this.$client.toast('请正确输入手机号')
        return
      }
      if (!Array.isArray(this.listSel)) {
        this.$client.toast('请选择楼盘')
        return
      }
      if (this.formData.cstIdNo && !/(^\d{5}(\d|X|x)$)/.test(this.formData.cstIdNo)) {
        this.$client.toast('请正确输入身份证后六位')
        return
      }

      return true
    },
    // 推荐客户
    async createCustomer() {
      if (!this.validate()) {
        return;
      }
      try {
        console.log('表单数据' + JSON.stringify(this.formData))
        let { data } = await this.$client.rpc(this.$api.CREATE_CUSTOMER, this.formData);
        if (data.success) {
          this.isShowResult = true
        } else {
          this.$client.alert(data.msg ? data.msg : (data.extParams.msg || "推荐失败"));
        }
        this.$client.pushEventNew(9,{}); // 9，经纪人主动报备
      } catch (error) {
         this.$client.alert("推荐失败，请稍后再试");
        // console.log(error)
      }
    },
    onClose() {
      // 用户点击关闭按钮，返回上一页
      this.isShowResult = false;
      this.$client.pushEvent('RECOMMEND', {
        cstProj: this.formData.cstProj, //项目
        cstProjs: this.listSel.map(item => item.projectName),   //楼盘名称，多个
        cstName: this.formData.cstName, //客户名称
      }) // 埋点
      this.$client.back()
    },
    gotofile(num) {
      this.$client.pushWindow('/pkPublic/login/file', { code: num });

    }
  },
};
</script>
<style lang="scss">
@import "./style.scss";
</style>