export default {
  /**
   * 判断是否为对象(判断值)
   * @param {any} obj 对象
   * @returns {Boolean} 结果
   */
  isObject(obj) {
    return (Object.prototype.toString.call(obj) === '[object Object]');
  },
  /**
   * 判断是否为数组(判断值)
   * @param {any} obj 对象
   * @returns {Boolean} 结果
   */
  isArray(obj) {
    return (Object.prototype.toString.call(obj) === '[object Array]');
  },

  /**
   * 判断是否为字符串(判断值)
   * @param {any} obj 对象
   * @returns {Boolean} 结果
   */
  isString(obj) {
    return (Object.prototype.toString.call(obj) === '[object String]');
  },

  /**
   * 判断是否为数字(判断值)
   * @param {any} obj 对象
   * @returns {Boolean} 结果
   */
  isNumber(obj) {
    return (Object.prototype.toString.call(obj) === '[object Number]');
  },

  /**
   * 判断是否为布尔值(判断值)
   * @param {any} obj 对象
   * @returns {Boolean} 结果
   */
  isBoolean(obj) {
    return (Object.prototype.toString.call(obj) === '[object Boolean]');
  },

  /**
   * 判断是否为Date对象(判断值)
   * @param {any} obj 对象
   * @returns {Boolean} 结果
   */
  isDate(obj) {
    return (Object.prototype.toString.call(obj) === '[object Date]');
  },

  /**
   * 判断是否为Null(判断值)
   * @param {any} obj 对象
   * @returns {Boolean} 结果
   */
  isNull(obj) {
    return (Object.prototype.toString.call(obj) === '[object Null]');
  }
};