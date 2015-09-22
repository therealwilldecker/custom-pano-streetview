var welcomeArray = ['******************************',
'* Welcome to View My Shoes!! *',
'******************************'];

for (var i = 0; i < welcomeArray.length; i++ ) {
  console.log(welcomeArray[i]);
}

// Global photosphere info that will be shared across our split screens 
// @ photosphere, object, for our first and original streetview
// @ myMapOptions, object, are set mainly to start our streetview with an existing photo
// @ photoOptions, object, are set mainly to make the streetview visible
// @ radius, integer, might as well set it :) This is used to grab the pano nearest our starting point
// @ zoomLevel, integer, is the starting custom zoom level for the map. 0 is zoomed out to the max.
var photosphere;
var myMapOptions;
var photoOptions;
var radius = 50;
var zoomLevel = 0;

function initialize() {
  // The latlong of our starting point for the custom street view.
  var sanCarlos = new google.maps.LatLng(37.482282,-122.286420);
  
  // OK let's setup the map and start up the controls
  myMapOptions = {
    center: null,
    zoom: 16
    };
  var ourMap = new google.maps.Map(document.getElementById('map-canvas'),
    myMapOptions);
    
  photosphere = ourMap.getStreetView();
  // Let's setup our streetview and make sure it is visible.
  // First, register a photosphere getter function.
  photoOptions = {
    position: sanCarlos,
    visible: true,
    panoProvider: getOurPhotosphere,
    addressControl: false,
    zoomControl: false
  };
  photosphere.setOptions(photoOptions);
  
  // Now let's create a StreetViewService object.
  var streetViewService = new google.maps.StreetViewService();
  
  // Compute the nearest photosphere to our starting point
  // using the service.
  streetViewService.getPanoramaByLocation(photoOptions.position, radius,
    function(result, status) {
      if(status == google.maps.StreetViewStatus.OK) {
        // Monitor the links_changed event to check if the current
        // photosphere is either a custom one or the starting one
        google.maps.event.addListener(photosphere, 'links_changed',
          function() {
            photosphere.setZoom(zoomLevel);
            makeMyLinks(photosphere, result.location.pano);
          }
        );
      }
    }
  );
  return false;
}

function initializeStereo() {
  // check first to see if we have a smartphone that can be flip flopped around.
  if(window.orientation != undefined){
    var alpha = 0;
    var beta = 0;
    var gamma = 0;
    
    window.ondeviceorientation = function(event){
      // Scan for movement of the phone.
      alpha = Math.round(event.alpha);
      beta = Math.round(event.beta);
      gamma = Math.round(event.gamma);
    }
    
    // Update new coordinates of the view based on where the phone is.
    var myPOV;
    setInterval(function(){
        myPOV = {
          pov: {
            heading: 360-alpha,
            pitch: beta
          }
        };
        photosphere.setOptions(myPOV)
    }, 25);
    
    // OK let's use some Web Virtual Reality!
    // Split our screen when landscape and
    // Sync the maps
    if (window.innerHeight < window.innerWidth) {
      document.getElementById('map-canvas').style.width = '50%';
      // Let's reset the whole original map size
      // and keep those zoom levels in sync
      initialize();
      document.getElementById('map-horizontal-2').style.display = 'block';
      
      // Setting up another streetview with another getter
      var ourStereoMap = new google.maps.Map(document.getElementById('map-horizontal-2'),
        myMapOptions);
        
      myStereoPhotosphere = ourStereoMap.getStreetView();
      myStereoPhotosphere.setOptions(photoOptions);

      // Starting up a new service so we can calculate
      // the nearest pano and register our link updater
      var streetViewService = new google.maps.StreetViewService();
      
      streetViewService.getPanoramaByLocation(photoOptions.position, radius,
        function(result, status) {
          if(status == google.maps.StreetViewStatus.OK) {
            google.maps.event.addListener(myStereoPhotosphere, 'links_changed',
              function() {
                myStereoPhotosphere.setZoom(zoomLevel);
                makeMyLinks(myStereoPhotosphere, result.location.pano);
              });
          }
        });

      setInterval(function(){
        // Monitor the phone position and sync up the panos
        // Here we just check the original pano and then update the
        // stereo map to match it.
        myStereoPhotosphere.setOptions(myPOV);
        myNewPano = getOurPhotosphere(photosphere.pano);
//        if(myNewPano != null){
          myStereoPhotosphere.setPano(photosphere.pano);
//        }
      }, 25);
    } else {
      // If we flip flop back up straight, let's reset and turn
      // off our VR.
      document.getElementById('map-horizontal-2').style.display='none';
      document.getElementById('map-canvas').style.width = '100%';
      initialize();
    }
  }
  return false;
}

