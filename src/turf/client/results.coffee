@module "Turf.Client", ->

  class @ResultsTable

    constructor: (@$table, @data)->
      @$head  = @$table.find('thead')
      @$body  = @$table.find('tbody')
      @proto = []
      @total = 0
      do @build

    build : ->
      $row = $('<tr />')
      for key, value of @data.table
        @proto.push key
        $cell = $('<td />').html value
        $row.append($cell)
      @$head.append $row


    reset: ->
      @$body.empty()
      @total = 0


    add : (marker)->
      @total++
      @addRow marker

    observe : (action, callback) ->
      @$body.find('tr').live action, ->
        id = $(this).attr 'data-marker-id'
        callback id


    addRow: (marker)->
      $row = $('<tr />').attr 'data-marker-id', marker.id

      for key in @proto
        $row.append $('<td />').html marker.properties[key]

      @$body.append $row