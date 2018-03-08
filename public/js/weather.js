
/* 后台天气js差价 */
(function(T, h, i, n, k, P, a, g, e) {
	g = function() {
		P = h.createElement(i);
		a = h.getElementsByTagName(i)[0];
		P.src = k;
		P.charset = "utf-8";
		P.async = 1;
		a.parentNode.insertBefore(P, a)
	};
	T["ThinkPageWeatherWidgetObject"] = n;
	T[n] || (T[n] = function() {
		(T[n].q = T[n].q || []).push(arguments)
	});
	T[n].l = +new Date();
	if(T.attachEvent) {
		T.attachEvent("onload", g)
	} else {
		T.addEventListener("load", g, false)
	}
}(window, document, "script", "tpwidget", "//widget.thinkpage.cn/widget/chameleon.js"));
tpwidget("init", {
	"flavor": "slim",
	"location": "WX4FBXXFKE4F",
	"geolocation": "enabled",
	"language": "zh-chs",
	"unit": "c",
	"theme": "chameleon",
	"container": "tp-weather-widget",
	"bubble": "disabled",
	"alarmType": "badge",
	"color": "#FFFFFF",
	"uid": "U9EC08A15F",
	"hash": "039da28f5581f4bcb5c799fb4cdfb673"
});
tpwidget("show");