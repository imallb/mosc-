layui.use(['jquery','form','laypage'],function(){
	var $ = layui.jquery;
	var form = layui.form;
	var laypage = layui.laypage;
	var page = new Number($('#demo1').attr('page'));
	var limit = new Number($('#demo1').attr('limit'));
	
	//页码
	laypage.render({
		elem: 'demo1',
		count: page,
		limit: limit,
		jump: function(obj, first){
			// 异步加载文章列表
			$.ajax({
				type:"GET",
				url:"/mosc/user_list/api?page="+obj.curr+"&limit="+limit,
				dataType:"json",
				success:function(data){
					$("tbody").html('');
					for(var i=0;i<data.posts.length;i++){
						var post = data.posts[i];
						$("tbody").append(
							'<tr>'+
								'<td><input type="checkbox" name="checklist[]" lay-skin="primary" lay-filter="checklist" class="checklist" value="'+post.name+'"></td>'+
								'<td align="left">'+post.name+'</td>'+
								'<td>'+selected(post.status)+'</td>'+
								'<td>'+post.created_at+'</td>'+
							'</tr>'
						);
					};
					function selected(status){
						var arr = ['user', 'admin'];
						var text= '<select name="status" lay-verify="" lay-filter="status">';
						
						for(var i=0;i<arr.length;i++){
							if(arr[i]==status){
								text += '<option value="'+arr[i]+'" selected>'+arr[i]+'</option>';
							}else{
								text += '<option value="'+arr[i]+'">'+arr[i]+'</option>';
							}
						};
						return text+'</select>';
					};
					form.render();
				}
			});
		}
	});
	
	// 全选
	form.on('checkbox(allChoose)', function(data){
		var child = $(data.elem).parents('table').find('.checklist');
		child.each(function(index, item){
			item.checked = data.elem.checked;
		});
		form.render('checkbox');
	});
	
	// 复选
	form.on('checkbox(checklist)', function(data){
		var child = $(data.elem).parents('table').find('#allChoose');
		var _this = $(data.elem).parents('table').find('.checklist');
		var allblu= false;
		var i = 0;

		_this.each(function(index, item){
			if(item.checked==true){
				i++;
				if(i==_this.length){
					allblu = true;
					return false
				}
			}else{
				allblu = false;
				return false
			};
		});
		
		if( data.elem.checked == false ){
			child.get([0]).checked = false;
		}else if(allblu==true){
			child.get([0]).checked = true;
		};
		form.render('checkbox');
	});
	
	// 会员修改
	form.on('select(status)', function(data){
		var val = data.value;
		var name= $(data.elem).parent().parent().find('td').eq(1).html();
		
		$.post("/mosc/user_list/update/", { name: name, val: val });
		
		form.render('select');
	});
	
	$('#deleted').on('click',function(event){
		var checklist = [];
		$('.checklist').each(function(i, e){
			if(e.checked==true){
				checklist.push(e.value);
			}
		});
		if(checklist[0]==undefined){
			window.event.preventDefault();
		}else{
			$.post("/mosc/api/user_delete/", { checklist:checklist });
		}
	});
});
