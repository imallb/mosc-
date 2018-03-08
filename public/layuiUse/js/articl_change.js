layui.use(['form','upload','jquery','layer'],function(){
	var $ = layui.jquery,
		upload = layui.upload,
		form = layui.form,
		layer = layui.layer,
		classifys = 0;
	
	$.ajax({
		type:"GET",
		url:"/arrcify.json",
		dataType:"json",
		success:function(data,status){
			function checkInput(i){
				for(var y=0;y<cify.length;y++){
					if( data.arrcify[i]===cify[y] ){
						return $(".classify ul.allcify").append('<li>'+
										'<input type="checkbox" lay-filter="classify" lay-skin="primary" name="classify[]" value="'+data.arrcify[i]+'" checked>'+
										'<label>'+i+'</label>'+
									'</li>'
								);
					}
				};
				return $(".classify ul.allcify").append('<li>'+
								'<input type="checkbox" lay-filter="classify" lay-skin="primary" name="classify[]" value="'+data.arrcify[i]+'">'+
								'<label>'+i+'</label>'+
							'</li>'
						);
			};
			for(var i in data.arrcify){
				checkInput(i)
			};
			form.on('checkbox(classify)', function(data){
				if(data.elem.checked == true){
					classifys++
					if(classifys>3){
						classifys = 3;
						data.elem.checked = false;
					};
				}else{
					classifys--;
				};
				form.render('checkbox');
			});
			
			$(".classify .c_ok").click(function(){
				$(".ed_classify").fadeOut(300);
			});
			$(".classify .c_qx").click(function(){
				$(".ed_classify").fadeOut(300);
				var arr = $(".classify ul input").length;
				for(var i=0;i<arr;i++){
					$(".classify ul input").get([i]).checked = false;
				};
				classifys = 0;
				form.render('checkbox');
			});
			$(".cfig").click(function(){
				$(".ed_classify").fadeIn(300);
			});
			
			form.render('checkbox');
		}
	});

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

