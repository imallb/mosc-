var User = require('../lib/mongo').User;

module.exports = {
	// 注册一个用户
	create: function create(user) {
		return User.create(user).exec();
	},
	// 获得查找数量
	getCount:function getCount(con){
		return User.count(con).exec();
	},
	// 获取其中一些用户
	getLimitUser: function getLimitUser(author,l,s){
		return User
			.find(author)
			.sort({ _id: -1 })
			.limit(l)
			.skip(s)
			.addCreatedAt()
			.exec();
	},
	// 通过用户名获取用户信息
	getAllUser: function getUserByName(post) {
		return User
		  .find(post)
		  .sort({ _id: -1 })
		  .addCreatedAt()
		  .exec();
	},
	// 通过用户名获取用户信息
	getUserByName: function getUserByName(name) {
		return User
		  .findOne({ name: name })
		  .addCreatedAt()
		  .exec();
	},
	// 删除一篇用户
	deleteUser: function deleteUser(postId) {
		return User.remove({ _id: postId }).exec();
	},
	// 修改用户
	updateUser: function updateUser(name, data){
		return User.update({ name: name }, { $set: data }).exec();
	},
};