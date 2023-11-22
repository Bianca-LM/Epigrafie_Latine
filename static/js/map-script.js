//MAP SCRIPT

const coordinatesQuery = 'SELECT DISTINCT ?address ?lat ?long WHERE {?s <http://www.cidoc-crm.org/cidoc-crm/P55_has_current_location> ?address; 	<https://w3id.org/arco/ontology/location/lat> ?lat; 	<https://w3id.org/arco/ontology/location/long> ?long}';
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
            var address = data[i].address.value
            console.log(latitude, longitude)
            setMarkers(latitude, longitude,address, map)
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


function setMarkers(Lat, Long, name, map) {

	var marker = L.marker([Lat, Long]).addTo(map);
	marker.bindPopup(name).openPopup(); 
}


//IMAGE VIEWER




function addImage() {
  console.log("HERE")
  const queryImages = 'SELECT DISTINCT ?imageLinks WHERE {<http://www.cidoc-crm.org/cidoc-crm/E22_Human-Made_Object> <http://www.cidoc-crm.org/cidoc-crm/P138i_has_representation> ?object. ?object <crm:P138i_has_representation>  ?imageLinks} LIMIT 1';
  const encodedQueryImages = encodeURIcomponent(queryImages); 
  $.ajax({
    url: '/blaze?q=' + encodedQueryImages,
    type: 'GET',
    success: function(result_json) {
      console.log(result_json);
      var data = result_json.results.bindings
      console.log(data)
      var div = document.getElementById("epigrafe")
      if (data.length > 0) { 
        for(var i=0;i<data.length;i++) { 
          var figure = document.createElement("figure")
          var img = document.createElement("img")
          var link = data[i].imageLinks.value;
          div.appendChild(figure)
          figure.appendChild(img)
          img.setAttribute("src", "link")
        }
      }
    },
    error: function(xhr, status, error) {
      console.error(error);
    }
  });
}