<?php
session_start();
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$action = $_GET['action'] ?? '';
$usersFile = '../data/users.json';

// Initialize users.json if it doesn't exist
function get_users() {
    global $usersFile;
    if (!file_exists($usersFile)) {
        $defaultUsers = [
            [
                'username' => 'admin',
                'password' => password_hash('maudy2025', PASSWORD_DEFAULT),
                'role' => 'admin'
            ]
        ];
        file_put_contents($usersFile, json_encode($defaultUsers, JSON_PRETTY_PRINT));
        return $defaultUsers;
    }
    return json_decode(file_get_contents($usersFile), true);
}

function save_users($users) {
    global $usersFile;
    file_put_contents($usersFile, json_encode($users, JSON_PRETTY_PRINT));
}

switch ($action) {
    case 'login':
        $input = json_decode(file_get_contents('php://input'), true);
        $username = $input['username'] ?? '';
        $password = $input['password'] ?? '';

        $users = get_users();
        foreach ($users as $user) {
            if ($user['username'] === $username && password_verify($password, $user['password'])) {
                $_SESSION['admin_user'] = $username;
                echo json_encode(['success' => true, 'username' => $username]);
                exit;
            }
        }
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Username atau password salah']);
        break;

    case 'logout':
        session_destroy();
        echo json_encode(['success' => true]);
        break;

    case 'check':
        if (isset($_SESSION['admin_user'])) {
            echo json_encode(['success' => true, 'logged_in' => true, 'username' => $_SESSION['admin_user']]);
        } else {
            echo json_encode(['success' => true, 'logged_in' => false]);
        }
        break;

    case 'change_password':
        // Require login
        if (!isset($_SESSION['admin_user'])) {
            http_response_code(401);
            echo json_encode(['success' => false, 'message' => 'Unauthorized']);
            exit;
        }

        $input = json_decode(file_get_contents('php://input'), true);
        $oldPass = $input['oldPassword'] ?? '';
        $newPass = $input['newPassword'] ?? '';
        $username = $input['username'] ?? $_SESSION['admin_user'];
        $isSelf = ($username === $_SESSION['admin_user']);

        $users = get_users();
        $found = false;
        
        foreach ($users as &$u) {
            if ($u['username'] === $username) {
                $found = true;
                // Verifikasi password lama jika ganti punya sendiri
                if ($isSelf && !password_verify($oldPass, $u['password'])) {
                    echo json_encode(['success' => false, 'message' => 'Password lama salah']);
                    exit;
                }
                
                $u['password'] = password_hash($newPass, PASSWORD_DEFAULT);
                break;
            }
        }
        
        if ($found) {
            save_users($users);
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'message' => 'User tidak ditemukan']);
        }
        break;

    case 'get_users':
        if (!isset($_SESSION['admin_user'])) {
            http_response_code(401);
            echo json_encode(['success' => false, 'message' => 'Unauthorized']);
            exit;
        }
        $users = get_users();
        // Return without password hashes
        $safeUsers = array_map(function($u) {
            return ['username' => $u['username'], 'role' => $u['role'] ?? 'admin'];
        }, $users);
        echo json_encode(['success' => true, 'users' => $safeUsers]);
        break;

    case 'add_user':
        if (!isset($_SESSION['admin_user'])) {
            http_response_code(401);
            echo json_encode(['success' => false, 'message' => 'Unauthorized']);
            exit;
        }
        $input = json_decode(file_get_contents('php://input'), true);
        $newUsername = $input['username'] ?? '';
        $newPassword = $input['password'] ?? '';
        if (!$newUsername || !$newPassword) {
             echo json_encode(['success' => false, 'message' => 'Username dan Password wajib diisi']);
             exit;
        }
        
        $users = get_users();
        foreach ($users as $u) {
            if ($u['username'] === $newUsername) {
                echo json_encode(['success' => false, 'message' => 'Username sudah ada']);
                exit;
            }
        }
        
        $users[] = [
            'username' => $newUsername,
            'password' => password_hash($newPassword, PASSWORD_DEFAULT),
            'role' => 'admin'
        ];
        save_users($users);
        echo json_encode(['success' => true]);
        break;

    case 'delete_user':
        if (!isset($_SESSION['admin_user'])) {
            http_response_code(401);
            echo json_encode(['success' => false, 'message' => 'Unauthorized']);
            exit;
        }
        $input = json_decode(file_get_contents('php://input'), true);
        $delUsername = $input['username'] ?? '';
        
        $users = get_users();
        if (count($users) <= 1) {
            echo json_encode(['success' => false, 'message' => 'Tidak dapat menghapus admin terakhir']);
            exit;
        }
        
        $newUsers = [];
        foreach ($users as $u) {
            if ($u['username'] !== $delUsername) {
                $newUsers[] = $u;
            }
        }
        save_users($newUsers);
        
        if ($delUsername === $_SESSION['admin_user']) {
            session_destroy();
        }
        echo json_encode(['success' => true]);
        break;

    default:
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Action not found']);
}
