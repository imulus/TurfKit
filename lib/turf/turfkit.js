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

this.module = function(names, fn) {
  var space, _name;
  if (typeof names === 'string') {
    names = names.split('.');
  }
  space = this[_name = names.shift()] || (this[_name] = {});
  space.module || (space.module = this.module);
  if (names.length) {
    return space.module(names, fn);
  } else {
    return fn.call(space);
  }
};


this.module("Turf.Core", function() {
  return this.InfoWindow = (function() {
    InfoWindow.windows = [];
    function InfoWindow(map, marker, params) {
      this.map = map;
      this.marker = marker;
      InfoWindow.windows.push(this);
      this.title = params.title, this.body = params.body;
      this.settings = {};
      this.build();
    }
    InfoWindow.prototype.build = function() {
      var content;
      content = "<div class='infowindow'>";
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
      var win, _i, _len, _ref, _results;
      _ref = InfoWindow.windows;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        win = _ref[_i];
        _results.push(win.close());
      }
      return _results;
    };
    return InfoWindow;
  })();
});


this.module("Turf.Core", function() {
  return this.Map = (function() {
    Map.prototype.settings = {
      panControl: false,
      zoomControl: false,
      mapTypeControl: false,
      scaleControl: false,
      streetViewControl: false,
      overviewMapControl: false,
      mapTypeControl: false
    };
    function Map(element, params) {
      this.element = element;
      this.canvas = null;
      this.center = new Turf.Core.Point(params.lat, params.lng);
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
      return this.canvas = new google.maps.Map(element, this.settings);
    };
    Map.prototype.setCenter = function(lat, lng) {
      this.center = new Turf.Core.Point(params.lat, params.lng);
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
      marker = new Turf.Core.Marker(this, params);
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
});


var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
this.module("Turf.Core", function() {
  return this.Marker = (function() {
    function Marker(map, params) {
      var shadow;
      this.map = map;
      this.hidden = false;
      this.id = params.id;
      this.center = new Turf.Core.Point(params.lat, params.lng);
      this.infoWindow = null;
      this.color = params.color || '#4daed8';
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
      this.infoWindow = new Turf.Core.InfoWindow(this.map, this.marker, params);
      return this.observe();
    };
    return Marker;
  })();
});


this.module("Turf.Core", function() {
  return this.Point = (function() {
    function Point(lat, lng) {
      this.lat = lat;
      this.lng = lng;
      this.latLng = new google.maps.LatLng(parseFloat(this.lat), parseFloat(this.lng));
    }
    return Point;
  })();
});


var __indexOf = Array.prototype.indexOf || function(item) {
  for (var i = 0, l = this.length; i < l; i++) {
    if (this[i] === item) return i;
  }
  return -1;
}, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
this.module("Turf.Client", function() {
  return this.Filter = (function() {
    Filter.markers = [];
    Filter.results = [];
    Filter.applied = {};
    Filter.reset = function() {
      this.results = this.markers;
      return this.applied = {};
    };
    function Filter($container, params) {
      var marker, value, _i, _len, _ref;
      this.$container = $container;
      this.params = params;
      this.values = [];
      this.key = this.params.key;
      _ref = Filter.markers;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        marker = _ref[_i];
        value = marker.properties[this.key];
        if (__indexOf.call(this.values, value) >= 0 === false) {
          this.values.push(value);
        }
      }
      this.build();
    }
    Filter.prototype.build = function() {
      var value, _i, _len, _ref;
      this.$label = $('<label />').text(this.params.label);
      this.$select = $('<select />');
      this.$select.append($('<option />').attr('value', 'all').text('All'));
      _ref = this.values;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        value = _ref[_i];
        this.$select.append("<option value='" + value + "'>" + value + "</option>");
      }
      return this.$container.append(this.$label, this.$select);
    };
    Filter.prototype.change = function(callback) {
      return this.$select.change(__bind(function() {
        var key, marker, results, rules_met, total_rules, value, _i, _len, _ref, _ref2, _ref3;
        Filter.applied[this.key] = this.$select.find('option:selected').val();
        results = [];
        total_rules = 0;
        _ref = Filter.applied;
        for (key in _ref) {
          value = _ref[key];
          total_rules++;
        }
        _ref2 = Filter.markers;
        for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
          marker = _ref2[_i];
          rules_met = 0;
          _ref3 = Filter.applied;
          for (key in _ref3) {
            value = _ref3[key];
            if (marker.properties[key] === value || value === 'all') {
              rules_met++;
            }
          }
          if (rules_met === total_rules) {
            results.push(marker);
          }
        }
        Filter.results = results;
        return callback(Filter.results);
      }, this));
    };
    return Filter;
  })();
});


