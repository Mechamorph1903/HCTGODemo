//so Arcgis, Hattiesburgs main live tracker gets and display coordinates using the web mercartor system which Instead of degrees, \
// it measures in meters from the center of the Earth. it is used for 3D maps, google maps also uses this
// However, our system w OpenSTreet and mostly what evryone else uses would be the LAt/Lng system, which is for 2D projections.
//AFter getting the coordinates from arcgis we need to convert web mercartoe coordinates to lat/lng. this is what this function does

function webMercatorToLatLng(x, y) {
  const lng = (x / 20037508.34) * 180
  const lat = Math.atan(Math.exp((y / 20037508.34) * Math.PI)) * (360 / Math.PI) - 90
  return [lat, lng]
}