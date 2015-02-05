$(document).ready(function(){
	$("#player").load("templates/player.html", setupPlayer);
})

function setupPlayer() {
	var audio = $("#player audio")[0];
	$("#player .playButton").on("click", function(){
		audio.play();
	});
	$("#player .pauseButton").on("click", function(){
		audio.pause();
	});
	$("#player audio").bind("timeupdate", function(){
		var pos = (audio.currentTime / audio.duration) * 100;
		$("#player .progress .progress-bar").attr("aria-valuenow", pos);
		$("#player .progress .progress-bar").width(pos + "%");
		$("#player .progress .progress-bar span").html(pos + "% Complete");
	});
}
