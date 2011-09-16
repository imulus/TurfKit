module 'Turf'

Turf.Point = class

  constructor: (@lat, @lng) ->
    @latLng = new google.maps.LatLng parseFloat(@lat), parseFloat(@lng)
