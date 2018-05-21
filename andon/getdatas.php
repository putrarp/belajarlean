<?php  
//export.php  
include "connection.php";
$output = '';

$query = "SELECT * FROM record";
$result = $conn->query($query);

while($row = mysqli_fetch_array($result))
{
$output = $row["ID"].';'.$row["machineID"].';'.$row["type"].';'.$row["start"].';'.$row["end"];
echo ("<br>");
echo $output;
}
// header('Content-Type: application/txt');
// header('Content-Disposition: attachment; filename=download.txt');


?>
