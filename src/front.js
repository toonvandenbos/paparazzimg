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

      p.download = function(mode, id) {
            var a;
            if(id == undefined) a = downloadAll(mode);
            else a = downloadTracker(id, mode);
            for (var i = 0; i < a.length; i++) a[i].download();
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

      function downloadTracker(id, mode) {
            var a = [], s;
            if(oTrackers[id].isActive) stopTracker(id);
            if(mode === undefined){
                  for (mode in oTrackers[id].output.optimal) {
                        a.push( new p.canvas(oTrackers[id], mode) );
                  }
            }
            else if(oTrackers[id].output.optimal[mode] === undefined){
                  s = 'Paparazzimg: mode "' + mode + '" is not a defined render mode (defined modes are:';
                  for (mode in oTrackers[id].output.optimal) s = s + ' "' + mode + '",';
                  s = s.slice(0, -1) + ').';
                  console.error(s);
            }
            else a.push( new p.canvas(oTrackers[id], mode) );
            return a;
      };

      function downloadAll(mode) {
            var a = [], tmp, id;
            for(id in oTrackers){
                  tmp = downloadTracker(id, mode);
                  for (var i = 0; i < tmp.length; i++) {
                        a.push(tmp[i]);
                  }
            }
            return a;
      };

      registerEvent();

      return p;

})(paparazzimg || {});