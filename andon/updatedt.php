<?php
    session_start();
    $MC = $_SESSION["MC"];
    date_default_timezone_set("Asia/Jakarta");
    echo date_default_timezone_get();
    include "connection.php";
    $id = $_GET["mc"];
    $status = $_GET["status"];
    $laststatus = $_SESSION["laststatus"];
    $start = $_SESSION["lastupdate"];
    $end = new DateTime(date("Y-m-d h:i:s"));
    $sql = "UPDATE `machine` SET `machineStatus`= $status ,`lastUpdate`= NOW() WHERE `ID` = $id";
    $conn->query($sql);
    if ($laststatus <> 1){
        $sql = "INSERT INTO `record` (`ID`, `machineID`, `type`, `start`, `end`) VALUES (NULL, '$MC', '$laststatus', '$start', NOW())";
        $conn->query($sql);
    }
    header("Location: ./apps.php"); 
    exit;

?>