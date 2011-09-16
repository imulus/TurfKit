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