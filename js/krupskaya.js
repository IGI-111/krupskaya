$(document).ready(function(){
	$.get("connected.php", function(isConnected) {
		setupConnectButton();
		$(isConnected ? "#disconnect" : "#connect").show();
		setupUploadButton();
		if(isConnected)
			$("#upload").show();
	});
	setupPlayer();

	$.get("list.php", function(idList){
		for (var i = 0, len = idList.length; i < len; i++) {
			$.get("metadata.php",{r:idList[i]}, function(data) {
				$("#list").append(
				'<div class="col-md-2">' +
					'<div class="panel panel-default" file="'+data._id+'">' +
						'<div class="panel-heading">' +
							data.title +
						'</div>' +
						'<div class="panel-body">' +
							'<a href="#">' +
								'<img class="media-object" src="data/'+data._id+'.jpg" alt="cover">' +
							'</a>' +
						'</div>' +
					'</div>' +
				'</div>');
				setupList();
			});
		}
	});

});

function setupList() {
	$("#list .panel").click(function(){
		changeTrack($(this).attr("file"));
		$("#list .panel").removeClass("panel-danger");
		$(this).toggleClass("panel-danger");
	});
	$("#list .panel").hover(function(){
		$(this).toggleClass("panel-warning");
		$(this).toggleClass("panel-default");
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
	$("#player .slider").slider({
		max: sliderPrecision,
		orientation: "horizontal",
		range: "min",
		animate: 1000
	});
	$("#player .slider").on("slide", function(event, ui) {
		audio.currentTime = audio.duration*(ui.value / sliderPrecision);
	});
	$("#player audio").on("timeupdate", function(event, ui){
		var pos = sliderPrecision*(audio.currentTime / audio.duration);
		$("#player .slider").slider("value", pos);
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
			$("#connectionModal :submit").prop("disabled", false);
			toggleConnection();
		}).fail(function(){
			$("#connectionModal .modal-body").prepend(
				'<div role ="alert" class="alert alert-danger"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><p>Wrong username or password</p></div>'
			);
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
				$("#uploadModal :submit").prop("disabled", false);
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
						message = "File is not an mp3.";
						break;
					case 500:
					default:
						message = "Unknown Error.";
				}
				$("#uploadModal .modal-body").prepend(
					'<div role ="alert" class="alert alert-danger"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><p>'+message+'</p></div>'
				);
				$("#uploadModal :submit").prop("disabled", false);
			}
		});
	});
}
