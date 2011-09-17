module 'Turf'

Turf.Application = class Turf.Application

  constructor: (@wrapper_id, data)->
    @$wrapper = $("##{@wrapper_id}");

    if typeof data is 'string'
      $.ajax
        url: data,
        dataType: 'json',
        success: (data) =>
          @data = data
          do @build
    else
      @data = data
      do @build


  build : ->
    json = @data
    @map = new Turf.Map "map", json.map
    @results = new Turf.ResultsTable $('#results'), json
    @results.reset()
    @results.observe 'hover', (id)=>
      marker = @map.markers[id]
      marker.infoWindow.open()

    @filters = []

    for _filter in json.filters
      filter = new Turf.Filter $("#filters"), _filter, json.points

      filter.change (points)=>
        console.log points
        @results.reset()
        @map.hideMarkers true
        @addPoint point for point in points

      @filters.push filter

    filter.reset() for filter in @filters
    @addPoint point for point in json.points


  addPoint : (point)->
    for filter in @filters
      for key, value of point.properties
        filter.add value if key is filter.key

    @results.add point

    @map.addMarker
      id  : point.id
      lat : point.lat
      lng : point.lng
      infoWindow: @makeInfoWindow point
        

  makeInfoWindow : (point)->
    swap = (key)-> point.properties[key.replace(/[{{}}]+/g, "")] or ""
    pattern = /{{[^{}]+}}/g
    title  = @data.infoWindow.title.replace pattern, swap
    body   = @data.infoWindow.body.replace pattern, swap
    return {title: title, body: body}





