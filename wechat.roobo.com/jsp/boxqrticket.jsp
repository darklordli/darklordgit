<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>生成设备二维码</title>
<link
	href="resources/theme1/css/bootstrap.min.css"
	rel="stylesheet">

	<style type="text/css">
		.qrticket{
			background-repeat:no-repeat;
			background-position: center center;
			padding-top:180px;
			text-align:center;
		}
	</style>

	<script src="js/lib/jquery-1.11.3.min.js"></script>

</head>

<body>
	<div class="container">
		<h1 class="page-header">创建用于绑定的设备二维码</h1>
		<form id="createForm" class="form-horizontal">
			<div class="form-group">
				<label class="col-sm-2 control-label">产品id</label>
				<div class="col-sm-10">
					<input type="text" class="form-control" name="productId">
					<p class="help-block">请在微信公众号后台查询到产品id</p>
				</div>
			</div>
			<div class="form-group">
				<label class="col-sm-2 control-label">批次</label>
				<div class="col-sm-10">
					<input type="text" class="form-control" name="head">
					<p class="help-block">可以是大小写英文字母和数字，长度控制在10以内</p>
				</div>
			</div>
			<div class="form-group">
				<label class="col-sm-2 control-label">起始号</label>
				<div class="col-sm-10">
					<input type="text" class="form-control" name="beginNum">
					<p class="help-block">任意大于零的数字</p>
				</div>
			</div>
			<div class="form-group">
				<label class="col-sm-2 control-label">截止号</label>
				<div class="col-sm-10">
					<input type="text" class="form-control" name="endNum">
					<p class="help-block">任意大于零的数字，要大于起始号</p>
				</div>
			</div>
			<div class="form-group">
				<div class="col-sm-offset-2 col-sm-10">
					<button id="createFormSubmit" type="button" class="btn btn-success">创建</button>
				</div>
			</div>
			<div id="divQrticket"></div>
		</form>

	</div>

	<script>
	$(document).ready(function() {


		$("#createFormSubmit").click(function(){
			var productId = $("#createForm").find("input[name=productId]").val();
			if(productId == ""){
				alert("产品id不能为空!");
				return;
			}

			if(productId.indexOf(' ') >= 0){
				alert("产品id不能包含空格!");
				return;
			}

			var head = $("#createForm").find("input[name=head]").val();
			if(head == ""){
				alert("批次不能为空!");
				return;
			}

			var pattern =/^[A-Za-z0-9]+$/;
			if(!pattern.test(head)){
				alert("批次有不合法的字符!");
				return;
			}

			if(head.length >10){
				alert("批次的长度不能超过10!");
				return;
			}

			var beginNum =  $("#createForm").find("input[name=beginNum]").val();
			if(isNaN(beginNum) || beginNum<0){
				alert("起始号不是大于零的数字!");
				return;
			}

			var endNum =  $("#createForm").find("input[name=endNum]").val();
			if(isNaN(endNum) || endNum<0){
				alert("截止号不是大于零的数字!");
				return;
			}
			if(beginNum>endNum){
				alert("截止号不能小于起始号!");
				return;
			}

			$("#divQrticket").html("");

			var deferreds = [];
			var i= parseInt(beginNum);
			endNum = parseInt(endNum);

			while (i<=endNum) {
				var request = create_request(productId,head,i);
				deferreds.push(request);
				i = i +1;
			}

			$.when.apply(null, deferreds).done(function() {
	            console.log("all done");
	        });

		});

		function create_request(productId,head,num){
			var url = "boxqrticket/create.do";
			var boxQrticketCreate ={};
			boxQrticketCreate.productId = productId;
			boxQrticketCreate.prefix = head+num;

			return $.ajax({
		          type:"POST",
		          url:url,
		          async:true,
		          contentType : 'application/json',
	         	  cache:false,
	         	 data : JSON.stringify(boxQrticketCreate),
	         	dataType: 'json',
	         	 success:function(data){
	         		 if(data.deviceId != "" && data.deviceId != null){
		         	 	var html = "<div class =\"col-sm-3 qrticket\" style=\"background-image:url("+data.imgUrl+")\"><span>"+data.prefix+"</span></div>";
		         	 	console.log(html);
		         	 	$("#divQrticket").append(html);
	         		 }
	          }
		      });
		}

	});


	</script>

</body>


</html>
