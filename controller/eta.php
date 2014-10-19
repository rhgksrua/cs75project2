<?php

if (isset($_GET["station"])) {
    $station = $_GET["station"];

    $url = "http://api.bart.gov/api/etd.aspx?cmd=etd&orig=$station&key=MW9S-E7SL-26DU-VV8V";

    $xml_string = file_get_contents($url);
    $xml = simplexml_load_string($xml_string);

    if (!$xml) {
        echo "error";
        exit();
    }


    $destinations = $xml->xpath("/root/station/etd/abbreviation");
    header("Content-Type: text/xml");

    print "<root>";
    print "<etds>";
    foreach ($destinations as $destination) {
        print "<etd>";
        
        print "<destination>$destination</destination>";
        $estimates = $xml->xpath("/root/station/etd/estimate[../abbreviation='{$destination}']/minutes");
        foreach ($estimates as $estimate) {
            print "<estimate>$estimate</estimate>";
        }
        

        print "</etd>";


    }
    print "</etds>";
    print "</root>";
}





// END
