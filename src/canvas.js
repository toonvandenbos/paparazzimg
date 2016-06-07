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
                  minwidth: {r: 180, g: 180, b: 180, a: 1},
                  minwidthBg: {r: 180, g: 180, b: 180, a: 0.1},
                  maxwidth: {r: 190, g: 190, b: 190, a: 1},
                  maxwidthBg: {r: 190, g: 190, b: 190, a: 0.1},
                  minheight: {r: 200, g: 200, b: 200, a: 1},
                  minheightBg: {r: 200, g: 200, b: 200, a: 0.1},
                  maxheight: {r: 210, g: 210, b: 210, a: 1},
                  maxheightBg: {r: 210, g: 210, b: 210, a: 0.1},
                  minratio: {r: 220, g: 220, b: 220, a: 1},
                  minratioBg: {r: 220, g: 220, b: 220, a: 0.1},
                  maxratio: {r: 230, g: 230, b: 230, a: 1},
                  maxratioBg: {r: 230, g: 230, b: 230, a: 0.1},
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
            for (var t in tracker.breaks) {
                  this.drawBreak(t, tracker.breaks[t]);
            }
      };

      this.drawBreak = function(type, o) {
            this.ctx.lineWidth = this.conf.line;
            this.ctx.strokeStyle = this.getRgba(this.conf.colors[type.replace('-','')]);
            this.ctx.fillStyle = this.getRgba(this.conf.colors[type.replace('-','') + 'Bg']);
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

      this.init();
};