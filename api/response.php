<?php
// response.php
// Standard answer format for every endpoint.
// React always gets the same shape back:
//   success: { "success": true,  "data": ... }
//   error:   { "success": false, "error": "message" }

// Send a successful answer and stop the script.
function sendJson($data, $status = 200)
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['success' => true, 'data' => $data]);
    exit; // nothing else runs after the answer is sent
}

// Send an error answer with a friendly message and stop the script.
function sendError($message, $status = 400)
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['success' => false, 'error' => $message]);
    exit;
}
