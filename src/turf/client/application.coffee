@module "Turf.Client", ->

  class @Application

    constructor: (data)->
      @$map = $("#map")

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
      Filter = Turf.Client.Filter
      Filter.markers = json.markers
      Filter.results = json.markers

      @map = new Turf.Core.Map @$map.get(0), json.map
      @results = new Turf.Client.ResultsTable $('#results'), json
      @results.reset()
      @results.observe 'hover', (id)=>
        marker = @map.markers[id]
        marker.infoWindow.open()

      @filters = {}

      for _filter in json.filters
        filter = new Filter $("#filters"), _filter
        filter.change (markers) =>
          @results.reset()
          @map.hideMarkers true
          @addMarker marker for marker in markers
        @filters[_filter.key] = filter

      @addMarker marker for marker in json.markers


    addMarker : (marker)->
      @results.add marker

      @map.addMarker
        id  : marker.id
        lat : marker.lat
        lng : marker.lng
        infoWindow: @makeInfoWindow marker


    makeInfoWindow : (marker)->
      swap = (key)-> marker.properties[key.replace(/[{{}}]+/g, "")] or ""
      pattern = /{{[^{}]+}}/g
      title  = @data.infoWindow.title.replace pattern, swap
      body   = @data.infoWindow.body.replace pattern, swap
      return {title: title, body: body}





