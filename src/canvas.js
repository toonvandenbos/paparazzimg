paparazzimg.canvas = function( tracker, mode ) {

      this.mode = null;
      this.file = null;
      this.canvas = null;
      this.ctx = null;
      this.conf = {
            colors: {
                  base: {r: 63, g: 74, b: 78, a: 1},
                  baseBg: {r: 198, g: 214, b: 220, a: 0.2},
                  always: {r: 149, g: 202, b: 128, a: 1}
            },
            line: 1.5,
            baseLine: 4.5
      };

      this.init = function(el) {
            this.makeName();
            this.makeCanvas();
            this.drawBase();
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

      //    FUNCTIONS

      this.getRgba = function(o) {
            return 'rgba('
                  + o.r + ','
                  + o.g + ','
                  + o.b + ','
                  + o.a + ')';
      };

      this.init();
};