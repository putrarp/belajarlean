<!DOCTYPE html>
<?php
    date_default_timezone_set("Asia/Jakarta");
    $now = new DateTime(date("Y-m-d h:i:s"));
    session_start();
    $MC = $_SESSION["MC"];
?>
<html>
<head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Page Title</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" type="text/css" media="screen" href="inputssc.css" />
    <script src="main.js"></script>
</head>
<body>
    <a href="./apps.php"><input id="clearButton" class="button" type="button" value="X"></a>
    <center><b style="color:white">SSC JAM <?php echo($now->format("H"))  ?></b></center>
    <div class="container">
        <fieldset id="container">
            <form name="calculator" method="post" action="updatessc.php">
                <input id="display" type="text" name="output" readonly>
                <input class="button digits" type="button" value="7" onclick="calculator.display.value += '7'">
                <input class="button digits" type="button" value="8" onclick="calculator.display.value += '8'">
                <input class="button digits" type="button" value="9" onclick="calculator.display.value += '9'">
                <br>
                <input class="button digits" type="button" value="4" onclick="calculator.display.value += '4'">
                <input class="button digits" type="button" value="5" onclick="calculator.display.value += '5'">
                <input class="button digits" type="button" value="6" onclick="calculator.display.value += '6'">
                <br>
                <input class="button digits" type="button" value="1" onclick="calculator.display.value += '1'">
                <input class="button digits" type="button" value="2" onclick="calculator.display.value += '2'">
                <input class="button digits" type="button" value="3" onclick="calculator.display.value += '3'">
                <br>
                <input class="button" id="clearButton" type="button" value="C" onclick="calculator.display.value = ''">
                <input class="button digits" type="button" value="0" onclick="calculator.display.value += '0'">
                <input class="button mathButtons" type="submit" value="="> 
            </form>
        </fieldset>
    </div>
</body>
</html>
