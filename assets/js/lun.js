//定义开关（默认关闭）
var flag = true;
var lunbo;
var lun = {
	//向右按钮
	butR:function(arr,oli){
		//判断flag是否为true，是的话变向右移动，（如果开关是关闭的情况下）。
		if(flag){
			//每点击一次，flag改为false，（将开关打开）。
			flag = false;
			//截取arr数组首位的值
			var fist = arr.shift();
			//将截取到的值追加到arr的后面去
			arr.push(fist);
			//for循环遍历每一个li，逐个替换class
			for(var i = 0 ; i < arr.length; i++){
				//循环出的li的class名替换成arr数组里面class名
				oli[i].className = arr[i];
			};
			//延迟0.5秒后，flag改为true（延迟执行，0.5秒后将开关恢复到关闭状态）
			//这里的延迟时间需要与css的transition的时间一样。
			setTimeout(function(){
				flag = true;
			//500为0.5秒
			},500)
		};
		console.log(arr,fist);
	},

	//向左按钮
	butL:function(arr,oli){
		//判断flag是否为true，是的话变向右移动，（如果开关是关闭的情况下）
		if(flag){
			//每点击一次，flag改为false，（将开关打开）。
			flag = false;
			//截取arr数组末位的值
			var last = arr.pop();
			//将截取到的值追加到arr的前面去
			arr.unshift(last);
			//for循环遍历每一个li，逐个替换class
			for(var i = 0 ; i < arr.length; i++){
				//循环出的li的class名替换成arr数组里面class名
				oli[i].className = arr[i];
			};
			//延迟0.5秒后，flag改为true（延迟执行，0.5秒后将开关恢复到关闭状态）
			//这里的延迟时间需要与css的transition的时间一样。
			setTimeout(function(){
				flag = true;
			//500为0.5秒
			},500)
		};
		console.log(arr,last);
	},

	//定义设置向右自动轮播
	setNowInterval : function(oli){
		if(lunbo){
		   clearInterval(lunbo);	
		}
		lunbo = setInterval(function(){
			//截取arr数组首位的值
			var fist = arr.shift();
			//将截取到的值追加到arr的后面去
			arr.push(fist);
			//for循环遍历每一个li，逐个替换class
			for(var i = 0 ; i < arr.length; i++){
				//循环出的li的class名替换成arr数组里面class名
				oli[i].className = arr[i];
			};
		//3000为3秒
		},3000);
	},
	//鼠标移入左按钮停止自动轮播
	stopNowInterval:function(){
		clearInterval(lunbo);
		console.log('鼠标移进来')
	}
}