module 'Turf'

Turf.ResultsTable = class

  constructor: (@$table)->
    @$head = @$table.find 'thead'
    @$body = @$table.find 'tbody'
    @total = 0

  reset: ->
    @$body.empty()
    @total = 0

  add : (node)->
    @total++
    @addRow node

  observe : (action, callback) ->
    @$body.find('tr').live action, ->
      id = $(this).attr 'data-marker-id'
      callback id

  addRow: (node)->
    $row = $('<tr />').attr 'data-marker-id', node.id

    for column in @proto
      for property in node.customProperties
        if property.Key is column
          $row.append $('<td />').html property.Value

    @$body.append $row

  buildHead : (data)->
    @proto = []
    $row = $('<tr />')

    for column in data.table
      @proto.push column.Key
      $cell = $('<td />').html column.Value
      $row.append($cell)

    @$head.append $row
