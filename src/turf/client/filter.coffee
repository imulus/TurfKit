@module "Turf.Client", ->
  
  class @Filter

    constructor: ($container, params, @points)->
      @values = {}
      @key = params.key
      $label = $('<label />').text params.label
      @$element = $('<select />')
      @$element.append $('<option />').attr('value','all').text 'All'
      $container.append $label, @$element

    add: (value)->
      if not @values[value]
        @$element.append "<option value='" + value + "'>" + value + "</option>"
        @values[value] = true


    change : (callback)->
      @$element.change =>
        value = @$element.find('option:selected').val()
        results = @filter value
        callback results


    filter : (value)->
      results = []
      for point in @points
        results.push point if point.properties[@key] is value or value is 'all'
      return results
         
         
    reset : ->
      @values = {}
      @$element.empty()
      @$element.append "<option value='all'>All</option>"


