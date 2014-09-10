#browserStorage

Use localStorage or cookies to storage data. 使用 localStorage/cookies 存储数据。


#简介

要是你想找一个关于 localStorage 的库，用于前后端分离时候的数据存储，取代以前使用 cookies 存储数据的方式以便丁点加快 http 请求，抛去一切能省去的 http 夹带 cookies 的话，你找对了。马上使用这个。
此 JS 只能称之为一个工具，因此只是做了 存储方面的 控制，把数据存储到 localStorage ，不支持 localStorage 的时候，就存储到 cookies 里面。


#设计思路

一开始的时候，把数据存储到 cookies 里面，发现等数据量过大了，有时候会有很大的问题，而且现在的东西基本上 >=IE8 就直接支持 localStorage 了。  
因此，花个时间，按照以前存储进 cookies 的方式，存储到 localStorage 里面。  
再不能使用 localStorage 的浏览器（ <=IE7 ） 就自动转移到使用 cookies 进行数据存储。  
要是用户连 cookies 都不开的话，那就是钉子户，他也知道不使用 cookies 的后果，就这样。  
GET IT AND ENJOY IT.

#不足之处

会占用一个命名空间，放在 `window.browserStorage` 下面，要是这个空间已经被占用，将警告下，就没进行其他动作了。开发者在调试的时候应该注意这个，要是出现一个经过，看看里面的英文，就清楚是为什么了。

#空间属性

```javascript
browserStorage = {
  date: new Date(),
  read: function() { "....." },
  fireEvent: function() { "....." },
  remove: function() { "....." },
  storage: function() { "....." },
  storageSecond: function() { "....." }
}
```

#使用

首先加载 js 文件进去。
```html
<script src="src/util.js"></script>
```
然后，就用下面的方法进行操作了。

## browserStorage.date

这个是用于比较数据的存储时间信息的，在页面加载的时候进行初始化，记录的是页面初始化时候的时间。
默认不会变，毕竟真个页面来说，不需要精细到每时每刻都重新获取时间，要是场景需要，直接覆盖赋值即可。

## browserStorage.read

从存储的信息中读取数据。
要是在 sessionStroage 和 localStorage 都进行存储了，那么将直接返回 sessionStroage 中、删除 localStorage 中的，这么说，就是读取时候， sessionStroage 的优先级将高于 localStorage 。

## browserStorage.fireEvent

自动挂载为 空函数 或者 触发事件的函数。
由于 chrome\firefox 等等浏览器，在本页面更新 storage 数据的时候，不触发本页面 window 的 storage 事件。 IE 系列则进行触发。
因此程序将做了判断，在不触发本页面 storage 事件的浏览器时，将触发一个自制的事件（window 的 storage-passive 事件，监控的时候可以写上这个，但是 event 参数没那么正规而已），提醒用户 storage 进行修改了。
在 IE 等能触发本页面 storage 事件的浏览器，将挂载为 空函数。要是觉得没必要，直接删除掉源码里面关于 browserStorage.fireEvent 的所有行即可。

## browserStorage.remove

强力移除 storage 的函数，不管是通过什么方式存储进去的。


## browserStorage.storage(name, value, expires)

进行信息的存储。以天为跳转单位。 存储进 html5 的 stronge。
@param { string } name 字段的名字  
@param { string } value 字段的值  
@param { int } 字段的有效时间，多少天。
              为 空，则直接存储为 session 方式。
              为 数值 n ，则 n 天之后过期。
              为 数值 0 ，则永久保存，直到手动删除。



## browserStorage.storageSecond(name, value, expires)

进行信息的存储。以秒为跳转单位。 存储进 html5 的 stronge。
@param { string } name 字段的名字  
@param { string } value 字段的值  
@param { int } 字段的有效时间，多少天。
              为 空，则直接存储为 session 方式。
              为 数值 n ，则 n 天之后过期。
              为 数值 0 ，则永久保存，直到手动删除。

#测试

test 文件夹下面有个 index.html 下面，打开它，打开 console ， 进行操作，查看 console 的效果，现阶段就只做了这方面的了，没做自动测试。


#版本

## 当前版本 
0.1.0-pre

## 0.1.0-pre
初步发布能用的版本，还没经过多种浏览器的使用



##授权协议
Released under the MIT, BSD, and GPL Licenses

==========
© shenqihui
