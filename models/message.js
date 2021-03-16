let Message = require('../lib/mongo').Message;

module.exports = {
	// 创建一个留言信息
	create: function create(message) {
		return Message.create(message).exec();
	},
	// 获得查找的留言数量
	getCount:function getCount(con){
		return Message.count(con).exec();
	},
	// 获取其中一些留言
	getLimitMessage: function getLimitMessage(message,l,s){
		return Message
			.find(message)
			.sort({ _id: -1 })
			.limit(l)
			.skip(s*l)
			.addCreatedAt()
			.exec();
	},
	// 删除留言
	deleteMessage: function deleteMessage(postId) {
		return Message.remove(postId).exec();
	}
};