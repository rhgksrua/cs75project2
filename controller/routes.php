<?php

$xml = file_get_contents("http://api.bart.gov/api/route.aspx?cmd=routes&key=MW9S-E7SL-26DU-VV8V");
echo "hello";
echo $xml;
if ($xml) {
    file_put_contents("./model/routes.xml", $xml);
} else {
    echo "FAILED";
}


// END
