class Point
  constructor: (@lat, @lng) ->
    @latLng = new google.maps.LatLng parseFloat(@lat), parseFloat(@lng)
