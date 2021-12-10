<!--
 * @Description: 
 * @version: 
 * @Author: gonghonglin
 * @Date: 2021-09-09 16:48:09
 * @LastEditors: gonghonglin
 * @LastEditTime: 2021-10-26 10:16:00
-->
<template>
  <UPopup v-model="isShow" type="center">
    <div class="card">
      <div class="close" @click="close">
        <img class="icon-x" src="@/static/icon-x.png" />
      </div>
      <div class="content">
        <div class="input-group">
          <div class="label">姓　　名</div>
          <div class="input input-name">
            <input type="text" v-model="userName" maxlength="20" :class="{'is-editting': isEditting}" @focus="isEditting=true" @blur="isEditting=false" class="text-box">
            <img class="icon-edit" v-if="!isEditting" src="@/static/icon-edit.png" />
            <img class="icon-edit" v-else src="@/static/icon-edit-off.png" />
          </div>
        </div>
        <div class="input-group">
          <div class="label">联系电话</div>
          <div class="input">
            <div>{{userPhone}}</div>
          </div>
        </div>
        <div class="input-group" @click="addProj">
          <div class="label">意向楼盘</div>
          <div class="input build-list">
            <div class="build-item" v-for="(item,index) in sceneProjectList" :key="index">
              {{item.projectName}}
            </div>
            <div class="btn-add" v-if="!isLockProj">
              <img class="icon-add" src="@/static/icon-add.png" />
            </div>
          </div>
        </div>
      </div>
      <div class="footer">
        <div class="agreement" @click="isChecked = !isChecked">
          <div class="check_btn">
            <img v-if="isChecked" src="http://img.asset/selected_icon.png" alt="">
          </div>
          <div class="text">我已阅读并同意<span class="text-danger" @click.stop="gotofile(100001)">《奥园云用户服务协议》</span></div>
        </div>
        <div class="btn-submit" :class="{disabled: !isReady}" @click="submit">我感兴趣</div>
        <div class="btn-text" @click="skip">跳过</div>
      </div>
    </div>
  </UPopup>
</template>

<script>
import UPopup from '@/components/UPopup';
export default {
  props: {
    sceneBrokerId: {
      type: String,
      default: ''
    },
    sceneProjectList: {
      type: Array,
      default: []
    },
    // 楼盘列表，只能在这个列表中选择，如果没有，则全部楼盘
    couponInfo: {
      type: Object,
      default: null
    },
    isLockProj: {
      type: Boolean,
      default: false
    },
    visabled:{
      type: Boolean,
      default: false
    }
  },
  components: {
    UPopup
  },

  data() {
    return {
      isShow: true,
      isChecked: false,
      isEditting: false,
      userName: '',
      userPhone: '',
      userSex: 1,
      buildList: [],
      paramProjects:[],
      cstProjectList:[],
    }
  },
  async mounted(){
    this.userName = this.$store.state.userInfo.name
    this.userPhone = this.$store.state.userInfo.phone
  },
  watch:{
    visabled:{
      handler(nv,ol){
        this.isShow = nv
        if(nv){
          this.userName = this.$store.state.userInfo.name
          this.userPhone = this.$store.state.userInfo.phone
        }
      },
      immediate:true
    }
  },
  computed:{ 
    isReady(){
      return this.isChecked && this.userName && this.sceneProjectList.length
    }
  },
  methods: {
    async refreshData(){
      this.userName = this.$store.state.userInfo.name
      this.userPhone = this.$store.state.userInfo.phone
      this.userSex = this.$store.state.userInfo.sex || 1
      console.log('EReporting--refresh',this.userName,this.userPhone);
    },
    gotofile(num){
       this.$client.pushWindow('/pkPublic/login/file', {code: num});
    },
    close() {
      this.isShow = false;
      this.$emit('close');
    },
    skip() {
      // this.isShow = false;
      // this.$emit('skip');
      this.$emit('onClose')

    },
    addProj(){
      if(this.isLockProj) return
      if(this.couponInfo){
        this.$client.pushWindow('/pkPublic/building-selector/building-selector?couponId='+this.couponInfo.id, this.sceneProjectList)
      }else{
        this.$client.pushWindow('/pkPublic/building-selector/building-selector', this.sceneProjectList)
      }
    },
    // 外部调用显示
    showWindow(){

    },
    async submit(autorun=false) {
      // this.refreshData();
      //自动报备处理 - 有优惠券id传入才能触发
      if(this.couponInfo && this.couponInfo.id && autorun){
        this.isChecked = true;
        // 如果没有名字，或者 超过3 个楼盘，需要弹出确认框
        if(!this.userName || !([1,2,3].includes(this.sceneProjectList.length))){
          this.isShow = true
          return
        }

      }

      // #region 检查必填参数
      if(!this.isChecked){
        this.$client.alert('请先勾选用户协议')
        return
      }
      if(!this.userName){
        this.$client.alert('请填写姓名')
        return
      }
      if(!this.sceneProjectList.length){
        this.$client.alert('请选择意向楼盘')
        return
      }
      // #endregion

      try {
        let param = {
          "brokerId": this.sceneBrokerId, //推荐人ID
          // "cstDescription": "string",
          "cstGender": this.userSex,  // 性别
          "cstName": this.userName,  //姓名
          // "cstProj": "string",
          "cstTels": this.userPhone, // 手机号
          "cstProjectList": [
            // {
            //   "cstCenter": "string",
            //   "cstProject": "string" // 项目ID
            // }
          ],
        }
		    console.log('表单数据'+JSON.stringify(param))

        for (const item of this.sceneProjectList) {
          param.cstProjectList.push({
            cstProject: item.projectId,
            cstCenter: item.cstSaleid
          })
        }
        // 静默模式处理本次请求，不提示弹框 silent:true
        let {data} = await this.$client.rpc(this.$api.CREATE_CUSTOMER_AI, param,{silent:true});
        if(data.success){
          console.log('自动报备成功')
        }else{
          console.error(data.msg ? data.msg: (data.extParams.msg || "报备失败"));
        }
      } catch (error) {
        console.log('自动报备 error')
      }
      this.$emit('onClose')
      this.isShow = false;
      this.$emit('getUserInfo');
      console.log('报备完成')
      this.$client.pushEventNew(25,{}); //25，自主报备--感兴趣楼盘自动报备
    },
    check(evt) {
    }
  }
}
</script>

<style lang="scss" scoped>
@import "./style.scss";

</style>
