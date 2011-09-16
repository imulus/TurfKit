/*
 * Extended API for Google Maps v3
 *
 * by JosÃ© Fernando Calcerrada.
 *
 * Licensed under the GPL licenses:
 * http://www.gnu.org/licenses/gpl.html
 *
 */


// LatLng
/******************************************************************************/
google.maps.LatLng.prototype.distanceFrom = function(latlng) {
  var lat = [this.lat(), latlng.lat()]
  var lng = [this.lng(), latlng.lng()]

  //var R = 6371; // km (change this constant to get miles)
  var R = 6378137; // In meters
  var dLat = (lat[1]-lat[0]) * Math.PI / 180;
  var dLng = (lng[1]-lng[0]) * Math.PI / 180;
  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
  Math.cos(lat[0] * Math.PI / 180 ) * Math.cos(lat[1] * Math.PI / 180 ) *
  Math.sin(dLng/2) * Math.sin(dLng/2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c;

  return Math.round(d);
}
// TODO: revisar para 179, -179
google.maps.LatLng.prototype.getMiddle = function(latlng) {
  var lat = (this.lat()+latlng.lat())/2;
  var lng = this.lng()-latlng.lng();      // Distance between

  // To control the problem with +-180 degrees.
  if (lng <= 180 && lng >= -180) {
    lng = (this.lng()+latlng.lng())/2;
  } else {
    lng = (this.lng()+latlng.lng()+360)/2;
  }

  return new google.maps.LatLng(lat, lng)
}



// Marker
/******************************************************************************/
google.maps.Marker.prototype.distanceFrom = function(marker) {
  return this.getPosition().distanceFrom(marker.getPosition());
}

google.maps.Marker.prototype.getMiddle = function(marker) {
  return this.getPosition().getMiddle(marker.getPosition());
}


// Polyline
/******************************************************************************/
google.maps.Polyline.prototype.deleteVertex = function(i) {
  this.getPath().removeAt(i);
}

google.maps.Polyline.prototype.getBounds = function() {
  var latlngBounds = new google.maps.LatLngBounds();
  var path = this.getPath();

  for (var i = 0; i < path.getLength(); i++) {
    latlngBounds.extend(path.getAt(i));
  }

  return latlngBounds;
}

google.maps.Polyline.prototype.getLength = function() {
  var d = 0;
  var path = this.getPath();
  var latlng;

  for (var i = 0; i < path.getLength()-1; i++) {
    latlng = [path.getAt(i), path.getAt(i+1)]
    d += latlng[0].distanceFrom(latlng[1]);
  }

  return d;
}

google.maps.Polyline.prototype.getVertex = function(i) {
  return this.getPath().getAt(i);
}

google.maps.Polyline.prototype.getVertexCount = function() {
  return this.getPath().getLength();
}

google.maps.Polyline.prototype.getVisible = function() {
  return (this.getMap()) ? true : false;
}

google.maps.Polyline.prototype.insertVertex = function(i, latlng) {
  this.getPath().insertAt(i, latlng);
}

google.maps.Polyline.prototype.lastMap = false;

google.maps.Polyline.prototype.setVertex = function(i, latlng) {
  this.getPath().setAt(i, latlng);
}

google.maps.Polyline.prototype.setVisible = function(visible) {
  if (visible === true && !this.getVisible()) {
    this.setMap(this.lastMap);

  } else if (visible === false && this.getVisible()) {
    this.lastMap = this.getMap();
    this.setMap(null);
  }
}



// Polygon
/******************************************************************************/
google.maps.Polygon.prototype.deleteVertex = function(i) {
  this.getPath().removeAt(i);
}

google.maps.Polygon.prototype.getBounds = function() {
  var latlngBounds = new google.maps.LatLngBounds();
  var path = this.getPath();

  for (var i = 0; i < path.getLength(); i++) {
    latlngBounds.extend(path.getAt(i));
  }

  return latlngBounds;
}

google.maps.Polygon.prototype.getPerimeter = function() {
  var d = 0;
  var path = this.getPath();
  var latlng, first;

  if (path.getLength()) {
    first = path.getAt(1);
  }

  for (var i = 0; i < path.getLength(); i++) {
    if (i < path.getLength()-1) {
      latlng = [path.getAt(i), path.getAt(i+1)];
    } else {
      if (first == path.getAt[i]) {
        break;
      } else {
        latlng = [path.getAt(i), path.getAt(0)];
      }
    }
    d += latlng[0].distanceFrom(latlng[1]);
  }

  return d;
}

google.maps.Polygon.prototype.getVertex = function(i) {
  return this.getPath().getAt(i);
}

google.maps.Polygon.prototype.getVertexCount = function () {
  var path = this.getPath();
  var length = path.getLength();
  if (!path.getAt(0).equals(path.getAt(length-1))) {
    return length;
  } else {
    return length-1;
  }
}

google.maps.Polygon.prototype.getVisible = function() {
  return (this.getMap()) ? true : false;
}

google.maps.Polygon.prototype.insertVertex = function(i, latlng) {
  this.getPath().insertAt(i, latlng);
}

google.maps.Polygon.prototype.lastMap = false;

google.maps.Polygon.prototype.setVertex = function(i, latlng) {
  this.getPath().setAt(i, latlng);
}

google.maps.Polygon.prototype.setVisible = function(visible) {
  if (visible === true && !this.getVisible()) {
    this.setMap(this.lastMap);

  } else if (visible === false && this.getVisible()) {
    this.lastMap = this.getMap();
    this.setMap(null);
  }
}

window.module = function(name) {
  return window[name] = window[name] || {};
};


module('Turf');
Turf.VERSION = '1.0.0';


var Filter;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
Filter = (function() {
  function Filter(data, $form) {
    var $label;
    $label = $('<label />').text(data.label);
    this.$element = $('<select />');
    this.$element.append($('<option />').attr('value', 'all').text('All'));
    $form.prepend($label, this.$element);
    this.field = data.fieldKey;
    this.values = {};
  }
  Filter.prototype.add = function(value) {
    if (!this.values[value]) {
      this.$element.append("<option value='" + value + "'>" + value + "</option>");
      return this.values[value] = true;
    }
  };
  Filter.prototype.change = function(callback) {
    return this.$element.change(__bind(function() {
      var results, value;
      value = this.$element.find('option:selected').val();
      results = this.filter(this.field, value);
      return callback(results);
    }, this));
  };
  Filter.prototype.filter = function(field, value) {
    var index, item, property, results, _i, _len, _len2, _ref, _ref2;
    results = [];
    _ref = Filter.data;
    for (index = 0, _len = _ref.length; index < _len; index++) {
      item = _ref[index];
      _ref2 = item.customProperties;
      for (_i = 0, _len2 = _ref2.length; _i < _len2; _i++) {
        property = _ref2[_i];
        if (property.Key === field && (property.Value === value || value === 'all')) {
          results.push(item);
        }
      }
    }
    return results;
  };
  Filter.prototype.reset = function() {
    this.values = {};
    this.$element.empty();
    return this.$element.append("<option value='all'>All</option>");
  };
  return Filter;
})();


var Results;
Results = (function() {
  function Results($table) {
    this.$table = $table;
    this.$head = this.$table.find('thead');
    this.$body = this.$table.find('tbody');
    this.total = 0;
  }
  Results.prototype.reset = function() {
    this.$body.empty();
    return this.total = 0;
  };
  Results.prototype.add = function(node) {
    this.total++;
    return this.addRow(node);
  };
  Results.prototype.observe = function(action, callback) {
    return this.$body.find('tr').live(action, function() {
      var id;
      id = $(this).attr('data-marker-id');
      return callback(id);
    });
  };
  Results.prototype.addRow = function(node) {
    var $row, column, property, _i, _j, _len, _len2, _ref, _ref2;
    $row = $('<tr />').attr('data-marker-id', node.id);
    _ref = this.proto;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      column = _ref[_i];
      _ref2 = node.customProperties;
      for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
        property = _ref2[_j];
        if (property.Key === column) {
          $row.append($('<td />').html(property.Value));
        }
      }
    }
    return this.$body.append($row);
  };
  Results.prototype.buildHead = function(data) {
    var $cell, $row, column, _i, _len, _ref;
    this.proto = [];
    $row = $('<tr />');
    _ref = data.table;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      column = _ref[_i];
      this.proto.push(column.Key);
      $cell = $('<td />').html(column.Value);
      $row.append($cell);
    }
    return this.$head.append($row);
  };
  return Results;
})();


