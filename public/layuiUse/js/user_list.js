layui.use(['jquery','form','laypage','layer'],function(){
	var $ = layui.jquery;
	var form = layui.form;
	var laypage = layui.laypage;
	var layer = layui.layer;
	var page = 1;

	//页码
	function pagefn(){
		$.get('/mosc/user_list/count',function(res){
			laypage.render({
				elem: 'demo1',
				count: res.data,
				limit: 10,
				curr: page,
				jump: function(obj, first){
					page = obj.curr
					// 异步加载用户信息列表
					$.ajax({
						type:"GET",
						url:"/mosc/user_list/api?page="+page+"&limit="+obj.limit,
						dataType:"json",
						success:function(data){
							$("tbody").html('');
							for(var i=0;i<data.posts.length;i++){
								var post = data.posts[i];
								$("tbody").append(
									'<tr>'+
										'<td><input type="checkbox" name="checklist[]" lay-skin="primary" lay-filter="checklist" class="checklist" value="'+post.name+'"></td>'+
										'<td align="left" onclick="modify(\''+post.name+'\')">'+post.name+'</td>'+
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
		});
	};
	pagefn();
	
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
		var status = data.value;
		var name= $(data.elem).parent().parent().find('td').eq(1).html();
		$.post("/mosc/user_list/update", {name:name,status:status});
		form.render('select');
	});
	// 删除
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
			$.post("/mosc/user_list/user_delete/", { checklist:checklist },function(res){
				pagefn();
				layer.msg(res.message);
				$('#allChoose').get([0]).checked = false;
				form.render('checkbox');
			});
		}
	});

	// 弹窗
	$('.ceart_user').on('click',function(){
		$('.zz').show();
		$('#col').show();
	});
	// 提交用户
	form.on('submit(sub)', function(data){
		if(data.field.users==''){
			$('[name=users]').focus();
			layer.msg('账号不能为空！');
			return false;
		};
		if(data.field.password==''){
			$('[name=password]').focus();
			layer.msg('密码不能为空！');
			return false;
		};
		$.post('/mosc/user_list/puser',{users:data.field.users,password:data.field.password},function(res){
			if(res.static == 'success'){
				$('[name=users]').val('');
				$('[name=password]').val('');
				pagefn();
				$('.zz').hide();
				$('.col').hide();
			};
			layer.msg(res.message);
		});
		return false;
	});
	// 修改密码
	modify = function(users){
		$('.zz').show();
		$('#col_pasw').show();
		form.on('submit(Modifypasw)', function(data){
			if(data.field.newpasw==''){
				$('[name=newpasw]').focus();
				layer.msg('新密码不能为空！');
				return false;
			};
			if(data.field.againpasw==''){
				$('[name=againpasw]').focus();
				layer.msg('再次输入不能为空！');
				return false;
			};
			if(data.field.newpasw!=data.field.againpasw){
				$('[name=password]').focus();
				layer.msg('再次输入密码不一致！');
				return false;
			};
			$.post('/mosc/user_list/update',{name:users,password:data.field.newpasw},function(res){
				if(res.static == 'success'){
					$('[name=newpasw]').val('');
					$('[name=againpasw]').val('');
					$('.zz').hide();
					$('#col_pasw').hide();
				};
				layer.msg(res.message);
			});
			return false;
		});
	};
});
