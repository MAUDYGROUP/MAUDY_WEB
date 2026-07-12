<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

session_start();
if (!isset($_SESSION['admin_user'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit();
}

$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!$data || !isset($data['image'])) {
    echo json_encode(['success' => false, 'message' => 'No image data provided']);
    exit();
}

$uploadDir = '../assets/uploads/';
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

// Extract base64
$imageParts = explode(";base64,", $data['image']);
if (count($imageParts) !== 2) {
    echo json_encode(['success' => false, 'message' => 'Invalid base64 image']);
    exit();
}

$imageTypeAux = explode("image/", $imageParts[0]);
$imageType = $imageTypeAux[1];
$imageBase64 = base64_decode($imageParts[1]);

$newFileName = uniqid('img_', true) . '.' . $imageType;
$destPath = $uploadDir . $newFileName;
$publicPath = 'assets/uploads/' . $newFileName;

if (file_put_contents($destPath, $imageBase64)) {
    echo json_encode(['success' => true, 'url' => $publicPath]);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to save image']);
}
