<?php
/**
 * Relay Control System - PHP Backend
 * This file handles Firebase Realtime Database operations via REST API
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT');
header('Access-Control-Allow-Headers: Content-Type');

// Firebase Configuration
// IMPORTANT: Ganti dengan konfigurasi Firebase Anda
define('FIREBASE_DATABASE_URL', 'https://your-project-id.firebaseio.com');
// Optional: Jika menggunakan auth, tambahkan database secret atau auth token
define('FIREBASE_SECRET', ''); // Legacy auth atau kosongkan jika menggunakan rules

/**
 * Make HTTP request to Firebase
 */
function firebaseRequest($path, $method = 'GET', $data = null) {
    $url = FIREBASE_DATABASE_URL . $path . '.json';
    
    // Add auth parameter if secret is set
    if (FIREBASE_SECRET !== '') {
        $url .= (strpos($url, '?') === false ? '?' : '&') . 'auth=' . FIREBASE_SECRET;
    }
    
    $ch = curl_init($url);
    
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
    
    switch ($method) {
        case 'POST':
            curl_setopt($ch, CURLOPT_POST, true);
            break;
        case 'PUT':
            curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'PUT');
            break;
        case 'PATCH':
            curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'PATCH');
            break;
        case 'DELETE':
            curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'DELETE');
            break;
    }
    
    if ($data !== null) {
        $jsonData = json_encode($data);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $jsonData);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array(
            'Content-Type: application/json',
            'Content-Length: ' . strlen($jsonData)
        ));
    }
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    
    if (curl_errno($ch)) {
        $error = curl_error($ch);
        curl_close($ch);
        return ['error' => $error, 'httpCode' => $httpCode];
    }
    
    curl_close($ch);
    
    return [
        'data' => json_decode($response, true),
        'httpCode' => $httpCode
    ];
}

/**
 * Get relay status
 */
function getRelayStatus() {
    $result = firebaseRequest('/relay', 'GET');
    
    if ($result['httpCode'] === 200) {
        return [
            'success' => true,
            'data' => $result['data']
        ];
    } else {
        return [
            'success' => false,
            'error' => 'Failed to get relay status',
            'httpCode' => $result['httpCode']
        ];
    }
}

/**
 * Set relay status
 */
function setRelayStatus($status) {
    $data = [
        'status' => (bool)$status,
        'lastControl' => round(microtime(true) * 1000),
        'lastUpdate' => date('c')
    ];
    
    $result = firebaseRequest('/relay', 'PATCH', $data);
    
    if ($result['httpCode'] === 200) {
        return [
            'success' => true,
            'message' => 'Relay status updated',
            'data' => $result['data']
        ];
    } else {
        return [
            'success' => false,
            'error' => 'Failed to update relay status',
            'httpCode' => $result['httpCode']
        ];
    }
}

/**
 * Initialize relay data
 */
function initializeRelay() {
    $data = [
        'status' => false,
        'lastControl' => 0,
        'lastUpdate' => '',
        'deviceOnline' => false,
        'deviceIP' => ''
    ];
    
    $result = firebaseRequest('/relay', 'PUT', $data);
    
    if ($result['httpCode'] === 200) {
        return [
            'success' => true,
            'message' => 'Relay initialized',
            'data' => $result['data']
        ];
    } else {
        return [
            'success' => false,
            'error' => 'Failed to initialize relay',
            'httpCode' => $result['httpCode']
        ];
    }
}

// Handle API requests
$action = isset($_GET['action']) ? $_GET['action'] : '';

switch ($action) {
    case 'get':
        echo json_encode(getRelayStatus());
        break;
        
    case 'set':
        $status = isset($_POST['status']) ? filter_var($_POST['status'], FILTER_VALIDATE_BOOLEAN) : null;
        
        if ($status === null && !isset($_POST['status'])) {
            echo json_encode([
                'success' => false,
                'error' => 'Status parameter is required'
            ]);
        } else {
            echo json_encode(setRelayStatus($status));
        }
        break;
        
    case 'init':
        echo json_encode(initializeRelay());
        break;
        
    default:
        echo json_encode([
            'success' => false,
            'error' => 'Invalid action',
            'availableActions' => ['get', 'set', 'init']
        ]);
}
?>
