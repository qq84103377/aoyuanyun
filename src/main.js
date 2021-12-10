/*
 * @Description: 
 * @version: 
 * @Author: gonghonglin
 * @Date: 2021-06-23 16:34:14
 * @LastEditors: gonghonglin
 * @LastEditTime: 2021-10-12 10:42:30
 */
import Vue from "vue";
import App from "./App";

import UInput from "./components/UInput/index.vue";
import UCell from "./components/UCell/index.vue";
import UTab from "./components/UTab/index.vue";
import UTabItem from "./components/UTab/tab-item.vue";
import UNavbar from "./components/UNavbar/index";
import UPopup from "@/components/UPopup";

import "./scss/theme-default.scss";

import Adapter from "./adapter";

import store from './store';

Vue.component("u-input", UInput);
Vue.component("u-cell", UCell);
Vue.component("u-tab", UTab);
Vue.component("u-tab-item", UTabItem);
Vue.component("UNavbar", UNavbar);
Vue.component("UPopup", UPopup);

Vue.config.productionTip = false;
Vue.filter('safeName',function(val='',nickName=''){
  // console.log(10000,val, nickName)
  if(val){
    // console.log(10001,val)
    return val.slice(0, 1) + '*'.repeat(val.length-1)
  }else{
    // console.log(10002,val)
    return nickName ? nickName : '微信用户'
  }
})
new Adapter(store).create(Vue);

App.mpType = "app";

const app = new Vue({
  store,
  ...App
});
app.$mount();