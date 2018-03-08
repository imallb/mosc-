var Post = require('../lib/mongo').Post;

module.exports = {
	// 创建一篇文章
	create: function create(post) {
		return Post.create(post).exec();
	},
	// 获得查找的文章数量
	getCount:function getCount(con){
		return Post.count(con).exec();
	},
	// 获取某一个用户文章
	getAllArticle: function getAllArticle(obj){
		return Post
			.find(obj)
			.sort({ _id: -1 })
			.addCreatedAt()
			.exec();
	},
	// 获取其中一些文章
	getLimitArticle: function getLimitArticle(author,l,s){
		return Post
			.find(author)
			.sort({ _id: -1 })
			.limit(l)
			.skip(s)
			.addCreatedAt()
			.exec();
	},
	// 获取单独一篇文章
	getOneArticle: function(obj){
		return Post
			.findOne({ _id:obj })
			.addCreatedAt()
			.exec();
	},
	// 修改文章
	updateArticle: function updateArticle(postId, data){
		return Post.update({ _id: postId }, { $set: data }).exec();
	},
	// 删除一篇文章
	deleteArticle: function deleteArticle(postId) {
	  return Post.remove({ _id: postId }).exec();
	}
};































