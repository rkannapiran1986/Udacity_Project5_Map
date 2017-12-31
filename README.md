# Udacity_Project5_Map - Kannapiran

A simple map application displaying with marker. On clicking marker you can see the review comments of the place. Which is populating from third party API (Foursquare API)

## Technologies Used

1. jQuery

2. Knockout JS

3. HTML & CSS

4. Google API

5. Foursquare API

## API used:

Google Map API used to get the map functionality based on latitude and longitude. Google API reference can be get from [here](https://console.cloud.google.com/). For using Google API you need your own API Key.


Foursquare API is used to get the *venueid* based on latitude and longitude. Right now it is hardcoded in *main.js*. Based on *venueid* I'm getting recent comments of the places. You need your own Foursquare API Client Id and Client Secret. You can get this from [here](https://foursquare.com/developers/).

## Set Up

1. Clone the project from respository.

2. Open *main.js* and update Foursquare API with your *client_id* and *client_secret*:

3. Open *index.html* and update Google API key at line around 47.

4. Now directly open *index.html* in any browser.