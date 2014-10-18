<?php

// Received route
if (isset($_GET["route"])) {
    $number = $_GET["route"];

    // get route info.  All the station info
    $path = "../model/$number.xml";

    // route info
    $xml = simplexml_load_file($path);

    // station info

    $route_station = [];
    
    if ($xml) {
        $station_in_route = $xml->xpath("/root/routes/route/config/station");
        $color = $xml->xpath("/root/routes/route/color");
        // get station location
        header("Content-type: text/xml");
        print "<root>";
        print "<stations>";
        print "<color>{$color[0]}</color>";
        foreach ($station_in_route as $station) {
            print "<station>";
            $st = simplexml_load_file("../model/$station.xml");
            $name = $st->xpath("/root/stations/station/name");
            print "<name>{$name[0]}</name>";
            $lat = $st->xpath("/root/stations/station/gtfs_latitude");
            print "<latitude>{$lat[0]}</latitude>";
            $lng = $st->xpath("/root/stations/station/gtfs_longitude");
            print "<longitude>{$lng[0]}</longitude>";
            $abbr = $st->xpath("/root/stations/station/abbr");
            print "<abbr>{$abbr[0]}</abbr>";
            print "</station>";

        }
        print "</stations>";
        print "</root>";




    } else {
        echo "xml error";
    }



} else {
    echo "error";
}

// END
