var express = require('express');
var router = express.Router();
var mongo = require("./mongo.js");

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render("index");
});

router.post("/insertOne",function(req,res,next){
	var insertOne = mongo.insertOne;
	var data = "";
	req.on("data",function(chunk){
		data += chunk;
	})
	req.on("end",function(){
		data = JSON.parse(data);
		if(!data.collection || !data.data){
			res.end("1 error")
		}else{
			insertOne(data,function(err,doc){
				var msg;
				if(err){
					msg = {status:"ERROR",data:err};	
				}else{
					msg = {status:"SUCCESS"}
				}
				msg = JSON.stringify(msg);
				res.end(msg);
			})
		}
	})
})

router.post("/getModuleList",function(req,res,next){
	var getModuleList = mongo.queryDistinctModule;
	var cfg = {collection:"blog",key:"module"};
	getModuleList(cfg,function(err,doc){
		var msg;
		if(err){
			msg = {status:"ERROR",data:err}
		}else{
			msg = {status:"SUCCESS",data:doc};
		}
		msg = JSON.stringify(msg);
		res.end(msg);
	})
})

router.post("/getList",function(req,res,next){
	var getList = mongo.queryAll;
	var cfg = {collection:"blog",BsonKey:{},filter:{}};
	getList(cfg,function(err,doc){
		if(err){
			var msg = {status:"ERROR",data:err};
		}else{
			var msg = {status:"SUCCESS",data:doc};
		}
		msg = JSON.stringify(msg);
		res.end(msg);
	})
	
})

router.post("/getListByModuleName",function(req,res,next){
	var data = req.body;
	if(data.moduleName == "")
		res.end("error: moduleName can not be null");
	else{
		var moduleName = data.moduleName;
		var getListByModuleName = mongo.queryAll;
		var cfg = {collection:"blog",BsonKey:{module:moduleName},filter:{}};
		getListByModuleName(cfg,function(err,doc){
			var msg;
			if(err){
				msg = {status:"ERROR",data:err};
			}else{
				msg = {status:"SUCCESS",data:doc};					
			}
			msg = JSON.stringify(msg);
			res.end(msg);
		})
	}
})

/**
* 描述：通过状态获取列表
*       status = ALL/PASS/ERROR/ABORT;
*/
router.post("/getListByStatus",function(req,res,next){
	var data = req.body;
	if(data.status == "")
		res.end("error: status can not be null");
	else{
		var status = data.status;
		var getListByStatus = mongo.queryAll;
		var cfg = {collection:"blog",BsonKey:{status:status},filter:{}};
		getListByStatus(cfg,function(err,doc){
			var msg;
			if(err){
				msg = {status:"ERROR",data:err};
			}else{
				msg = {status:"SUCCESS",data:doc};					
			}
			msg = JSON.stringify(msg);
			res.end(msg);
		})
	}
})

router.post("/removeAllTest",function(req,res,next){
	var removeAllTest = mongo.removeAll;
	var cfg = {collection:"blog"};
	removeAllTest(cfg,function(err,doc){
		var msg;
		if(err){
			msg = {status:"ERROR",data:err};
		}else{
			msg = {status:"SUCCESS",data:doc};					
		}
		msg = JSON.stringify(msg);
		res.end(msg);
	})
})

module.exports = router;
