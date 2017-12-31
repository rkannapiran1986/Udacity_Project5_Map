// Location function used for marker.
var LocationFn = function(title, lng, lat, venueId, cat) {
    var self = this;
    this.title = title;
    this.lng = lng;
    this.lat = lat;
    this.venueId = venueId;
    this.cat = cat;

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
        icon: self.icon
    });

    // Opens the info window for the location marker.
    this.openInfowindow = function() {
        for (var i = 0; i < locationsModel.locations.length; i++) {
            locationsModel.locations[i].infowindow.close();
        }
        map.panTo(self.marker.getPosition());

        //Setting content in map popup
        self.infowindow.setContent(self.content);
        self.infowindow.open(map, self.marker);
    };

    // Assigns a click event for marker
    this.addListener = google.maps.event.addListener(self.marker, 'click', (this.openInfowindow));
};

// Location model
var locationsModel = {

    locations: [
        new LocationFn('Ega Theatre', 13.077873, 80.240464, '4cf22a8d6c29236a042e6aa2', 'Movie Theater'),
        new LocationFn('Satyam Cinemas', 13.055368, 80.257967, '4b7fba44f964a520073b30e3', 'Movie Theater'),
        new LocationFn('Fort Museum', 13.079589, 80.287452, '4cb9863b90c9a143bac487d6', 'Visit'),
        new LocationFn('Thalpakatti', 12.977411, 80.219264, '4ce69e38948f224b8af8e45d', 'Food'),
        new LocationFn('Sangeetha Veg', 12.987955, 80.218705, '4cc010319ca85481a600ba16', 'Food')
    ],

    query: ko.observable(''),
};


// Search function for filtering
locationsModel.search = ko.dependentObservable(function() {
    var self = this;
    var search = this.query().toLowerCase();
    return ko.utils.arrayFilter(self.locations, function(location) {
        return location.title.toLowerCase().indexOf(search) >= 0;
    });
}, locationsModel);

ko.applyBindings(locationsModel);