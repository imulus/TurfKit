module 'Turf'

Turf.InfoWindow = class InfoWindow

  @windows = []

  constructor : (@map, @marker, params)->
    InfoWindow.windows.push this
    {@title, @body} = params
    @settings = {}
    do @build


  build : ->
    content = "<div class='infowindow-content'>"
    if @title then content += "<div class='title'>#{@title}</div>"
    if @body then content += "<div class='body'>#{@body}</div>"
    content += "</div>";
    
    @settings.content = content
    
    @window = new google.maps.InfoWindow @settings


  open : -> 
    do @closeAll
    @window.open @map.canvas, @marker


  close : -> 
    @window.close()


  closeAll : ->
    win.close() for win in InfoWindow.windows

