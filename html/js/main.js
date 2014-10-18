var markers = [];
var current = null;
var map = "";
var path;
var infoWindows = [];

// Initial render of Google Maps
function initialize() {

    var mapOptions = {
        center: { lat: 37.7833, lng: -122.4167 },
        zoom: 10
    };
    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
}

// Helper function for toggling current route
function getChildren(n, skipMe) {
    var r = [];
    var elem = null;
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
                // color of the route
                color = xmlDoc.getElementsByTagName("color")[0].textContent;
                addMarker(map, latlngs);
                addPolyline(map, latlngs, color);
                addInfoWindow(map, latlngs);
                
            } else {
                console.error(xhr.statusText);
            }
        }
    };
    xhr.send(null);
    return markers;
}

function addMarker(map, latlng) {
    for (var i = 0; i < latlng.length; i++) {
        marker = new google.maps.Marker(
                {
                    position: new google.maps.LatLng(latlng[i][0], latlng[i][1]),
                    title: latlng[i][2],
                });
        marker.setMap(map);
        // Store markers for infoWindows
        markers.push(marker);
    }
}

function addPolyline(map, latlng, color) {
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
        (function(i) {
            marker = markers[i];
            
            google.maps.event.addListener(marker, 'click', function(event) {
                if (current !== null) {
                    infoWindows[current].close();
                }
                current = i;
                xhr = new XMLHttpRequest();

                console.log(latlng[i][3]);
                xhr.open("GET", "/?page=eta&station=" + latlng[i][3], true);
                xhr.onload = function (e) {
                    if (xhr.readyState === 4) {
                        if (xhr.status === 200) {
                            contentHTML = "<div>" + latlng[i][2] + "</div>";

                            // Results from ajax
                            xmlDoc = xhr.responseXML;
                            console.log(xmlDoc);
                            count = xmlDoc.getElementsByTagName("etd").length;
                            dest = xmlDoc.getElementsByTagName("destination");

                            for (j = 0; j < count; j++) {
                                contentHTML += "<div>To: " + dest[j].textContent + "</div>";
                                estimate = dest[j].parentNode.getElementsByTagName("estimate");
                                contentHTML += "<ul>";
                                for (k = 0; k < estimate.length; k++) {
                                    contentHTML += "<li>" + estimate[k].textContent + " minutes</li>";
                                }
                                contentHTML += "</ul>";
                            }
                            
                            infoWindow = new google.maps.InfoWindow({
                                content: contentHTML,
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
            event.target.className = event.target.className + " highlight";
            // Remove all infoWindows from previous click
            infoWindows = [];
            current = null;
            // Render route
            showMap(event.target.id, map);
        } else if (event.target.className == "routes highlight") {
            event.target.className = "routes";
        }

    }, false);
};
    
// Render Google Maps
google.maps.event.addDomListener(window, 'load', initialize);
