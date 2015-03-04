$(document).ready(function(){
	$.get("connected.php", function(data) {
		var connectionButton = new ConnectionButton(data);
		if(data)
			UploadButton();
	});
	var player;
	$("#player").load("templates/player.html", function(){
		player = new Player();
	});

	$("#list .panel").click(function(){
		player.change($(this).attr("file"));
		$("#list .panel").removeClass("panel-danger");
		$(this).toggleClass("panel-danger");
	});
	$("#list .panel").hover(function(){
		$(this).toggleClass("panel-warning");
		$(this).toggleClass("panel-default");
	});
});



function Player() {
	var self = this;
	this.audio = $("#player audio")[0];
	this.sliderPrecision = 10000;
	self = this;

	$("#player .playButton").on("click", function(){
		self.audio.play();
	});
	$("#player .pauseButton").on("click", function(){
		self.audio.pause();
	});
	$("#player .stopButton").on("click", function(){
		self.audio.pause();
		self.audio.currentTime = 0;
	});
	$("#player .slider").slider({
		max: self.sliderPrecision,
		orientation: "horizontal",
		range: "min",
		animate: 1000
	});
	$("#player .slider").on("slide", function(event, ui) {
		self.audio.currentTime = self.audio.duration*(ui.value / self.sliderPrecision);
	});
	$("#player audio").on("timeupdate", function(event, ui){
		var pos = self.sliderPrecision*(self.audio.currentTime / self.audio.duration);
		$("#player .slider").slider("value", pos);
	});

	this.wave = new Waveform($("#player canvas"));
	this.change = function(id){
		// change audio value
		$("#player audio").attr("src", "song.php?r="+id);
		$("#player .slider").slider("value", 0);
		// change waveform data
		$.get("metadata.php",{r:id}, function(data) {
			self.wave.draw(data);
		});
		// autoplay
		self.audio.play();
	}
}

function Waveform(container) {
	canvas = container[0];

	this.draw = function(data){
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
}
function ConnectionButton(isConnected) {
	var setDisconnect = function() {
		$("#connection").load("templates/disconnectButton.html", function(){
			$("#connection button").click(function(){
				$(this).prop("disabled", true);
				$.post("disconnect.php");
				$("#connection button").fadeOut(setConnect);
			})});
	};
	var setConnect = function() {
		$("#connection").load("templates/connectButton.html", function(){
			$("#connection button").click(function(){
				$("#connectionModal").load("templates/connectionForm.html", function(){
					$("#connectionModal form").submit(function(event){
						event.preventDefault();
						$.post("connect.php", $("#connectionModal form").serialize())
						.done(function(){
							$("#connectionModal").find("button").prop("disabled", true);
							$("#connectionModal .modal").modal("hide");
							$("#connectionModal").empty();
							// $("#connection").fadeOut(setDisconnect);
							new UploadButton();
							$("#connection button").fadeOut(setDisconnect);
						})
						.fail(function(){
							$("#connectionModal").find("button").prop("disabled", true);
							$("#connectionModal .modal-body").prepend(
								'<div role ="alert" class="alert alert-danger"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><p>Wrong username or password</p></div>'
							);
							$("#connectionModal").find("button").prop("disabled", false);
						});
					});
					$("#connectionModal .modal").modal("show");
				});
			})});
	};
	isConnected ? setDisconnect() : setConnect();
}

function UploadButton() {
	$("#upload").load("templates/uploadButton.html", function(){
		$("#uploadModal").load("templates/uploadForm.html");
		$("#uploadModal form").submit(function(){
			$(this).ajaxSubmit();
		});
		$("#upload").click(function(){
			$("#uploadModal .modal").modal("show");
		});
	});
}
