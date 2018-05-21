<?php
    $page = $_SERVER['PHP_SELF'];
    $sec = "1";
?>

<html>
    <head>
    <meta http-equiv="refresh" content="<?php echo $sec?>;URL='<?php echo $page?>'">
    <!-- <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="HandheldFriendly" content="true"> -->
    </head>
    <style>
        table.darkTable {
            font-family: "Arial Black", Gadget, sans-serif;
            border: 2.5px solid #888888;
            background-color: #4A4A4A;
            text-align: center;
            border-collapse: collapse;
        }
        table.darkTable td, table.darkTable th {
            border: 1px solid #4A4A4A;
            padding: 3px 2px;
        }
        table.darkTable tbody td {
            font-size: 13px;
            color: red;
        }
        /* table.darkTable tr:nth-child(even) {
            background: #888888;
        } */
        table.darkTable thead {
            background: #000000;
            border-bottom: 3px solid #000000;
        }
        table.darkTable thead th {
            font-size: 15px;
            font-weight: bold;
            color: #E6E6E6;
            text-align: center;
            border-left: 2px solid #4A4A4A;
        }
        table.darkTable th {
            color: #E6E6E6;
            background: #888888;
            height:40px
        }
        table.darkTable thead th:first-child {
            border-left: none;
        }
        table.darkTable tfoot {
            font-size: 12px;
            font-weight: bold;
            color: #E6E6E6;
            background: #000000;
            background: -moz-linear-gradient(top, #404040 0%, #191919 66%, #000000 100%);
            background: -webkit-linear-gradient(top, #404040 0%, #191919 66%, #000000 100%);
            background: linear-gradient(to bottom, #404040 0%, #191919 66%, #000000 100%);
            border-top: 1px solid #4A4A4A;
        }
        table.darkTable tfoot td {
            font-size: 12px;
        }
        table.darkTable tr {
        
        }
        .pageCenter {
            margin-left: auto;
            margin-right: auto;
            max-width: 750px;
            float: none;
            /* border: 1px solid red;Added red border to see the div better */
        }
    </style>
</html>

<?php
    date_default_timezone_set("Asia/Jakarta");
    include "connection.php";
    $machineNumber = array();
    $machinestatus = array();   
    $lastUpdate  = array();
    $counter = 0;
    $now = date("Y-m-d h:i:s");
    $sql="SELECT * FROM machine";

    $result = $conn->query($sql);
    
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $ID[$counter] = $row["ID"];
            $machineNumber[$counter] = $row["machineNumber"];
            $machinestatus[$counter] = $row["machineStatus"];
            $lastUpdate[$counter] = $row["lastUpdate"];
            $counter = $counter + 1;
        }
    } else {
        echo "<center><h1>All is well";
    }
    echo('<div class="pageCenter"');
    echo('<center><table class="darkTable"  border="1" style="float: left;">');
    for($i = 0; $i<$counter;$i++){
        $datetime1 = new DateTime($lastUpdate[$i]);
        $datetime2 = new DateTime(date("Y-m-d H:i:s"));
        $interval = $datetime2->diff($datetime1);
        if (($i % 5)==0 && $i != 0){
            echo('<center><table class="darkTable"  border="1" style="float: left;">');
        }
        if($machinestatus[$i] == 0){
            echo('<tr><th><center>' . $machineNumber[$i] .
            '<tr><td><center><a href="./status.php/?mc='.$ID[$i].'"><img src="./asset/gray.png" width="85" height="85"></a><br>');
        }
        elseif($machinestatus[$i] == 1){
            echo('<tr><th><center>' . $machineNumber[$i] .
            '<tr><td><center><a href="./status.php/?mc='.$ID[$i].'"><img src="./asset/green.png" width="85" height="85"></a><br>');
        }
        elseif($machinestatus[$i] == 2){
            echo('<tr><th><center>' . $machineNumber[$i] . 
            '<tr><td><center><a href="./status.php/?mc='.$ID[$i].'"><img src="./asset/yellow.png" width="85" height="85"></a><br>');
        }
        elseif($machinestatus[$i] == 3){
            echo('<tr><th><center>' . $machineNumber[$i] . 
            '<tr><td><center><a href="./status.php/?mc='.$ID[$i].'"><img src="./asset/red.png" width="85" height="85"></a><br>');
        }
        if ((($i+1) % 5)==0 && $i != 0){
            echo("</table>");
        }
    }
?>