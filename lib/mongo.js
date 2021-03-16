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
	name: { type: 'string' },												// 用户账号
	password: { type: 'string' },										// 用户密码
	status: { type: 'string' },											// 用户级别
	photo: { type: 'string' }												// 用户头像
});
exports.User.index({ name: 1 }, { unique: true }).exec(); // 根据用户名找到用户，用户名全局唯一

// 栏目表
exports.Column = mongolass.model('Column', {
	author: { type: 'object' },											// 作者信息
	title: { type: 'string' },											// 栏目标题
	read:[{ type: 'string' }]												// 阅读状态（off：发布，on：审核）
});
exports.Column.index({ title:1, _id: 1 }).exec(); // 按创建时间降序查看标题的文章列表

// 文章表
exports.Post = mongolass.model('Post', {
	column: { type: Mongolass.Types.ObjectId },			// 栏目id
	author: { type: 'object' },											// 作者信息
	title: { type: 'string' },											// 文章标题
	key: { type: 'string' },												// 关键词
	paper: { type: 'string' },											// 简介
	content: { type: 'string' },										// 内容
	pv: { type: 'number' },													// 浏览次数
	read:[{ type: 'string' }]												// 阅读状态（off：发布，on：审核）
});
exports.Post.index({ title:1, _id: 1 }).exec(); // 按创建时间降序查看标题的文章列表

// 留言板
exports.Message = mongolass.model('Message', {
	column: { type: Mongolass.Types.ObjectId },			// 栏目id
	article: { type: Mongolass.Types.ObjectId },		// 文章id
	author: { type: 'object' },											// 作者信息
	user: { type: 'object' },												// 留言用户
	title: { type: 'string' },											// 留言文章标题
	paper: { type: 'string' },											// 留言文章简介
	message: { type: 'string' }											// 留言信息
});
exports.Message.index({ title:1, _id: 1 }).exec(); // 按创建时间降序查看标题的文章留言

// session数据
exports.Session = mongolass.model('Session');
