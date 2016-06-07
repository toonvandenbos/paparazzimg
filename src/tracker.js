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
            return o;
      };

      this.point = function() {
            this.points.push( this.getPoint() );
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

      this.init(el);
};