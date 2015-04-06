var List = {
    getNextTrack: function(){
        return $("#list [data-file='"+Player.playing+"']").next().attr("data-file");
    },
    bindUI: function () {
        $("#list a").click(function(){
            var id = $(this).attr("data-file");
            Player.changeTrack(id);
        });
    },
    update: function() {
        $("#list [data-theme='b']").removeAttr("data-theme").trigger("mouseout");
        $("#list [data-file='"+Player.playing+"']").attr("data-theme",'a').trigger("mouseout");
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
                    $('#list').append(
                        $('<li>').attr("data-role", "list-divider").html(data[0].album)
                    );
                    for (var i = 0, len = data.length; i < len; i++)
                    $('#list').append(
                        $("<li>").append(
                            $("<a>").attr("data-file", data[i]._id).html(data[i].title)
                    )
                    );
                }));
            }
            $.when.apply($, requests).then(function(){
                List.bindUI();
                $( "#list" ).listview('refresh');
                if(callback != undefined)
                    callback();
            });
        });
    }
};

var Player = {
    playing: undefined,
    sliderPrecision: 10000,
    isPaused: true,
    bindUI: function(){
        var audio = $("#player audio")[0];
        $("#player .playPauseButton").on("click", function(){
            this.isPaused ? audio.play() : audio.pause();
            this.isPaused = !this.isPaused;
            $(this).toggleClass("glyphicon-play").toggleClass("glyphicon-pause");
        });
        $("#player audio").on("timeupdate", function(event, ui){
            var pos = Player.sliderPrecision*(audio.currentTime / audio.duration);
            $("#player .slider").slider("value", pos);
        }).on("ended", function(event, ui){
            //play next element if there is any
            var nextToPlay = List.getNextTrack();
            if(nextToPlay != undefined){
                Player.changeTrack(nextToPlay);
            }
        });
    },
    init: function(){
        Player.bindUI();
    },
    changeTrack: function(id){
        Player.playing = id;
        // change audio value
        $("#player audio").attr("src", "data/"+id+".ogg");
        $("#player .slider").slider("value", 0);
        // change title
        $.get("metadata.php",{r:id}, function(data) {
            $("#playing").html(data.title);
        });
        // autoplay
        $("#player audio")[0].play();
        $("#player .playPauseButton").addClass("glyphicon-pause").removeClass("glyphicon-play");
        // update list
        List.update();
    },
};

$(document).ready(function(){
    // Connection.init();
    Player.init();
    List.init();
});
