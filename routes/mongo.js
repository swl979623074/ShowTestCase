"use strict"
var mongojs = require('mongojs');
var config = {
	host:"127.0.0.1",
	port:12345,
	database:"test"
};

var conninsc;//

function connect() {
    if (conninsc && conninsc != '' && conninsc != null) {
        return conninsc;
    } else {
        var host = config.host || "127.0.0.1",
            port = config.port || 12345,
            database = config.database || "test",
            connection_string = 'mongodb://' + host + ':' + port + '/' + database;
        conninsc = mongojs(connection_string);
        return conninsc;
    }
}

/**
* 描述：查询某个集合中的所有文档
* @param cfg = {collection:"blog",BsonKey:{"_id":1},filter:{"_id":0}};
* @param cb 回调函数
*/
var queryAll = function (cfg,cb) {  
    var collect = connect().collection(cfg.collection);
	collect.find(cfg.BsonKey,cfg.filter).sort({time:1}).toArray(function (err, doc) {
		cb(err,doc);
	});
};

/**
* 描述：查找某个集合中某个一个字段的所有值
* @param cfg = {collection:"blog",key:"module"}
* @param cb 回调函数
*/
var queryDistinctModule = function(cfg,cb){
	var collect = connect().collection(cfg.collection);
	collect.distinct(cfg.key,{},function(err,doc){
		cb(err,doc)
	})
}

/**
* 描述：查询某个集合中的一条文档
* @param cfg = {collection:"blog",BsonKey:{"_id":1},filter:{"_id":0}};
* @param cb 回调函数
*/
var queryOne = function(cfg,cb){
	var collect = connect().collection(cfg.collection);
	collect.findOne(cfg.BsonKey, cfg.filter, function (err, doc) {
		cb(err,doc);
	});
}

/**
* 描述：向某个集合添加一条文档
* @param cfg = {collection:"blog",data:{module:"systemInfo",function:"getSystemInfo",system:"linux",platform:"x86",time:"2016-12-12  12:34:54",status:"PASS"}};
* @param cb 回调函数
*/
var insertOne = function(cfg,cb){
	var collect = connect().collection(cfg.collection);
	var abc = JSON.parse(JSON.stringify(cfg));  //abc 是cfg的一个拷贝 指向不同地址，避免添加过程中cfg指向同一地址
	collect.insert(abc.data,function(err,doc){
		cb(err,doc);
	})	
}

/**
* 描述：移除某个集合中的所有文档
* @paream cfg = {collection:"blog"}
* @cb 回调函数
*/
var removeAll = function(cfg,cb){
	var collect = connect().collection(cfg.collection);
	collect.remove(null,function(err,doc){
		cb(err,doc);
	})
}

exports.queryAll = queryAll
exports.insertOne = insertOne;
exports.queryDistinctModule = queryDistinctModule;
exports.removeAll = removeAll;
