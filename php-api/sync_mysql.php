<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
include "db.php";

$data = json_decode(
    file_get_contents("php://input"),
    true
);

if(!isset($data['name'])){

    echo json_encode([
        "status"=>false,
        "message"=>"Name required"
    ]);

    exit;
}

$name = strtolower(
    trim($data['name'])
);

/*
|--------------------------------------------------------------------------
| CHECK DUPLICATE
|--------------------------------------------------------------------------
*/

$check = $conn->prepare(
    "SELECT id FROM users WHERE LOWER(name)=?"
);

$check->bind_param("s",$name);

$check->execute();

$result = $check->get_result();

if($result->num_rows > 0){

    echo json_encode([
        "status"=>false,
        "message"=>"Duplicate in MySQL"
    ]);

    exit;
}

/*
|--------------------------------------------------------------------------
| INSERT INTO MYSQL
|--------------------------------------------------------------------------
*/

$stmt = $conn->prepare(
    "INSERT INTO users(name) VALUES(?)"
);

$stmt->bind_param("s",$name);

if($stmt->execute()){

    echo json_encode([
        "status"=>true,
        "message"=>"MySQL synced"
    ]);

}else{

    echo json_encode([
        "status"=>false,
        "message"=>"MySQL sync failed"
    ]);
}