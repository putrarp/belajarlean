<!DOCTYPE html>
<?php
    session_start();
    $MC=$_SESSION["MC"] = "1";
    include "connection.php";
    $sql="SELECT * FROM machine WHERE ID = $MC";
    $result = $conn->query($sql);
    while($row = $result->fetch_assoc()) {
        $ID= $row["ID"];
        $machineNumber = $row["machineNumber"];
        $machinestatus = $row["machineStatus"];
        $lastUpdate = $row["lastUpdate"];
    }
    $_SESSION["laststatus"] = $machinestatus;
    $_SESSION["lastupdate"] = $lastUpdate;
    $page = $_SERVER['PHP_SELF'];
    $sec = "10";
?>
<html>
<head>
    <meta http-equiv="refresh" content="<?php echo $sec?>;URL='<?php echo $page?>'">
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>ANDON SYSTEM</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" type="text/css" media="screen" href="apps.css" />
    <script src="apps.js"></script>
</head>
<body>
    <?php echo "<script>myFunction($machinestatus)</script>"; ?>
    <center><h1><?php echo($machineNumber) ?></h1></center>
    <center><h3>100/400</h3></center>
    <center><h3 id="demo">Duration</h3></center>
    <script>
        // Set the date we're counting down to
        var countDownDate = new Date("<?php echo date($lastUpdate)?>").getTime();

        // Update the count down every 1 second
        var x = setInterval(function() {

            // Get todays date and time
            var now = new Date().getTime();
            
            // Find the distance between now an the count down date
            var distance = now - countDownDate;
            
            // Time calculations for days, hours, minutes and seconds
            var days = Math.floor(distance / (1000 * 60 * 60 * 24));
            var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
            // Output the result in an element with id="demo"
            document.getElementById("demo").innerHTML = days + "d " + hours + "h "
            + minutes + "m " + seconds + "s ";
            
            // If the count down is over, write some text 
            if (distance < 0) {
                clearInterval(x);
                document.getElementById("demo").innerHTML = "EXPIRED";
            }
        }, 1000);
    </script>
    <center><a href="./updatedt.php/?mc=<?php echo($MC."&") ?>status=3" class="buttonred">RED</a></center>
    <br>
    <center><a href="./updatedt.php/?mc=<?php echo($MC."&") ?>status=2" class="buttonyellow">YELLOW</a></center>
    <br>
    <center><a href="./updatedt.php/?mc=<?php echo($MC."&") ?>status=1" class="buttongreen">GREEN</a></center>
    <a href="./inputssc.php" class="buttonwhite">SSC</a>
</body>
</html>