function getOurPhotosphere(pano) {
  // this will provide a new photosphere to streetviews
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
          centerHeading: 280,
          getTileUrl: function() {
            return 'https://farm8.staticflickr.com/7494/15539086363_c6402dd7bc_b.jpg';
            }
          }
        };
        break;
    case 'heartLake':
      return {
        location: {
          pano: 'heartLake',
          description: 'Let\'s Go to Shasta',
          latLng: new google.maps.LatLng(40.434362,-121.596019)
        },
        links: [],
        tiles: {
          tileSize: new google.maps.Size(1024, 512),
          worldSize: new google.maps.Size(1024, 512),
          centerHeading: 280,
          getTileUrl: function() {
            return 'https://farm6.staticflickr.com/5712/21505883091_cd24bcf217_b.jpg';
            }
          }
        };
        break;
    case 'montecitoBalcony':
      return {
        location: {
          pano: 'montecitoBalcony',
          description: 'Montecito Lodge - Balcony',
          latLng: new google.maps.LatLng(36.694576,-118.872457)
        },
        links: [],
        tiles: {
          tileSize: new google.maps.Size(1024, 512),
          worldSize: new google.maps.Size(1024, 512),
          centerHeading: 280,
          getTileUrl: function() {
            return 'https://farm1.staticflickr.com/295/18451789334_da965eb5bc_b.jpg';
            }
          }
        };
        break;
    case 'montecitoPool':
      return {
        location: {
          pano: 'montecitoPool',
          description: 'Montecito Lodge - Pool',
          latLng: new google.maps.LatLng(36.694576,-118.872457)
        },
        links: [],
        tiles: {
          tileSize: new google.maps.Size(1024, 512),
          worldSize: new google.maps.Size(1024, 512),
          centerHeading: 280,
          getTileUrl: function() {
            return 'https://farm1.staticflickr.com/303/18451845364_97439f775d_b.jpg';
            }
          }
        };
        break;
      default:
        return null;
  }
}

function makeMyLinks(photosphere, letsStartOurWalk) {
  // Adds links into the street view along with photo info.
  var links = photosphere.getLinks();
  var photoId = photosphere.getPano();
  
  switch(photoId) {
    case letsStartOurWalk:
      links.push({
        heading: 235,
        description: 'My Favorite View',
        pano: 'myFavoriteView'
      });
      break;
    case 'myFavoriteView':
      links.push({
        heading: 55,
        description: 'Back',
        pano: letsStartOurWalk
      },
      {
        heading: 200,
        description: 'Let\'s Go to Shasta!',
        pano: 'heartLake'
      });
      break;
    case 'heartLake':
      links.push({
        heading: 200,
        description: 'Off to Montecito!',
        pano: 'montecitoBalcony'
      },{
        heading: 55,
        description: 'Back to San Carlos',
        pano: 'myFavoriteView'
      });
      break;
    case 'montecitoBalcony':
      links.push({
        heading: 55,
        description: 'To the pool!',
        pano: 'montecitoPool'
      },
      {
        heading: 200,
        description: 'Back to Shasta',
        pano: 'heartLake'
      });
      break;
    case 'montecitoPool':
      links.push({
        heading: 55,
        description: 'Back to the balcony',
        pano: 'montecitoBalcony'
      },
      {
        heading: 200,
        description: 'Home to San Carlos',
        pano: letsStartOurWalk
      });
      break;
    default:
      return;
  }
}

// run our photosphere functions!
google.maps.event.addDomListener(window, 'load', initialize);
window.addEventListener("orientationchange", function(){
    initializeStereo();
  }, false);
