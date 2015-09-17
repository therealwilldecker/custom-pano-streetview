var welcomeString = '******************************'+
'* Welcome to View My Shoes!! *'+
'******************************';

console.log(welcomeString);

var photosphere;

/**
* The photosphere that will be used as the entry point to the custom
* photosphere set.
*/
var letsStartOurWalk = null;

function initialize() {
  // The latlong of our starting point for the custom street view.
  var sanCarlos = new google.maps.LatLng(37.482282,-122.286420);
  
  // OK let's setup the map and start up the controls
  var myMapOptions = {
    center: letsStartOurWalk,
    zoom: 16
  };
  var ourMap = new google.maps.Map(document.getElementById('map-canvas'),
    myMapOptions);
    
  photosphere = map.getStreetView();
  // Let's setup our streetview and make sure it is visible.
  // First, register a photosphere getter function.
  var photoOptions = {
    position: sanCarlos,
    visible: true,
    panoProvider: getCustomPhotosphere
  };
  photosphere.setOptions(photoOptions);
  
  // Now let's create a StreetViewService object.
  var streetViewService = new google.maps.StreetViewService();
  
  // Compute the nearest photosphere to our starting point
  // using the service and store that ID.
  var radius = 50;
  streetViewService.getPanoramaByLocation(sanCarlos, radius,
    function(result, status) {
      if(status == google.maps.StreetViewStatus.OK) {
        // Monitor the links_changed event to check if the current
        // photosphere is either a custom one or the starting one
        google.maps.event.addListener(photosphere, 'links_changed',
          function() {
            createCustomLinks(result.location.pano);
          });
      }
    });
}

function getOurPhotosphere(pano) {
  // this will provide a new photosphere to streetview
  switch(pano){
    case 'myFavoriteView':
      return {
        location: {
          pano: 'myFavoriteView',
          description: 'My Favorite View',
          latLng: new google.maps.LatLng(37.482282,-122.286420)
        },
        links: [],
        tiles: {
          tileSize: new google.maps.Size(1024, 512),
          worldSize: new google.maps.Size(1024, 512),
          // The heading at the origin of the photosphere
          centerHeading: 100,
          getTileUrl: function() {
            return 'https://farm8.staticflickr.com/7494/15539086363_c6402dd7bc_b.jpg';
            }
          }
        };
        break;
      default:
        return null;
  }
}

function makeMyLinks(letsStartOurWalk) {
  // Adds links into the street view along with photo info.
  var links = photosphere.getLinks();
  var photoId = photosphere.getPano();
  
  switch(photoId) {
    case letsStartOurWalk:
      links.push({
        heading: 55,
        description: 'My Favorite View',
        pano: 'myFavoriteView'
      });
      break;
    case 'myFavoriteView':
      links.push({
        heading: 55,
        description: 'Back',
        pano: letsStartOurWalk
      });
      break;
    default:
      return;
  }
}

google.maps.event.addDomListener(window, 'load', initialize);
