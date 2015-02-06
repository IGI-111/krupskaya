$(document).ready(function(){
	$("#player").load("templates/player.html", setupPlayer);
})

function setupPlayer() {
	var audio = $("#player audio")[0];
	var sliderPrecision = 10000;
	$("#player .playButton").on("click", function(){
		audio.play();
	});
	$("#player .pauseButton").on("click", function(){
		audio.pause();
	});
	$("#player .slider").slider({
		max: sliderPrecision,
	});
	$("#player .slider").on("slidestop", function(event, ui) {
		audio.currentTime = audio.duration*(ui.value / sliderPrecision);
	});

	$("#player audio").bind("timeupdate", function(){
		var pos = sliderPrecision*(audio.currentTime / audio.duration);
		$("#player .slider").slider("value", pos);
	});
}
