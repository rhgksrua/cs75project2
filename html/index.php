<?php

session_start();

// Redirect user to specific page. Redirects to home if not set.
if (isset($_GET["page"])) {
    $page = $_GET["page"];
} else {
    $page = "home";
}

$path = __DIR__ . '/../controller/' . $page . '.php';
if (file_exists($path)) {
    require($path);
} else {
    print "page does not exist";
}


// END
