$(function () {
	'use strict';

	var check = {};	//Store form-check booleans
	var map = null;
	
	$('#formerror').hide();

	//Validate email form
	$('#emailinput').on('input', function() {
		var email = $('#emailinput').val();
		var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
		check.mail = regex.test(email);

		checkAll();
		
	});
	
	//Validate postcode form
	$('#postcodeinput').on('input', function() {
		var postcode = $('#postcodeinput').val().replace(/\s/g, "");
		var regex = /[A-Z]{1,2}[0-9]{1,2} ?[0-9][A-Z]{2}/i;
		check.postcode = regex.test(postcode);

		checkAll();

	});

	$('#sendbutton').on('click', function(){
		var options = {
			postcode: $('#postcodeinput').val().replace(/\s/g, ""),
			mp: map 
		}
		var distance = new CheckDistance(options);
	});

	//Disable - Enable send button
	var checkAll = function () {
		if (check.mail && check.postcode){
			$('#sendbutton').removeClass('disabled');
			$('#sendbutton').text('Send');
		} else {
			$('#sendbutton').addClass('disabled');
			$('#sendbutton').text('Please fill in both fields correctly');
		}
	}

	/*Google maps*/
	function initMaps() {
		var myLatLng = new google.maps.LatLng(52.196455, 0.146483);
		var mapOptions = { 
			center: myLatLng,
			zoom: 15,
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			scrollwheel: false
		};
		map = new google.maps.Map(document.getElementById('maps'), mapOptions);	
		var marker = new google.maps.Marker({
			position: myLatLng,
			map: map,
			title: 'Me'
		});	
      	var markerWindow = new google.maps.InfoWindow({
      		content: 'Me!'
      	});
      	markerWindow.open(map, marker);

	}
	
	//Load google maps on 
	google.maps.event.addDomListener(window, 'load', initMaps);


});

