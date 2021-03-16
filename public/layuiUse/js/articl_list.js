layui.use(['jquery','form','layer', 'laypage'],function(){
	var $ = layui.jquery;
	var form = layui.form;
	var layer = layui.layer;
	var laypage = layui.laypage;
	var page = new Number($('#demo1').attr('page'));
	// 获取url的参数属性
	var queryArr = window.location.href.match(/\?.+/g)[0].replace('?','').split('&');
	var queryObj = {};
	for(var i=0;i<queryArr.length;i++){
		var list = queryArr[i].split('=');
		queryObj[list[0]] = list[1];
	};
	function articles(){
		//页码
		$.get('/mosc/article_list/count?id='+queryObj.id, function(res){
			laypage.render({
				elem: 'demo1',
				count: res.data,
				limit: 10,
				curr: page,
				jump: function(obj, first){
					// 记录当前页码，异步刷新后保持在当前页码
					page = obj.curr;
					// 异步加载文章列表
					$.ajax({
						type:"GET",
						url:"/mosc/article_list/article/"+queryObj.id+"?page="+page+"&limit="+obj.limit,
						dataType:"json",
						success:function(data){
							var data = data.data;
							$('#allChoose').get([0]).checked = false;
							$("tbody").html('');
							for(var i=0;i<data.length;i++){
								var posts = data[i];
								tbodyhtml(posts);
							};
							form.render('checkbox');
							layer.closeAll('loading');
							// 删除单个数据
							$('.news_clear').on('click',function(){
								var url = $(this).attr('data');
								layer.load(2);
								$.get(url, function(data){
									articles();
									layer.msg(data.message,{time: 2000});
								});
							})
						}
					});
				}
			});
		});
	};
	articles();
	// 创建html
	function tbodyhtml(post){
		$("tbody").append(
			'<tr>'+
				'<td><input type="checkbox" name="checklist[]" lay-skin="primary" lay-filter="checklist" class="checklist" value="'+post._id+'"></td>'+
				'<td align="left">'+post.title+'</td>'+
				'<td>'+(post.read[0] == 'on'?'审核中':'已通过')+'</td>'+
				'<td>'+post.created_at+'</td>'+
				'<td>'+
					'<a class="layui-btn layui-btn-mini news_edit" href="/mosc/article_editor/'+post._id+'?listPage='+page+'"><i class="layui-icon">&#xe642;</i>编辑</a>'+
					'<a class="layui-btn layui-btn-mini layui-bg-red news_clear" href="javascript:;" data="/mosc/article_list/delete?id='+post._id+'"><i class="layui-icon">&#xe640;</i>删除</a>'+
				'</td>'+
			'</tr>'
		);
	};
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
	
	$('#deleted').on('click',function(event){
		var checklist = [];
		$('.checklist').each(function(i, e){
			if(e.checked==true){
				checklist.push(e.value);
			}
		});
		if(checklist[0]==undefined){
			window.event.preventDefault();
			return false;
		}else{
			layer.load(2);
			$.post("/mosc/article_list/article_delete/", { checklist:checklist }, function(res){
				articles();
				layer.msg(res.message,{time: 2000});
			});
		}
	});
	$('.back').on('click',function(){
		var page = getCookie('columnPage');

		window.location.href = '/mosc/column?page='+page;
	});
	function getCookie(name) {
		var v = window.document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
		return v ? v[2] : null;
	}
});
