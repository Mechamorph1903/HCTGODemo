//so Arcgis, Hattiesburgs main live tracker gets and display coordinates using the web mercartor system which Instead of degrees, \
// it measures in meters from the center of the Earth. it is used for 3D maps, google maps also uses this
// However, our system w OpenSTreet and mostly what evryone else uses would be the LAt/Lng system, which is for 2D projections.
//AFter getting the coordinates from arcgis we need to convert web mercartoe coordinates to lat/lng. this is what this function does

export  function webMercatorToLatLng(x, y) {
  const lng = (x / 20037508.34) * 180
  const lat = Math.atan(Math.exp((y / 20037508.34) * Math.PI)) * (360 / Math.PI) - 90
  return [lat, lng]
}



/**
 * //this is the get the centroid of the route to use as the center of the map container. just a rough estimate
 * A centroid is the geometric center or mean position of all points in a shape or object.  
 * It represents the average location of the figure's area or volume and is often referred to as 
 * the center of mass or center of gravity when the object has uniform density. 
 */
 export default function getRouteCentroid(stops){
  let total = stops.length
  let avgLat = 0
  let avgLng = 0

  for(const stop of stops){
    avgLat += stop.coords[0]
    avgLng += stop.coords[1]
  }

  avgLat = avgLat/total
  avgLng = avgLng/total

  return [avgLat, avgLng]
}