this.module("Turf.Client", function() {
  return this.ResultsTable = (function() {
    function ResultsTable($table, data) {
      this.$table = $table;
      this.data = data;
      this.$head = this.$table.find('thead');
      this.$body = this.$table.find('tbody');
      this.proto = [];
      this.total = 0;
      this.build();
    }
    ResultsTable.prototype.build = function() {
      var $cell, $row, key, value, _ref;
      $row = $('<tr />');
      _ref = this.data.table;
      for (key in _ref) {
        value = _ref[key];
        this.proto.push(key);
        $cell = $('<td />').html(value);
        $row.append($cell);
      }
      return this.$head.append($row);
    };
    ResultsTable.prototype.reset = function() {
      this.$body.empty();
      return this.total = 0;
    };
    ResultsTable.prototype.add = function(marker) {
      this.total++;
      return this.addRow(marker);
    };
    ResultsTable.prototype.observe = function(action, callback) {
      return this.$body.find('tr').live(action, function() {
        var id;
        id = $(this).attr('data-marker-id');
        return callback(id);
      });
    };
    ResultsTable.prototype.addRow = function(marker) {
      var $row, key, _i, _len, _ref;
      $row = $('<tr />').attr('data-marker-id', marker.id);
      _ref = this.proto;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        key = _ref[_i];
        $row.append($('<td />').html(marker.properties[key]));
      }
      return this.$body.append($row);
    };
    return ResultsTable;
  })();
});


var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
this.module("Turf.Client", function() {
  return this.Application = (function() {
    function Application(data) {
      this.$map = $("#map");
      if (typeof data === 'string') {
        $.ajax({
          url: data,
          dataType: 'json',
          success: __bind(function(data) {
            this.data = data;
            return this.build();
          }, this)
        });
      } else {
        this.data = data;
        this.build();
      }
    }
    Application.prototype.build = function() {
      var Filter, filter, json, marker, _filter, _i, _j, _len, _len2, _ref, _ref2, _results;
      json = this.data;
      Filter = Turf.Client.Filter;
      Filter.markers = json.markers;
      Filter.results = json.markers;
      this.map = new Turf.Core.Map(this.$map.get(0), json.map);
      this.results = new Turf.Client.ResultsTable($('#results'), json);
      this.results.reset();
      this.results.observe('hover', __bind(function(id) {
        var marker;
        marker = this.map.markers[id];
        return marker.infoWindow.open();
      }, this));
      this.filters = {};
      _ref = json.filters;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        _filter = _ref[_i];
        filter = new Filter($("#filters"), _filter);
        filter.change(__bind(function(markers) {
          var marker, _j, _len2, _results;
          this.results.reset();
          this.map.hideMarkers(true);
          _results = [];
          for (_j = 0, _len2 = markers.length; _j < _len2; _j++) {
            marker = markers[_j];
            _results.push(this.addMarker(marker));
          }
          return _results;
        }, this));
        this.filters[_filter.key] = filter;
      }
      _ref2 = json.markers;
      _results = [];
      for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
        marker = _ref2[_j];
        _results.push(this.addMarker(marker));
      }
      return _results;
    };
    Application.prototype.addMarker = function(marker) {
      this.results.add(marker);
      return this.map.addMarker({
        id: marker.id,
        lat: marker.lat,
        lng: marker.lng,
        infoWindow: this.makeInfoWindow(marker)
      });
    };
    Application.prototype.makeInfoWindow = function(marker) {
      var body, pattern, swap, title;
      swap = function(key) {
        return marker.properties[key.replace(/[{{}}]+/g, "")] || "";
      };
      pattern = /{{[^{}]+}}/g;
      title = this.data.infoWindow.title.replace(pattern, swap);
      body = this.data.infoWindow.body.replace(pattern, swap);
      return {
        title: title,
        body: body
      };
    };
    return Application;
  })();
});


