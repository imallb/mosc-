var Column = require('../lib/mongo').Column;

module.exports = {
	// 创建一篇栏目
	create: function create(post) {
		return Column.create(post).exec();
	},
	// 获得查找的栏目数量
	getCount:function getCount(con){
		return Column.count(con).exec();
	},
	// 获取某一个用户栏目
	getAllArticle: function getAllArticle(obj){
		return Column
			.find(obj)
			.sort({ _id: -1 })
			.addCreatedAt()
			.exec();
	},
	// 获取其中一些栏目
	getLimitArticle: function getLimitArticle(author,l,s){
		return Column
			.find(author)
			.sort({ _id: -1 })
			.limit(l)
			.skip(s)
			.addCreatedAt()
			.exec();
	},
	// 获取单独一篇栏目
	getOneArticle: function(obj){
		return Column
			.findOne({ _id:obj })
			.addCreatedAt()
			.exec();
	},
	// 修改栏目
	updateArticle: function updateArticle(postId, data){
		return Column.update({ _id: postId }, { $set: data }).exec();
	},
	// 删除一篇栏目
	deleteArticle: function deleteArticle(postId) {
	  return Column.remove({ _id: postId }).exec();
	}
};































