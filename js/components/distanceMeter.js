var CheckDistance = function (opt) {
	this.postcode = opt.postcode;
	this.map = opt.mp;
	this.initialize();
}


CheckDistance.prototype = {
	postcode: '',
	lng: 0,		//postcode longitude
	lat: 0,		//postcode latitude
	map: null,
	myLatLng: new google.maps.LatLng(52.196455, 0.146483),
	searchLatLng: null,
	bounds: new google.maps.LatLngBounds(),	//Array containing all marker locations

	initialize: function() {
		this.bounds.extend(this.myLatLng);	//Add my marker location to bounds array
		this.defineLngLat();	
	},
	defineLngLat: function() {			//Function that defines the Longitude and Latitude, depending on the postcode	
		var me = this;

		/*AJAX Request to determine geolocation based on postcode*/
		 $.ajax({
                url: 'http://maps.googleapis.com/maps/api/geocode/json?components=postal_code:'+this.postcode+'|country:UK&sensor=false',
                type: 'GET',
                timeout: 10000,
                success: function (data, textStatus, xhr) {
                    me.lng = data.results[0].geometry.location.lng;
                    me.lat = data.results[0].geometry.location.lat;

                    me.searchLatLng = new google.maps.LatLng(me.lat, me.lng);          
                    me.bounds.extend(me.searchLatLng);
                   	me.getDistance();
                },
                error: function (jqXHR, textStatus, error) {
                    console.log(error);
                }
                
            });
	},
	getDistance: function() {			//Function that defines distance in meters and converts them to miles
		//console.log(this.myLatLng);
		//console.log(this.searchLatLng);
		var distance_meters = google.maps.geometry.spherical.computeDistanceBetween(this.myLatLng, this.searchLatLng);
		var distance_miles = distance_meters * 0.00062137;

		if(distance_miles < 5){
			this.placeSearchMarker();
			this.createRadius();
			this.reCenterView();
		}
		//console.log(distance);
	},
	placeSearchMarker: function() {		//Function that places marker and infowindow
		
		var marker = new google.maps.Marker({
			position: this.searchLatLng,
			map: this.map,
			animation: google.maps.Animation.DROP
		});
		var markerWindow = new google.maps.InfoWindow({
      		content: 'This must be a great honor for you, being located so close to me!'
      	});
      	markerWindow.open(this.map, marker);
	},
	createRadius: function() {			//Function that draws radius of 5 miles on the map
		var radius = new google.maps.Circle({
			strokeColor: '#ffa900',
			strokeOpacity: 0.5,
			strokeWeight: 2,
			fillColor: '#ffa900',
			fillOpacity: 0.3,
			map: this.map,
			center: this.myLatLng,
			radius: 8046.72
		});
	},
	
	reCenterView: function() {			//Function that rezooms and recenters the map with both locations as fitBounds
		this.map.fitBounds(this.bounds);
	}
}
