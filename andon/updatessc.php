<?php
    session_start();
    date_default_timezone_set("Asia/Jakarta");
    include "connection.php";
    $MC = $_SESSION["MC"];
    $output = $_POST["output"];
    $start = $_SESSION["lastupdate"];
    $now = new DateTime(date("Y-m-d H:i:s"));
    $now = $now->format("H");
    
    $sql = "INSERT INTO `ssc` (`ID`, `machineID`, `time`, `output`) VALUES (NULL, '$MC', '$now', '$output')";
    $conn->query($sql);

    header("Location: ./apps.php"); 
    exit;
?>