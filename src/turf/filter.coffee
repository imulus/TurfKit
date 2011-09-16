module 'Turf'

Turf.Filter = class

  constructor: (data, $form)->
    $label = $('<label />').text data.label
    @$element = $('<select />')
    @$element.append $('<option />').attr('value','all').text 'All'
    $form.prepend $label, @$element
    @field = data.fieldKey
    @values = {}


  add: (value)->
    if not @values[value]
      @$element.append "<option value='" + value + "'>" + value + "</option>"
      @values[value] = true


  change : (callback)->
    @$element.change =>
      value = @$element.find('option:selected').val()
      results = @filter @field, value
      callback results


  filter : (field, value)->
    results = []
    for item, index in Filter.data
      for property in item.customProperties
        if property.Key is field and (property.Value is value or value == 'all')
          results.push item
    return results
         
         
  reset : ->
    @values = {}
    @$element.empty()
    @$element.append "<option value='all'>All</option>"


