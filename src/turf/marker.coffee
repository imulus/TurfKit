class Marker

  constructor: (@map, params)->
    @hidden = false
    {@id} = params
    @center = new Point params.lat, params.lng
    @infoWindow = null
    @color = params.color || '#F0F'
    shadow = new google.maps.MarkerImage 'http://chart.apis.google.com/chart?chst=d_map_pin_shadow',
      new google.maps.Size(40, 37), new google.maps.Point(0,0), new google.maps.Point(0, 37)

    @marker = new google.maps.Marker
      position  : @center.latLng
      map       : @map.canvas
      shadow    : shadow

    @setColor @color
    @setInfoWindow params.infoWindow if params.infoWindow
    do @show
    do @observe
    

  observe : ->
    if @infoWindow isnt null
      google.maps.event.addListener @marker, 'mouseover', =>
        @infoWindow.open @marker

  show : -> 
    @marker.setMap @map.canvas
    @hidden = false


  hide : ->
    @marker.setMap null
    @infoWindow.closeAll() if @infoWindow?
    @hidden = true

  
  setColor : (color)->
    @color  = color
    url     = "http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=A|#{@color.substring(1)}|#{@color.substring(1)}"
    width   = 21
    height  = 34

    icon = new google.maps.MarkerImage(url,
         new google.maps.Size(width, height),
         new google.maps.Point(0,0),
         new google.maps.Point(0, height))

    @marker.setOptions icon: icon


  setInfoWindow : (params)->
    @infoWindow = new InfoWindow @map, @marker, params
    do @observe


