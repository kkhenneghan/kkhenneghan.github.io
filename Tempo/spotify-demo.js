$(document).ready(function(){

	if ("geolocation" in navigator) {
		console.log("geolocation is available");
		navigator.geolocation.getCurrentPosition(function(position) {
			weatherFunction(position.coords.latitude, position.coords.longitude);
		});


	} else {console.log("geolocation unavailable");

	}



	function weatherFunction(lat1, lon1) {
		console.log(lat1, lon1);

		$.ajax({
			url : "https://api.wunderground.com/api/e81f4372c7048507/geolookup/conditions/q/" + lat1 +","+ lon1 + ".json",
			dataType: "jsonp",
			success: function (parsed_json) {
				console.log(parsed_json);

			}



		})

	}





})