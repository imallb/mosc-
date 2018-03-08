layui.use(['form','upload','jquery','layer'],function(){
	var $ = layui.jquery,
		element = layui.element;
		upload = layui.upload,
		form = layui.form,
		layer = layui.layer,
		classifys = 0;

	//普通图片上传
	var uploadInst = upload.render({
		elem: '#test1',
		url: '/mosc/api/upload',
		before: function(obj){
			//预读本地文件示例，不支持ie8
			obj.preview(function(index, file, result){
				$('#demo1').attr('src', result); //图片链接（base64）
			});
		},
		done: function(res){
			//如果上传失败
			if(res.code > 0){
				return layer.msg('上传失败');
			};
			$('#avatar').val(res.filename);
			$('#demoText').hide();
			//上传成功
		},
		error: function(){
			//演示失败状态，并实现重传
			var demoText = $('#demoText');
			demoText.show().html('<span>上传失败</span><a class="layui-btn layui-btn-small demo-reload">重试</a>');
			demoText.find('.demo-reload').on('click', function(){
				uploadInst.upload();
			});
		}
	});

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
		if(ue.getContent()==''){
			layer.msg('请编写你的文章！');
			return false;
		};
		$("textarea[name=content]").val(ue.getContent());
	});
});

