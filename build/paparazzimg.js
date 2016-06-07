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
paparazzimg.tracker = function(el) {

      this.element = null;
      this.id = null;
      this.points = [];
      this.isActive = false;

      this.init = function(el) {
            this.element = el;
            this.setId();
      };

      this.setId = function() {
            if(this.element.getAttribute('id')) this.id = paparazzimg.addId(this.element.getAttribute('id'));
            else {
                  this.id = paparazzimg.addId(this.element.nodeName);
                  this.element.setAttribute('id', this.id);
            }
      };

      this.setActive = function() {
            this.isActive = true;
      };

      this.setInactive = function() {
            this.isActive = false;
      };

      //    API

      this.report = function() {
            var o = {};
            o.count = this.points.length;
            o.extremum = this.getExtremum();
            o.optimal = this.getOptimal(o.extremum);
            this.reset();
            return o;
      };

      this.point = function() {
            this.points.push( this.getPoint() );
      };

      this.reset = function() {
            this.points = [];
      };

      //    FUNCTIONS

      this.getPoint = function() {
            var p = {};
            p.width = this.element.clientWidth;
            p.height = this.element.clientHeight;
            p.ratio = p.width / p.height;
            return p;
      };

      this.getExtremum = function() {
            var o = {}, i, d;
            for (i = 0; i < this.points.length; i++) {
                  for (d in this.points[i]){
                        if(o[d] === undefined) o[d] = { min: this.points[i][d], max: this.points[i][d] };
                        else if(this.points[i][d] > o[d].max) o[d].max = this.points[i][d];
                        else if(this.points[i][d] < o[d].min) o[d].min = this.points[i][d];
                  }
            }
            return o;
      };

      this.getOptimal = function(oExtremum) {
            var o = {};
            o.static = this.getStaticSize(oExtremum);
            o.fluidWidth = this.getFluidWidthSize(oExtremum);
            o.fluidHeight = this.getFluidHeightSize(oExtremum);
            return o;
      };

      this.getStaticSize = function(oExtremum) {
            return {
                  width: Math.ceil(oExtremum.width.max),
                  height: Math.ceil(oExtremum.height.max)
            };
      };

      this.getFluidWidthSize = function(oExtremum) {
            return {
                  width: Math.ceil(oExtremum.height.max * oExtremum.ratio.max),
                  height: Math.ceil(oExtremum.width.max / oExtremum.ratio.min)
            };
      };

      this.getFluidHeightSize = function(oExtremum) {
            return {
                  width: Math.ceil(oExtremum.height.min * oExtremum.ratio.max),
                  height: Math.ceil(oExtremum.width.min / oExtremum.ratio.min)
            };
      };

      this.init(el);
};