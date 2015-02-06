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
	$("#player .slider").slider();
	$("#player audio").bind("timeupdate", function(){
		var pos = (audio.currentTime / audio.duration) * 100;
		$("#player .slider").slider('setValue', pos);
	});
}
