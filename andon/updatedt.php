<?php
    session_start();
    $MC = $_SESSION["MC"];
    date_default_timezone_set("Asia/Jakarta");
    include "connection.php";
    $id = $_GET["mc"];
    $status = $_GET["status"];
    $laststatus = $_SESSION["laststatus"];
    $start = $_SESSION["lastupdate"];
    $now = new DateTime(date("Y-m-d h:i:s"));
    $fdate = $now->format('Y-m-d h:i:s');
    $sql = "UPDATE `machine` SET `machineStatus`= $status ,`lastUpdate`= '$fdate' WHERE `ID` = $id";
    $conn->query($sql);
    if ($laststatus <> 1){
        $sql = "INSERT INTO `record` (`ID`, `machineID`, `type`, `start`, `end`) VALUES (NULL, '$MC', '$laststatus', '$start', '$fdate')";
        $conn->query($sql);
    }
    header("Location: ./apps.php"); 
    exit;

?>