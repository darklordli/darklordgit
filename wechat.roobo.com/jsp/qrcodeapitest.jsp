<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>带参数的二维码接口页面</title>
<link
	href="resources/theme1/css/bootstrap.min.css"
	rel="stylesheet">

	<script src="js/lib/jquery-1.11.3.min.js"></script>

</head>

<body>
	<div class="container">
		<h1 class="page-header">创建用于绑定的临时二维码</h1>
		<form id="devicebindCreateForm" class="form-horizontal">
			<div class="form-group">
				<label class="col-sm-2 control-label">deviceId</label>
				<div class="col-sm-10">
					<input type="text" class="form-control" name="deviceId">
				</div>
			</div>
			<div class="form-group">
				<label class="col-sm-2 control-label">场景类型</label>
				<div class="col-sm-10">
					<select class="form-control" name="sceneType"></select>
				</div>
			</div>
			<div class="form-group">
				<div class="col-sm-offset-2 col-sm-10">
					<button id="devicebindCreateFormSubmit" type="button" class="btn btn-default">创建</button>
				</div>
			</div>

		</form>
		<img id="devicebindCreateImg" alt="" src="">


	</div>

	<script>
	$(document).ready(function() {

		$.ajax({
	       type:"GET",
	       url:"qrcodeapi/scenetype/get.do",
	       async:false,
	      dataType:"json",
       	  cache:false,
       	 success:function(data){
       			var count = $(data).size();
       		 	var i=0;
       		 	while(i<count){
       		 		var html = "<option>"+data[i]+"</option>";
       		 		$("select[name=sceneType]").append(html);
       		 		i = i+1;
       		 	}
        	}
	      });



		$("#devicebindCreateFormSubmit").click(function(){
			var deviceId = $("#devicebindCreateForm").find("input[name=deviceId]").val();

			if(deviceId.indexOf(' ') >= 0){
				alert("存在空格!");
				return;
			}

			var sceneType = $("select[name=sceneType]").val();
			var url = "qrcodeapi/create.do?deviceId="+deviceId+"&sceneType="+sceneType;
			console.log(url);

			$.ajax({
		          type:"GET",
		          url:url,
		          async:false,
		          //contentType : 'application/json',
	         	  cache:false,
	         	 success:function(msg){
	          		$("#devicebindCreateImg").attr('src',msg);
	          }
		      });
		});


	});


	</script>

</body>


</html>
