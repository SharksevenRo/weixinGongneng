/**
 * 随机产生num个字母字符串
 */
function getNonceStr(num) {
	result = "";
	for (var i = 0; i < num; i++) {
		var ranNum = Math.ceil(Math.random() * 25);
		result += String.fromCharCode(97 + ranNum);
	}
	return result.toString();
}
/**
 * 获取微信签名 
 * @param {Object} timestamp
 * @param {Object} nonceStr
 * @param {Object} curUrl
 */
function getSingture(nonceStr, timestamp, curUrl) {
	var sign = "";
	var param = JSON.stringify({
		"noncestr": nonceStr,
		"timestamp": timestamp,
		"url": curUrl
	});
	var data = myAjax(param, "/api/common/weixin/jsapi_ticket");
	sign = data.ticket;
	return sign;
}
/**
 *微信认证 
 */
function shareConfig() {
	var timestamp = new Date().getTime() + "";
	timestamp = timestamp.substring(0, 10);
	var nonceStr = getNonceStr(16);
	var curUrl = location.href.split('#')[0];
	var signature = getSingture(nonceStr, timestamp, curUrl)
	wx.config({
		debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
		appId: 'wx65bd7b08d1a47153', // 必填，公众号的唯一标识
		timestamp: timestamp, // 必填，生成签名的时间戳
		nonceStr: nonceStr, // 必填，生成签名的随机串
		signature: signature, // 必填，签名，见附录1
		jsApiList: ['checkJsApi', 'onMenuShareTimeline', 'onMenuShareAppMessage','openLocation','getBrandWCPayRequest'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
	});
}
/**
 * 微信分享
 * @param {Object} title
 * @param {Object} desc
 * @param {Object} surl
 */
var weiXinShare = function weiXinShare(title, desc,surl) {
	var curUrl="";
	var share_img="http://medcircle.oss-cn-beijing.aliyuncs.com/upload/app/public.png";
	if(surl==""||surl==null){
		curUrl = location.href.split('#')[0];
	}else{
		curUrl=surl;
	}
	//share_img=(share_img===""?"http://medcircle.oss-cn-beijing.aliyuncs.com/upload/app/public.png":share_img);
	shareConfig();
	wx.ready(function() {
		//转发给好友
		wx.onMenuShareAppMessage({
			title: title, // 分享标题
			desc: desc, // 分享描述
			link: curUrl,
			imgUrl: share_img, // 分享图标
			type: 'link', // 分享类型,music、video或link，不填默认为link
			dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
			success: function() {

			},
			cancel: function() {
				// 用户取消分享后执行的回调函数
			}
		});
		//分享到朋友圈
		wx.onMenuShareTimeline({
			title: title, // 分享标题
			link: curUrl, // 分享链接
			imgUrl: share_img, // 分享图标
			success: function() {
				// 用户确认分享后执行的回调函数
			},
			cancel: function() {
				// 用户取消分享后执行的回调函数
			}
		});
	});

}

function openLocationWeixin(lat,lon) {
	wx.openLocation({
		latitude: lat, // 纬度，浮点数，范围为90 ~ -90
		longitude: lon, // 经度，浮点数，范围为180 ~ -180。
		name: '', // 位置名
		address: '', // 地址详情说明
		scale: 1, // 地图缩放级别,整形值,范围从1~28。默认为最大
		infoUrl: '' // 在查看位置界面底部显示的超链接,可点击跳转
	});
}

// var wePay=function wePay(prepayId){
// 	var timestamp = new Date().getTime() + "";
// 	timestamp = timestamp.substring(0, 10);
// 	var nonceStr = getNonceStr(16);
// 	var curUrl = location.href.split('#')[0];
// 	var signature = getSingture(nonceStr, timestamp, curUrl);
// 	wx.getBrandWCPayRequest({
// 		appId:"wx65bd7b08d1a47153",
// 		timestamp:timestamp,
// 		nonceStr:nonceStr,
// 		package:prepayId,
// 		signType:"MD5",
// 		paySign:signature
// 	})
// }

exports.weiXinShare=weiXinShare;
// exports.wepay=wepay;
