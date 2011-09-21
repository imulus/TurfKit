@module "Turf.Client", ->
  
  class @Filter

    @markers = []
    @results = []
    @applied = {}

    @reset = ->
      @results = @markers
      @applied = {}


    constructor: (@$container, @params)->
      @values = []
      @key = @params.key  

      for marker in Filter.markers
        value = marker.properties[@key]
        if value in @values is false
          @values.push value

      do @build

    build: ->
      @$label = $('<label />').text @params.label
      @$select = $('<select />')
      @$select.append $('<option />').attr('value','all').text 'All'
      
      for value in @values      
        @$select.append "<option value='" + value + "'>" + value + "</option>"    
      
      @$container.append @$label, @$select





    change : (callback)->
      @$select.change =>
        Filter.applied[@key] = @$select.find('option:selected').val()

        results = []

        for marker in Filter.markers
          include = true
          
          for key, value of Filter.applied
            if value is 'all'
              include = true
              break
            if marker.properties[key] isnt value
              include = false
            
          results.push marker if include

        Filter.results = results

        callback(Filter.results)
     
         
    reset : ->
      @values = {}
      @$select.empty()
      @$select.append "<option value='all'>All</option>"


