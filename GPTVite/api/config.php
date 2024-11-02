<?php
// config/config.php

// Charger les variables d'environnement depuis le fichier .env
function load_env($path)
{
    if (!file_exists($path)) {
        die("Fichier .env non trouvé!");
    }

    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) {
            continue;
        }
        list($name, $value) = explode('=', $line, 2);
        $name = trim($name);
        $value = trim($value);
        if (!array_key_exists($name, $_ENV)) {
            $_ENV[$name] = $value;
        }
    }
}

// Charger les variables d'environnement
load_env(__DIR__ . '/.env');
