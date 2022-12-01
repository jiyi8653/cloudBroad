function backUp() {
  // 遥控器返回
  destoryMP();
  var referrer_url = document.referrer;

  if (return_url.length > 2) {
    referrer_url = return_url;
  } else if (referrer_url.indexOf('pay-callback') > -1 || referrer_url.indexOf('pay') > -1) {
    referrer_url = '/iptv/';
  }
  window.location.href = referrer_url.replace(
    eval('/(pointer=)([^&]*)/gi'),
    '$1' + getUrlValue('pointer')
  );
}
// 窗口播放器对象
 WindowPlayer = {
  // 调试信息
  debug: function (value){
    document.getElementById('test-bar').innerHTML = value;
    this.setDisplayById('test-bar', 'block');
  },
  // 全屏播放初始化
  initParam: function (left, top, width, height){
    this.left = left;
    this.top = top;
    this.width = width;
    this.height = height;
    try {
      this.mp = new MediaPlayer();
      // 本地播放器实例标识
      this.instanceId = this.mp.getNativePlayerInstanceID();
      this.playListFlag = 1;
      this.videoDisplayMode = 1;
      
      // 全屏播放时，宽高设为0
      this.height = 0;
      this.width = 0;
      this.left = 0;
      this.top = 0;
      // 设置声音（0：有声【默认】；1：静音）
      this.muteFlag = 0;
      this.subtitleFlag = 0;
      this.videoAlpha = 0;
      // 是否自动循环播放（0自动循环播放；1不自动循环播放）
      this.cycleFlag = 1;
      this.randomFlag = 0;
      this.autoDelFlag = 0;
      this.useNativeUIFlag = 0;
      volume = MyCookie.get('windowPlayerVolume');
      volume = parseInt(volume);
      // document.getElementById('mytest-bar').innerHTML = MyCookie.get('windowPlayerVolume');
      if ([0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].indexOf(volume) > -1){
        this.volume = volume;
      }else {
        this.volume = 40;
      }
      // 自定义参数
      this.selfParam();
      
      // 设置
      this.mp.initMediaPlayer(
          this.instanceId,
          this.playListFlag,
          this.videoDisplayMode,
          this.height, this.width, this.left, this.top,
          this.muteFlag,
          this.useNativeUIFlag, 
          this.subtitleFlag,
          this.videoAlpha,
          this.cycleFlag, 
          this.randomFlag,
          this.autoDelFlag
      )
      this.mp.setNativeUIFlag(this.useNativeUIFlag);
      this.mp.setAudioVolumeUIFlag(1);

      this.mp.setAudioTrackUIFlag(1);
      this.mp.setMuteUIFlag(1);
      // 0:单媒体，1:播放列表
      this.mp.setSingleOrPlaylistMode(0);
      this.mp.setAllowTrickmodeFlag(0);
      // 是否循环播放（0：循环播放；1：单次播放）
      this.mp.setCycleFlag(this.cycleFlag);
      // 全屏播放（1：全屏；0：区域）
      // this.mp.setVideoDisplayMode(1);
      this.mp.setVideoDisplayMode(0);
      this.mp.setVideoDisplayArea(left, top, width, height);
      
      this.mp.setVolume(this.volume);
      // 刷新播放器设置并生效
      this.mp.refreshVideoDisplay();
    } catch (error) {
      // this.debug('error info:'+error);
    }
  },
  initParamFull: function (){
    this.left = 0;
    this.top = 0;
    this.width = 0;
    this.height = 0;
    try {
      this.mp = new MediaPlayer();
      // 本地播放器实例标识
      this.instanceId = this.mp.getNativePlayerInstanceID();
      this.playListFlag = 1;
      this.videoDisplayMode = 1;
      
      // 全屏播放时，宽高设为0
      this.height = 0;
      this.width = 0;
      this.left = 0;
      this.top = 0;
      // 设置声音（0：有声【默认】；1：静音）
      this.muteFlag = 0;
      this.subtitleFlag = 0;
      this.videoAlpha = 0;
      this.cycleFlag = 0;
      this.randomFlag = 0;
      this.autoDelFlag = 0;
      this.useNativeUIFlag = 0;
      this.volume = 40;

      // 自定义参数
      this.selfParam();
      
      // 设置
      this.mp.initMediaPlayer(
          this.instanceId,
          this.playListFlag,
          this.videoDisplayMode,
          this.height, this.width, this.left, this.top,
          this.muteFlag,
          this.useNativeUIFlag, 
          this.subtitleFlag,
          this.videoAlpha,
          this.cycleFlag, 
          this.randomFlag,
          this.autoDelFlag
      )
      this.mp.setNativeUIFlag(this.useNativeUIFlag);
      this.mp.setAudioVolumeUIFlag(1);

      this.mp.setAudioTrackUIFlag(1);
      this.mp.setMuteUIFlag(1);
      // 0:单媒体，1:播放列表
      this.mp.setSingleOrPlaylistMode(0);
      this.mp.setAllowTrickmodeFlag(0);
      // 是否循环播放（0：循环播放；1：单次播放）
      this.mp.setCycleFlag(this.cycleFlag);
      // 全屏播放（1：全屏；0：区域）
      this.mp.setVideoDisplayMode(0);
      this.mp.setVideoDisplayArea(0, 0, 1280, 720);
      this.mp.setVolume(this.volume);
      // 刷新播放器设置并生效
      this.mp.refreshVideoDisplay();
    } catch (error) {
      // this.debug('error info:'+error);
    }
  },
  // 刷新区域设置
  refreshArea: function (){
    try {
      this.mp.setVideoDisplayMode(0);
      this.mp.setVideoDisplayArea(this.left, this.top, this.width, this.height);
      this.mp.refreshVideoDisplay();
    } catch (error) {
      
    }
  },
  fullPlay:function(){
    try {
      this.mp.setVideoDisplayMode(1);
      this.mp.refreshVideoDisplay();
    } catch (error) {
    }
  },
  setSingleUrl: function (mediaUrl){
    try {
      // 设置媒体播放器播放内容
      var json = '[{mediaUrl:"' + mediaUrl+ '",';
      json += 'mediaCode: "jsoncode1",';
      json += 'mediaType:2,';
      json += 'audioType:1,';
      json += 'videoType:1,';
      json += 'streamType:1,';
      json += 'drmType:1,';
      json += 'fingerPrint:0,';
      json += 'copyProtection:1,';
      json += 'allowTrickmode:1,';
      json += 'startTime:0,';
      json += 'endTime:20000,';
      json += 'entryID:"jsonentry1"}]';
      this.mp.setSingleMedia(json);
    } catch (error) {
      
    }
  },
  // 自定义参数
  selfParam: function (){
    // 播放器是否在运行
    this.isPlayerRun = false;
    // 显示控件x秒后隐藏（默认3秒）
    this.hideAfterTime = 3000;
    // 试看
    this.isTryWatch = true;
    // 试看秒数
    this.tryWatchSecond = 30;
  },
  trySee: function () {
    self = this;
    clearInterval(this.intervalObj);
    this.intervalObj = setInterval(function () {
      try {
        // 总播放时长
        playTimeLength = self.mp.getMediaDuration();
        // 当前播放时间
        playCurrentTime = self.mp.getCurrentPlayTime();
        if( playCurrentTime >= self.tryWatchSecond){
          self.mp.stop(); 
          self.mp.gotoStart(); 
        }
      } catch (error) {
        
      }
      
    }, 300);
  },
  // 从起始点开始播放
  playFromStart: function (){
      try {
        //开始播放
        this.mp.playFromStart();
        this.isPlayerRun = true;
      } catch (error) {
        
      }
  },
  // 释放（返回）
  destory: function (){
    try {
      this.mp.stop();
      this.mp.releaseMediaPlayer(this.instanceId);
      this.isPlayerRun = false;
    } catch (error) {
      
    }
  },
  // 暂停
  pause: function (){
      try {
        this.mp.pause();
      } catch (error) {
        
      }
  },
  // 继续播放
  play: function (){
      try {
        this.mp.resume();
        this.isPlayerRun = true;
      } catch (error) {
        
      }
  },
  // 音量+
  volumeUp: function (value){
      try {
        this.volume += value;
        if (this.volume > 100){
            this.volume = 100;
        }
        MyCookie.set('windowPlayerVolume', this.volume);
        // document.getElementById('mytest-bar').innerHTML = MyCookie.get('windowPlayerVolume');
        // 取消静音
        // this.setDisplayById('mute-bar', 'none');
        this.mp.setVolume(this.volume);
        this.mp.refreshVideoDisplay();
      } catch (error) {
        
      }
  },
  // 音量-
  volumeDown: function (value){
    try {
      this.volume -= value;
      if (this.volume <= 0){
        // 静音
        this.volume = 0;
        // this.setDisplayById('mute-bar', 'block');
      }
      MyCookie.set('windowPlayerVolume', this.volume);
      // document.getElementById('mytest-bar').innerHTML = MyCookie.get('windowPlayerVolume');
      this.mp.setVolume(this.volume);
      this.mp.refreshVideoDisplay();
    } catch (error) {
      
    }
  },
  // 静音
  volumeMute: function (){
    try {
      this.volume = 0;
      MyCookie.set('windowPlayerVolume', this.volume);
      // document.getElementById('mytest-bar').innerHTML = MyCookie.get('windowPlayerVolume');
      this.mp.setVolume(this.volume);
      this.mp.refreshVideoDisplay();
    } catch (error) {
      
    }
  },
  // 根据id显示或隐藏(value: block|none)
  setDisplayById: function (id, value){
    element = document.getElementById(id);
    if (element){
      element.style.display = value;
    }
  },
  // 根据class显示或隐藏(value: block|none)
  setDisplayByClass: function (name, value){
    elements = document.getElementsByClassName(name);
    if (elements.length > 0){
      for (var i in elements){
        elements[i].style.display = value;
      }
    }
  }
};


