<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>用户列表</title>
	<link href="resources/theme1/css/bootstrap.min.css" rel="stylesheet">

	<script src="js/lib/jquery-1.11.3.min.js"></script>
	<script src="js/lib/bootstrap.min.js"></script>
	<script src="js/lib/bootbox.min.js"></script>
</head>

<body>
	<div class="container">

		<div class="page-header">
			<p class="pull-right">
				<c:url value="../<%= request.getContextPath() %>userlist.do" var="refreshUrl"/>
				<a href="<c:out value='${refreshUrl}'/>" class="btn btn-default" role="button">
					<span class="glyphicon glyphicon-star" aria-hidden="true"></span> 刷新
				</a>
				<a href="javascript:history.back();" class="btn btn-default" role="button">返回</a>
				<button type="button" class="btn btn-primary btn-lg" data-toggle="modal" data-target="#myModal" data-id="test">
				  Launch demo modal
				</button>
				<button type="button" class="btn btn-default" onclick="showAlert()">弹出框</button>
			</p>
			<h3>storybox用户列表</h3>

		</div>



		<table class="table table-bordered table-striped">
			<thead>
				<tr>
					<th></th>
					<th>昵称</th>
					<th>性别</th>
					<th>城市</th>
					<th>关注时间</th>
					<th>是否关注</th>
				</tr>
			</thead>
			<tbody>
				<c:forEach var="user" items="${users}">
					<tr>
						<td><img src="${user.headimgurl}" height="50" width="50" /></td>
						<td>${user.nickname}</td>
						<td>
						<c:if test="${user.sex == 1 }">
						男
						</c:if>
						<c:if test="${user.sex == 2 }">
						女
						</c:if>
						<c:if test="${user.sex == 0 }">
						未知
						</c:if>
						</td>
						<td>${user.country}${user.province}${user.city}</td>
						<td>${user.subscribe_time} </td>
						<td>${user.subscribe} </td>
					</tr>
				</c:forEach>
			</tbody>
		</table>
		<form action="media/upload.do" enctype="multipart/form-data" method="post">
			<input type="text" name="fileType" />
			<input type="file" name="file" />
			<button type="submit">提交</button>
		</form>
	</div>

	<!-- Modal -->
	<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
	  <div class="modal-dialog" role="document">
	    <div class="modal-content">
	      <div class="modal-header">
	        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
	        <h4 class="modal-title" id="myModalLabel">Modal title</h4>
	      </div>
	      <div class="modal-body">
	       <p> ceshi </p>
	      </div>
	      <div class="modal-footer">
	        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
	        <button type="button" class="btn btn-primary">Save changes</button>
	      </div>
	    </div>
	  </div>
	</div>

</body>
<script>
$("#myModal").on('show.bs.modal', function (event) {
	var button = $(event.relatedTarget) // Button that triggered the modal
	var id = button.data('id') // Extract info from data-* attributes
	var modal = $(this)
	  modal.find('.modal-title').text('New message to ' + id)

});

function showAlert(){
	bootbox.alert({
	    size: 'small',
	    message: "分享成功",
	    callback: function(){ /* your callback code */ }
	})
}
</script>

</html>
