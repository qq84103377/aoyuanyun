/*
 * @Description: 
 * @version: 
 * @Author: gonghonglin
 * @Date: 2021-07-21 10:19:38
 * @LastEditors: gonghonglin
 * @LastEditTime: 2021-09-08 18:56:23
 */
import Vue from "vue";
import Vuex from "vuex";
import {client} from './adapter';

Vue.use(Vuex);
const store = new Vuex.Store({
    state: {
        // 跳转页面时存储页面参数，
        pageParam: {},
        // 普通缓存数据
        cache: {},
        // 用户相关信息数据
        userInfo: {},
        // 定位
        location: '',
        // 定位经纬度
        locationXY:{},
        // 历史定位
        useCity: [],
        // 首页架子信息
        queryHome: []
    },
    getters: {
        getUserInfo: state => key => key ? state.userInfo[key] : state.userInfo,
        getCache: state => key => key ? state.cache[key] : state.cache,
        getParam: state => {
            return () => state.pageParam
        },
        getQueryHome: state => {
            return () => state.queryHome;
        },
        getTabBarInfo: state => {
            let arry = [];
            for (const item of state.queryHome) {
                let {shelfName,shelfSeq,shelfImg,selectImg,shelfUrl} = item
                arry.push({shelfName,shelfSeq,shelfImg,selectImg,shelfUrl})
            };
            return arry
        },
        isLogin: state => {
            return () => !!state.userInfo.uid
        }
    },
    mutations: {
        // 首页架子信息
        SET_QUERY_HOME(state, data) {
            state.queryHome = data;
            client.setStorage('queryHome', data)
            // console.log('==》存架子数据', data)
        },
        SET_LOCATION(state, data) {
            state.location = data;
            client.setStorage('location', data)
        },
        SET_LOCATIONXY(state, data) {
          state.locationXY = data;
          client.setStorage('locationXY', data)
        },
        SET_USECITY(state, data) {
            state.useCity = data;
            // client.setStorage('useCity', data)
        },
        SET_PAGE_PARAM(state, data) {
            state.pageParam = data;
        },
        SET_CACHE(state, data) {
            for (const key in data) {
                state.cache[key] = data[key];
            }
        },
        SET_USERINOF(state, data) {
            for (const key in data) {
                state.userInfo[key] = data[key];
            }
            client.setStorage('userInfo', state.userInfo);
        },
        CLEAR_USER_INFO(state, data) {
            state.userInfo = {};
            client.removeStorage('clientToken')
            client.removeStorage('userInfo')
            client.removeStorage('real_info')
        },
    },
    actions: {
        clearUserInfo({
            commit
        }, data) {
            commit("CLEAR_USER_INFO", data);
        },
        setParam({
            commit
        }, data) {
            commit("SET_PAGE_PARAM", data);
        },
        setCache({
            commit
        }, data) {
            commit("SET_CACHE", data);
        },
        setUserInfo({
            commit
        }, data) {
            commit("SET_USERINOF", data);
        }
    }
});
store.commit('SET_USERINOF', client.getStorage('userInfo') || {})
export default store;