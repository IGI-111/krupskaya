var Connection = {
	status: undefined,
	toggle: function(){
		$("#upload").toggle('fade');
		if(this.status){
			$("#disconnect").hide('fade', 200, function(){
				$("#connect").show('fade', 200);
			});
		}
		else{
			$("#connect").hide('fade', 200, function(){
				$("#disconnect").show('fade', 200);
			});
		}
		this.status = !this.status;
	},
	bindUI: function() {
		// setup connection buttons
		$("#disconnect").click(function(){
			$(this).prop("disabled", true);
			$.post("disconnect.php");
			Connection.toggle();
			$(this).prop("disabled", false);
		});
		$("#connect").click(function(){
			$("#connectionModal").modal("show");
		});
		$("#connectionModal form").submit(function(event){
			$("#connectionModal :submit").prop("disabled", true);
			event.preventDefault();
			$.post("connect.php", $("#connectionModal form").serialize())
			.done(function(){
				$("#connectionModal").modal("hide");
				Connection.toggle();
			}).fail(function(){
				$("#connectionModal .modal-body").prepend(
					'<div role ="alert" class="alert alert-danger"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><p>Wrong username or password</p></div>'
				);
			}).complete(function(){
				$("#connectionModal :submit").prop("disabled", false);
			});
		});
		// setup upload button
		$("#upload").click(function(){
			$("#uploadModal").modal("show");
		});
		$("#uploadModal form").submit(function(event){
			$("#uploadModal :submit").prop("disabled", true);
			event.preventDefault();
			$.ajax({
				url: 'upload.php',
				type: 'POST',
				data: new FormData($("#uploadModal form")[0]),
				contentType: false,
				processData: false,
				success: function(){
					$("#uploadModal").modal("hide");
					List.reload();
				},
				error: function(request){
					var message;
					switch(request.status)
					{
						case 401:
							message = "You are not logged in.";
						break;
						case 422:
							message = "File is too big.";
						break;
						case 400:
							case 500:
							default:
							message = "Unknown Error.";
					}
					$("#uploadModal .modal-body").prepend(
						'<div role ="alert" class="alert alert-danger"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><p>'+message+'</p></div>'
					);
				},
				complete: function() {
					$("#uploadModal :submit").prop("disabled", false);
				}
			});
		});

	},
	init: function(){
		Connection.bindUI();
		$.get("connected.php", function(isConnected) {
			this.status = isConnected;
			if(status)
				{
					$("#upload").show();
					$("#disconnect").show();
				}
				else
					{
						$("#connect").show();
					}
		});
	}
};

var List = {
	getNextTrack: function(){
		return $("#list .active").next().attr("data-file");
	},
	bindUI: function () {
		$("#list li").click(function(){
			var id = $(this).attr("data-file");
			Player.changeTrack(id);
		});
	},
	update: function() {
		$('#list .active').toggleClass("active")
		.parent().parent().toggleClass("panel-primary");
		$("#list [data-file='"+Player.playing+"']").toggleClass("active")
		.parent().parent().toggleClass("panel-primary");
	},
	reload: function() {
		$("#list").empty();
		List.init(List.update);
	},
	init: function (callback) {
		$.get("listAlbums.php", function(albumList){
			var requests = [];
			for (var i = 0, len = albumList.length; i < len; i++) {
				requests.push($.get("album.php",{r:albumList[i]}, function(data) {
					var albumHtml =
						'<div class="col-md-2">' +
						'<div style="display:none;" class="panel panel-default">' +
						'<div class="panel-heading">' +
						data[0].album +
						'</div>' +
						'<ul class="list-group">';
					for (var i = 0, len = data.length; i < len; i++) {
						albumHtml +=
							'<li class="list-group-item" data-file="' + data[i]._id + '" href="#">' +
							data[i].title +
							'</li>';
					}
					albumHtml +=
						'</ul>' +
						'</div>' +
						'</div>';
					$("#list").append(albumHtml);
				}));
			}
			$.when.apply($, requests).then(function(){
				List.bindUI();
				if(callback != undefined)
					callback();
				$("#list .panel").fadeIn();
			});
		});
	}
};

var Player = {
	playing: undefined,
	sliderPrecision: 10000,
	bindUI: function(){
		var audio = $("#player audio")[0];
		$("#player .playButton").on("click", function(){
			audio.play();
		});
		$("#player .pauseButton").on("click", function(){
			audio.pause();
		});
		$("#player .stopButton").on("click", function(){
			audio.pause();
			audio.currentTime = 0;
		});
		$("#player .togglePlayer").on("click", function(){
			$("#complexPlayer").toggle("blind");
			$("#simplePlayer").toggle("blind");
		});
		$("#player .slider").slider({
			max: Player.sliderPrecision,
			orientation: "horizontal",
			range: "min",
			animate: 1000
		}).on("slide", function(event, ui) {
			audio.currentTime = audio.duration*(ui.value / Player.sliderPrecision);
		});
		$("#player audio").on("timeupdate", function(event, ui){
			var pos = Player.sliderPrecision*(audio.currentTime / audio.duration);
			$("#player .slider").slider("value", pos);
		}).on("ended", function(event, ui){
			//play next element if there is any
			var nextToPlay = List.getNextTrack();
			if(nextToPlay != undefined){
				Player.changeTrack(nextToPlay);
				List.update();
			}
		});
	},
	init: function(){
		Player.bindUI();
	},
	changeTrack: function(id){
		Player.playing = id;
		// change audio value
		$("#player audio").attr("src", "song.php?r="+id);
		$("#player .slider").slider("value", 0);
		// change waveform data
		$.get("metadata.php",{r:id}, function(data) {
			Player.drawWaveform(data.wave);
		});
		// autoplay
		$("#player audio")[0].play();
		// update list
		List.update();
	},
	drawWaveform: function(data){
		var canvas = $("#player canvas")[0];
		canvas.width = data.left.length;
		var ctx = canvas.getContext('2d');
		var increment = canvas.width/data.left.length;

		var offset = canvas.height*(2/3);
		var leftBarGradient = ctx.createLinearGradient(0,0,0,offset);
		leftBarGradient.addColorStop(0,"rgba(255,255,255,0.2)");
		leftBarGradient.addColorStop(1,"rgba(255,255,255,0.3)");
		var rightBarGradient = ctx.createLinearGradient(0,offset,0,offset + offset/2);
		rightBarGradient.addColorStop(0,"rgba(255,255,255,0.2)");
		rightBarGradient.addColorStop(1,"rgba(255,255,255,0.3)");

		ctx.fillStyle = "lightgrey";
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		for (var i = 0, len = data.left.length; i < len; i++) {
			var leftBarHeight = data.left[i]*(offset);
			var rightBarHeight = data.right[i]*(offset/2);
			ctx.fillStyle = leftBarGradient;
			ctx.clearRect(i*increment, Math.ceil(offset-leftBarHeight), increment, Math.floor(leftBarHeight));
			ctx.fillRect(i*increment, Math.ceil(offset-leftBarHeight), increment, Math.floor(leftBarHeight));
			ctx.fillStyle = rightBarGradient;
			ctx.clearRect(i*increment, Math.floor(offset), increment, Math.floor(rightBarHeight));
			ctx.fillRect(i*increment, Math.floor(offset), increment, Math.floor(rightBarHeight));
		}
	}
};

$(document).ready(function(){
	Connection.init();
	Player.init();
	List.init();
});
