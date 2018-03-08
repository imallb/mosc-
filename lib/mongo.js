'use strict';
var config = require('config-lite');
var Mongolass = require('mongolass');
var mongolass = new Mongolass();
mongolass.connect(config.mongodb);

var moment = require('moment');
var objectIdToTimestamp = require('objectid-to-timestamp');

// 根据 id 生成创建时间 created_at
mongolass.plugin('addCreatedAt', {
  afterFind: function (results) {
    results.forEach(function (item) {
		item.created_at = moment(objectIdToTimestamp(item._id)).format('YYYY-MM-DD HH:mm');
    });
    return results;
  },
  afterFindOne: function (result) {
    if (result) {
		result.created_at = moment(objectIdToTimestamp(result._id)).format('YYYY-MM-DD HH:mm');
    }
    return result;
  }
});

// 用户表
exports.User = mongolass.model('User', {
	name: { type: 'string' },
	password: { type: 'string' },
	status: { type: 'string' }
});
exports.User.index({ name: 1 }, { unique: true }).exec(); // 根据用户名找到用户，用户名全局唯一

// 栏目表
exports.Column = mongolass.model('Column', {
	author: { type: 'object' },
	title: { type: 'string' },
	read:[{ type: 'string' }]
});
exports.Column.index({ title:1, _id: 1 }).exec(); // 按创建时间降序查看标题的文章列表

// 文章表
exports.Post = mongolass.model('Post', {
	column: { type: Mongolass.Types.ObjectId },
	title: { type: 'string' },
	key: { type: 'string' },
	paper: { type: 'string' },
	content: { type: 'string' },
	pv: { type: 'number' },
	read:[{ type: 'string' }]
});
exports.Post.index({ title:1, _id: 1 }).exec(); // 按创建时间降序查看标题的文章列表
// session数据
exports.Session = mongolass.model('Session');
