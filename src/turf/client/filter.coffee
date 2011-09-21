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
        total_rules = 0
        total_rules++ for key, value of Filter.applied

        for marker in Filter.markers
          rules_met = 0
          for key, value of Filter.applied
            if marker.properties[key] is value or value is 'all'
              rules_met++
          results.push marker if rules_met is total_rules

        Filter.results = results
        callback(Filter.results)
     
         
