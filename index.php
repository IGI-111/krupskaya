<?php session_start(); ?>
<!doctype html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7" lang=""> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8" lang=""> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9" lang=""> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js" lang=""> <!--<![endif]-->
	<head>
		<meta charset="utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
		<title></title>
		<meta name="description" content="">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<link rel="apple-touch-icon" href="apple-touch-icon.png">

		<link rel="stylesheet" href="css/bootstrap.min.css">
		<style>
			body {
				padding-top: 50px;
				padding-bottom: 20px;
			}
		</style>
		<link rel="stylesheet" href="css/jquery-ui.min.css">
		<link rel="stylesheet" href="css/bootstrap-theme.css">
		<link rel="stylesheet" href="css/bootstrap-slider.css">
		<link rel="stylesheet" href="css/main.css">

		<script src="js/vendor/modernizr-2.8.3-respond-1.4.2.min.js"></script>
	</head>
	<body>
		<!--[if lt IE 8]>
		<p class="browserupgrade">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.</p>
		<![endif]-->
		<nav class="navbar navbar-default navbar-fixed-top" role="navigation">
			<div class="container">
				<div class="navbar-header">
					<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
						<span class="sr-only">Toggle navigation</span>
						<span class="icon-bar"></span>
						<span class="icon-bar"></span>
						<span class="icon-bar"></span>
					</button>
					<a id="krupskaya" class="navbar-brand" href="#">Krupskaya</a>
				</div>
				<nav class="navbar-collapse collapse">
					<div class="nav navbar-nav navbar-right">
						<button id="upload" style="display: none;" class="glyphicon glyphicon-upload navbar-btn btn-success btn"></button>
						<div id="uploadModal" class="modal fade">
							<div class="modal-dialog">
								<div class="modal-content">
									<div class="modal-header">
										<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
										<h4 class="modal-title">Upload file</h4>
									</div>
									<div class="modal-body">
										<form action="upload.php" method="post" enctype="multipart/form-data">
											<div class="form-group">
												<input name="f" class="form-control" type="file">
											</div>
											<button type="submit" class="btn btn-success">Upload</button>
										</form>
									</div>
								</div>
							</div>
						</div>
						<button id="connect" style="display: none;" class="glyphicon glyphicon-log-in navbar-btn btn-success btn"></button>
						<button id="disconnect" style="display: none;" href="disconnect.php" class="glyphicon glyphicon-log-out navbar-btn btn-info btn"></button>
						<div id="connectionModal" class="modal fade">
							<div class="modal-dialog">
								<div class="modal-content">
									<div class="modal-header">
										<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
										<h4 class="modal-title">Sign In</h4>
									</div>
									<div class="modal-body">
										<form action="connect.php" method="post">
											<div class="form-group">
												<input name="login" placeholder="Login" class="form-control" type="text">
											</div>
											<div class="form-group">
												<input name="password" placeholder="Password" class="form-control" type="password">
											</div>
											<button type="submit" class="btn btn-success">Sign in</button>
										</form>
									</div>
								</div>
							</div>
						</div>
					</div>
				</nav>
			</div>
		</nav>

		<!-- Main jumbotron for a primary marketing message or call to action -->
		<div class="well">
			<div id="player" class="container">
				<audio hidden src="">
				</audio>
				<div class="sliderContainer">
					<div class="slider">
					</div>
					<canvas></canvas>
				</div>
				<br/>
				<a class="glyphicon glyphicon-play btn btn-success playButton"></a>
				<a class="glyphicon glyphicon-pause btn btn-info pauseButton"></a>
				<a class="glyphicon glyphicon-stop btn btn-danger stopButton"></a>
			</div>
		</div>

		<div id="list" class="container">
			<div class="col-md-2">
				<div class="panel panel-default" file="01">
					<div class="panel-heading">
						Hell March
					</div>
					<div class="panel-body">
						<a href="#">
							<img class="media-object" src="data/01.jpg" alt="cover">
						</a>
					</div>
				</div>
			</div>
			<div class="col-md-2">
				<div class="panel panel-default" file="02">
					<div class="panel-heading">
						The Sign of the Southern Cross
					</div>
					<div class="panel-body">
						<a href="#">
							test link
						</a>
					</div>
				</div>
			</div>
		</div> <!-- /container -->
		<!-- <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>-->
		<script>window.jQuery || document.write('<script src="js/vendor/jquery-1.11.2.min.js"><\/script>')</script>
<script>window.jQuery.ui || document.write('<script src="js/vendor/jquery-ui.min.js"><\/script>')</script>
<script src="js/vendor/bootstrap.min.js"></script>
<script src="js/main.js"></script>
</body>
</html>
