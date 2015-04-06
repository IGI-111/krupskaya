var Connection = {
    status: undefined,
    toggle: function(){
        $("#connect").toggle();
        $("#disconnect").toggle();
        $("#register").toggle();
        $("#upload").toggle();
        this.status = !this.status;
        List.reload();
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
            $.mobile.changePage( "#connection", { role: "dialog" } );
        });
        $("#connection form").submit(function(event){
            $("#connection :submit").prop("disabled", true);
            event.preventDefault();
            $.post("connect.php", $("#connection form").serialize())
            .done(function(){
                $.mobile.changePage("#index");
                Connection.toggle();
            }).fail(function(){
                //TODO: warn about failure
            }).complete(function(){
                $("#connection :submit").prop("disabled", false);
            });
        });
        // setup upload button
        $("#upload").click(function(){
            $.mobile.changePage("#uploadForm", { role: "dialog" });
        });
        $("#uploadForm form").submit(function(event){
            $("#uploadForm :submit").prop("disabled", true);
            event.preventDefault();
            $.ajax({
                url: 'upload.php',
                type: 'POST',
                data: new FormData($("#uploadForm form")[0]),
                contentType: false,
                processData: false,
                success: function(){
                    $.mobile.changePage("#index");
                    List.reload();
                },
                error: function(request){
                    //TODO
                },
                complete: function() {
                    $("#uploadForm :submit").prop("disabled", false);
                }
            });
        });
        //setup register button
        $("#register").click(function(){
            $.mobile.changePage("#registerForm", { role: "dialog" });
        });
        $("#registerForm form").submit(function(event){
            $("#registerForm :submit").prop("disabled", true);
            event.preventDefault();
            $.ajax({
                url: 'register.php',
                type: 'POST',
                data: $("#registerForm form").serialize(),
                success: function(){
                    $.mobile.changePage("#index");
                },
                error: function(request){
                    //TODO
                },
                complete: function() {
                    $("#registerForm :submit").prop("disabled", false);
                }
            });
        });
        $("#registerForm input[type='password']").keyup(function(){
            var validated = true;
            var value = undefined;
            $("#registerForm input[type='password']").each(function(index){
                if(index == 0)
                    value = $(this).val();
                else if($(this).val() != value)
                    validated = false;
            });
            if(!validated){
                $("#registerForm input[type='password']").css("color", "red");
                $("#registerForm :submit").prop("disabled", true);
            }else{
                $("#registerForm input[type='password']").css("color", "green");
                $("#registerForm :submit").prop("disabled", false);
            }
        });
    },
    init: function(){
        Connection.bindUI();
        $.get("connected.php", function(isConnected) {
            this.status = isConnected;
            if(this.status){
                $("#upload").show();
                $("#disconnect").show();
            }
            else{
                $("#register").show();
                $("#connect").show();
            }
        });
    }
};
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
        $("#mp3Source").attr("src", "data/"+id+".mp3");
        $("#oggSource").attr("src", "data/"+id+".ogg");
        console.log($("#player audio"));
        $("#player audio")[0].load();

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
    Connection.init();
    Player.init();
    List.init();
});
