/**
 * Geolocation utilities used by Dansk Supermarked
 */

// Dependencies
var $ = require('jquery');
var load = require('./load-assets');

var GEO_IP_CALLBACK = 'geo-ip-callback';
var GEO_IP_URL = '//freegeoip.net/json/';

// Get geoposition from geoip register
var geoPosPolyfill = function(success) {
    window[GEO_IP_CALLBACK] = success;
    load.js(GEO_IP_URL + '?callback=' + GEO_IP_CALLBACK);
};

/**
 * Get client geo position if browser supports it
 * @param         {number}        cachedTime        MS to cache geoposito result. Defaults to 60000 (10 mins)
 * @return        {promise}
 */
module.exports.clientLocation = function(cachedTime) {
    var deferred = $.Deferred();

    if (!navigator || !navigator.geolocation) {
        geoPosPolyfill(deferred.resolve);
        // Reject if no response within 5 secs
        window.setTimeout(function() {
            if (deferred.state() === 'pending') {
                deferred.reject();
            }
        }, 5000);
    } else {
        navigator.geolocation.getCurrentPosition(function(position) {
            deferred.resolve(position.coords);
        }, function() {
            deferred.reject();
        }, {
            maximumAge: cachedTime || 1000 * 60 * 10 // Default cache set to 10 minutes
        });
    }

    return deferred.promise();
};

/**
 * Get distance between two geopositions
 * @param         {object}        geo1        {latitude: float, longitude: float}
 * @param         {object}        geo2        {latitude: float, longitude: float}
 * @return        {number}                    km
 */
module.exports.distance = function(geo1, geo2) {
    var radius = 6367.0;

    var toRadian = function(v) {
        return v * (Math.PI / 180);
    };

    var diffRadian = function(v1, v2) {
        return toRadian(v2) - toRadian(v1);
    };

    // Calculate distance bewteen two geopositions
    return radius * 2 * Math.asin(Math.min(1, Math.sqrt((Math.pow(Math.sin((diffRadian(geo1.latitude, geo2.latitude)) / 2.0), 2.0) + Math.cos(toRadian(geo1.latitude)) * Math.cos(toRadian(geo2.latitude)) * Math.pow(Math.sin((diffRadian(geo1.longitude, geo2.longitude)) / 2.0), 2.0)))));
};

/**
 * Convert kilometer to miles and round to decimals.
 * @param         {float}        km
 * @param         {[int=2]}        decimals
 * @return        {float}
 */
module.exports.kmToMiles = function(km, decimals) {
    return (parseFloat(km) * 0.621371192).toFixed(decimals || 2);
};
