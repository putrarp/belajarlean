<?php
    date_default_timezone_set("Asia/Jakarta");
    include "connection.php";
    $id = $_GET["mc"];
    $status = $_GET["status"];

    $sql = "UPDATE `machine` SET `machineStatus`= $status ,`lastUpdate`= NOW() WHERE `ID` = $id";
    $conn->query($sql);

    header("Location: ../machinelist.php"); 
    exit;

?>