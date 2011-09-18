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


    add : (point)->
      @total++
      @addRow point

    observe : (action, callback) ->
      @$body.find('tr').live action, ->
        id = $(this).attr 'data-marker-id'
        callback id


    addRow: (point)->
      $row = $('<tr />').attr 'data-marker-id', point.id

      for key in @proto
        $row.append $('<td />').html point.properties[key]

      @$body.append $row