var Point;
Point = (function() {
  function Point(lat, lng) {
    this.lat = lat;
    this.lng = lng;
    this.latLng = new google.maps.LatLng(parseFloat(this.lat), parseFloat(this.lng));
  }
  return Point;
})();


var InfoWindow;
window.InfoWindows = [];
InfoWindow = (function() {
  function InfoWindow(map, marker, params) {
    this.map = map;
    this.marker = marker;
    InfoWindows.push(this);
    this.title = params.title, this.body = params.body;
    this.build();
  }
  InfoWindow.prototype.settings = {};
  InfoWindow.prototype.build = function() {
    var content;
    content = "<div class='infowindow-content'>";
    if (this.title) {
      content += "<div class='title'>" + this.title + "</div>";
    }
    if (this.body) {
      content += "<div class='body'>" + this.body + "</div>";
    }
    content += "</div>";
    this.settings.content = content;
    return this.window = new google.maps.InfoWindow(this.settings);
  };
  InfoWindow.prototype.open = function() {
    this.closeAll();
    return this.window.open(this.map.canvas, this.marker);
  };
  InfoWindow.prototype.close = function() {
    return this.window.close();
  };
  InfoWindow.prototype.closeAll = function() {
    var _i, _len, _results, _window;
    _results = [];
    for (_i = 0, _len = InfoWindows.length; _i < _len; _i++) {
      _window = InfoWindows[_i];
      _results.push(_window.close());
    }
    return _results;
  };
  return InfoWindow;
})();


