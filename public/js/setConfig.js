"use strict"
window.onload = function(){
	var html = document.getElementsByTagName("html")[0];
	html.style.fontSize = window.innerWidth / 50 + "px";
}

//真正运行在手机上，若不需要横屏，就不需要onresize
window.onresize = function(){
	var html = document.getElementsByTagName("html")[0];
	html.style.fontSize = window.innerWidth / 50 + "px";
}
