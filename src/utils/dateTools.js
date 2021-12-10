import TypeTools from './typeTools';

/**
 * 常规格式如下
 * 2017-08-03 12:00:00, 2017/08/03 12:00:00, 2017-08-03, 2017/08/03, 20170803,20170906165655
 */

const dateFunction = {
  /**
   * @desc 简单的把字符串日期(20180206)转成(2018-02-06)
   * @param {string} param1
   * @returns {string}
   * @example this.$tools.dateFormat('20180206','yyyy-MM-dd') -- '2018-02-068'
   */
  dateFormat(param1, segment = '-') {
    if (!/\d{8}/.test(param1)) {
      return param1;
    }
    return param1.replace(/(\d{4})(\d{2})(\d{2})/, `$1${segment}$2${segment}$3`);
  },
  /**
   * 日期字符串转日期对象
   * 支持6种常规格式日期字符串
   * @param {String} str
   * @returns {Date}
   */
  str2Date(str) {
    try {
      str = str.replace(/-/g, "/");
      if (str.length == 8) {
        str =
          str.substring(0, 4) +
          "/" +
          str.substring(4, 6) +
          "/" +
          str.substring(6, 8);
      }
      if (str.length == 10) {
        str = str + " 00:00:00";
      }
      if (str.length == 14) {
        str =
          str.substring(0, 4) +
          "/" +
          str.substring(4, 6) +
          "/" +
          str.substring(6, 8) +
          " " +
          str.substring(8, 10) +
          ":" +
          str.substring(10, 12) +
          ":" +
          str.substring(12, 14);
      }
      return new Date(str);
    } catch (error) {
      return null;
    }
  },

  /**
   * 格式化时间字符串
   * @param {any} str 时间字符串
   * @param {string} [exp="YYYY-MM-DD hh:mm:ss"] 表达式
   * @returns 格式化后的时间字符串
   */
  str2DateStr(str, exp = "YYYY-MM-DD hh:mm:ss") {
    if (str == "" || str == undefined || str == null) {
      return "";
    }
    let date = this.str2Date(str);
    return this.date2Str(date, exp);
  },

  /**
   * 日期对象转日期字符串(日期对象)
   * 表达式【YYYY年份 MM月份 DD日期 hh小时 mm分钟 ss秒钟 自由组合，如 YYYY-MM-DD hh:mm:ss】
   * @param {Date} date
   * @param {Sting} exp
   * @returns {String}
   */
  date2Str(date, exp) {
    try {
      let year = this.getYear(date);
      exp = exp.replace(/YYYY/, year);
      let month = this.getMonth(date);
      exp = exp.replace(/MM/, month);
      let day = this.getDay(date);
      exp = exp.replace(/DD/, day);
      let hour = this.getHours(date);
      exp = exp.replace(/hh/, hour);
      let minutes = this.getMinutes(date);
      exp = exp.replace(/mm/, minutes);
      let seconds = this.getSeconds(date);
      exp = exp.replace(/ss/, seconds);
      return exp;
    } catch (error) {
      return null;
    }
  },

  /**
   * 获取年份
   * 支持 Date对象 及 日期字符串
   * @param {any} obj
   * @returns
   */
  getYear(obj) {
    try {
      if (TypeTools.isString(obj)) {
        obj = this.str2Date(obj);
      }
      return obj.getFullYear() + "";
    } catch (error) {
      return "";
    }
  },

  /**
   * 获取月份 【01~12】
   * 支持 Date对象 及 日期字符串
   * @param {any} obj
   * @returns {String}
   */
  getMonth(obj) {
    try {
      if (TypeTools.isString(obj)) {
        obj = this.str2Date(obj);
      }
      let month = obj.getMonth() + 1;
      return month > 9 ? "" + month : "0" + month;
    } catch (error) {
      return "";
    }
  },

  /**
   * 获取天 【01~31】
   * 支持 Date对象 及 日期字符串
   * @param {any} obj
   * @returns {String}
   */
  getDay(obj) {
    try {
      if (TypeTools.isString(obj)) {
        obj = this.str2Date(obj);
      }
      let day = obj.getDate();
      return day > 9 ? "" + day : "0" + day;
    } catch (error) {
      return "";
    }
  },

  /**
   * 获取小时
   * 支持 Date对象 及 日期字符串【2017-08-03 12:00:00, 2017/08/03 12:00:00, 2017-08-03, 2017/08/03, 20170803】
   * @param {any} obj
   * @returns {String}
   */
  getHours(obj) {
    try {
      if (TypeTools.isString(obj)) {
        obj = this.str2Date(obj);
      }
      let hour = obj.getHours();
      return hour > 9 ? "" + hour : "0" + hour;
    } catch (error) {
      return "";
    }
  },

  /**
   * 获取分钟
   * 支持 Date对象 及 日期字符串【2017-08-03 12:00:00, 2017/08/03 12:00:00, 2017-08-03, 2017/08/03, 20170803】
   * @param {any} obj
   * @returns {String}
   */
  getMinutes(obj) {
    try {
      if (TypeTools.isString(obj)) {
        obj = this.str2Date(obj);
      }
      let minutes = obj.getMinutes();
      return minutes > 9 ? "" + minutes : "0" + minutes;
    } catch (error) {
      return "";
    }
  },

  /**
   * 获取秒钟
   * 支持 Date对象 及 日期字符串【2017-08-03 12:00:00, 2017/08/03 12:00:00, 2017-08-03, 2017/08/03, 20170803】
   * @param {any} obj
   * @returns {String}
   */
  getSeconds(obj) {
    try {
      if (TypeTools.isString(obj)) {
        obj = this.str2Date(obj);
      }
      let second = obj.getSeconds();
      return second > 9 ? "" + second : "0" + second;
    } catch (error) {
      return "";
    }
  },

  /**
   * N日之后(开始时间,N日[默认1])
   *
   * @param {Date} beginDay
   * @param {number} [value=1]
   * @param {number} [isBefore=false] 此值为true时返回N日之前的时间对象
   * @returns {Date}
   */
  afterDays(beginDay, value = 1, isBefore = false) {
    try {
      if (!TypeTools.isDate(beginDay)) {
        beginDay = this.str2Date(beginDay);
      }
      let before = new Date(beginDay.getTime() - value * 86400000);
      let after = new Date(beginDay.getTime() + value * 86400000);
      let endDay = isBefore ? before : after;
      return endDay;
    } catch (error) {
      return null;
    }
  },

  /**
   * N月之后(开始时间,N月[默认1])
   *
   * @param {Date} beginDay
   * @param {number} [value=1]
   * @returns {Date}
   */
  afterMonths(beginDay, value = 1) {
    return this.afterDays(beginDay, value * 30);
  },

  /**
   * N年之后(开始时间,N年[默认1])
   *
   * @param {Date} beginDay
   * @param {number} [value=1]
   * @returns {Date}
   */
  afterYears(beginDay, value = 1) {
    return this.afterDays(beginDay, value * 360);
  },

  /**
   * 时间差(第一时间,第二时间)
   * 时间不分先后
   * @param {date} firstTime
   * @param {date} secondTime
   * @returns {number}
   */
  timeGap(firstTime, secondTime) {
    if (!TypeTools.isDate(firstTime)) {
      firstTime = this.str2Date(firstTime);
    }
    if (!TypeTools.isDate(secondTime)) {
      secondTime = this.str2Date(secondTime);
    }
    let gap = Math.abs(firstTime.getTime() - secondTime.getTime());
    gap = Math.ceil(gap / 86400000);
    return gap;
  },
  /**
   * 获取一定时间间隔的开始和结束时间的，默认返回格式为YYYYMMDD 例如：20190101
   * @param {String|Number} days 间隔时间
   * @param {String} beginDay 开始计算的时间
   * @param {boolean}  isBefore true-计算beginDay之前N天， false-计算beginDay之后N天
   * @return {Object} {beginDay: '20190402', endDay: '20190323'} beginDay-开始计算的时间 endDay-计算之后的时间
   */
  getTimeStamp(days = 1, beginDay, isBefore = false, format = "YYYYMMDD") {
    beginDay = beginDay || new Date();
    let endDay = this.afterDays(beginDay, days, isBefore);
    return {
      endDay: this.date2Str(endDay, format),
      beginDay: this.date2Str(beginDay, format)
    };
  },
  /**
   * @desc 获取本月开始与结束日期
   */
  getCurrentMonthDate(date = new Date()) {
    let monthStartDate = `${this.getYear(date)}-${this.getMonth(date)}-01`;
    let endDate = new Date(new Date(this.getYear(date), this.getMonth(date), 1) - 86400000)
    let monthEndDate = `${this.getYear(endDate)}-${this.getMonth(endDate)}-${this.getDay(endDate)}`
    return {
      monthStartDate,
      monthEndDate
    }
  },
  /**
   * @desc 返回当前日期时间信息
   */
  getCurrentDate() {
    const _self = this;
    const date = new Date();
    let opt = {
      yy: _self.getYear(date),
      MM: _self.getMonth(date),
      dd: _self.getDay(date),
      hh: _self.getHours(date),
      mm: _self.getMinutes(date),
      ss: _self.getSeconds(date)
    };
    return opt;
  },
  /**
   * @description 增加月份
   * @param {String} date 格式化后的日期字符yyyyMMdd
   * @param {String|Number} num 增加的月份
   */
  addMouth(date, num = 0) {
    date = String(date);
    if (num == 0 || date.length !== 8) return date;
    let monthnum = parseInt(num);
    let year = parseInt(date.substring(0, 4));
    let month = parseInt(date.substring(4, 6)) - 1;
    // 如果最后一天小于传入的时间，取值为最后一天
    let nextMonLastDay = new Date(year, month + 1 + monthnum, 0).getDate();
    let day = parseInt(date.substring(6, 8));
    day = day > nextMonLastDay ? nextMonLastDay : day;

    let d = new Date(year, month + monthnum, 1);
    year = d.getFullYear();
    month = d.getMonth() + 1;
    // day = d.getDate();
    return year + "" + ('0' + month).substr(-2) + "" + ('0' + day).substr(-2);
  }
};

export default dateFunction;
