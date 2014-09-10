(function() {
  /**
   * browserStorage namespace.
   * @namespace browserStorage
   */
  "use strict";
  var browserStorage = browserStorage || {};
  browserStorage.supportLocalStorage = (typeof window.localStorage !== "undefined");

  // 存储时间，一切读取数据时候都以这个为过期时间为准。
  browserStorage.date = new Date();
  var storage, storageSecond, read, remove;

  // 自动切换到 localStorage 中
  if (browserStorage.supportLocalStorage) {
    /**
       * @name storage
       * @desc 进行信息的存储。以天为跳转单位。 存储进 html5 的stronge。
       * @depend []
       * memberof browserStorage
       * @param { string } name 字段的名字
       * @param { string } value 字段的值
       * @param { int } 字段的有效时间，多少天。
                为 空，则直接存储为 session 方式。
                为 数值 n ，则 n 天之后过期。
                为 数值 0 ，则永久保存，直到手动删除。
       **/
    storage = function(name, value, expires) {
      var exdate = new Date();
      var storageObj = {};
      if(typeof expires !== "number"){
        try {
          expires = parseInt( expires, 10)
        } catch (e) {
          expires = "";
        } finally {
          expires === expires ? expires = expires : expires = "" ;
        }
      }
      if (typeof expires === "number") {
        // 存储为一定时间过期的 localStorage ， 存储方式为 key + value ， 其中 value 为 json 字符串，内容格式为 {"to": "到期时间", "val": "值"}
        exdate.setDate(exdate.getDate() + expires);
        storageObj.to = exdate.toString();
        storageObj.val = value;
        localStorage.setItem(name, JSON.stringify(storageObj));
      } else if (expires === 0 || expires === "0") {
        // 存储为永久字段到 localStorage ， 存储方式为 key + value ， 其中 value 为 json 字符串，内容格式为  {"to":"forever","val":"i am value"}
        storageObj.to = "forever";
        storageObj.val = value;
        localStorage.setItem(name, JSON.stringify(storageObj));
      } else {
        // 直接存储为 sessionStorage;
        sessionStorage.setItem(name, value);
      }
    }
    browserStorage.storage = storage;
    /**
       * @name storageSecond
       * @desc 进行信息的存储。以秒为跳转单位。 存储进 html5 的stronge。
       * @depend []
       * memberof browserStorage
       * @param { string } name 字段的名字
       * @param { string } value 字段的值
       * @param { string } expires 字段的有效时间，多少秒。
                为 空，则直接存储为 session 方式。
                为 数值 n ，则 n 天之后过期。
                为 数值 0 ，则永久保存，直到手动删除。
       **/
    storageSecond = function(name, value, expires) {

      var exdate = new Date();
      var storageObj = {};
      if(typeof expires !== "number"){
        try {
          expires = parseInt( expires, 10);
        } catch (e) {
          expires = "";
        } finally {
          expires === expires ? expires = expires : expires = "" ;
        }
      }
      if (typeof expires === "number") {
        // 存储为一定时间过期的 localStorage ， 存储方式为 key + value ， 其中 value 为 json 字符串，内容格式为 {"to": "到期时间", "val": "值"}
        exdate.setDate(exdate.getSeconds() + expires);
        storageObj.to = exdate.toString();
        storageObj.val = value;
        localStorage.setItem(name, JSON.stringify(storageObj));
      } else if (expires === 0 || expires === "0") {
        // 存储为永久字段到 localStorage ， 存储方式为 key + value ， 其中 value 为 json 字符串，内容格式为  {"to":"forever","val":"i am value"}
        storageObj.to = "forever";
        storageObj.val = value;
        localStorage.setItem(name, JSON.stringify(storageObj));
      } else {
        // 直接存储为 sessionStorage;
        sessionStorage.setItem(name, value);
      }
    }
    browserStorage.storageSecond = storageSecond;
    /**
     * @name read
     * @desc 像 cookies 一样进行进行信息的读取。特别注意过期时间。
     * @depend []
     * memberof browserStorage
     * @param { name } 字段的名字
     **/
    read = function(name) {
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
    browserStorage.read = read;
    remove = function(name, path, domain) {
      localStorage.removeItem(name);
      sessionStorage.removeItem(name);
    }
    browserStorage.remove = remove;
  } else {
    // 直接存储到 cookies 中，这个有部分bug，不用管了。
    // 以下是使用 cookies 进行存储的
    storage = function(name, value, expires, path, domain, HttpOnly) {
      var today = new Date();
      today.setTime(today.getTime());
      if (expires) {
        expires = expires * 1000 * 60 * 60 * 24;
      }
      var expires_date = new Date(today.getTime() + (expires));

      document.cookie = name + "=" + escape(value) +
        ((expires) ? ";expires=" + expires_date.toGMTString() : "") +
        ((path) ? ";path=" + path : "") +
        ((domain) ? ";domain=" + domain : "") +
        ((secure) ? ";secure" : "") +
        ((HttpOnly) ? ";HttpOnly" : "");
    }
    browserStorage.storage = storage
    storageSecond = function(name, value, expires, path, domain, HttpOnly) {
      var today = new Date();
      today.setTime(today.getTime());
      if (expires) {
        expires = expires * 1000;
      }
      var expires_date = new Date(today.getTime() + (expires));

      document.cookie = name + "=" + escape(value) +
        ((expires) ? ";expires=" + expires_date.toGMTString() : "") +
        ((path) ? ";path=" + path : "") +
        ((domain) ? ";domain=" + domain : "") +
        ((secure) ? ";secure" : "") +
        ((HttpOnly) ? ";HttpOnly" : "");
    }
    browserStorage.storageSecond = storageSecond;
    read = function(name) {
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
    browserStorage.read = read;
    remove = function(name, path, domain) {
      if (Get_Cookie(name)) {
        document.cookie = name + "=" +
          ((path) ? ";path=" + path : "") +
          ((domain) ? ";domain=" + domain : "") +
          ";expires=Thu, 01-Jan-1970 00:00:01 GMT";
      }
    }
    browserStorage.remove = remove;
  }
  // browserStorage不进行冲突处理
  if ( window.browserStorage !== undefined) {
    console.warn("browserStorage: window.browserStorage is already used, browserStorage will not use this namespace. Make sure to release window.browserStorage before include browserStorage lib");
  } else {
    window.browserStorage = window.browserStorage || browserStorage;
  }
})();