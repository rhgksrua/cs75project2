var markers = [];
var current = "";
var map = "";
var path;
var infoWindows = [];

function initialize() {

    var mapOptions = {
        center: { lat: 37.7833, lng: -122.4167 },
        zoom: 10
    };
    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

}

function getChildren(n, skipMe) {
    var r = [];
    var elem = null;
    for ( ; n; n = n.nextSibling ) {
        if (n.nodeType == 1 && n != skipMe)
            r.push(n);
    }
    return r;
};

function getSiblings(n) {
    return getChildren(n.parentNode.firstChild, n);
}



function addMarker(map, latlng) {
    for (var i = 0; i < latlng.length; i++) {
        marker = new google.maps.Marker(
                {
                    position: new google.maps.LatLng(latlng[i][0], latlng[i][1]),
                    title: "I am a marker"
                });

        marker.setMap(map);
        markers.push(marker);
    }
}

function addPolyline(map, latlng) {
    var coord = [];
    var point;
    for (var i = 0; i < latlng.length; i++) {
        point = new google.maps.LatLng(latlng[i][0], latlng[i][1]);
        coord.push(point);
    }
    path = new google.maps.Polyline({
        path: coord,
         strokeColor: '#FF0000',
         strokeOpacity: 1.0,
         strokeWeight: 2
    });

    path.setMap(map);
}

function addInfoWindow(map, latlng) {
    var infoWindow;
    console.log("inside addInfo");
    for (var i = 0; i < latlng.length; i++) {
        infoWindow = new google.maps.InfoWindow({
            content: "<p>Hellow</p>",
            //position: new google.maps.LatLng(latlng[i][0], latlng[i][1]),
        });
        infoWindows.push(infoWindow);
        marker = markers[i];
        google.maps.event.addListener(marker, 'click', function(event) {
            infoWindow.open(map, this);
        });
    }


}
    




function clearMarker() {
    if (markers.length > 0) {
        path.setMap(null);
    }
    
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    markers = [];

}

window.onload = function() {
    var list;

    list = document.getElementById("routes-list");

    list.addEventListener('click', function(event) {
        if (event.target.id == "routes-list") {
            return
        }
        console.log(event.target.id);

        var sib = getSiblings(event.target);

        // Clear highlights on route name
        for (var i = 0; i < sib.length; i++) {
            sib[i].className = "routes";
        }
        
        clearMarker();

        // Toggle highlights and show markers
        if (event.target.className == "routes") {
            event.target.className = event.target.className + " highlight";
            showMap(event.target.id, map);
        } else if (event.target.className == "routes highlight") {
            event.target.className = "routes";
        }

    }, false);
};
    
var showMap = function(route, map) {

    var latlngs = [];
    var xhr = new XMLHttpRequest();

    xhr.open("GET", "/?page=routes&route=" + route, true);
    xhr.onload = function (e) {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                console.log(xhr.responseXML);
                xmlDoc = xhr.responseXML;
                
                var count = xmlDoc.getElementsByTagName("station").length;

                for (var i = 0; i < count; i++) {

                    var lng = xmlDoc.getElementsByTagName("longitude")[i].textContent;
                    var lat = xmlDoc.getElementsByTagName("latitude")[i].textContent;
                    latlngs.push([lat, lng]);
                }
                addMarker(map, latlngs);
                addPolyline(map, latlngs);
                addInfoWindow(map, latlngs);
                
            } else {
                console.error(xhr.statusText);
            }
        }
    };
    xhr.send(null);
    return markers;
}

google.maps.event.addDomListener(window, 'load', initialize);



