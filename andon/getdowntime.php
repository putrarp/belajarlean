<?php  
//export.php  
include "connection.php";
$output = '';

$query = "SELECT * FROM record";
$result = $conn->query($query);
$count = 2;
if($result->num_rows > 0)
{
$output .= '
<table class="table" bordered="1">  
        <tr>  
                <th>ID</th>
                <th>machineID</th>
                <th>Type</th>
                <th>start</th>
                <th>end</th>
                <th>dur</th>
                <th>we</th>
        </tr>
';
while($row = mysqli_fetch_array($result))
{
$output .= '
        <tr>  
                <td>'.$row["ID"].'</td>
                <td>'.$row["machineID"].'</td>
                <td>'.$row["type"].'</td>
                <td>'.$row["start"].'</td>
                <td>'.$row["end"].'</td>
                <td></td>
                <td></td>
        </tr>
';
$count = $count +1;
}
$output .= '</table>';
// header('Content-Type: application/ms-excel');
// header('Content-Disposition: attachment; filename=downtime.xls');
echo $output;
}

?>
