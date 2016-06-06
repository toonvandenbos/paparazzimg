/*!
 * Paparazzimg
 * https://github.com/nyratas/paparazzimg
 *
 * Copyright (c) 2016 Toon Van den Bos
 * Licensed under the MIT license.
 */

"use strict";

var paparazzimg = (function(p) {

      var oTrackers = {}, oIDCache = {};

      p.track = function(el) {
            var o = makeTracker(el);
            if(o) registerTracker(o);
      };

      p.release = function(id) {
            if(id == undefined) return stopAll();
            return stopTracker(id);
      };

      p.addId = function(str) {
            str = str.toLowerCase();
            return cacheId(str);
      };

      p.addTrackpoint = function(id) {
            if(typeof id == 'String') addTrackerPoint(id);
            addAllPoints();
      };

      function registerEvent() {
            window.addEventListener('resize', p.addTrackpoint, false);
      };

      function makeTracker(el) {
            if(el === null || el === undefined) return false;
            else if(!el.nodeType){
                  console.error('Paparazzimg: variable is not a valid DOM element.');
                  return false;
            }
            return new p.tracker(el);
      };

      function registerTracker(o) {
            oTrackers[o.id] = o;
            oTrackers[o.id].setActive();
      };

      function cacheId(str) {
            if(oIDCache[str] === undefined) oIDCache[str] = [str];
            else oIDCache[str].push(str + oIDCache[str].length);
            return oIDCache[str][oIDCache[str].length - 1];
      };

      function stopTracker(id) {
            if(oTrackers[id] !== undefined){
                  oTrackers[id].setInactive();
                  return oTrackers[id].report();
            }
            return null;
      };

      function stopAll() {
            var reports = {}, id;
            for(id in oTrackers){
                  reports[id] = stopTracker(id);
            }
            return reports;
      };

      function addTrackerPoint(id) {
            if(oTrackers[id].isActive) oTrackers[id].point();
      };

      function addAllPoints() {
            for(var id in oTrackers) addTrackerPoint(id);
      };

      registerEvent();

      return p;

})(paparazzimg || {});