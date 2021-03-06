Vue.mixin({
  data: function data() {
    return {
      // 定义 BOM 相关变量
      page_offset_width: 0, //页面body可视区宽
      page_offset_height: 0, //页面body可视区高
      // Loading 相关变量
      loading_num: 0, //追踪要进行loading的数量
      fullscreenLoading: false, //显示loading蒙版
      fullscreenLoading_text: '', //loading蒙版文字内容
    }
  },
  methods: {
    // --------------------------------------------------------------- DOM 相关方法
      // 获取页面宽
      ZFcapturePageWidth: function ZFcapturePageWidth() {
        this.page_offset_width = document.body.scrollWidth;
      },
      // 获取页面高
      ZFcapturePageHeight: function ZFcapturePageHeight() {
        this.page_offset_height = document.body.offsetHeight;
      },
      // 函数库——判断当前访问浏览器
        //true为PC端，false为手机端
      ZFIsPC: function ZFIsPC() {
        var userAgentInfo = navigator.userAgent;
        var Agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"];
        var flag = true;
        for (var v = 0; v < Agents.length; v++) {
          if (userAgentInfo.indexOf(Agents[v]) > 0) {
            flag = false;
            break;
          }
        }
        return flag;
      },
			// 窗口拉伸自适应
				//adaptor:适配器(即目标响应方法)
				//target:调用适配方法者
				//duringTime:节流间隔时间
			ZFSelfAdaption: function ZFSelfAdaption(adaptor, target, duringTime) {
				var _this = this;
				window.onresize = function() {
					_this.ZFThrottle(adaptor, target, duringTime);
				};
			},
      
    // --------------------------------------------------------------- 基础 相关方法
      // 定义响应式对象
        //target:要追加的目标
        //param:要追加的属性
        //value:要追加的值
      ZFDefineResponsiveObj: function ZFDefineResponsiveObj(target, param, value) {
        this.$set(target, param, value);
      },
      // 地址转换
        //requestUrl:项目前缀
        //url:跳转地址
        //val:跳转携带参数
        //secretPassword:加密密码
        //flag:是否跳转外部项目页面 (internal:内部；external:外部)
        //usedEventListener:是否处理点击监听事件(usedEventListener:处理；noUsedEventListener不处理)
        //openStyle:跳转页面方式(默认是新开页面"_blank")
      ZFUrlTransmit: function ZFUrlTransmit(requestUrl, url, val, secretPassword, flag, usedEventListener, openStyle) {
        var jump_url = '';
        var open_style = openStyle || "_blank";
        var encryption_param = this.ZFSecret_Key(val, secretPassword, 'encryption');
        if (flag == 'internal') {
          jump_url = "".concat(requestUrl).concat(url).concat('?' + encryption_param);
        } else if (flag == 'external') {
          jump_url = "".concat(url).concat('?' + encryption_param);
        }
        if (usedEventListener == "usedEventListener") {
          this.ZFPageJumpHandleEventListener(jump_url, open_style);
        } else if (usedEventListener == "noUsedEventListener") {
          this.ZFPageJump(jump_url, open_style);
        }
      },
      // 页面跳转(无监听事件)
      ZFPageJump: function ZFPageJump(url, openStyle) {
        var link = document.createElement('a');
        link.target = openStyle;
        link.href = url;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      },
      // 页面跳转(有监听事件)
      ZFPageJumpHandleEventListener: function ZFPageJumpHandleEventListener(url, openStyle) {
        window.removeEventListener("mousedown", this.onMouseDown, false);
        window.removeEventListener("mouseup", this.onMouseUp, false);

        var link = document.createElement('a');
        link.target = openStyle;
        link.href = url;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        window.addEventListener("mousedown", this.onMouseDown, false);
        window.addEventListener("mouseup", this.onMouseUp, false);
      },
      // js动态加载css
      ZFCreateLink: function ZFCreateLink(url) {
        var link = document.createElement("link");
        link.rel = "stylesheet";
        link.type = "text/css";
        link.href = url;
        document.getElementsByTagName("head")[0].appendChild(link);
      },
    
    // --------------------------------------------------------------- 动画交互 相关方法
      // 旋转动画
        //obj.currentDeg：当前旋转度数
        //obj.rotateDeg：每次要旋转的角度
        //注：应用页面传入的对象中的属性要与当前函数currentDeg、rotateDeg属性名相同
      ZFRotateAnimation: function ZFRotateAnimation(obj) {
        obj.currentDeg += obj.rotateDeg;
      },
      
    // --------------------------------------------------------------- 父子组件暴露 相关方法
      // 暴露 函数 供父组件调用
        //name：函数名(对应父组件中组件标签中@名; 函数名用-表示法)
        //param：传参
      ZFExportFunction: function ZFExportFunction(name, param) {
        this.$emit(name, param);
      },
      
    // --------------------------------------------------------------- 数据交互 相关方法
      // 暴露 变量 作为公共变量
        //type：函数名(对应vuex中mutations中方法)
        //val：变量值
      ZFExportVariable: function ZFExportVariable(type, val) {
        this.$store.commit(type, val);
      },
      
    // --------------------------------------------------------------- 数据处理 相关方法
      // 除法-转换小数
        //num：分子
        //totalNum：分母
        //digit：保留位数
			ZFTransDoubleDecimal: function ZFtransDoubleDecimal(num, totalNum, digit) {
				var trans_num = 0;
				trans_num = ((num/totalNum).toFixed(digit));
				return trans_num;
			},
				// 除法-转换百分比(未加"%")
					//num：分子
					//totalNum：分母
			ZFTransPercentage: function ZFtransPercentage(num, totalNum) {
				var trans_num = 0;
				var decimal_num = 0;
				trans_num = ((num/totalNum).toFixed(4))*100;
				decimal_num = parseFloat(trans_num.toPrecision(12));
				return decimal_num;
			},
				// 转换千分位
					//num：要转换千分位的值
			ZFTransMicrometerLevel: function ZFtransMicrometerLevel(num) {
				var reg = /\d{1,3}(?=(\d{3})+$)/g;
				return (num + '').replace(reg, '$&,');
			},
    // --------------------------------------------------------------- 日期处理 相关方法
      // 日期格式转换 yyyy-mm
			ZFTransMonth: function ZFTransMonth(data) {
				var get_date = new Date(data);
				var year = get_date.getFullYear();
				var month = get_date.getMonth() + 1 < 10 ? '0' + (get_date.getMonth() + 1) : get_date.getMonth() + 1;
				return year + '-' + month;
		  },
			// 处理日期月份格式 yyyymm
      ZFHandleMonthLine: function ZFHandleMonthLine(val) {
        var bear_month = val.concat("");
        var output = bear_month.replace("-", "");
        return output;
      },
      // 日期格式转换 yyyy-mm-dd
    	ZFTransDate: function ZFTransDate(data) {
      	var get_date = new Date(data); // get_date = new Date()

      	var year = get_date.getFullYear();
      	var month = get_date.getMonth() + 1 < 10 ? '0' + (get_date.getMonth() + 1) : get_date.getMonth() + 1;
      	var day = get_date.getDate() < 10 ? '0' + get_date.getDate() : get_date.getDate(); // var hour = (get_date.getHours() < 10) ? '0' + (get_date.getHours()) : get_date.getHours()
      	// var minute = (get_date.getMinutes() < 10) ? '0' + (get_date.getMinutes()) : get_date.getMinutes()
      	// var second = (get_date.getSeconds() < 10) ? '0' + (get_date.getSeconds()) : get_date.getSeconds()
      	// return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second

      	return year + '-' + month + '-' + day;
    	},
	    // 日期时间格式转换 yyyy-mm-dd hh:mm:ss
    	ZFTransDateTime: function ZFTransDateTime(data) {
      	var get_date = new Date(data);
      	var year = get_date.getFullYear();
      	var month = get_date.getMonth() + 1 < 10 ? '0' + (get_date.getMonth() + 1) : get_date.getMonth() + 1;
      	var day = get_date.getDate() < 10 ? '0' + get_date.getDate() : get_date.getDate(); 
	    	var hour = (get_date.getHours() < 10) ? '0' + (get_date.getHours()) : get_date.getHours();
      	var minute = (get_date.getMinutes() < 10) ? '0' + (get_date.getMinutes()) : get_date.getMinutes();
      	var second = (get_date.getSeconds() < 10) ? '0' + (get_date.getSeconds()) : get_date.getSeconds();
      	return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
    	},
      // 上月全月范围
    	ZFTransLastMonth: function ZFTransLastMonth() {
      	var cur_date = new Date();
      	var year = cur_date.getFullYear();
      	var month = cur_date.getMonth();
      	if (month == 0) {
        	month = 12;
        	year -= 1;
      	}
      	month = month<0 ? '0'+month : month;
      	var last_month_first_day = year+'-'+month+'-01';
      	var last_month_last_date = new Date(year, month, 0);
      	var last_month_last_day = year+'-'+month+'-'+last_month_last_date.getDate();
      	var last_month_range = {
        	last_month_first_day: last_month_first_day,
        	last_month_last_day: last_month_last_day
      	};
      	return last_month_range;
    	},
			// 当前年月
    	ZFTransCurrentMonth: function ZFTransCurrentMonth() {
        var cur_date = new Date();
        var year = cur_date.getFullYear();
        var month = cur_date.getMonth() + 1 < 10 ? '0' + (cur_date.getMonth() + 1) : cur_date.getMonth() + 1;
        return year + '-' + month;
    	},
      // 昨天日期
    	ZFTransYesterday: function ZFTransYesterday() {
        var cur_day = new Date();
        var pre_day = new Date(cur_day.getTime()-24*60*60*1000);
        return pre_day;
    	},
      
    // --------------------------------------------------------------- 加密or解密 (依赖 base64.js)
      // str：要加密的内容
      // pwd：加密的密码(同一内容的加密、解密的密码要一致)
      // type：加密类型(加密encryption or 解密decryption)
			ZFSecret_Key: function ZFSecret_Key(str, pwd, type) {
				var b = new Base64(); //Base64加密
				if (type == 'encryption') {
					str = b.encode(str); //Base64加密
					var prand = "";
					for (var i = 0; i < pwd.length; i++) {
						prand += pwd.charCodeAt(i).toString();
					}
					var sPos = Math.floor(prand.length / 5);
					var mult = parseInt(prand.charAt(sPos) + prand.charAt(sPos * 2) + prand.charAt(sPos * 3) + prand.charAt(sPos * 4) + prand.charAt(sPos * 5));
					var incr = Math.ceil(pwd.length / 2);
					var modu = Math.pow(2, 31) - 1;
					if (mult < 2) {
						alert("Please choose a more complex or longer password.");
						return null;
					}
					var salt = Math.round(Math.random() * 1000000000) % 100000000;
					prand += salt;
					while (prand.length > 10) {
						prand = (parseInt(prand.substring(0, 10)) + parseInt(prand.substring(10, prand.length))).toString();
					}
					prand = (mult * prand + incr) % modu;
					var enc_chr = "";
					var enc_str = "";
					for (var i = 0; i < str.length; i++) {
						enc_chr = parseInt(str.charCodeAt(i) ^ Math.floor((prand / modu) * 255));
						if (enc_chr < 16) {
							enc_str += "0" + enc_chr.toString(16);
						} else enc_str += enc_chr.toString(16);
						prand = (mult * prand + incr) % modu;
					}
					salt = salt.toString(16);
					while (salt.length < 8) salt = "0" + salt;
					enc_str += salt;
					return enc_str;
				}
				if (type == 'decryption') {
					var prand = "";
					for (var i = 0; i < pwd.length; i++) {
						prand += pwd.charCodeAt(i).toString();
					}
					var sPos = Math.floor(prand.length / 5);
					var mult = parseInt(prand.charAt(sPos) + prand.charAt(sPos * 2) + prand.charAt(sPos * 3) + prand.charAt(sPos * 4) + prand.charAt(sPos * 5));
					var incr = Math.round(pwd.length / 2);
					var modu = Math.pow(2, 31) - 1;
					var salt = parseInt(str.substring(str.length - 8, str.length), 16);
					str = str.substring(0, str.length - 8);
					prand += salt;
					while (prand.length > 10) {
						prand = (parseInt(prand.substring(0, 10)) + parseInt(prand.substring(10, prand.length))).toString();
					}
					prand = (mult * prand + incr) % modu;
					var enc_chr = "";
					var enc_str = "";
					for (var i = 0; i < str.length; i += 2) {
						enc_chr = parseInt(parseInt(str.substring(i, i + 2), 16) ^ Math.floor((prand / modu) * 255));
						enc_str += String.fromCharCode(enc_chr);
						prand = (mult * prand + incr) % modu;
					}
					//return enc_str;
					return b.decode(enc_str);
				}
			},
		
		// --------------------------------------------------------------- 优化 相关函数
			// 函数节流
				//method:要调用的函数
				//context:调用method的主体
				//duringTime:节流间隔时间
			ZFThrottle: function ZFThrottle(method, context, duringTime) {
				var during_time = duringTime || 300;
				clearTimeout(method.tId);
				method.tId = setTimeout(function() {
					method.call(context);
				}, during_time);
			},
		
    // --------------------------------------------------------------- Loading (依赖 elements-ui js及css)
			// Open Loading
			ZFOpenLoading: function ZFOpenLoading(text) {
				this.fullscreenLoading = true;
				this.fullscreenLoading_text = text;
			},
			// Close Loading
			ZFCloseLoading: function ZFCloseLoading() {
				this.fullscreenLoading = false;
				this.fullscreenLoading_text = '';
			},
    // --------------------------------------------------------------- Prompt Information (依赖 elements-ui js及css)
			// Success
			ZFShowSuccess: function ZFShowSuccess(text) {
				this.$message({
					message: text,
					type: 'success'
				});
			},
			// Error
			ZFShowError: function ZFShowError(text) {
				this.$message({
					message: text,
					type: 'error'
				});
			},
  },
})