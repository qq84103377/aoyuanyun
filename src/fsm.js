/*
 * @Description: 
 * @version: 
 * @Author: gonghonglin
 * @Date: 2021-07-21 10:19:38
 * @LastEditors: gonghonglin
 * @LastEditTime: 2021-08-04 16:03:03
 */
// 文件系统中的用户目录路径 (本地路径)
const USER_DATA_PATH = wx.env.USER_DATA_PATH;
// 文件管理器
function getFileSystemManager() {
  return uni.getFileSystemManager();
}

// 读取文件
function readFile(options = {}) {
  return new Promise((resolve, reject) => {
    getFileSystemManager().readFile({
      ...options,
      success: res => resolve(res),
      fail: err => reject(err),
    });
  })
}

// 写文件
function writeFile(options = {}) {
  return new Promise((resolve, reject) => {
    getFileSystemManager().writeFile({
      ...options,
      success: res => resolve(res),
      fail: err => reject(err),
    });
  })
}

// 将 Base64 字符串转成 ArrayBuffer 对象
function base64ToArrayBuffer(base64) {
  return uni.base64ToArrayBuffer(base64);
}

export default {
  USER_DATA_PATH,
  getFileSystemManager,
  readFile,
  writeFile,
  base64ToArrayBuffer,
}