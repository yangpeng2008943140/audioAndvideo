$(function() {
	var onoff = false; //控制音乐播放器的开关
	var timer = null; //定时器开关
	var arrmusics = [
		["http://localhost:8090/music/平凡之路.mp4","平凡之路", "朴树"],
		["http://localhost:8090/music/说好的幸福.mp4","说好的幸福", "周杰伦"],
	];
	var index = 1; //歌曲索引
	var Totaltime //歌曲时间
	var mute = false; //歌曲静音
	var screen = false;
	//暂停与开始
	var audio = document.getElementById("vi");
	$(".start").click(function() {
		if(onoff == false) {
			$(this).html("&#xe62d;");
			onoff = !onoff;
			musicStart();
		} else {
			$(this).html("&#xe62e;");
			onoff = !onoff;
			musicStop();
		}
	})

	//重新播放
	$(".restart").click(function() {
		musicRestart();
	})

	//下一首歌曲
	$(".next").click(function() {
		nextMusic();
	})

	//下一首歌曲
	$(".pre").click(function() {
		preMusic();
	})

	//进度加速
	musicSpeed();

	//音量控制
	musicVolume();

	//点击话筒
	musicPhone();

	//随机一首歌曲
	musicRandom();

	//全屏播放
	allScreen();

	//隐藏与显示
		showHide();
	
	
	//--------------函数封装---------------------------------------------
	function musicStart() {
		if(onoff == false) {
			$(".start").html("&#xe62d;");
			onoff = !onoff;
		} 
		audio.play(); //歌曲播放
		musicTime();
		musicTimer();
		//定时器部分
		//歌曲信息的隐藏
		var time = parseInt($(".min1").html()) * 60 + parseInt($(".sec1").html());
		console.log(timer);
		if(timer==3){
			$(".pl-t").fadeIn(2000).fadeOut(5000);
		}
	}

	//音乐时间
	function musicTime() {
		Totaltime = audio.duration; //歌曲总的秒数
		console.log(Totaltime);
		var min = parseInt(Totaltime / 60); //歌曲分钟数
		var sec = parseInt(Totaltime - min * 60);
		$(".min2").html("0" + min);
		$(".sec2").html(function() {
			if(sec <= 9) {
				return "0" + 9;
			} else {
				return sec;
			}
		});
	}

	//音乐定时器
	function musicTimer() {
		clearInterval(timer);
		timer = setInterval(function() {
			$(".sec1").html(function() {
				var sec1 = parseInt($(this).html()) + 1;
				if(sec1 <= 9) {
					return "0" + sec1;
				} else if(sec1 <= 59) {
					return sec1
				} else {
					$(".min1").html(function() {
						return "0" + (parseInt($(this).html()) + 1);
					})
					return "00";
				}
			})
			//进度条部分
			$(".jindutiao").css("width", function() {
				var length = parseInt($(".min1").html()) * 60 + parseInt($(".sec1").html());
				return parseInt(length / Totaltime * 300);
			})
			//播放完成重新播放
			finish();
		}, 1000)
	}
	//音乐暂停
	function musicStop() {
		clearInterval(timer);
		audio.pause();
	}

	//音乐重新开始
	function musicRestart() {
		musicLine();
		audio.currentTime = 0;
		musicStart();
	}
	//清空时间线
	function musicLine() {
		clearInterval(timer);
		$(".min1").html("00");
		$(".sec1").html("00");
		$(".jindutiao").css("width", 0);
	}
	//下一首歌曲
	function nextMusic() {
		musicLine();
		index++;
		if(index > 3) {
			index = 0;
		}
		audio.src = arrmusics[index][0];
		$("h2").text(arrmusics[index][1]);

		//添加监听事件，防止音频时间获取不到
		audio.addEventListener("canplaythrough", function() {
			musicStart();
		});
	}

	//上一首歌曲
	function preMusic() {
		musicLine();
		index--;
		if(index < 0) {
			index = 3;
		}
		audio.src = arrmusics[index][0];
		$("h2").text(arrmusics[index][1]);
		//添加监听事件，防止音频时间获取不到
		audio.addEventListener("canplaythrough", function() {
			musicStart();
		});
	}

	//点击进度条播放
	function musicSpeed() {
		var jindu = document.getElementsByClassName("jindu")[0];
		jindu.addEventListener("click", function(e) {
			var e = e || window.event;
			var speed = e.offsetX;
			$(".jindutiao").css("width", speed);
			var speedTime = speed / 300 * Totaltime;
			var min = parseInt(speedTime / 60); //歌曲分钟数
			var sec = parseInt(speedTime - min * 60);
			$(".min1").html("0" + min);
			$(".sec1").html(function() {
				if(sec <= 9) {
					return "0" + 9;
				} else {
					return sec;
				}
			});
			audio.currentTime = speedTime;
		})
	}

	//音量控制
	function musicVolume() {
		audio.volume = 0.5;
		var vol = document.getElementsByClassName("vol")[0];
		vol.addEventListener("click", function(e) {
			var e = e || window.event;
			var speed = e.offsetX;
			console.log(speed);
			if(speed <= 0) {
				speed = 0;
			}
			$(".vol1").css("width", speed);
			$(".circle").css("left", speed);
			audio.volume = speed / 100;
		})
		$("#draggable").draggable({
			axis: "x",
			containment: "parent",
			drag: function() {
				var sp = $(".circle").css("left");
				$(".vol1").css("width", sp);
				audio.volume = parseInt(sp) / 100;
				if(audio.volume == 0) {
					$(".volume").html("&#xe632;");
				} else {
					$(".volume").html("&#xe634;");
				}
			}
		});
	}

	//点击话筒
	function musicPhone() {
		$(".volume").click(function() {
			if(mute == false) {
				$(this).html("&#xe632;")
				$(".circle").css("left", 0);
				$(".vol1").css("width", 0);
				audio.volume = 0;
			} else {
				$(this).html("&#xe634;")
				$(".circle").css("left", 43);
				$(".vol1").css("width", 50);
				audio.volume = 0.5;
			}
			mute = !mute;
		})
	}

	//随机一首歌曲
	function musicRandom() {
		$(".random").click(function() {
			musicLine();
			index = parseInt(Math.random() * 4);
			console.log(index);
			audio.src = arrmusics[index][0];
			$("h2").text(arrmusics[index][1]);

			//添加监听事件，防止音频时间获取不到
			audio.addEventListener("canplaythrough", function() {
				musicStart();
			});
		})
	}

	//点击全屏
	function allScreen() {
		$(".refresh").click(function() {
			if(screen == false) {
				$("video").css({
					"width": "100% ",
					"height": "100%",
				})
				$(".video-wrap").css({
					"width": "100% ",
					"height": "100%",
					"marginTop":0
				})
				$(".pl-c").css("width", 1080)
				$(".play").css({
					"width": "100% "
				})
				$(".jindu").css("width", 700);
				$(".pl-b").css("width", 820);
			} else {
				$("video").css({
					"width": 730,
					"height": 410,
				})
				$(".video-wrap").css({
					"width": 730,
					"height": 410,
					"marginTop":100
				})
				$(".play,.pl-c").css({
					"width": 730
				})
				$(".jindu").css("width", 350);
				$(".pl-b").css("width", 470);
			}
			screen = !screen;
		})
	}

	//控制条的显示与隐藏
	function showHide() {
		$(".video-wrap").hover(
			function() {
				$(".play").stop().fadeIn(500);
			},
			function() {
				$(".play").stop().fadeOut(3000);
			}
		)
	}

	//歌曲播放完成重新播放
	function finish() {
		var time = parseInt($(".min1").html()) * 60 + parseInt($(".sec1").html());
		if(time >= audio.duration) {
			musicRestart();
		}
	}
	
})