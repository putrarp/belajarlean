<?php
    include "connection.php";
    $sql="SELECT machineStatus FROM machine WHERE ID = 16";

    $result = $conn->query($sql);
    $row = $result->fetch_assoc();
    $a = $row["machineStatus"];
    print_r($a);
?>