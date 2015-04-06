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
		<div data-role="page">
		<nav data-position="fixed" data-role="header" role="navigation">
			<h1 id="playing">Krupskaya</h1>
			<div id="player" data-role="control-group" class="ui-btn-left" data-type="horizontal">
				<audio hidden src=""></audio>
				<button class="glyphicon glyphicon-play playPauseButton ui-btn"></button>
			</div>
		</nav>
		<section class="ui-content">
			<ul id="list" data-role="listview">
			</ul>
		</section>
		</div>
<script src="js/vendor/jquery-1.11.2.min.js"></script>
<script src="js/vendor/jquery.mobile-1.4.5.min.js"></script>
<script src="js/vendor/jquery-ui.min.js"></script>
<script src="js/krupskaya-mobile.js"></script>
</body>
</html>
