<%@ page contentType="text/html; charset=utf-8" language="java"
	errorPage=""%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>

<style type="text/css">
	
	#selectTrackList .modal-footer button{
		width:100%;
		display:block;
		border-color: transparent;
		background-color: transparent;
		box-shadow: none;
		color:#5dc5ec;
	}
	
	#selectTrackList .modal-dialog{
		position: fixed;
		top: 0; right: 0; bottom: 0; left: 0;
	   	margin: auto;
	   	height: 330px;
	   	width:90%;
	}

	a.selectTrackListItem{
		background-position: 10px 10px;
		background-repeat: no-repeat;
		background-size: 28px 28px;
		padding-left: 50px;
		min-height: 48px;
	}

	#addTrackList .modal-footer button{
		width:50%;
	background-color: transparent;
	box-shadow: none;
	color:#5dc5ec;
	}

	#addTrackList .modal-dialog{
		position: fixed;
		top: 0; right: 0; bottom: 0; left: 0;
	   	margin: auto;
	   	height: 200px;
	   	width:90%;
	}

	#addTrackListCancel{
		position:absolute;
		top:0;
		left:0;	
	}

	#addTrackListSubmit{
		position:absolute;
		top:0;
		right:0;	
		border-left:1px solid #e5e5e5;
	}

	button[name=add]{
		display: block;
		width:100%;
		border-color: transparent;
		background-color: transparent;
		padding: 10px 15px;
		padding-left: 50px;
    	min-height: 48px;
		text-align: left;
		background-image:url(resources/theme1/img/pic_add.png); 
 		background-position: 10px 10px;
		background-repeat: no-repeat;
		background-size: 28px 28px;
	}
</style>

<div id="selectTrackList" class="modal bs-example-modal-sm"
	tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel">
	<div class="modal-dialog modal-sm">
		<div class="modal-content">
			<div class="modal-header">
				<span>选择下载到一个列表</span>
			</div>
			<button type="button" name="add">新建</button>
			<div class="list-group" style="margin-bottom:0;overflow-y:auto;height:189px;">
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
			</div>
		</div>
	</div>
</div>

<div id="addTrackList" class="modal bs-example-modal-sm"
	tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel">
	<div class="modal-dialog modal-sm">
		<div class="modal-content">
			<div class="modal-header">
				<span>新建一个列表</span>
			</div>
			<div class="modal-body">
				<form>
					<div class="form-group">
						<label for="addTrackListName" class="control-label">列表名称：</label>
						<input type="text" class="form-control" id="addTrackListName">
					</div>
				</form>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn" data-dismiss="modal" id="addTrackListCancel">取消</button>
				<button type="button" class="btn"
					id="addTrackListSubmit">确定</button>
			</div>
		</div>
	</div>
</div>

<script>
	var callbackbtn;
	var callbackfunction;
	function select_add_tracklist_show(btn,callback){
		callbackbtn = btn;
		callbackfunction = callback;
		$("#selectTrackList").modal();
	}

	$('#selectTrackList').on('show.bs.modal', function (e) {
		console.log("showing");
		var $list = $('#selectTrackList').find(".list-group");
		$list.find("a").remove();
		
		$.ajax({
			type : "GET",
			url : contextPath + "/tracklist/getlistsimple.do?deviceId="+window.deviceId,
			async : false,
			dataType : 'json',
			timeout : 4000,
			success : function(data) {
				var count = data.length;
				
				for(var i=0;i<count;i++){
					console.log(data[i].coverSmallUrl);
					
					var html = "<a class=\"list-group-item selectTrackListItem\" name=\""+data[i].id+"\""
					+"style=\"background-image: url('"+ data[i].coverSmallUrl +"');\">"
						+data[i].name
						+"</a>";
					
					$list.append(html);
				}
			},
			error : function(data) {
				//hideMaskLoading();
			}
		});
	})
	
	$('#selectTrackList').find("button[name=add]").click(function(){
		$('#selectTrackList').modal('hide');
		$('#addTrackList').modal();
	});

	$('#selectTrackList').find(".list-group").on('click','a',function(){
		var trackListId = 0;
		var name = $(this).attr('name');
		var trackListId = parseInt($(this).attr('name'));
		
		console.log("trackListId:"+trackListId);
		
		if(trackListId >0){
			callbackfunction(callbackbtn,trackListId);
			$('#selectTrackList').modal('hide');
		}	
	});
	
	$('#addTrackList').find("#addTrackListSubmit").click(function(){
		var name= $("#addTrackListName").val();
		if(name == ""){
			common_alert("列表名称不能为空，请修改","确定",function(){
				//$("#addTrackListName")[0].focus();
				return;	
			});
			return;
		}
		
		var trackList = {id:0,deviceId:window.deviceId,name:name};
		var trackListId=0;
		$.ajax({
			type : "POST",
			url : contextPath + "/tracklist/add.do?deviceOnline="+window.deviceOnline,
			contentType : 'application/json',
			async : false,
			dataType : 'json',
			timeout : 4000,
			data : JSON.stringify(trackList),
			success : function(msg) {
				trackListId = parseInt(msg);
			},
			error : function(data) {
				//hideMaskLoading();
			}
		});
		
		if(trackListId >0){
			callbackfunction(callbackbtn,trackListId);
			$('#addTrackList').modal('hide');
		}
		else{
			common_alert("检测到已经存在同名列表，请修改","确定",function(){
				
			});
			
		}
	});

	function closeAllModal(){
		$("#selectTrackList").modal('hide');
		$('#addTrackList').modal('hide');
	}
</script>
