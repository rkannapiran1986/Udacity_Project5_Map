var map;

function initMap() {
    // Constructor to create a new map JS object.
    //13.08268,80.270718 - Chennai - Tamilnadu, India
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 13.08268,
            lng: 80.270718
        },
        zoom: 12
    });

    // Location function used for marker.
    //var LocationFn = function(title, lng, lat, venueId, cat) {
	var LocationFn = function(data) {
        var self = this;
        this.title = data.title;
        this.lng = data.lng;
        this.lat = data.lat;
        this.venueId = data.venueId;
        this.cat = data.cat;
		// By default every marker will be visible
		this.visible = ko.observable(true);
		
		/*this.title = title;
        this.lng = lng;
        this.lat = lat;
        this.venueId = venueId;
        this.cat = cat;*/

        // getInfoContent function retrieves 5 most recent tips from foursquare for the marker location.
        this.getInfoContent = function() {
            var recentComments = [];
            var venueUrl = 'https://api.foursquare.com/v2/venues/' + self.venueId + '/tips?sort=recent&v=20171231&client_id=VEU2U2A0P3FSKPVC0G0Z2YJWTVORN4MXRIC32EMR1SRH0WLV&client_secret=4DCQ3MU4UL3QOZNMSYS5N5BFC20OE3WENQSB3OF1KX4OD4Z2';

            $.getJSON(venueUrl,
                function(data) {
                    $.each(data.response.tips.items, function(i, tips) {
                        if (i < 4) {
                            if (tips.type == 'user') {
                                recentComments.push('<li>' + tips.text + ' -- <b>' + tips.user.firstName + '</b></li>');
                            } else {
                                recentComments.push('<li>' + tips.text + '</li>');
                            }
                        }
                    });

                }).done(function() {

                self.content = '<h2>' + self.title + '</h2>' + '<h3>Most Recent Comments</h3>';
                self.content += '<ol class="tips">' + recentComments.join('') + '</ol>';

            }).fail(function(jqXHR, textStatus, errorThrown) {
                self.content = '<h2>' + self.title + '</h2><h4>Oops. There was a problem retrieving this location\'s comments.</h4>';
            });
        }();

        // Info window details
        this.infowindow = new google.maps.InfoWindow();

        // Marker icon.
        switch (this.cat) {
            case "Movie Theater":
                this.icon = 'http://www.googlemapsmarkers.com/v1/009900/';
                break;
            case "Food":
                this.icon = 'http://www.googlemapsmarkers.com/v1/0099FF/';
                break;
            case "Visit":
                this.icon = 'http://www.googlemapsmarkers.com/v1/FCBE2C/';
                break;
            default:
                this.icon = 'http://www.googlemapsmarkers.com/v1/990000/';
        }
        this.marker = new google.maps.Marker({
            position: new google.maps.LatLng(self.lng, self.lat),
            map: map,
            title: self.title,
            icon: self.icon,
            animation: google.maps.Animation.DROP
        });
		
		//Display function for marker
		this.showMarker = ko.computed(function() {
			if(this.visible() === true) {
				this.marker.setMap(map);
			} else {
				this.marker.setMap(null);
			}
			return true;
		}, this);

        // Opens the info window for the location marker.
        this.openInfowindow = function() {
            for (var i = 0; i < locationsModel.locations.length; i++) {
                locationsModel.locations[i].infowindow.close();
            }
            map.panTo(self.marker.getPosition());

            //Setting content in map popup
            self.infowindow.setContent(self.content);
            self.infowindow.open(map, self.marker);
			
			//Animate the selected marker
			self.marker.setAnimation(google.maps.Animation.BOUNCE);
			setTimeout(function() {
				self.marker.setAnimation(null);
			}, 2100);
        };
		
		// Animate whenever we clicking the marker
		this.bounce = function(place) {
			google.maps.event.trigger(self.marker, 'click');
		};

        // Assigns a click event for marker
        this.addListener = google.maps.event.addListener(self.marker, 'click', (this.openInfowindow));
    };

    // Location model
	let tempLocations = [{
			title: 'Ega Theater',
			lng: 13.077873, 
			lat: 80.240464,
			venueId: '4cf22a8d6c29236a042e6aa2',
			cat:'Movie Theater'
		},{
			title: 'Satyam Cinemas',
			lng: 13.055368,
			lat: 80.257967,
			venueId: '4b7fba44f964a520073b30e3',
			cat:'Movie Theater'
		},{
			title: 'Fort Museum',
			lng: 13.079589,
			lat: 80.287452,
			venueId: '4cb9863b90c9a143bac487d6',
			cat: 'Visit'
		},{
			title: 'Thalpakatti',
			lng: 12.977411,
			lat: 80.219264,
			venueId: '4ce69e38948f224b8af8e45d',
			cat:'Food'
		},{
			title: 'Sangeetha Veg',
			lng: 12.987955,
			lat: 80.218705,
			venueId: '4cc010319ca85481a600ba16',
			cat:'Food'
		}
	];
	
    /*var locationsModel = {
        locations: [
            new LocationFn('Ega Theatre', 13.077873, 80.240464, '4cf22a8d6c29236a042e6aa2', 'Movie Theater'),
            new LocationFn('Satyam Cinemas', 13.055368, 80.257967, '4b7fba44f964a520073b30e3', 'Movie Theater'),
            new LocationFn('Fort Museum', 13.079589, 80.287452, '4cb9863b90c9a143bac487d6', 'Visit'),
            new LocationFn('Thalpakatti', 12.977411, 80.219264, '4ce69e38948f224b8af8e45d', 'Food'),
            new LocationFn('Sangeetha Veg', 12.987955, 80.218705, '4cc010319ca85481a600ba16', 'Food')
        ],
        query: ko.observable('')
    };*/
	
	var locationsArr = [];
	for(let i=0; i<tempLocations.length; i++){
		locationsArr.push(new LocationFn(tempLocations[i]));
	}
	var locationsModel = {
		locations : locationsArr,
		query: ko.observable('')
	};

    locationsModel.availablePlaces = ko.computed(function() {
        var self = this;
        return ko.utils.arrayFilter(self.locations, function(location) {
            return location.title.toLowerCase();
        });
    }, locationsModel);

    // Search function for filtering
    locationsModel.search = ko.computed(function() {
        var self = this;
        /*var search = this.query().toLowerCase();
        return ko.utils.arrayFilter(self.locations, function(location) {
            return location.title.toLowerCase().indexOf(search) >= 0;
        });*/
		var filter = this.query().toLowerCase();
		if (!filter) {
            self.locations.forEach(function(locationItem) {
                locationItem.visible(true);
            });
            return self.locations;
        } else {
            return ko.utils.arrayFilter(self.locations, function(locationItem) {
                var string = locationItem.title.toLowerCase();
                var result = (string.search(filter) >= 0);
                locationItem.visible(result);
                return result;
            });
        }
    }, locationsModel);

    ko.applyBindings(locationsModel);
}

function mapError() {
    $('#map').html('<span class="errorMsg">Sorry, some issue with map.</span>');
}