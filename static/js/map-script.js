//MAP SCRIPT

const coordinatesQuery = 'prefix dcterm: <http://purl.org/dc/terms/> SELECT DISTINCT ?s ?label ?lat ?long WHERE { ?s <https://w3id.org/arco/ontology/location/lat> ?lat;  <https://w3id.org/arco/ontology/location/long> ?long. ?s dcterm:title ?label. ?s1 <http://dbpedia.org/ontology/currentStatus> "published"; dcterm:title ?label. }';
const encodedCoordinatesQuery = encodeURIComponent(coordinatesQuery);

$(document).ready(function() {
 
  if(document.getElementById("myMap") != null) {
    //MAP TRIAL WITH PYTHON CODE
    $.ajax({
      url: '/blaze?q=' + encodedCoordinatesQuery,
      type: 'GET',
      success: function(result_json) {
        console.log(result_json);
        var data = result_json.results.bindings
        console.log(data)
        if (data.length > 0) { 
          for(var i=0;i<data.length;i++) { //PROBLEM: more than one set of coordinates can be find for the same address
            console.log("R", data);
            var latitude = data[i].lat.value;
            var longitude = data[i].long.value;
            var label = data[i].label.value;
            var id = data[i].s.value.replace("https://w3id.org/clef/", "")
            console.log(latitude, longitude)
            setMarkers(latitude, longitude, label, map, id)
          }
        }
      },
      error: function(xhr, status, error) {
        console.error(error);
      }
    });
  

    var map = L.map('myMap').setView([44.4939, 11.3428], 13);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
  }


	//coordinates(myUrl, map);
});


function setMarkers(Lat, Long, name, map, id) {

	var marker = L.marker([Lat, Long]).addTo(map);
	marker.bindPopup("<a href='view-"+id+"'>"+name+"</a>"); 
}


