<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
include "db.php";

$data = json_decode(file_get_contents("php://input"), true);

if(!isset($data['name'])){
    echo json_encode([
        "status" => false,
        "message" => "Name required"
    ]);
    exit;
}

$name = strtolower(trim($data['name']));

if(empty($name)){
    echo json_encode([
        "status" => false,
        "message" => "Empty name not allowed"
    ]);
    exit;
}

/*
|--------------------------------------------------------------------------
| CHECK DUPLICATE
|--------------------------------------------------------------------------
*/

$check = $conn->prepare(
    "SELECT id FROM users WHERE LOWER(name)=?"
);

$check->bind_param("s", $name);

$check->execute();

$result = $check->get_result();

if($result->num_rows > 0){

    echo json_encode([
        "status" => false,
        "message" => "Duplicate name"
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

$stmt->bind_param("s", $name);

if($stmt->execute()){

    /*
    |--------------------------------------------------------------------------
    | SYNC TO MONGODB
    |--------------------------------------------------------------------------
    */

    $payload = json_encode([
        "name" => $name
    ]);

    $ch = curl_init(
        "http://localhost:5000/sync-mongo"
    );

    curl_setopt($ch, CURLOPT_POST, true);

    curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);

    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        "Content-Type: application/json"
    ]);

    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    $mongoResponse = curl_exec($ch);

    curl_close($ch);

    echo json_encode([
        "status" => true,
        "message" => "Inserted into MySQL and synced to MongoDB",
        "mongo_response" => json_decode($mongoResponse, true)
    ]);

}else{

    echo json_encode([
        "status" => false,
        "message" => "Insert failed"
    ]);
}