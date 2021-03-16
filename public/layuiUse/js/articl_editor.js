layui.use(['form','upload','jquery','layer'],function(){
	var $ = layui.jquery,
		element = layui.element;
		upload = layui.upload,
		form = layui.form,
		layer = layui.layer,
		classifys = 0;

	form.on('submit(sub)', function(data){
		//console.log(data.field);
		if(data.field.title==''){
			$('[name=title]').focus();
			layer.msg('标题不能为空！');
			return false;
		};
		if(data.field.key==''){
			$('[name=key]').focus();
			layer.msg('关键字不能为空！');
			return false;
		};
		if(data.field.paper==''){
			$('[name=paper]').focus();
			layer.msg('文章摘要不能为空！');
			return false;
		};
		if(ue.getContent()==''){
			layer.msg('请编写你的文章！');
			return false;
		};
		$("textarea[name=content]").val(ue.getContent());
	});
});

