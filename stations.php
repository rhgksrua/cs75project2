<?php

// Get station info


$xml = file_get_contents("http://api.bart.gov/api/stn.aspx?cmd=stns&key=MW9S-E7SL-26DU-VV8V");

if ($xml) {
    file_put_contents("./model/stations.xml", $xml);
} else {
    echo "Station get FAIL";
}


// END
