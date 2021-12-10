/*
 * @Description: 项目环境常量配置
 * @version: 
 * @Author: gonghonglin
 * @LastEditors: gonghonglin
 * @LastEditTime: 2021-09-20 16:34:28
 */
const os = require('os');
const chalk = require('chalk');

const interfaces = os.networkInterfaces();
let address = '127.0.0.1';
Object.keys(interfaces).forEach(key => {
  const item = interfaces[key];
  Object.keys(item).forEach(cusor => {
    const ip = item[cusor];
    if (ip.family === 'IPv4' && !ip.internal) {
      address = ip.address || address;
    }
  });
});

let envConfig = {
  dev: {
    ENV: 'dev',
    assetUrl: `http://${address}:8082/mock/img/`,
    apiUrl: 'http://172.17.2.22:8019/',
    clientId: 'customer001'
  },
  sit: {
    ENV: 'sit',
    assetUrl: `https://digital-dev-1306790816.cos.ap-guangzhou.myqcloud.com/img/`,
    apiUrl: 'https://cloud-dev.aoyuan.net/',
    clientId: 'customer001'
  },
  test: {
    ENV: 'test',
    assetUrl: `https://digital-dev-1306790816.cos.ap-guangzhou.myqcloud.com/img/`,
    apiUrl: 'https://cloud-test.aoyuan.net/',
    clientId: 'customer001'
  },
  prod: {
    ENV: 'prod',
    assetUrl: `https://digital-dev-1306790816.cos.ap-guangzhou.myqcloud.com/img/`,
    apiUrl: 'https://aycloud.aoyuan.com.cn/',
    clientId: 'customer001'
  },

};

const envList = ['dev', 'sit', 'test', 'uat2', 'prod'];
let env = process.argv[process.argv.length - 1];
if (!envList.includes(env)) env = 'prod';
const CONF = envConfig[env];

console.log(chalk.green('当前环境：'));
console.log(env);
console.log(chalk.green('当前环境对应的常量：'));
console.log(CONF);

module.exports = CONF;
