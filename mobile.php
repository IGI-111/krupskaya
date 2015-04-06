<?php session_start(); ?>
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <title></title>
        <meta name="description" content="">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="apple-touch-icon" href="apple-touch-icon.png">

        <link rel="stylesheet" href="css/jquery.mobile-1.4.5.min.css">
        <link rel="stylesheet" href="css/bootsrap-glyphicons.min.css">
        <link rel="stylesheet" href="css/krupskaya-mobile.css">
        <style>
            body {
                padding-top: 50px;
                padding-bottom: 20px;
            }
        </style>

        <script src="js/vendor/modernizr-2.8.3-respond-1.4.2.min.js"></script>
    </head>
    <body>
        <div id="index" data-role="page">
            <nav data-position="fixed" data-role="header" role="navigation">
                <h1 id="playing">Krupskaya</h1>
                <div id="player" data-role="control-group" class="ui-btn-left" data-type="horizontal">
                    <button class="glyphicon glyphicon-play playPauseButton ui-btn"></button>
                    <audio hidden>
                        <source src="" id="mp3Source" type="audio/mp3">
                        <source src="" id="oggSource" type="audio/ogg">
                    </audio>
                </div>
                <div data-role="control-group" class="ui-btn-right" data-type="horizontal">
                    <button style="display:none;" id="connect" class="ui-btn">Connect</button>
                    <button style="display:none;" id="disconnect" class="ui-btn">Disconnect</button>
                    <button style="display:none;" id="upload" class="ui-btn">Upload</button>
                    <button style="display:none;" id="register" class="ui-btn">Register</button>
                </div>
            </nav>
            <section class="ui-content">
                <ul id="list" data-role="listview">
                </ul>
            </section>
        </div>
        <div data-role="page" id="connection">
            <div data-role="header"><h1>Sign In</h1></div>
            <form action="connect.php" method="post">
                <input name="login" placeholder="Login" class="form-control" type="text">
                <input name="password" placeholder="Password" class="form-control" type="password">
                <button type="submit" class="btn btn-success">Sign in</button>
            </form>
        </div>
        <div data-role="page" id="uploadForm">
            <div data-role="header"><h1>Upload file</h1></div>
            <form action="upload.php" method="post" enctype="multipart/form-data">
                <input multiple="multiple" id="uploadFileInput" name="f[]" class="form-control" type="file"/>
                <label><input value="on" name="public" type="checkbox"> Public  </label>
                <button type="submit" class="btn btn-success">Upload</button>
            </form>
        </div>
        <div data-role="page" id="registerForm">
            <div data-role="header"><h1>Register</h1></div>
            <form class="form-horizontal" action="register.php" method="post">
                <input placeholder="Username" name="username" type="text"/>
                <input placeholder="Password" value="" name="password" type="password"/>
                <input placeholder="Repeat" value="" type="password"/>
                <button type="submit" class="btn btn-success">Ok</button>
            </form>
        </div>
<script src="js/vendor/jquery-1.11.2.min.js"></script>
<script src="js/vendor/jquery.mobile-1.4.5.min.js"></script>
<script src="js/vendor/jquery-ui.min.js"></script>
<script src="js/krupskaya-mobile.js"></script>
</body>
</html>
