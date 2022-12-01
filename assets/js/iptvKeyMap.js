// 请求地址
var env_host =  ['203.110.166.82','localhost'].indexOf(location.hostname) > -1 ? 'test' : 'prod';
var host_dict = {
    // 测试环境
    'test': '203.110.166.82',
    // 生产环境
    'prod': '222.68.210.26'
};
var api_ptl = 'http';
var api_port = '7189';
var host_addr = api_ptl + '://' + host_dict[env_host] + ':' + api_port;
//接口
var addr = "http://121.4.166.61:8080/api-1.0/data/";
var currentKeyCode = -1;

if (typeof parent.setFrameSize != 'undefined'){
    parent.setFrameSize(1280);
}
var iptvKeyMap = {
    esc: 0x0008,
    back: 0x0008,
    confirm: 0x000d,
    left: 0x0025,
    up: 0x0026,
    right: 0x0027,
    down: 0x0028,
    blank: 0x0020,
    pageUp: 0x0021,
    pageDown: 0x0022,
    confirmed: 1,
    homeMainRow: 1,
    homeMainCol: 1,
    headerMainRow: 1,
    headerMainCol: 1,
    navMainRow: 1,
    navMainCol: 1,
    specialRow: 1,
    specialCol: 1,
    wholeMainRow: 1,
    wholeMainCol: 1,
    resultMainRow: 1,
    resultMainCol: 1,
    historyRow: 1,
    historyCol: 1,
    quitRow: 1,
    quitCol: 1,
    data: {},
    index_Keycode: 0,
    index_list: 0,
    index_news: 0,
    index_Row: 0,
    index_Col: 0,
};

window.onkeydown=function(e){
    if(e.keyCode == iptvKeyMap.up || e.keyCode == 87){        //上
        currentKeyCode = 1;
    }else if(e.keyCode == iptvKeyMap.down || e.keyCode == 83){  //下
        currentKeyCode = 2;
    }else if(e.keyCode == iptvKeyMap.left || e.keyCode == 65){  // 左
        currentKeyCode = 3;
    }else if(e.keyCode == iptvKeyMap.right || e.keyCode == 68){  // 右
        currentKeyCode = 4;
    }else if(e.keyCode == iptvKeyMap.confirm || e.keyCode == 13){  // 确定
        currentKeyCode = 5;
    }else if(e.keyCode == iptvKeyMap.back){  // 返回
        currentKeyCode = 0;
    }else{
        currentKeyCode = -1;
    }
    e = e ? e : window.event;
    var keyCode = e.which ? e.which : e.keyCode;

    switch (keyCode){
        case 259:
            try {
                if(WindowPlayer.isPlayerRun == false) return;
                WindowPlayer.volumeUp(10);
                WindowPlayer.setDisplayById('mute-bar', 'none');
                WindowPlayer.setDisplayById('volume-bar', 'block');
                volume_img = '/assets/resources/imgs/v'+(WindowPlayer.volume / 10)+'.png';
                document.getElementById('volume-bar').src = volume_img;
                // 隐藏全部控件
                clearTimeout(WindowPlayer.timeoutObj);
                WindowPlayer.timeoutObj = setTimeout(function (){
                    WindowPlayer.setDisplayByClass('complayer', 'none');
                }, WindowPlayer.hideAfterTime);
                currentKeyCode = -1;
            } catch (error) {
                
            }
            break;

        // 遥控器音量-
        case 260: 
            try {
                if(WindowPlayer.isPlayerRun == false) return;
                WindowPlayer.volumeDown(10);
            // view
            if (WindowPlayer.volume <= 0){
                // 静音
                WindowPlayer.setDisplayById('mute-bar', 'block');
            }
            WindowPlayer.setDisplayById('volume-bar', 'block');
            volume_img = '/assets/resources/imgs/v'+(WindowPlayer.volume / 10)+'.png';
            document.getElementById('volume-bar').src = volume_img;
            // 隐藏全部控件
            clearTimeout(WindowPlayer.timeoutObj);
            WindowPlayer.timeoutObj = setTimeout(function (){
                WindowPlayer.setDisplayByClass('complayer', 'none');
            }, WindowPlayer.hideAfterTime);
            currentKeyCode = -1;
            } catch (error) {
                
            }
            break;

        // 停止播放事件
        case 0x300:
            eval('eventJson = ' + Utility.getEvent());
            var typeStr = eventJson.type;
            if ('EVENT_MEDIA_BEGINING' == typeStr){
                // 开始播放
                // todo

            }else if ('EVENT_MEDIA_END' == typeStr) {
                // 播放结束
                if (typeof WindowPlayer == 'object'){
                    WindowPlayer.playFromStart();
                }
                
            } else if ('EVENT_MEDIA_ERROR' == typeStr) {
                // 播放中出现错误
            } else if ('EVENT_PLAYMODE_CHANGE' == typeStr) {
                // 播放模式变化（快进快退、播放、暂停）

            }else {

            }
            break;
    }
    if(currentKeyCode<=5 && currentKeyCode>=0){
        resetActive();
        action();
    }
};

