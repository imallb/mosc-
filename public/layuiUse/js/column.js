layui.use(['jquery','form','laypage','layer'],function(){
	var $ = layui.jquery;
	var form = layui.form;
	var laypage = layui.laypage;
	var layer = layui.layer;
	var page = new Number($('#demo1').attr('page'));
	
	function columns(u){
		var urlText = '';
		if(u){
			var urlText = u.search?u.search:'';
		};
		var countText = urlText ==''? '' : '?search='+urlText+'&select='+u.select;
		var columnText = urlText ==''? '' : '&search='+urlText+'&select='+u.select;
		//页码
		console.log('/mosc/column/count' + countText)
		$.get('/mosc/column/count' + countText, function(res){
			console.log(res)
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
						url:"/mosc/api/column?page="+page+"&limit="+obj.limit+columnText,
						dataType:"json",
						success:function(data){
							console.log(data.posts)
							$('#allChoose').get([0]).checked = false;
							$("tbody").html('');
							for(var i=0;i<data.posts.length;i++){
								var posts = data.posts[i];
								tbodyhtml(posts);
							};
							form.render('checkbox');
							layer.closeAll('loading');
							// 删除单个数据
							$('.news_clear').on('click',function(){
								var url = $(this).attr('data');
								layer.load(2);
								$.get(url, function(data){
									columns();
									layer.msg(data.message,{time: 2000});
								});
							})
						}
					});
				}
			});
		});
	};
	columns();
	// 创建html
	function tbodyhtml(post){
		$("tbody").append(
			'<tr>'+
				'<td><input type="checkbox" name="checklist[]" lay-skin="primary" lay-filter="checklist" class="checklist" value="'+post._id+'"></td>'+
				'<td align="left">'+post.title+'</td>'+
				'<td>'+post.author.name+'</td>'+
				'<td>'+( (post.read[0]=='on')?'审核中':'已通过' )+'</td>'+
				'<td>'+post.created_at+'</td>'+
				'<td>'+
					'<span class="layui-btn layui-btn-mini news_edit" onclick="articleList(\'/mosc/article_list?id='+post._id+'\','+page+')"><i class="layui-icon">&#xe642;</i>编辑</span>'+
					'<span class="layui-btn layui-btn-mini layui-bg-red news_clear" data="/mosc/column/delete?postId='+post._id+'"><i class="layui-icon">&#xe640;</i>删除</span>'+
				'</td>'+
			'</tr>'
		);
	};
	// 搜索
	$('#search').on('click',function(){
		var sText = $('[name=select]').val();
		var cText = $('[name=search]').val();
		columns({
			select:sText,
			search:cText
		});
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
	
	// 批量删除数据
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
			$.post("/mosc/column/column_delete/", { checklist:checklist }, function(data){
				columns();
				layer.msg(data.message);
			});
		};
	});
});
function articleList(url,page){
	window.location.href=url;
	document.cookie = "columnPage="+page;
};
