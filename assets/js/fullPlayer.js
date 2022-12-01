// 全屏播放器对象
var FullPlayer = {
  // 全屏播放初始化
  initParam: function (mediaUrl,is_free) {
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
      this.volume = 30;
      // 自定义参数
      this.selfParam(is_free);

      // 设置
      this.mp.initMediaPlayer(
        this.instanceId,
        this.playListFlag,
        this.videoDisplayMode,
        this.height,
        this.width,
        this.left,
        this.top,
        this.muteFlag,
        this.useNativeUIFlag,
        this.subtitleFlag,
        this.videoAlpha,
        this.cycleFlag,
        this.randomFlag,
        this.autoDelFlag
      );
      this.mp.setNativeUIFlag(this.useNativeUIFlag);
      this.mp.setAudioVolumeUIFlag(1);

      this.mp.setAudioTrackUIFlag(1);
      this.mp.setMuteUIFlag(1);
      this.mp.setSingleOrPlaylistMode(0);
      this.mp.setAllowTrickmodeFlag(0);
      this.mp.setCycleFlag(this.cycleFlag);
      // 全屏播放（1：全屏；0：区域）
      this.mp.setVideoDisplayMode(1);
      this.mp.setVolume(this.volume);
      // 刷新播放器设置并生效
      this.mp.refreshVideoDisplay();

      // 设置媒体播放器播放内容
      var json = '[{mediaUrl:"' + mediaUrl + '",';
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
  selfParam: function (is_free) {
    try {
      // 显示控件x秒后隐藏（默认3秒）
      this.hideAfterTime = 3000;
      // 控件刷新时间（默认300毫秒）
      this.refreshTime = 300;
      // 播放状态（true播放；false暂停）
      this.playStatus = true;
      // 播放速度（1，2，4，8，16，32），负数表示快退，正数表示快进，0：正常播放
      this.speed = 0;
      // 播放速度最大值
      this.maxSpeed = 32;
      // 滑块开始位置
      this.progressStart = 120;
      // 滑块终点
      this.progressEnd =
        document.getElementById('progress-total-line').offsetWidth + this.progressStart;
      // 滑块长度（总长度像素）
      this.progressLength = this.progressEnd - this.progressStart;

      // 试看
      this.isTryWatch = !!is_free;
      // 试看秒数
      this.tryWatchSecond = 30;
    } catch (error) {
      
    }
  },
  // 初始化图形
  initView: function () {
    try {
      // 进度开始位置
      document.getElementById('progress-slide-bar').style.left = '' + this.progressStart + 'px';
      // 进度条
      document.getElementById('progress-slide-line').style.width = '0px';
      // 隐藏全部控件
      try {
        this.setDisplayByClass('complayer', 'none');
      } catch (error) {
        
      }
      // 开始更新进度条
      this.startUpdateProgress();
    } catch (error) {
      
    }
  },
  // 调试信息
  debug: function (value) {
    document.getElementById('test-bar').innerHTML = value;
    this.setDisplayById('test-bar', 'block');
  },
  // 更新参数设置
  // params
  updateParams: function (params) {
    // this.mp.refreshVideoDisplay();
  },
  // 从起始点开始播放
  playFromStart: function () {
    try {
      //开始播放
      this.playStatus = true;
      this.mp.playFromStart();
    } catch (error) {
      
    }
  },
  // 释放（返回）
  destory: function () {
    try {
      this.mp.stop();
      this.mp.releaseMediaPlayer(this.instanceId);
    } catch (error) {
      
    }
  },
  // 暂停
  pause: function () {
    try {
      this.playStatus = false;
      // 重置快进快退
      this.resetSpeed();
      this.mp.pause();
    } catch (error) {
      
    }
  },
  // 继续播放
  play: function () {
    try {
      this.playStatus = true;
      // 重置快进快退
      this.resetSpeed();
      this.mp.resume();

      // 3秒后，隐藏全部控件
      self = this;
      clearTimeout(this.timeoutObj);
      this.timeoutObj = setTimeout(function () {
        self.setDisplayByClass('complayer', 'none');
      }, this.hideAfterTime);
    } catch (error) {
      
    }
  },
  // speed复位
  resetSpeed: function (){
    this.speed = 0;
  },
  // 快进
  fastForward: function () {
    try {
      if (this.speed <= 0) {
        // 正常播放或快退
        this.speed = 2;
      } else if (this.speed < this.maxSpeed) {
        this.speed = this.speed * 2;
      }
      this.mp.fastForward(this.speed);
    } catch (error) {
      
    }
  },
  // 快退
  fastRewind: function () {
    try {
      if (this.speed >= 0) {
        // 正常播放或快进
        this.speed = -2;
      } else if (this.speed > (-1 * this.maxSpeed)) {
        this.speed = this.speed * 2;
      }
      this.mp.fastRewind(this.speed);
    } catch (error) {
      
    }
  },
  // 音量+
  volumeUp: function (value) {
    try {
      this.volume += value;
      if (this.volume > 100) {
        this.volume = 100;
      }
      // 取消静音
      this.setDisplayById('mute-bar', 'none');
      this.mp.setVolume(this.volume);
      this.mp.refreshVideoDisplay();
    } catch (error) {
      
    }
  },
  // 音量-
  volumeDown: function (value) {
    try {
      this.volume -= value;
      if (this.volume <= 0) {
        // 静音
        this.volume = 0;
      }
      this.mp.setVolume(this.volume);
      this.mp.refreshVideoDisplay();
    } catch (error) {
      
    }
  },
  // 静音
  volumeMute: function () {
    try {
      this.volume = 0;
      this.mp.setVolume(this.volume);
      this.mp.refreshVideoDisplay();
    } catch (error) {
      
    }
  },
  // 根据id显示或隐藏(value: block|none)
  setDisplayById: function (id, value) {
    element = document.getElementById(id);
    if (element) {
      element.style.display = value;
    }
  },
  // 根据class显示或隐藏(value: block|none)
  setDisplayByClass: function (name, value) {
    elements = document.getElementsByClassName(name);
    if (elements.length > 0) {
      for (var i in elements) {
        elements[i].style.display = value;
      }
    }
  },
  getCurrentPlayTime: function(){
    try{
       return this.mp.getCurrentPlayTime();
    }catch(error){
      return -1;
    }
  },
  // 开始更新进度条
  startUpdateProgress: function () {
    self = this;
    clearInterval(this.intervalObj);
    this.intervalObj = setInterval(function () {
      try {
        // 总播放时长
        playTimeLength = self.mp.getMediaDuration();
        // 当前播放时间
        playCurrentTime = self.mp.getCurrentPlayTime();

        // 试看提示（不是vip，且不免费）
        if (!isVip && !self.isTryWatch){
          document.getElementById('try-watch-label').innerHTML = '试看'+(self.tryWatchSecond - playCurrentTime)+'秒';
          self.setDisplayById('try-watch-label', 'block');
        }else {
          self.setDisplayById('try-watch-label', 'none');
        }
        
        // 试看x秒
        self.tryWatch(playCurrentTime);

        if (playTimeLength > 0) {
          // 设置播放时间
          time_length_str = self.getFormatTime(playTimeLength);
          current_time_str = self.getFormatTime(playCurrentTime);
          document.getElementById('total-time').innerHTML = time_length_str;
          document.getElementById('pass-time').innerHTML = current_time_str;
          // 设置进度条
          progressPercent = playCurrentTime / playTimeLength;
          progressBarLeft = '' + (self.progressStart + self.progressLength * progressPercent) + 'px';
          progressLineWidth = '' + self.progressLength * progressPercent + 'px';
          // 滑块
          document.getElementById('progress-slide-bar').style.left = progressBarLeft;
          // 进度条
          document.getElementById('progress-slide-line').style.width = progressLineWidth;
        }
      } catch (error) {
        
      }
      
    }, this.refreshTime);
  },
  // 格式化秒数
  getFormatTime: function (sectime) {
    result = '';
    tmp = [];

    while (true) {
      if (tmp.length == 3 || sectime == 0) {
        break;
      }
      res_y = Math.floor(sectime % 60);
      res_s = Math.floor(sectime / 60);

      tmp.push(res_y);
      sectime = res_s;
    }

    for (var i = 2; i >= 0; i--) {
      if (typeof tmp[i] == 'undefined') {
        if (i == 2) {
          val = '0';
        } else {
          val = '00';
        }
      } else {
        if (tmp[i] < 10) {
          val = '0' + tmp[i];
        } else {
          val = tmp[i];
        }
      }

      if (result == '') {
        result = val;
      } else {
        result += ':' + val;
      }
    }
    return result;
  },
  // 试看
  tryWatch: function (playTime) {
    if (!this.isTryWatch && playTime >= this.tryWatchSecond && !isVip) {
      // this.pause();
      this.destory();
      var enjoy = getQueryVariable('enjoy') || 0;
      // 跳转订购
      location.href = '/pay.html?uid='+encodeURIComponent(uid)+'&id='+getQueryVariable('id')+'&time=' + time+'&enjoy='+enjoy;
    }
  }
};
