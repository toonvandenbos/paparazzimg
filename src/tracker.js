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