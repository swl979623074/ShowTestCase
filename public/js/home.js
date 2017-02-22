/**
* 描述：服务端传回的数据样式模板
var content = {
	status:"SUCCESS",
	data:[
		{module:"systemInfo",function:"getSystemInfo",system:"linux",platform:"x86",time:"2016-12-12 12:34:54",status:"PASS"},
		{module:"systemInfo",function:"getSystemInfo",system:"linux",platform:"x86",time:"2016-12-12 12:34:54",status:"PASS"},
		{module:"systemInfo",function:"getSystemInfo",system:"linux",platform:"x86",time:"2016-12-12 12:34:54",status:"ERROR"},
		{module:"systemInfo",function:"getSystemInfo",system:"linux",platform:"x86",time:"2016-12-12 12:34:54",status:"PASS"},
		{module:"systemInfo",function:"getSystemInfo",system:"linux",platform:"x86",time:"2016-12-12 12:34:54",status:"PASS"},
		{module:"systemInfo",function:"getSystemInfo",system:"linux",platform:"x86",time:"2016-12-12 12:34:54",status:"ERROR"},
		{module:"systemInfo",function:"getSystemInfo",system:"linux",platform:"x86",time:"2016-12-12 12:34:54",status:"PASS"},
		{module:"systemInfo",function:"getSystemInfo",system:"linux",platform:"x86",time:"2016-12-12 12:34:54",status:"PASS"}
	]
};
*/

/**************************************Module**************************************/

/**
 * 描述：从服务端获取数据
 * */
(function(){
	window.DATABASE = {
		getModuleList : function(cb){
			$.post('/getModuleList',{},function(msg,status){
				cb(JSON.parse(msg));
			})
		},
		getList : function(cb){
			$.post('/getList',{},function(msg,status){
				cb(JSON.parse(msg));
			})
		},
		getListByModuleName : function(moduleName,cb){
			$.post('/getListByModuleName',{moduleName:moduleName},function(msg,status){
				cb(JSON.parse(msg));
			})
		},
		getListByStatus : function(status,cb){
			$.post('/getListByStatus',{status:status},function(msg,status){
				cb(JSON.parse(msg));
			})
		},
		removeAllTest : function(cb){
			$.post('/removeAllTest',{},function(msg,status){
				cb(JSON.parse(msg));
			})
		}
	};
})();

/**************************************View**************************************/

(function(){
	window.VIEWS = {
		showContentList : function(msg){
			contentList.innerHTML = "";
			if(msg.status != "SUCCESS") return;
			var data = msg.data;
			var len = data.length;
			var html = "";
			for(var i=0;i<len;i++){
				var className = getColor(data[i].status);
				html += "<tr><td>"+data[i].module+"</td><td>"+data[i].function+"</td><td>"+data[i].system+"</td><td>"+data[i].platform+"</td><td>"+data[i].time+"</td><td class='"+className+"'>"+data[i].status+"</td></tr>"
			}
			contentList.innerHTML = html;
			num.innerHTML = len;
		},
		clearContent : function(){
			contentList.innerHTML = "";
		},
		showModuleList : function(msg){
			if(msg.status != "SUCCESS") return;
			var data = msg.data;
			var len = data.length;
			var html = "";
			for(var i=0;i<len;i++){
				html += "<li>"+data[i]+"</li>";
			}
			moduleList.innerHTML = html;
		},
		updateModuleListClass : function(elementNode){
			var lightskyblueEle = document.getElementsByClassName("lightskyblue")[0];
			if(lightskyblueEle) {
				lightskyblueEle.classList.remove("lightskyblue");
			}
			if(elementNode && elementNode.nodeName.toLowerCase() == "li")
				elementNode.classList.add("lightskyblue");
		},
		updateTypeNavStatus : function(){
			$('input[name="type"]:checked').attr("checked",false);
		}
	}
	function getColor(status){
		var color;
		switch(status){
			case "PASS":color = "green";break;
			case "ABORT":color = "yellow";break;
			case "ERROR":color = "red";break;
			default:break;
		}
		return color;
	}
})();


/**************************************Controller**************************************/

/**
 * 描述：获取模块列表,刷新时自动加载
 */
(function(){
	DATABASE.getModuleList(VIEWS.showModuleList);
	DATABASE.getList(VIEWS.showContentList);
})();

/**
 * 描述：为模块列表添加单击事件
 */
(function(){
	moduleList.addEventListener("click",function(e){
		VIEWS.updateTypeNavStatus();
		var elementNode = e.target;
		var nodeName = elementNode.nodeName.toLowerCase();
		if(nodeName != "li") return;
		var moduleName = elementNode.innerHTML;
		DATABASE.getListByModuleName(moduleName,VIEWS.showContentList);
		VIEWS.updateModuleListClass(elementNode);
	})
})();

/**
 * 描述：为单选按钮添加单击事件
 */
(function(){
	typeNav.addEventListener("click",function(e){
		VIEWS.updateModuleListClass();
		var elementNode = e.target;
		var nodeName = elementNode.nodeName.toLowerCase();
		if(nodeName != "input") return;
		var typeName = elementNode.value;
		switch(typeName){
			case "ALL":DATABASE.getList(VIEWS.showContentList);break;
			case "PASS":DATABASE.getListByStatus(typeName,VIEWS.showContentList);break;
			case "ERROR":DATABASE.getListByStatus(typeName,VIEWS.showContentList);break;
			case "ABORT":DATABASE.getListByStatus(typeName,VIEWS.showContentList);break;
			default:break;	
		}
	})
})();

/**
 * 描述：为移除按钮添加单击事件
 */
(function(){
	removeBtn.addEventListener('click',function(){
		var result = confirm("Do you really want to remove all?");
		if(result == true){
			DATABASE.removeAllTest(function(msg){
				alert(msg.status+" , remove "+msg.data.n);
				VIEWS.clearContent();
			})
		}
	})
})();
