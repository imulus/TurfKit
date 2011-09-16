module 'Turf'

Turf.Map = class

  settings: 
    panControl          : false
    zoomControl         : false
    mapTypeControl      : false
    scaleControl        : false
    streetViewControl   : false
    overviewMapControl  : false
    mapTypeControl      : false

  constructor: (params, @element)->
    @canvas = null
    @center = new Turf.Point params.lat, params.lng
    @markers = {}
    @settings.center      = @center.latLng
    @settings.mapTypeId   = google.maps.MapTypeId[params.type] or google.maps.MapTypeId['TERRAIN']
    @settings.zoom        = parseInt params.zoom or 10
    @setCanvas @element if @element
    @addMarkers params.markers if params.markers
  
  setCanvas: (element)-> @canvas = new google.maps.Map document.getElementById(element), @settings

  setCenter: (lat, lng) ->
    @center = new Turf.Point params.lat, params.lng
    do @recenter

  recenter: -> @canvas.setCenter @center

  reset: ->
    do @recenter
    @canvas.setZoom parseInt @settings.zoom

  addMarkers: (markers)->
    @addMarker marker for marker in markers

  addMarker: (params)->
    marker = new Turf.Marker this, params
    @markers[marker.id] = marker
    return marker
    
  hideMarkers : (deleteMarkers)->
    marker.hide() for index, marker of @markers
    if deleteMarkers
      do @deleteMarkers

  deleteMarkers : ->
    for marker, index of @markers    
      delete marker
