;(function() {
  "use strict";
  var browserStorage = browserStorage || {};
  browserStorage.supportLocalStorage = (typeof window.localStorage !== "undefined");

  // 存储时间，一切读取数据时候都以这个为过期时间为准。
  browserStorage.date = new Date();

  // 自动切换到 localStorage 中
  if (browserStorage.supportLocalStorage) {
    /**
     * @name storage
     * @desc 进行信息的存储。以天为跳转单位。 存储进 html5 的stronge。
     * @depend []
     * @param { name } 字段的名字
     * @param { value } 字段的值
     * @param { expiredays } 字段的有效时间，多少天。
              为 空，则直接存储为 session 方式。
              为 数值 n ，则 n 天之后过期。
              为 数值 0 ，则永久保存，直到手动删除。
     **/
    browserStorage.storage = function(name, value, expiredays) {
      var exdate = new Date();
      var storageObj = {};
      if (typeof expiredays === "number") {
        // 存储为一定时间过期的 localStorage ， 存储方式为 key + value ， 其中 value 为 json 字符串，内容格式为 {"to": "到期时间", "val": "值"}
        exdate.setDate(exdate.getDate() + expiredays);
        storageObj.to = exdate.toString();
        storageObj.val = value;
        localStorage.setItem(name, JSON.stringify(storageObj));
      } else if (expiredays === 0 || expiredays === "0") {
        // 存储为永久字段到 localStorage ， 存储方式为 key + value ， 其中 value 为 json 字符串，内容格式为  {"to":"forever","val":"i am value"}
        storageObj.to = "forever";
        storageObj.val = value;
        localStorage.setItem(name, JSON.stringify(storageObj));
      } else {
        // 直接存储为 sessionStorage;
        sessionStorage.setItem(name, value);
      }
    }

    /**
     * @name storageSecond
     * @desc 进行信息的存储。以秒为跳转单位。 存储进 html5 的stronge。
     * @depend []
     * @param { name } 字段的名字
     * @param { value } 字段的值
     * @param { expiredays } 字段的有效时间，多少秒。
              为 空，则直接存储为 session 方式。
              为 数值 n ，则 n 天之后过期。
              为 数值 0 ，则永久保存，直到手动删除。
     **/
    browserStorage.storageSecond = function(name, value, second) {
      var exdate = new Date();
      var storageObj = {};
      if (typeof second === "number") {
        // 存储为一定时间过期的 localStorage ， 存储方式为 key + value ， 其中 value 为 json 字符串，内容格式为 {"to": "到期时间", "val": "值"}
        exdate.setDate(exdate.getSeconds() + second);
        storageObj.to = exdate.toString();
        storageObj.val = value;
        localStorage.setItem(name, JSON.stringify(storageObj));
      } else if (second === 0 || second === "0") {
        // 存储为永久字段到 localStorage ， 存储方式为 key + value ， 其中 value 为 json 字符串，内容格式为  {"to":"forever","val":"i am value"}
        storageObj.to = "forever";
        storageObj.val = value;
        localStorage.setItem(name, JSON.stringify(storageObj));
      } else {
        // 直接存储为 sessionStorage;
        sessionStorage.setItem(name, value);
      }
    }

    /**
     * @name getCookie
     * @desc 进行信息的读取。特别注意过期时间。
     * @depend []
     * @param { name } 字段的名字
     **/
    browserStorage.getCookie = function(name) {
      var sessionStorageData = sessionStorage.getItem(name);
      var localStorageData; // = localStorage.getItem(name);
      var localStorageDataObj;

      // (window.devMod === true) && console.log( 'sessionStorageData', sessionStorageData );
      if (typeof sessionStorageData === "string") {
        // 要是已经直接存储在 sessionStorage 里面了
        localStorage.removeItem(name);
        return sessionStorageData;
      } else {
        // 存储进了 localStorage 里面。
        localStorageData = localStorage.getItem(name);
        if (typeof localStorageData === "string") {
          // (window.devMod === true) && ( console.log('localStorageData', localStorageData) );
          try {
            localStorageDataObj = JSON.parse(localStorageData);
          } catch (e) {
            localStorageDataObj = {
              to: browserStorage.date,
              val: ""
            };
          }
          try {
            localStorageDataObj.to = new Date(localStorageDataObj.to);
          } catch (e) {
            localStorageDataObj.to = localStorageDataObj.to || browserStorage.date;
          }
          localStorageDataObj.val = localStorageDataObj.val || "";
          if (browserStorage.date > localStorageDataObj.to) {
            // 判断当前时间和存储时间的关系，大于就是代表过期了。
            localStorage.removeItem(name);
            return "";
          } else {
            return localStorageDataObj.val;
          }
        } else {
          return "";
        }
      }
    }

  } else {
    // 直接存储到 cookies 中，这个有部分bug，不用管了。
    // 以下是使用 cookies 进行存储的
    // 这个函数使用完毕就干掉
    browserStorage.storage = function(name, value, expiredays) {
      var exdate = new Date();
      exdate.setDate(exdate.getDate() + expiredays);
      document.cookie = name + "=" + escape(value) +
        ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString()) + ';path=/' + browserStorage.domain;
    }
    // 这个函数使用完毕就干掉
    browserStorage.storageSecond = function(name, value, second) {
      var exdate = new Date()
      exdate.setSeconds(exdate.getSeconds() + second)
      document.cookie = name + "=" + escape(value) +
        ((second == null) ? "" : ";expires=" + exdate.toGMTString()) + ';path=/' + browserStorage.domain
    }
    browserStorage.getCookie = function(name) {
      var start, end;
      if (document.cookie.length > 0) {
        start = document.cookie.indexOf(name + "=")
        if (start != -1) {
          // 这里有个bug，需要进行边界处理
          start = start + name.length + 1
          end = document.cookie.indexOf(";", start)
          if (end == -1) end = document.cookie.length
          return unescape(document.cookie.substring(start, end))
        }
      }
      return ""
    }
  }

  // browserStorage不进行冲突处理
  window.browserStorage = window.browserStorage || browserStorage;
})();