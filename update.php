<?php

// UPDATE route info if necessary

// routes in service

require("./model/model.php");


// get all available routes
$xml = file_get_contents("http://api.bart.gov/api/route.aspx?cmd=routes&key=MW9S-E7SL-26DU-VV8V");
if ($xml) {
    file_put_contents("./model/routes.xml", $xml);
} else {
    echo "FAILED";
}

$routes = get_available_routes("./model/routes.xml");

// get each route info
foreach ($routes as $route) {
    $xml = file_get_contents("http://api.bart.gov/api/route.aspx?cmd=routeinfo&route={$route[1]}&key=MW9S-E7SL-26DU-VV8V");

    file_put_contents("./model/{$route[1]}.xml", $xml);

}








// END
