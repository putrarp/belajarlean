<?php
$servername = "	mysql.hostinger.co.id";
$username = "u931597255_andon";
$password = "andon1";
$db = "u931597255_andon";

// Create connection
$conn = new mysqli($servername, $username, $password, $db);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} 
//echo "Connected successfully<br>";
?>