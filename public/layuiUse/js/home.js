layui.use(['jquery'],function(){
	var $ = layui.jquery;
	
	// 所有文章数
	$.ajax({
		type:"GET",
		url:"/mosc/home/allCount/",
		dataType:"html",
		success:function(data){
			$('.allArticle').html(data);
		}
	});
	// 审核文章数
	$.ajax({
		type:"GET",
		url:"/mosc/home/readCount/",
		dataType:"html",
		success:function(data){
			$('.readArticle').html(data);
		}
	});
	// 所有用户数
	$.ajax({
		type:"GET",
		url:"/mosc/home/allUser/",
		dataType:"html",
		success:function(data){
			$('.allUser').html(data);
		}
	});
	// 所有栏目
	$.ajax({
		type:"GET",
		url:"/mosc/home/allColumn/",
		dataType:"html",
		success:function(data){
			$('.column').html(data);
		}
	});
	// 所有栏目
	$.ajax({
		type:"GET",
		url:"/mosc/home/readColumn/",
		dataType:"html",
		success:function(data){
			$('.readColumn').html(data);
		}
	});
});