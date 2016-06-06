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
            console.log(this.points);
            console.log('TODO : generate tracker report');
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

      this.init(el);
};