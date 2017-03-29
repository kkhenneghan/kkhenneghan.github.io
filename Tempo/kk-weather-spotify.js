$(document).ready(function(){

		var myFunction;

		//first we need to geolocate your user via the browser
		if ("geolocation" in navigator) {
		  /* geolocation is available */
		  console.log("geolocation is available");
		  navigator.geolocation.getCurrentPosition(function(position) {
		  	  //pass the latitude and longitude to a function called myFunction
			  myFunction(position.coords.latitude, position.coords.longitude);
			});
		} else {
			//if no geolocation is available, use the equator lat-lon coordinates
		  	myFunction(0.0,0.0);
		}


		//Here's where we define myFunction, which is being passed two variables
		function myFunction(lat1, lon1){

			//log the latitude and longitude to make sure variables are being passed properly
			console.log(lat1 + ", " + lon1);

			//query the wunderground api with the latitude and longitude, using those variables in the query
			$.ajax({
			  url : "https://api.wunderground.com/api/e81f4372c7048507/geolookup/conditions/q/" + lat1 +","+ lon1 + ".json",
			  dataType : "jsonp",
			  success : function(parsed_json) {
				  var location = parsed_json['location']['city'];
				  var temp_f = parsed_json['current_observation']['temp_f'];
				  var wind_mph = parsed_json['current_observation']['wind_mph'];
				  var weather = parsed_json['current_observation']['weather'];

				  //use jquery to change the background color of the html document based on the temp 
				  $("body").css("background-color", "rgb(" + (Math.round(temp_f*2.5)) + ",90,90)");
				  
				  //log the location to check to see that the api returned something
				  console.log(location);

				  //wind speed contingency - if wind is more than 20mph, just set it to 20
				  //this will make the max number of songs 20 which is the same that spotify returns when queried
				  if(wind_mph>20) {
				  	wind_mph=20;
				  } else if(wind_mph<1) {
				  	wind_mph=1;
				  }

				  //Send the conditions at the user's lat-lon to the second function to do the spotify requests
				  myFunction2(weather, wind_mph, temp_f);

			  }
			});
		}

		//define myFunction2
		function myFunction2(weatherCondition, wind, temp){

		//log the weatherCondition variable to check if variables were passed correctly
		console.log(weatherCondition);

		$.ajax({
			//query the spotify api using their endpoint reference and replacing a keyword with the variable 'weatherCondition'
			url: "https://api.spotify.com/v1/search?q=track:"+weatherCondition+"&type=track",
			type: "GET",
			dataType: "json",
			success: function(parsed_json) {

				//the variable 'meow' is the object 'items' from inside the object 'tracks', which is what spotify returns
				var meow = parsed_json['tracks']['items'];

				//below you can log to the console the length of the array 'meow' - (commented out for now)
				//console.log(meow.length);

				//below is what's called a "for loop"
				//for each time that a condition is true, it does a thing that you tell it to do
				//so in this case, for every value less than the wind speed, I'm telling it to give me the next song in the search.
				for(var i=0; i<wind; i++) {
					var meowSong = meow[i];
					var meowArtist = meowSong.artists[0];
					var meowArtistName = meowArtist.name;
					console.log(meowArtistName);

					var meowSongName = meowSong.name;
					console.log(meowSongName);

					var meowLink = meowSong.external_urls.spotify;
					console.log(meowLink);

					$("#songTitle").append("<a href='"+meowLink+"'> "+meowSong.name + " by " + meowArtist.name+"</a> <br>");
				}

			}

		})

	} 
})
