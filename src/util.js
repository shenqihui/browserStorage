(function() {
  /**
   * browserStorage namespace.
   * @namespace browserStorage
   */
  "use strict";
  // 用于监控是否能触发本页面的 storageEvent 。
  var addEventListenerStr,
    eventListenerPrefix = "",
    removeEventListenerStr,
    browserStorage = browserStorage || {},
    fireEvent,
    storage,
    storageSecond,
    read,
    remove,
    c_storage,
    c_storageSecond,
    c_read,
    c_remove;
  // 初始化选择动作的处理
  if (typeof window.addEventListener === "function") {
    addEventListenerStr = "addEventListener";
    removeEventListenerStr = "removeEventListener"
  } else {
    addEventListenerStr = "attachEvent";
    removeEventListenerStr = "detachEvent";
    eventListenerPrefix = "on";
  }
  window.browserStorageForceUseCookie = window.browserStorageForceUseCookie || false;


  browserStorage.supportLocalStorage = typeof window.localStorage !== "undefined";
  // 要是设置为false，就直接设置到 cookies 中
  (window.browserStorageForceUseCookie === true) && (browserStorage.supportLocalStorage = false);
  // browserStorage.supportLocalStorage = false;

  // 存储时间，一切读取数据时候都以这个为过期时间为准。
  browserStorage.date = new Date();
  browserStorage.fireEvent = function() {};



  /**
   * @name storage
   * @desc 进行信息的存储。以天为跳转单位。 存储进 html5 的stronge。
   * @depend []
   * @memberof browserStorage
   * @param { string } name 字段的名字
   * @param { string } value 字段的值
   * @param { int } 字段的有效时间，多少天。
            为 空，则直接存储为 session 方式。
            为 数值 n ，则 n 天之后过期。
            为 数值 0 ，则永久保存，直到手动删除。
   **/
  storage = function(name, value, expires) {
    if (expires === undefined) {
      storageSecond(name, value);
    } else {
      storageSecond(name, value, expires * 24 * 60 * 60);
    }
  }
  c_storage = function(name, value, expires) {
    if (expires === undefined) {
      c_storageSecond(name, value);
    } else {
      c_storageSecond(name, value, expires * 24 * 60 * 60);
    }
  }
  /**
   * @name storageSecond
   * @desc 进行信息的存储。以秒为跳转单位。 存储进 html5 的stronge。
   * @depend []
   * @memberof browserStorage
   * @param { string } name 字段的名字
   * @param { string } value 字段的值
   * @param { string } expires 字段的有效时间，多少秒。
            为 空，则直接存储为 session 方式。
            为 数值 n ，则 n 天之后过期。
            为 数值 0 ，则永久保存，直到手动删除。
   **/
  storageSecond = function(name, value, expires) {
    var exdate = new Date(),
      storageObj = {};

    if (expires === undefined) {
      // 直接存储为 sessionStorage;
      // sessionStorage.setItem(name, value);
      c_storageSecond(name, value);
    } else {
      if (typeof expires !== "number") {
        try {
          expires = parseInt(expires, 10);
        } catch (e) {} finally {
          // 避免 NaN 的情况
          expires = expires === expires ? expires : "";
        }
      }

      if (expires === 0 || expires === "0") {
        // 存储为永久字段到 localStorage ， 存储方式为 key + value ， 其中 value 为 json 字符串，内容格式为  {"to":"forever","val":"i am value"}
        storageObj.to = "forever";
        storageObj.val = value;
        localStorage.setItem(name, JSON.stringify(storageObj));
      } else if (typeof expires === "number") {
        // 存储为一定时间过期的 localStorage ， 存储方式为 key + value ， 其中 value 为 json 字符串，内容格式为 {"to": "到期时间", "val": "值"}
        exdate.setSeconds(exdate.getSeconds() + expires);
        storageObj.to = exdate.toString();
        storageObj.val = value;
        localStorage.setItem(name, JSON.stringify(storageObj));
      } else {
        // 都是 "" 的情况了
      }
    }

    browserStorage.fireEvent();
  }
  c_storageSecond = function(name, value, expires) {
    var exdate = new Date();
    var cookiesArr = [];
    cookiesArr.push(name);
    cookiesArr.push("=");
    cookiesArr.push(escape(value));
    if (expires !== undefined) {
      if (typeof expires !== "number") {
        try {
          expires = parseInt(expires, 10);
        } catch (e) {} finally {
          // 避免 NaN 的情况
          expires = expires === expires ? expires : "";
        }
      }
      exdate.setSeconds(exdate.getSeconds() + expires);
      cookiesArr.push(";expires=");
      cookiesArr.push(exdate.toGMTString());
    } else {
      // session cookie
    }
    document.cookie = cookiesArr.join("");
  }
  // sessionStorage 是个二货 -_-|| , 只能存储进 cookies
  // sessionStorage.setItem = c_storageSecond;
  /**
   * @name read
   * @desc 像 cookies 一样进行进行信息的读取。特别注意过期时间。
   * @depend []
   * @memberof browserStorage
   * @param { name } 字段的名字
   **/
  read = function(name) {
    var cookieVal = c_read(name);
    if (cookieVal !== "") {
      return cookieVal;
    } else {
      var sessionStorageData = sessionStorage.getItem(name);
      var localStorageData; // = localStorage.getItem(name);
      var localStorageDataObj;

      // (window.devMod === true) && console.log( 'sessionStorageData', sessionStorageData );
      if (typeof sessionStorageData === "string") {
        // 要是已经直接存储在 sessionStorage 里面了， sessionStorage 优先级比 localStorage 高
        localStorage.removeItem(name);
        browserStorage.fireEvent();
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
          localStorageDataObj.val = localStorageDataObj.val || "";
          if (localStorageDataObj.to === "forever") {
            // 存储为永久数据的时候，不需要判断时间，直接返回数据
            return localStorageDataObj.val;
          } else {
            // 进行时间比较
            try {
              localStorageDataObj.to = new Date(localStorageDataObj.to);
            } catch (e) {} finally {
              localStorageDataObj.to = localStorageDataObj.to || browserStorage.date;
            }
            if (browserStorage.date > localStorageDataObj.to) {
              // 判断当前时间和存储时间的关系，大于就是代表过期了。
              localStorage.removeItem(name);
              browserStorage.fireEvent();
              return "";
            } else {
              return localStorageDataObj.val;
            }
          }
        } else {
          return "";
        }
      }
    }
  }
  c_read = function(name) {
    var match = null;
    var regex = new RegExp("[;]\\s*" + name + "=([^;]+)[\\s;]*?");
    // console.log(regex);
    var cookie = "; " + document.cookie;
    match = cookie.match(regex);
    if (match !== null) {
      return unescape(match[1]);
    } else {
      return ""
    };
  }
  // sessionStorage 是个二货 -_-|| , 只能存储进 cookies
  // sessionStorage.getItem = c_read;
  /**
   * @name remove
   * @desc 删除该字段。
   * @depend []
   * @memberof browserStorage
   * @param { name } 字段的名字
   **/
  remove = function(name) {
    c_remove(name);
    localStorage.removeItem(name);
    sessionStorage.removeItem(name);
    browserStorage.fireEvent();
  }
  c_remove = function(name, path, domain) {
    var cookiesArr = [];
    // console.log( read(name));
    if (read(name)) {
      cookiesArr.push(name);
      cookiesArr.push("=");
      cookiesArr.push(";expires=Thu, 01-Jan-1970 00:00:01 GMT");
      // console.log(cookiesArr.join(""));
      document.cookie = cookiesArr.join("");
    }
  }



  // 自动切换到 localStorage 中
  if (browserStorage.supportLocalStorage) {
    /**
     * @name fireEvent
     * @desc 进行事件的触发。浏览器貌似不进行直接触发的。。。
     * @depend []
     * @memberof browserStorage
     * @param { string } name 字段的名字
     * @param { string } oldValue 设置之前字段值
     * @param { string } newValue 设置之后字段值
     * @param { string } url 默认当前url
     * @param { Storage } storage 一般为 localStorage 这个域，没啥用的参数
     **/
    fireEvent = function(name, oldValue, newValue, url, storage) {
      var storageEvent;
      // extend , 判断是否和 undefined 相等，不适用 || 主要是因为可能为 int 0 的情况。
      name = name === undefined ? "" : name;
      oldValue = oldValue === undefined ? "" : oldValue;
      newValue = newValue === undefined ? "" : newValue;
      url = url === undefined ? "" : location.href;
      storage = storage === undefined ? {} : storage;

      // trigger the event
      storageEvent = document.createEvent("StorageEvent");
      storageEvent.initStorageEvent('storage-passive', false, false, name, oldValue, newValue, url, storage);
      (typeof window.dispatchEvent !== "undefined") && (window.dispatchEvent(storageEvent));
    }

    browserStorage.fireEvent = fireEvent;

    !(function() {
      var storageHandlerForTestEventSupport,
        addEventListenerStrTestKey = "browserStorageStorageEventSupportTest" + (new Date()).getTime();
      storageHandlerForTestEventSupport = function(e) {
        // 需要是当前自己页面触发的
        // console.log("storageHandlerForTestEventSupport", e.key, addEventListenerStrTestKey);
        if (e.key === addEventListenerStrTestKey) {
          browserStorage.fireEvent = function() {};
        }
        window[removeEventListenerStr](eventListenerPrefix + "storage", storageHandlerForTestEventSupport, false);
        storageHandlerForTestEventSupport = null;
        addEventListenerStrTestKey = null;
      }
      window[addEventListenerStr](eventListenerPrefix + "storage", storageHandlerForTestEventSupport, false);
      sessionStorage.setItem(addEventListenerStrTestKey, "1");
      sessionStorage.removeItem(addEventListenerStrTestKey);
    })();
    // console.log(browserStorage.fireEvent.toString());
    // 挂载使用 html5 storage
    browserStorage.storage = storage;
    browserStorage.storageSecond = storageSecond;
    browserStorage.read = read;
    browserStorage.remove = remove;
  } else {
    // 以下是使用 cookies 进行存储的
    browserStorage.storage = c_storage;
    browserStorage.storageSecond = c_storageSecond;
    browserStorage.read = c_read;
    browserStorage.remove = c_remove;
  }
  // browserStorage不进行冲突处理
  if (window.browserStorage !== undefined) {
    console.warn("browserStorage: window.browserStorage is already used, browserStorage will not use this namespace. Make sure to release window.browserStorage before include browserStorage lib");
  } else {
    window.browserStorage = window.browserStorage || browserStorage;
  }
})();