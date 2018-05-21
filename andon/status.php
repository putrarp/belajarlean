<html>
    <head>
    <meta http-equiv="refresh" content="<?php echo $sec?>;URL='<?php echo $page?>'">
    <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="HandheldFriendly" content="true">
    </head>
</html>

<?php
    $id = $_GET["mc"];
    echo('<a href="../update.php/?mc='.$id.'&status=0"><img src="../asset/gray.png" width="100" height="100"></a>');
    echo('<a href="../update.php/?mc='.$id.'&status=1"><img src="../asset/green.png" width="100" height="100"></a>');
    echo('<a href="../update.php/?mc='.$id.'&status=2"><img src="../asset/yellow.png" width="100" height="100"></a>');
    echo('<a href="../update.php/?mc='.$id.'&status=3"><img src="../asset/red.png" width="100" height="100"></a>');
?>