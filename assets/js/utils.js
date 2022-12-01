function rollAnimateLeft(boxWidth, boxNum, focus, time, ele, offset) {
  /*
  boxWidth:每页的宽度  单位 rem；
  boxNum：每页的数量 ；
  focus：当前焦点位置 ；
  time：动画时间 ;
  offset:初始定位
   */
  var left = -((Math.ceil((focus + 1) / boxNum) - 1) * boxWidth - offset) * 100 + 'px';
  ele.stop().animate({ left: left }, time);
}

function checkPageControlStatue(ele, foucs, num, allDivNum, preEle, nextEle) {
  if (parseInt($('#' + ele).css('left')) == 0) $('#' + preEle).hide();
  else $('#' + preEle).show();
  if (Math.ceil(allDivNum / num) > Math.ceil(foucs / num)) {
    $('#' + nextEle).show();
  } else {
    $('#' + nextEle).hide();
  }
}

// 获取URL参数
function getUrlQuery() {
  var query = window.location.search.substring(1);

  var vars = query.split('&');
  var obj = {};

  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split('=');

    if (pair && pair.length === 2) {
      obj[pair[0]] = pair[1];
    }
  }
  return obj;
}

// 获取URL指定参数
function getQueryVariable(variable) {
  var query = window.location.search.substring(1);

  var vars = query.split('&');

  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split('=');

    if (pair[0] == variable) {
      return pair[1];
    }
  }

  return false;
}

// 文字横向滚动
function ScrollImgLeft() {
  var speed = 50;
  var MyMar = null;
  var scroll_begin = document.getElementById('scroll_begin');
  var scroll_end = document.getElementById('scroll_end');
  var scroll_div = document.getElementById('scroll_div');
  scroll_end.innerHTML = scroll_begin.innerHTML;
  function Marquee() {
    if (scroll_div.clientWidth == scroll_div.scrollWidth - scroll_div.scrollLeft) {
      scroll_div.scrollLeft = 0;
    } else {
      scroll_div.scrollLeft++;
    }
  }
  setInterval(Marquee, speed);
}

function getCookie(cookiename) {
  var name = cookiename + '=';
  var cs = document.cookie.split(';');
  for (var i = 0; i < cs.length; i++) {
    var c = cs[i].trim();
    if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
  }
}
function setCookie(name, value, day) {
  if (day !== 0) {
    //当设置的时间等于0时，不设置expires属性，cookie在浏览器关闭后删除
    var expires = day * 24 * 60 * 60 * 1000;
    var date = new Date(+new Date() + expires);
    document.cookie = name + '=' + escape(value) + ';expires=' + date.toUTCString();
  } else {
    document.cookie = name + '=' + escape(value);
  }
}
function delCookie(name) {
  setCookie(name, '', -1);
}
/*********** MyCookie ***********/
// cookie键名：_c
// cookie存储结构：name1=aa|name2=bb
var MyCookie = {
  // 所有的cookie
  getAll: function () {
    all = {};
    _c = getCookie('_c');
    if (_c == null) {
      return all;
    }
    _c_arr = _c.split('|');
    for (key in _c_arr) {
      content = _c_arr[key].trim();
      val_arr = content.split('=');
      if (val_arr.length == 2) {
        all[val_arr[0]] = val_arr[1];
      }
    }
    return all;
  },
  // 设置
  set: function (name, value) {
    set_res = [];
    is_exist = false;
    cookie = this.getAll();
    for (key in cookie) {
      if (key == name) {
        temp = key + '=' + value;
        is_exist = true;
      } else {
        temp = key + '=' + cookie[key];
      }
      set_res.push(temp);
    }

    // 新增
    if (is_exist == false) {
      set_res.push(name + '=' + value);
    }
    document.cookie = '_c=' + set_res.join('|');
  },
  // 获取一个
  get: function (name) {
    cookie = this.getAll();
    return cookie[name];
  },
  // 删除
  delete: function (name) {
    del_res = [];
    cookie = this.getAll();
    for (key in cookie) {
      if (key != name) {
        del_res.push(key + '=' + cookie[key]);
      }
    }
    document.cookie = '_c=' + del_res.join('|');
  },
  // 是否存在
  exist: function (name) {
    cookie = this.getAll();
    if (cookie && cookie[name] == null) {
      return false;
    }
    return true;
  }
};
// 7.0平台专题板块设置platform返回参数
function setEPGInfo() {
  var epg_info = getQueryVariable('epg_info') || '';

  if (epg_info != '') {
    epg_info = decodeURIComponent(epg_info);
    url_match = epg_info.match(/\<page_url\>(.*?)\<\/page_url\>/i);
    if (url_match != null) {
      MyCookie.set('page7', url_match[1] + '?vas_info=' + encodeURIComponent('<vas_action>back</vas_action>') + '&cusBackFlag=true');
      MyCookie.set('_platform', '7');
    }
  }
}
// 获取默认platform参数
function getDefaultPlatform() {
  // 设置7.0返回platform
  setEPGInfo();

  console.log('--my getDefaultPlatform--');
  // 设置返回平台

  var platform = getQueryVariable('platform');
  if (platform) {
    MyCookie.set('_platform', platform);
  } else if (!!MyCookie.get('_platform')) {
    platform = MyCookie.get('_platform');
  } else {
    // 既没有platform参数，又没有epg_info参数
    platform = 'rong';
  }
  return platform;
}

