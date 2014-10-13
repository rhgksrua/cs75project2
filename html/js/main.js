function initialize() {
    var mapOptions = {
        center: { lat: 37.7833, lng: -122.4167 },
        zoom: 10
    };
    var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
}
google.maps.event.addDomListener(window, 'load', initialize);


window.onload = function() {

    var list = document.getElementById("routes-list");
    console.log(list);

    list.addEventListener('click', function(event) {
        console.log(event.target.id);

        if (event.target.className == "routes") {
            event.target.className = event.target.className + " highlight"
        } else if (event.target.className == "routes highlight") {
            event.target.className = "routes";
        }

        
    }, false);
};
    

