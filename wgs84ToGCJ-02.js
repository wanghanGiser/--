/**
 * 计算WGS84转火星坐标系
 */
var CalDev = function (WgLon, WgLat) {
  var ee = 0.00669342162296594323;
  var a = 6378245.0;
  if (IsOutOfChina(WgLon, WgLat)) {
    return {
      Lon: 0,
      Lat: 0
    };
  }
  var Lat = CalLat(WgLon - 105.0, WgLat - 35.0);
  var Lon = CalLon(WgLon - 105.0, WgLat - 35.0);
  var RadLat = WgLat / 180.0 * Math.PI;
  var Magic = Math.sin(RadLat);
  Magic = 1 - ee * Magic * Magic;
  var sqrtMagic = Math.sqrt(Magic);
  Lat = (Lat * 180.0) / ((a * (1 - ee)) / (Magic * sqrtMagic) * Math.PI);
  Lon = (Lon * 180.0) / (a / sqrtMagic * Math.cos(RadLat) * Math.PI);
  return {
    Lon: Lon,
    Lat: Lat
  };
}
/******判断坐标是否在国外******/
var IsOutOfChina = function (Lon, Lat) {
  if (Lon < 72.004 || Lon > 137.8347) {
    return true;
  }
  if (Lat < 0.8293 || Lat > 55.8271) {
    return true;
  }
  return false;
}
/****** 计算纬度******/
var CalLat = function (X, Y) {
  var ResultLat = -100.0 + 2.0 * X + 3.0 * Y + 0.2 * Y * Y + 0.1 * X * Y + 0.2 * Math.sqrt(Math.abs(X));
  ResultLat += (20.0 * Math.sin(6.0 * X * Math.PI) + 20.0 * Math.sin(2.0 * X * Math.PI)) * 2.0 / 3.0;
  ResultLat += (20.0 * Math.sin(Y * Math.PI) + 40.0 * Math.sin(Y / 3.0 * Math.PI)) * 2.0 / 3.0;
  ResultLat += (160.0 * Math.sin(Y / 12.0 * Math.PI) + 320 * Math.sin(Y * Math.PI / 30.0)) * 2.0 / 3.0;
  return ResultLat;
}
/******计算经度******/
var CalLon = function (X, Y) {
  var ResultLon = 300.0 + X + 2.0 * Y + 0.1 * X * X + 0.1 * X * Y + 0.1 * Math.sqrt(Math.abs(X));
  ResultLon += (20.0 * Math.sin(6.0 * X * Math.PI) + 20.0 * Math.sin(2.0 * X * Math.PI)) * 2.0 / 3.0;
  ResultLon += (20.0 * Math.sin(X * Math.PI) + 40.0 * Math.sin(X / 3.0 * Math.PI)) * 2.0 / 3.0;
  ResultLon += (150.0 * Math.sin(X / 12.0 * Math.PI) + 300.0 * Math.sin(X / 30.0 * Math.PI)) * 2.0 / 3.0;
  return ResultLon;
}
/*********WGS-84 to GCJ-02  *******/
/**
 * 
 * @param coords [lontitude,latitude]:Array(2)
 * @returns [lontitude,latitude]:Array(2)
 */
export default function (coords) {
  const Longitude = coords[0];
  const Latitude = coords[1];
  var Dev = CalDev(Longitude, Latitude);
  var RetLat = Latitude - Dev.Lat;
  var RetLon = Longitude - Dev.Lon;
  Dev = CalDev(RetLon, RetLat);
  RetLat = Latitude + Dev.Lat;
  RetLon = Longitude + Dev.Lon;
  return [RetLon, RetLat]
}