function setActive(dal, max){
    iptvKeyMap.index_Keycode += dal;
    if(iptvKeyMap.index_Keycode < 0) iptvKeyMap.index_Keycode = 0;
    if(iptvKeyMap.index_Keycode > max) iptvKeyMap.index_Keycode = max;
    document.getElementById('fre'+iptvKeyMap.index_Keycode).className = "fre active";
};

function resetActive(){
    var i = 0;
    var fre = document.getElementById('fre'+i);
    while(fre){
        i++;
        fre.className = "fre";
        fre = document.getElementById('fre'+i);
    }
};

/**
 * 返回
 */
function referrerBack() {
    var referrer_url = document.referrer;
    window.location.href = referrer_url.replace(
        eval('/(pointer=)([^&]*)/gi'),
        '$1' + getUrlValue('pointer')
    );
}

/**
 * 处理焦点坐标 row col
 */
function handlerPointerRC(pointer){
    if (pointer){
        var len = pointer.length;
        return {
            r: pointer.substr(len - 2, 1),
            c: pointer.substr(len - 1, 1)
        }
    }
}

// 当前指针
var curPointer = '';

function getUrlValue(field){
    if (!location.search){
        return null;
    }
    var params = location.search.split('?')[1].split('&');
    for (var i in params){
        var map = params[i].split('=');
        if (field == map[0]){
            return map[1];
        }
    }
    return null;
}
// 获取当前url的名称
function getUrlName(){
    var name_list = {
        'index': '首页',
        'detail': '播放页',
        'special': '专题页',
        'whole': '分类页',
        'pay': '支付页',
        'whole_collect': '收藏页'
    };
    var url = window.location.href;
    var url_match = url.match(/\:\d+\/(.+?)\.html/i)
    if (url_match == null){
        return '首页';
    }
    var name = url_match[1];
    var url_name = name_list[name];
    if (url_name == null){
        url_name = '首页';
    }
    return url_name;
}

// 提示信息
// toast.show('您已经是VIP用户，无需再订购');
var toast = {
    create: function (msg_id, msg, width){
        page_width = parseInt(document.body.getAttribute('width'));
        page_height = parseInt(document.body.getAttribute('height'));

        toast_width = width || 200;
        toast_height = 50;
        toastObj = document.createElement('div');
        toastObj.id = msg_id;
        toastObj.className = msg_id;
        toastObj.innerText = msg;
        toastObj.style.border = '2px solid #FF9933';
        toastObj.style.fontSize = '16px';
        toastObj.style.height = ''+toast_height+'px';
        toastObj.style.lineHeight = ''+toast_height+'px';
        toastObj.style.width = toast_width+'px';
        toastObj.style.color = '#FFFFFF';
        toastObj.style.textAlign = 'center';
        toastObj.style.borderRadius = '12px';
        toastObj.style.backgroundColor = '#111111';
        // toastObj.style.opacity = '0.9';
        toastObj.style.zIndex = 9999;
        toastObj.style.position = 'absolute';
        toastObj.style.left = ''+((page_width - toast_width)/2)+'px';
        toastObj.style.top = ''+(page_height * 0.8)+'px';
        document.getElementsByTagName("body")[0].appendChild(toastObj);
    },

    show: function(msg, width){
        msg_id = 'toast_msg';
        if (this.isExist(msg_id)){
            $('#'+msg_id).remove();
            clearTimeout(this.timeoutObj);
        }
        
        this.create(msg_id, msg, width);
        this.timeoutObj = setTimeout(function(){
            $('#'+msg_id).remove();
        }, 5000);
    },

    isExist: function (msg_id){
        if (document.getElementById(msg_id) == null){
            return false;
        }
        return true;
    }
};
//**回滚 row col */
function rollBackRowCol(rollPoint,rollRow,rollCol){
  switch (rollPoint) {
    case "up":
      iptvKeyMap[rollRow]++;
      break;
    case "down":
      iptvKeyMap[rollRow]--;
      break;
    case "left":
      iptvKeyMap[rollCol]++;
      break;
    case "right":
      iptvKeyMap[rollCol]--;
      break;
  }
}

