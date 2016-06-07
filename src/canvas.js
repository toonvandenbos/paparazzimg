paparazzimg.canvas = function( tracker, mode ) {

      this.mode = null;
      this.file = null;
      this.canvas = null;
      this.ctx = null;
      this.link = null;
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

      this.init = function() {
            this.makeName();
            this.makeCanvas();
            this.drawBase();
            this.drawBreaks();
            this.makeDownloadLink();
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

      this.makeDownloadLink = function() {
            this.link = document.createElement('a');
            this.link.addEventListener('click',(function(self){return function(e){self.event_download(e)}})(this),false);
      };

      //    API

      this.download = function() {
            this.link.click();
      };

      //    EVENT

      this.event_download = function() {
            this.link.href = this.canvas.toDataURL();
            this.link.download = this.file;
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
            var m = { width: o.width, height: o.height, ratio: o.ratio};
            switch(this.mode){
                  case 'fluidWidth': return this.adjustFluidWidth(type, m); break;
                  case 'fluidHeight': return this.adjustFluidHeight(type, m); break;
                  default: return m; break;
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
            return o;
      };

      this.init();
};