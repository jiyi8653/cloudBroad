// 进入
////////////////////////////////////////////////////////////
// 7.0平台专题板块设置platform返回参数
// function setEPGInfo(){
//     var epg_info = getQueryVariable('epg_info') || '';

//     if (epg_info != ''){
//         epg_info = decodeURIComponent(epg_info);
//         url_match = epg_info.match(/\<page_url\>(.*?)\<\/page_url\>/i);
//         if (url_match != null){
//             MyCookie.set('page7', url_match[1] + '?vas_info='+encodeURIComponent('<vas_action>back</vas_action>')+'&cusBackFlag=true');
//             setCookie('_platform', '7');
//         }
//     }
// }
// // 获取默认platform参数
// function getDefaultPlatform(){
//     // 设置7.0返回platform
//     setEPGInfo();
    
//     console.log('--app getDefaultPlatform--');
//     // 设置返回平台

//     var platform = getQueryVariable('platform');
//     if (platform){
//         setCookie('_platform', platform);
//     }else if (!!getCookie('_platform')){
//         platform = getCookie('_platform');
//     }else {
//         // 既没有platform参数，又没有epg_info参数
//         platform = 'rong';
//     }
//     return platform;
// }
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
  
    console.log('--app getDefaultPlatform--');
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


// 返回
////////////////////////////////////////////////////////////
function exitApp(){
    if (typeof parent.setFrameSize != 'undefined') {
        parent.setFrameSize(720);
    }
    var platform = getCookie('_platform');
    if (platform == '4k') {
        // 4K桌面
        Utility.setValueByName('exitIptvApp');
        return ;
    } else if (platform == '7' && MyCookie.exist('page7')){
        // 7.0
        return_url = MyCookie.get('page7');
        MyCookie.delete('page7');
        window.location.href = return_url;
        return ;
    } else {
        // 融合
        if (getCookie('epg_info').indexOf('<partner>FH</partner>') > -1) {
            window.parent.location.href = Authentication.CTCGetConfig('EPGDomain');
        } else {
            window.location.href = Authentication.CTCGetConfig('EPGDomain');
        }
    }
}