function getToday() {
  var date = new Date();
  return date.getFullYear() +''+ date.getMonth() +''+ date.getDate();
}


var httpTools = {
	/* ajax请求get
	 * @param url     string   请求的路径
	 * @param query   object   请求的参数query
	 * @param succCb  function 请求成功之后的回调
	 * @param failCb  function 请求失败的回调
	 * @param isJson  boolean  true： 解析json  false：文本请求  默认值true 
	 */
	ajaxGet : function (url, query, succCb, failCb, isJson) {
		// 拼接url加query
		if(query) {
			url += "?";
			for(var key in query){
				url += key+"="+query[key]+"&";
			}
			// 把最后一个&删掉
			url = url.slice(0, -1);
		}
		
		// 1、创建对象
		var ajax = new XMLHttpRequest();
		// 2、建立连接
		ajax.open("GET", url, true);
		
		// 3、发送请求
		ajax.send(null);
		
		// 4、监听状态的改变
		ajax.onreadystatechange = function(){
			if(ajax.readyState === 4){
				if(ajax.status === 200){
					// 用户传了回调才执行
					// isJson默认值为true，要解析json
					if(isJson === undefined){
						isJson = true;
					}
					// var res = isJson ? JSON.parse(ajax.responseText) : ajax.responseText;
					var res = ajax.responseText;
					succCb && succCb(res);
				}else{
					// 请求失败
					failCb && failCb();
				}
			}
		}
	},
	
	// 调用该方法实例：
	//tools.ajaxGet("03-ajax.php", {"name": "lisi"}, function(res){console.log(res);}, function() {},false);
	/* ajax请求post
	 * @param url     string   请求的路径
	 * @param query   object   请求的参数query
	 * @param succCb  function 请求成功之后的回调
	 * @param failCb  function 请求失败的回调
	 * @param isJson  boolean  true： 解析json  false：文本请求  默认值true 
	 */
	ajaxPost: function(url, query, succCb, failCb, isJson){
		var ajax = new XMLHttpRequest();
		ajax.open("POST", url, true);
		// 设置请求头数据传输格式
		ajax.setRequestHeader("Content-type","application/x-www-form-urlencoded");
		// 把query拼接成urlencoded
		var str = "";
		for(var key in query){
			str += key + "=" + query[key] + "&";
		}
		str = str.slice(0,-1);
		ajax.send(str);
		ajax.onreadystatechange = function () {
			if(ajax.readyState === 4) {
				if(ajax.status === 200){
					// 判断isJson是否传进来了
					isJson = isJson === undefined ? true : isJson;
					succCb && succCb(isJson ? JSON.parse(ajax.responseText) : ajax.responseText);
				}
			}
		}
	},

// 调用该方法实例：
//tools.ajaxGet("03-ajax.php", {"name": "lisi"}, function(res){console.log(res);}, function() {},false);

   httpPost:function(url,param,succCb,failCb){
   	$.ajax({
   	  url:addr+url,
   	  type:"POST",
   	  data:JSON.stringify(param),
   	  contentType:"application/json; charset=utf-8",
   	  dataType:"json",
   	  success: function(res){
   		  succCb(res)
   	  }})
   }
}