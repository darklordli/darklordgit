<div id="pagePlay" class="page out" data-callback="pagePlay_callback">
	<div id="divCurrentPlay" class="text-center">
		<h4>nothing to play</h4>
		<p>1分30秒</p>
		<img src="http://fdfs.xmcdn.com/group11/M02/04/42/wKgDbVawG1rBjO-HAAsoKn1FJrI110_web_meduim.jpg">

		<p>1分30秒</p>
		<p class="downloadexists">&nbsp;&nbsp;&nbsp;状态：已下载</p>

		<div style="margin-top:30px;background-color: #f8f8f8; border-color: #e7e7e7;">
			<button type="button" class="btn btn-lg btn_clear btnBackward">
					<span class="glyphicon glyphicon-step-backward" aria-hidden="true"></span>
				</button>
			<button type="button" class="btn btn-lg btn_clear btnPlay">
					<span class="glyphicon glyphicon-play" aria-hidden="true"></span>
				</button>
			<button type="button" class="btn btn-lg btn_clear btnPause">
					<span class="glyphicon glyphicon-pause" aria-hidden="true"></span>
				</button>
			<button type="button" class="btn btn-lg btn_clear btnForward">
					<span class="glyphicon glyphicon-step-forward" aria-hidden="true"></span>
				</button>
			<button type="button" class="btn btn-lg btn_clear btnDownload">
					<span class="glyphicon glyphicon-download" aria-hidden="true"></span>
				</button>

		</div>
	</div>
	<div id="divVolumeSet" class="text-center" style="padding-top:30px;display:none;">
		音量：<input type="text" data-slider-min="0" data-slider-max="40" />
		<button type="button" class="btn btn-success btn-xs" onclick="toggleVolmeSet()">ok</button>
	</div>
	<div id="divModeSet" class="text-center" style="padding-top:30px;display:none;">
		<input type="radio" name="radioMode" value="0">
        <label>顺序</label>
		<input type="radio" name="radioMode" value="1">
		<label>随机</label>
		<input type="radio" name="radioMode" value="2">
        <label>单曲循环</label>
		<input type="radio" name="radioMode" value="3">
		<label>列表循环</label>

		<button type="button" class="btn btn-success btn-xs" onclick="setMode()">ok</button>
	</div>
	<div id="divDownloadInfo" class="text-center" style="padding-top:30px;display:none;">
		下载成功
		<button type="button" class="btn btn-success btn-xs" onclick="closeDownloadInfo()">ok</button>
	</div>

	<nav class="navbar navbar-default navbar-fixed-bottom">
		<div id="btnLocationToPlayList" class="col-xs-4 footbutton text-center">
			<a href="#pageTrackList">
				<span class="glyphicon glyphicon-arrow-left" aria-hidden="true" style="display:block;"></span>
				<small>返回</small>
			</a>
		</div>
		<div id="btnLocationToPlayList" class="col-xs-4 footbutton text-center" onclick="toggleVolmeSet()">
			<span class="glyphicon glyphicon-volume-up" aria-hidden="true" style="display:block;"></span>
			<small>音量设置</small>
		</div>
		<div id="btnLocationToPlayList" class="col-xs-4 footbutton text-center" onclick="toggleModeSet()">
			<span class="glyphicon glyphicon-cog" aria-hidden="true" style="display:block;"></span>
			<small>播放模式</small>
		</div>

	</nav>
</div>
