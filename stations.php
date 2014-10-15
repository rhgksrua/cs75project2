<?php

// Get station info


$xml = file_get_contents("http://api.bart.gov/api/stn.aspx?cmd=stns&key=MW9S-E7SL-26DU-VV8V");

if ($xml) {
    file_put_contents("./model/stations.xml", $xml);
} else {
    echo "Station get FAIL";
}

$xml = simplexml_load_file("./model/stations.xml");

$st_names = $xml->xpath("/root/stations/station/abbr");



foreach ($st_names as $name) {
    echo $name;
    echo "\n";
    $st = file_get_contents("http://api.bart.gov/api/stn.aspx?cmd=stninfo&orig=$name&key=MW9S-E7SL-26DU-VV8V");
    if ($st) {
        file_put_contents("./model/$name.xml", $st);
    } else {
        echo "could not get $name";
    }
        
}



// END