function exitApp(){
    
    try {
        if (typeof parent.setFrameSize != 'undefined') {
            parent.setFrameSize(720);
        }
        var platform = MyCookie.get('_platform');
        console.log('--' + platform);
        MyCookie.delete('_platform');
        if (platform == '4k') {
            // 4K桌面
            console.log('--4k exit');
            Utility.setValueByName('exitIptvApp');
            return ;
        } else if (platform == '7' && MyCookie.exist('page7')){
            // 7.0
            console.log('--7.0 exit');
            return_url = MyCookie.get('page7');
            MyCookie.delete('page7');
            window.location.href = return_url;
            return ;
        } else {
            // 融合
            console.log('--rong exit');
            if (!!getCookie('epg_info') && getCookie('epg_info').indexOf('<partner>FH</partner>') > -1) {
                window.parent.location.href = Authentication.CTCGetConfig('EPGDomain');
            } else {
                window.location.href = Authentication.CTCGetConfig('EPGDomain');
            }
        }
    } catch (error) {
        
    }
    
}


function formatDataList(list){
    if(!list){
      return [];
    }
    for (var  index = 0; index < list.length; index++) {
      var element = list[index];
      formatData(element);
    }
    return list;
  }
  function formatData(obj){
    if(!obj) return {};
    //tpyes 1 专题  0 视频
    if(obj.types == 1){
      // act 专题下 types  0-自营专题 1-就是第三方
        obj.type_id = obj.act.types == 0  ? obj.act.code : obj.act.url;
        obj.img = obj.act.img
    }else if(obj.types == 0){
      obj.type_id = obj.videos.id
      obj.img = obj.videos.img
    }
    return obj;
  }

  function menuIcon(data){
    
      if(data.code ==  'gcw'){ 
        data.unselected_img = '/assets/imgs/icon/gcw-un.png';
        data.cur_img = '/assets/imgs/icon/gcw-cur.png';
        data.selected_img = '/assets/imgs/icon/gcw-selected.png';
      }else if(data.code == 'lljsc'){
        data.unselected_img = '/assets/imgs/icon/lljsc-un.png';
        data.selected_img = '/assets/imgs/icon/lljsc-selected.png';
        data.cur_img = '/assets/imgs/icon/lljsc-cur.png';
      }else if(data.code == 'tjys'){
        data.unselected_img = '/assets/imgs/icon/tjys-un.png';
        data.selected_img = '/assets/imgs/icon/tjys-selected.png';
        data.cur_img = '/assets/imgs/icon/tjys-cur.png';
      }else if(data.code == 'jkyj'){
        data.unselected_img = '/assets/imgs/icon/jkyj-un.png';
        data.selected_img = '/assets/imgs/icon/jkyj-selected.png';
        data.cur_img = '/assets/imgs/icon/jkyj-cur.png';
      }
    return data;
  }

  function relocation(url){
    if (WindowPlayer && WindowPlayer.isPlayerRun == true){
        WindowPlayer.destory();
    }
    location.href=url;
  }

  function updateMenu(homeIndex){
      try {
        switch(homeIndex){
            case 0:
            document.getElementById('xuanze').style.left="0";
            break;
            case 1:
            document.getElementById('xuanze').style.left = "311px";
            break;
            case 2:
            document.getElementById('xuanze').style.left = "626px";
            break;
            case 3:
            document.getElementById('xuanze').style.left = "940px";
            break;
          }
      } catch (error) {
          
      }
  }



