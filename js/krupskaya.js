$(document).ready(function(){
	$.get("connected.php", function(isConnected) {
		setupConnectButton();
		$(isConnected ? "#disconnect" : "#connect").show();
		setupUploadButton();
		if(isConnected)
			$("#upload").show();
	});
	setupPlayer();
	setupList();
});

function setupList() {
	$("#list").empty();
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
			$("#list li").click(function(){
				$("#list .panel-primary").toggleClass("panel-primary");
				$('#list .active').toggleClass("active");
				changeTrack($(this).attr("data-file"));
				$(this).toggleClass("active");
				$(this).parent().parent().toggleClass("panel-primary");
			});
			$("#list .panel").fadeIn();
		});
	});
}

function setupPlayer() {
	var audio = $("#player audio")[0];
	var sliderPrecision = 10000;
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
	$("#player .slider")
		.slider({
			max: sliderPrecision,
			orientation: "horizontal",
			range: "min",
			animate: 1000
		})
		.on("slide", function(event, ui) {
			audio.currentTime = audio.duration*(ui.value / sliderPrecision);
		});
	$("#player audio")
		.on("timeupdate", function(event, ui){
			var pos = sliderPrecision*(audio.currentTime / audio.duration);
			$("#player .slider").slider("value", pos);
		})
		.on("ended", function(event, ui){
			//play next element if there is any
			var nextToPlay = $("#list .active").next();
			if(nextToPlay != undefined){
				$('#list .active').toggleClass("active");
				changeTrack(nextToPlay.attr("data-file"));
				nextToPlay.toggleClass("active");
			}
		});
}
function changeTrack (id){
	// change audio value
	$("#player audio").attr("src", "song.php?r="+id);
	$("#player .slider").slider("value", 0);
	// change waveform data
	$.get("metadata.php",{r:id}, function(data) {
		drawWaveform(data.wave);
	});
	// autoplay
	$("#player audio")[0].play();
}

function drawWaveform(data){
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

function setupConnectButton(isConnected) {
	$("#disconnect").click(function(){
		$(this).prop("disabled", true);
		$.post("disconnect.php");
		toggleConnection();
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
			toggleConnection();
		}).fail(function(){
			$("#connectionModal .modal-body").prepend(
				'<div role ="alert" class="alert alert-danger"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><p>Wrong username or password</p></div>'
			);
		}).complete(function(){
			$("#connectionModal :submit").prop("disabled", false);
		});
	});
}

function toggleConnection(){
	if($("#connect").is(":hidden")){
		$("#disconnect").toggle('fade', function(){
			$("#connect").toggle('fade');
		});
	}
	else{
		$("#connect").toggle('fade', function(){
			$("#disconnect").toggle('fade');
		});
	}
	$("#upload").toggle('fade');
}

function setupUploadButton() {
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
}
