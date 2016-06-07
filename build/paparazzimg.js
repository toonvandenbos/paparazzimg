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
            if(id == undefined) return downloadAll(mode);
            return downloadTracker(id, mode);
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
paparazzimg.canvas = function( tracker, mode ) {

      this.mode = null;
      this.file = null;
      this.canvas = null;
      this.ctx = null;
      this.conf = {
            colors: {
                  base: {r: 63, g: 74, b: 78, a: 1},
                  baseBg: {r: 198, g: 214, b: 220, a: 0.2},
                  always: {r: 149, g: 202, b: 128, a: 1},
                  alwaysBg: {r: 149, g: 202, b: 128, a: 0.4},
                  normal: {r: 180, g: 180, b: 180, a: 1},
                  normalBg: {r: 180, g: 180, b: 180, a: 0.1}
            },
            line: 1,
            baseLine: 4
      };

      this.init = function(el) {
            this.makeName();
            this.makeCanvas();
            this.drawBase();
            this.drawBreaks();
            document.body.appendChild(this.canvas);
      };

      this.makeName = function() {
            this.mode = mode;
            this.file = tracker.id + '-' + this.mode + '.png';
      };

      this.makeCanvas = function() {
            this.canvas = document.createElement('canvas');
            this.canvas.width = tracker.output.optimal[mode].width;
            this.canvas.height = tracker.output.optimal[mode].height;
            this.ctx = this.canvas.getContext('2d');
            this.ctx.lineJoin = "round";
            this.ctx.lineCap = "round";
      };

      //    DRAW

      this.drawBase = function() {
            this.ctx.lineWidth = this.conf.baseLine;
            this.ctx.strokeStyle = this.getRgba(this.conf.colors.base);
            this.ctx.fillStyle = this.getRgba(this.conf.colors.baseBg);
            this.ctx.beginPath();
            this.ctx.rect((this.conf.baseLine/2),(this.conf.baseLine/2),(this.canvas.width - this.conf.baseLine),(this.canvas.height - this.conf.baseLine));
            this.ctx.fill();
            this.ctx.moveTo(this.conf.baseLine,this.conf.baseLine);
            this.ctx.lineTo((this.canvas.width - this.conf.baseLine),(this.canvas.height - this.conf.baseLine));
            this.ctx.moveTo(this.conf.baseLine,(this.canvas.height - this.conf.baseLine));
            this.ctx.lineTo((this.canvas.width - this.conf.baseLine),this.conf.baseLine);
            this.ctx.stroke();
      };

      this.drawBreaks = function() {
            var t, c;
            for (t in tracker.breaks) {
                  c = this.conf.colors[t.replace('-','')] === undefined ? 'normal' : t.replace('-','');
                  this.drawBreak(c, this.adjustModeSize(t, tracker.breaks[t]));
            }
      };

      this.drawBreak = function(color, o) {
            this.ctx.lineWidth = this.conf.line;
            this.ctx.strokeStyle = this.getRgba(this.conf.colors[color]);
            this.ctx.fillStyle = this.getRgba(this.conf.colors[color + 'Bg']);
            this.ctx.beginPath();
            this.ctx.rect(this.getPX(o.width),this.getPY(o.height),o.width,o.height);
            this.ctx.fill();
            this.ctx.stroke();
      };

      //    FUNCTIONS

      this.getRgba = function(o) {
            return 'rgba('
                  + o.r + ','
                  + o.g + ','
                  + o.b + ','
                  + o.a + ')';
      };

      this.getPX = function(i) {
            return (this.canvas.width - i)/2;
      };

      this.getPY = function(i) {
            return (this.canvas.height - i)/2;
      };

      this.adjustModeSize = function(type, o) {
            switch(this.mode){
                  case 'fluidWidth': return this.adjustFluidWidth(type, o); break;
                  case 'fluidHeight': return this.adjustFluidHeight(type, o); break;
                  default: return o; break;
            }
      };

      this.adjustFluidWidth = function(type, o) {
            o.width = this.canvas.width;
            if(type != 'always') o.height = (o.width/o.ratio);
            return o;
      };

      this.adjustFluidHeight = function(type, o) {
            o.height = this.canvas.height;
            if(type != 'always') o.width = o.ratio * o.height;
            console.log(type, o);
            return o;
      };

      this.init();
};
paparazzimg.tracker = function(el) {

      this.element = null;
      this.id = null;
      this.points = [];
      this.output = null;
      this.breaks = null;
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
            this.breaks = {};
            this.makeOutput();
            this.addMinBreak();
            this.reset();
            return this.output;
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

      this.makeOutput = function() {
            this.output = {};
            this.output.count = this.points.length;
            this.output.extremum = this.getExtremum();
            this.output.optimal = this.getOptimal();
      };

      this.getExtremum = function() {
            var o = {}, i, d, tmp = {};
            for (i = 0; i < this.points.length; i++) {
                  for (d in this.points[i]){
                        if(o[d] === undefined) {
                              o[d] = { min: this.points[i][d], max: this.points[i][d] };
                              tmp[d] = { min: this.points[i], max: this.points[i] };
                        }
                        else if(this.points[i][d] > o[d].max) {
                              o[d].max = this.points[i][d];
                              tmp[d].max = this.points[i];
                        }
                        else if(this.points[i][d] < o[d].min){
                              o[d].min = this.points[i][d];
                              tmp[d].min = this.points[i];
                        }
                  }
            }
            this.addExtremumBreaks(tmp);
            return o;
      };

      this.getOptimal = function() {
            var o = {};
            o.static = this.getStaticSize();
            o.fluidWidth = this.getFluidWidthSize();
            o.fluidHeight = this.getFluidHeightSize();
            return o;
      };

      this.getStaticSize = function() {
            return {
                  width: Math.ceil(this.output.extremum.width.max),
                  height: Math.ceil(this.output.extremum.height.max)
            };
      };

      this.getFluidWidthSize = function() {
            return {
                  width: Math.ceil(this.output.extremum.height.max * this.output.extremum.ratio.max),
                  height: Math.ceil(this.output.extremum.width.max / this.output.extremum.ratio.min)
            };
      };

      this.getFluidHeightSize = function() {
            return {
                  width: Math.ceil(this.output.extremum.height.min * this.output.extremum.ratio.max),
                  height: Math.ceil(this.output.extremum.width.min / this.output.extremum.ratio.min)
            };
      };

      this.addBreak = function(type, x, y, r) {
            var o = {};
            o.width = (x > 0 || x === 0) ? x : null;
            o.height = (y > 0 || y === 0) ? y : null;
            o.ratio = r;
            this.breaks[type] = o;
      };

      this.addExtremumBreaks = function(o) {
            var d, m;
            for (d in o) {
                  for(m in o[d]){
                        this.addBreak(m + '-' + d, o[d][m].width, o[d][m].height, o[d][m].ratio);
                  }
            }
      };

      this.addMinBreak = function() {
            this.addBreak('always', this.output.extremum.width.min, this.output.extremum.height.min, null);
      };

      this.init(el);
};