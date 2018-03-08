layui.use(['element','layer','jquery'], function(){
	var element = layui.element;
	var $ = layui.jquery;
	var layer = layui.layer;
	
	$('[data-url]').on('click', function(){
		// layer.load(2);
		$('.clildFrame iframe').attr('src',$(this).attr('data-url')).load(function(){
			layer.closeAll('loading');
		});
	});
	
	$('.clearCookie').on('click',function(){
		layer.load(2);
		$.ajax({
			type: 'GET',
			url: '/mosc/clearsession',
			dataType:"json",
			success: function(data){
				layer.closeAll('loading');
				layer.msg(data.text);
			}
		});
	});
});