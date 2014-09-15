#browserStorage

Use localStorage or cookies to storage data.  
使用 localStorage/cookies 存储数据。


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
加载完毕 js 之后，一般情况下，会占用 `window.browserStorage` 和 `window.browserStorageForceUseCookie` 空间。


#空间属性

```javascript
window.browserStorageForceUseCookie = false;
window.browserStorage = {
  date: new Date(),
  read: function() { "....." },
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

## 选择使用 html5 storage 或者 cookie

默认将使用 html5 storage , 不支持 html5 storage 的时候才转移到 cookie 存储，要是想主动转移使用 cookie ，需要再引入 js 文件之前，设置如下代码：
```javascript
window.browserStorageForceUseCookie = true
```

## browserStorage.date

这个是用于比较数据的存储时间信息的，在页面加载的时候进行初始化，记录的是页面初始化时候的时间。  
默认不会变，毕竟真个页面来说，不需要精细到每时每刻都重新获取时间，要是场景需要，直接覆盖赋值即可。

## browserStorage.read(name)

从存储的信息中读取数据。  
要是在 sessionStroage 和 localStorage 都进行存储了，那么将直接返回 sessionStroage 中、删除 localStorage 中的，这么说，就是读取时候， sessionStroage 的优先级将高于 localStorage 。



## browserStorage.remove(name)

强力移除 storage 的函数，不管是通过什么方式存储进去的。  





## browserStorage.storageSecond(name, value, expires)

```javascript
/**
 * @desc 进行信息的存储。以秒为跳转单位。 存储进 html5 的stronge。多少秒之后过期。
 * @memberof browserStorage
 * @param { string } name 字段的名字
 * @param { string } value 字段的值
 * @param { int } 字段的有效时间，多少秒。
          为 空，则直接存储为 session 方式。
          为 数值 n ，则 n 秒之后过期。
          为 数值 0 ，则永久保存，直到手动删除。
 **/
``` 

## browserStorage.storage(name, value, expires)

进行信息的存储。以天为跳转单位。 存储进 html5 的 stronge。  
```javascript
/**
 * @desc 进行信息的存储。以天为跳转单位。 存储进 html5 的stronge。
 * @memberof browserStorage
 * @param { string } name 字段的名字
 * @param { string } value 字段的值
 * @param { int } 字段的有效时间，多少天。
          为 空，则直接存储为 session 方式。
          为 数值 n ，则 n 天之后过期。
          为 数值 0 ，则永久保存，直到手动删除。
 **/
```  
这个接口是在 browserStorage.storageSecond 的基础上衍生出来直接设置多少天之后过期的。 程序内部实现直接等于一个适配器。把天数转换为秒数。
```javascript
storageSecond(name, value, expires * 24 * 60 * 60);
``` 

#测试

test 文件夹下面有个 index.html 下面。  
打开它，打开 console ， 进行操作，查看 console 的效果，现阶段就只做了这方面的了，没做自动测试。


#版本

## 当前版本 
0.1.1

## 0.1.1
修复 0.1.0-pre 版本的 cookies 大 bug 。正式发布 0.1 版本。经过测试， firefox\chrome\IE11 可用。

## 0.1.0-pre
初步发布能用的版本，还没经过多种浏览器的使用。



##授权协议

Released under the [WTFPL][1] Licenses  

就是没啥授权，想怎么改就怎么改，改的好改的坏什么的，也 pull request 过来瞧瞧。  
是驴子是马，溜溜就知道。

==========








==========
  [1]: http://www.wtfpl.net/txt/copying/
