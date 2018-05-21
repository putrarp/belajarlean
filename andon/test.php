<?php
    $page = $_SERVER['PHP_SELF'];
    $sec = "10";
?>

<html>
    <head>
    <meta http-equiv="refresh" content="<?php echo $sec?>;URL='<?php echo $page?>'">
    </head>
</html>
<?php
date_default_timezone_set("Asia/Jakarta");
$datetime1 = new DateTime('2018-04-03 11:04:26 AM');
$datetime2 = new DateTime(date("Y-m-d h:i:s"));
$interval = $datetime1->diff($datetime2);
echo $interval->format('%h')." Hours ".$interval->format('%i')." Minutes    " .$interval->format('%s')." Second";
// echo ($datetime2->format('H'))
?>