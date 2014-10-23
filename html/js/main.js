var markers = [];
var current = null;
var map = "";
var path;
var infoWindows = [];

// Initial render of Google Maps
function initialize() {
    var mapOptions;
    mapOptions = {
        center: { lat: 37.7833, lng: -122.4167 },
        zoom: 10
    };
    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
}

// Helper function for toggling current route
function getChildren(n, skipMe) {
    var r, elem = null;
    r = [];
    elem = null;
    for ( ; n; n = n.nextSibling ) {
        if (n.nodeType == 1 && n != skipMe)
            r.push(n);
    }
    return r;
};

// Helper function for toggling current route
function getSiblings(n) {
    return getChildren(n.parentNode.firstChild, n);
}


function showMap(route, map) {

    var latlngs = [];
    var lng, lat, name, abbr, color, count, i;
    var xhr = new XMLHttpRequest();

    xhr.open("GET", "/?page=routes&route=" + route, true);
    xhr.onload = function (e) {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                xmlDoc = xhr.responseXML;
                count = xmlDoc.getElementsByTagName("station").length;
                for (i = 0; i < count; i++) {
                    // add station position
                    lng = xmlDoc.getElementsByTagName("longitude")[i].textContent;
                    lat = xmlDoc.getElementsByTagName("latitude")[i].textContent;
                    name = xmlDoc.getElementsByTagName("name")[i].textContent;
                    abbr = xmlDoc.getElementsByTagName("abbr")[i].textContent;
                    latlngs.push([lat, lng, name, abbr]);
                }

                // center Map on route
                centerMap(latlngs);
                
                color = xmlDoc.getElementsByTagName("color")[0].textContent;

                // add marker for each route
                addMarker(latlngs);

                // add route to map with color
                addPolyline(latlngs, color);

                // add info window to stations
                addInfoWindow(map, latlngs);
                
            } else {
                console.error(xhr.statusText);
            }
        }
    };
    xhr.send(null);
    return markers;
}

function centerMap(latlng) {
    var maxLat, minLat, maxLng, minLng, center;

    // Get min max lat lng of route
    maxLat = Math.max.apply(Math, latlng.map(function(i) {
        return i[0];
    }));
    minLat = Math.min.apply(Math, latlng.map(function(i) {
        return i[0];
    }));
    maxLng = Math.max.apply(Math, latlng.map(function(i) {
        return i[1];
    }));
    minLng = Math.min.apply(Math, latlng.map(function(i) {
        return i[1];
    }));
    
    latCenter = (maxLat + minLat) / 2.0;
    lngCenter = (maxLng + minLng) / 2.0;

    // center map on route
    center = new google.maps.LatLng(latCenter, lngCenter);
    map.panTo(center);
    // reset zoom when route is clicked
    map.setZoom(10);

}


function addMarker(latlng) {
    var i;
    for (i = 0; i < latlng.length; i++) {
        marker = new google.maps.Marker(
                {
                    position: new google.maps.LatLng(latlng[i][0], latlng[i][1]),
                    title: latlng[i][2]
                });
        marker.setMap(map);
        // Store markers for infoWindows
        markers.push(marker);
    }
}

function addPolyline(latlng, color) {
    var coord = [];
    var point, i;

    for (i = 0; i < latlng.length; i++) {
        point = new google.maps.LatLng(latlng[i][0], latlng[i][1]);
        coord.push(point);
    }
    path = new google.maps.Polyline({
        path: coord,
         strokeColor: color,
         strokeOpacity: 1.0,
         strokeWeight: 3
    });
    path.setMap(map);
}

function addInfoWindow(map, latlng) {
    var infoWindow, i, xhr, contentHTML, count, j, k, dest, estimate;
    for (i = 0; i < latlng.length; i++) {
        // Need to store different i value for addListener
        // function scope
        // Adding infoWindow with the marker might be better.
        (function(i) {
            marker = markers[i];
            
            // Listen for click on marker
            google.maps.event.addListener(marker, 'click', function(event) {
                // Check if infoWindow is open. Close if open
                if (current !== null) {
                    infoWindows[current].close();
                }
                // set this infoWindow to current
                current = i;
                xhr = new XMLHttpRequest();

                console.log(latlng[i][3]);
                xhr.open("GET", "/?page=eta&station=" + latlng[i][3], true);
                xhr.onload = function (e) {
                    if (xhr.readyState === 4) {
                        if (xhr.status === 200) {
                            contentHTML = "<div class='station'>" + latlng[i][2] + "</div>";

                            // Results from ajax
                            xmlDoc = xhr.responseXML;
                            count = xmlDoc.getElementsByTagName("etd").length;
                            dest = xmlDoc.getElementsByTagName("destination");

                            for (j = 0; j < count; j++) {
                                contentHTML += "<div class='dest'>To: " + dest[j].textContent + "</div>";
                                estimate = dest[j].parentNode.getElementsByTagName("estimate");
                                // wrap contentHTML in scrollFix
                                contentHTML = "<div class='scrollFix info-container'>" + contentHTML + "<ul class='minutes'>";
                                for (k = 0; k < estimate.length; k++) {
                                    if (estimate[k].textContent === "Leaving") {
                                        contentHTML += "<li>NOW</li>";
                                    } else {
                                        contentHTML += "<li>" + estimate[k].textContent + " minutes</li>";
                                    }
                                }
                                contentHTML += "</ul>";
                            }
                            contentHTML +="</div>";
                            
                            infoWindow = new google.maps.InfoWindow({
                                content: contentHTML
                            });
                            infoWindows[i] = infoWindow;
                            infoWindow.open(map, markers[i]);

                        } else {
                            console.error(xhr.statusText);
                        }
                    }
                };
                xhr.send(null);
            });
        }(i));
    }
}
    
// Remove markers
function clearMarker() {
    var i;

    // Remove all polylines
    if (markers.length > 0) {
        path.setMap(null);
    }
    
    // Remove all markers
    for (i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    markers = [];
}

window.onload = function() {

    var list, sib, i;

    list = document.getElementById("routes-list");

    // Event delegation
    list.addEventListener('click', function(event) {

        // Parent node is ignored
        if (event.target.id == "routes-list") {
            return
        }

        // Clear highlights on route name
        sib = getSiblings(event.target);
        for (i = 0; i < sib.length; i++) {
            sib[i].className = "routes";
        }
        
        // Remove all markers when clicked on a route
        clearMarker();

        // Toggle highlights and show markers
        if (event.target.className == "routes") {
            //event.target.className = event.target.className + " highlight";
            event.target.className = " highlight";
            // Remove all infoWindows from previous click
            infoWindows = [];
            current = null;
            // Render route
            showMap(event.target.id, map);
        } else if (event.target.className !== "routes") {
            event.target.className = "routes";
        }

    }, false);
};
    
// Render Google Maps
google.maps.event.addDomListener(window, 'load', initialize);
