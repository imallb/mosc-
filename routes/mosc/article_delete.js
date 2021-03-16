var path = require('path');
var fs = require('fs');
var express = require('express');
var router  = express.Router();
var PostModel = require('../../models/posts');

// 删除文章
router.get('/:postId', function(req, res, next){
	var postId = req.params.postId;
	
	PostModel.deleteArticle(post._id)
		.then(function(){
			res.redirect('back');
		})
		.catch(next);
});

module.exports = router;