var Marker;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
Marker = (function() {
  function Marker(map, params) {
    var shadow;
    this.map = map;
    this.hidden = false;
    this.id = params.id;
    this.center = new Point(params.lat, params.lng);
    this.infoWindow = null;
    this.color = params.color || '#F0F';
    shadow = new google.maps.MarkerImage('http://chart.apis.google.com/chart?chst=d_map_pin_shadow', new google.maps.Size(40, 37), new google.maps.Point(0, 0), new google.maps.Point(0, 37));
    this.marker = new google.maps.Marker({
      position: this.center.latLng,
      map: this.map.canvas,
      shadow: shadow
    });
    this.setColor(this.color);
    if (params.infoWindow) {
      this.setInfoWindow(params.infoWindow);
    }
    this.show();
    this.observe();
  }
  Marker.prototype.observe = function() {
    if (this.infoWindow !== null) {
      return google.maps.event.addListener(this.marker, 'mouseover', __bind(function() {
        return this.infoWindow.open(this.marker);
      }, this));
    }
  };
  Marker.prototype.show = function() {
    this.marker.setMap(this.map.canvas);
    return this.hidden = false;
  };
  Marker.prototype.hide = function() {
    this.marker.setMap(null);
    if (this.infoWindow != null) {
      this.infoWindow.closeAll();
    }
    return this.hidden = true;
  };
  Marker.prototype.setColor = function(color) {
    var height, icon, url, width;
    this.color = color;
    url = "http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=A|" + (this.color.substring(1)) + "|" + (this.color.substring(1));
    width = 21;
    height = 34;
    icon = new google.maps.MarkerImage(url, new google.maps.Size(width, height), new google.maps.Point(0, 0), new google.maps.Point(0, height));
    return this.marker.setOptions({
      icon: icon
    });
  };
  Marker.prototype.setInfoWindow = function(params) {
    this.infoWindow = new InfoWindow(this.map, this.marker, params);
    return this.observe();
  };
  return Marker;
})();


var Map;
Map = (function() {
  Map.prototype.settings = {
    panControl: false,
    zoomControl: false,
    mapTypeControl: false,
    scaleControl: false,
    streetViewControl: false,
    overviewMapControl: false,
    mapTypeControl: false
  };
  function Map(params, element) {
    this.element = element;
    this.canvas = null;
    this.center = new Point(params.lat, params.lng);
    this.markers = {};
    this.settings.center = this.center.latLng;
    this.settings.mapTypeId = google.maps.MapTypeId[params.type] || google.maps.MapTypeId['TERRAIN'];
    this.settings.zoom = parseInt(params.zoom || 10);
    if (this.element) {
      this.setCanvas(this.element);
    }
    if (params.markers) {
      this.addMarkers(params.markers);
    }
  }
  Map.prototype.setCanvas = function(element) {
    return this.canvas = new google.maps.Map(document.getElementById(element), this.settings);
  };
  Map.prototype.setCenter = function(lat, lng) {
    this.center = new Point(params.lat, params.lng);
    return this.recenter();
  };
  Map.prototype.recenter = function() {
    return this.canvas.setCenter(this.center);
  };
  Map.prototype.reset = function() {
    this.recenter();
    return this.canvas.setZoom(parseInt(this.settings.zoom));
  };
  Map.prototype.addMarkers = function(markers) {
    var marker, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = markers.length; _i < _len; _i++) {
      marker = markers[_i];
      _results.push(this.addMarker(marker));
    }
    return _results;
  };
  Map.prototype.addMarker = function(params) {
    var marker;
    marker = new Marker(this, params);
    this.markers[marker.id] = marker;
    return marker;
  };
  Map.prototype.hideMarkers = function(deleteMarkers) {
    var index, marker, _ref;
    _ref = this.markers;
    for (index in _ref) {
      marker = _ref[index];
      marker.hide();
    }
    if (deleteMarkers) {
      return this.deleteMarkers();
    }
  };
  Map.prototype.deleteMarkers = function() {
    var index, marker, _ref, _results;
    _ref = this.markers;
    _results = [];
    for (marker in _ref) {
      index = _ref[marker];
      _results.push(delete marker);
    }
    return _results;
  };
  return Map;
})();


