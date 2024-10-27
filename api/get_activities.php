<?php
// api/get_activities.php

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *"); // Ajustez selon vos besoins de sécurité
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Inclure le fichier de configuration
require_once('../config/config.php');

// Vérifier que la méthode est POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); // Method Not Allowed
    echo json_encode(["error" => "Méthode non autorisée"]);
    exit();
}

// Récupérer les données JSON de la requête
$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    http_response_code(400); // Bad Request
    echo json_encode(["error" => "Données invalides"]);
    exit();
}

// Construire le prompt basé sur les capacités de l'utilisateur
$capabilities = [];
if (isset($input['pmr']) && $input['pmr']) {
    $capabilities[] = "PMR (Personnes à Mobilité Réduite)";
}
if (isset($input['easily_fatigued']) && $input['easily_fatigued']) {
    $capabilities[] = "facilement fatigué";
}
if (isset($input['valid']) && $input['valid']) {
    $capabilities[] = "valide";
}

if (empty($capabilities)) {
    http_response_code(400);
    echo json_encode(["error" => "Aucune capacité sélectionnée"]);
    exit();
}

$capabilities_text = implode(", ", $capabilities);

// Créer le prompt pour l'API AI
$prompt = "Génère une liste d'activités adaptées pour une personne qui est $capabilities_text. Retourne les résultats au format JSON avec les champs 'name', 'description', 'latitude' et 'longitude' pour chaque activité.";

// Préparer la requête vers l'API Google AI
$apiUrl = 'https://generativelanguage.googleapis.com/v1beta2/models/text-bison-001:generateText?key=' . $_ENV['GOOGLE_AI_API_KEY'];

// Préparer les données de la requête
$requestData = [
    "prompt" => [
        "text" => $prompt
    ]
];


// Initialiser cURL
$ch = curl_init($apiUrl);

// Après avoir exécuté la requête cURL
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

// Enregistrer la réponse brute pour le débogage
file_put_contents('debug_api_response.txt', $response);

// Configurer les options de cURL
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json'
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($requestData));

// Exécuter la requête
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

// Gérer les erreurs
if (curl_errno($ch)) {
    http_response_code(500);
    echo json_encode(["error" => "Erreur lors de la connexion à l'API"]);
    curl_close($ch);
    exit();
}

curl_close($ch);

// Vérifier le code de réponse
if ($httpCode !== 200) {
    http_response_code(500);
    echo json_encode(["error" => "Erreur lors de la récupération des activités"]);
    exit();
}

// Décoder la réponse de l'API
$aiResponse = json_decode($response, true);

// Extraire le contenu généré
if (isset($aiResponse['candidates'][0]['output']['content'])) {
    $generatedContent = $aiResponse['candidates'][0]['output']['content'];
} else {
    http_response_code(500);
    echo json_encode(["error" => "Réponse inattendue de l'API"]);
    exit();
}

// Tenter de parser le JSON généré
$suggestions = json_decode($generatedContent, true);

if (json_last_error() !== JSON_ERROR_NONE) {
    // Si le JSON n'est pas valide, renvoyer une erreur
    http_response_code(500);
    echo json_encode(["error" => "L'API AI n'a pas renvoyé un JSON valide.", "details" => $generatedContent]);
    exit();
}

// Vérifier que les activités sont présentes
if (!isset($suggestions['activities']) || !is_array($suggestions['activities'])) {
    http_response_code(500);
    echo json_encode(["error" => "Format des activités invalide."]);
    exit();
}

// Retourner les suggestions au frontend
echo json_encode($suggestions);
