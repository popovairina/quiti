export default () => {
    function Accordion() {
        this.accordion = document.querySelector('.js-acc');
        this.items = Array.from(this.accordion.querySelectorAll('.js-acc-item'));
        this.toggle = this.toggle.bind(this);
        this.onResize = this.onResize.bind(this);
    }
  
    Accordion.prototype.hideAll = function() {
        var items = this.items;
        items.forEach(function(val, idx) {
            val.removeAttribute('data-open');
            var content = val.querySelector('.js-acc-content');
            content.style.maxHeight = 0;
        });
    }
  
    Accordion.prototype.toggle = function(idx) {
        var item = this.items[idx];
        var isOpen = item.getAttribute('data-open') !== null;
        if (!isOpen) {
           this.hideAll();
           item.setAttribute('data-open', '');
           this.setItemHeight(item);
           return;
        }
        this.hideAll();
    }
  
    Accordion.prototype.setItemHeight = function(item) {
        var content = item.querySelector('.js-acc-content');
        setTimeout(function() {
           var children = Array.from(content.children);
           let scrollHeight = 0;
           children.forEach(function(val) {
              scrollHeight += val.offsetHeight;
           });
           content.style.maxHeight = scrollHeight + 'px';
        }, 0);
    };
  
    Accordion.prototype.setControls = function() {
        var toggle = this.toggle;
        this.items.forEach(function(item, idx) {
           var btn = item.querySelector('.js-acc-button');
           btn.addEventListener('click', function() {
              toggle(idx);
              const parent = this.closest('.js-acc-item');
              if (parent){
                setTimeout(function() {
                  let posY = parent.getBoundingClientRect().top + window.pageYOffset - 80;
                  window.scrollTo({
                    left: 0,
                    top: posY,
                    behavior: "smooth"
                  });                
                }, 300);
              }
           });
        });
    };
  
    Accordion.prototype.init = function() {
        this.setControls();
        var items = this.items;
        items.forEach(function(val, idx) {
           var content = val.querySelector('.js-acc-content');
           if (val.getAttribute('data-open') === null) {
              content.style.maxHeight = 0;
              return;
           } 
  
           content.style.maxHeight = content.offsetHeight + 'px';
        });
    };
  
    Accordion.prototype.onResize = function() {
        var current = this.accordion.querySelector('.js-acc-item[data-open]');
        if(!current) return;
        this.setItemHeight(current);
    };
  
    var accordion = new Accordion();
    accordion.init(); 
    window.addEventListener('resize', accordion.onResize);
    accordion.onResize();
}