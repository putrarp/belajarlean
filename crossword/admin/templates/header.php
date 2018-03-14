<?php if (!defined('BASE_PATH')) die("No direct access allowed"); ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <title>Wordsearch admin</title>
    <link href="css/bootstrap.min.css" rel="stylesheet" />
    <link href="../style/style.css" rel="stylesheet" />
    <script src="js/jquery.js" type="text/javascript"></script>
    <script src="js/bootstrap.js" type="text/javascript"></script>
</head>
<body>

<div class="container">
<nav class="navbar navbar-default">
    <div class="container-fluid">
    <div class="navbar-header">
        <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
        </button>
        <a class="navbar-brand" href="./">HTML5 Crossword</a>
    </div>

    <div class="collapse navbar-collapse">
        <ul class="nav navbar-nav">
            <?php if (is_logged()): ?>
                <li><a href="?logout">Logout</a></li>
                <li><a href="?edit">Create puzzle</a></li>
            <?php endif; ?>
        </ul>
    </div>
    </div>
</div>
</nav>

<div class="container">
    <div class="row">
