<?php 
$conn = new mysqli("localhost","root","","machine_round");
if($conn->connect_error){
    die("Connection_failed");
}