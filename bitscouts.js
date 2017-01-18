'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var camelCase = function camelCase(str) {
  return str.replace(/^([A-Z])|[\s-_](\w)/g, function (match, p1, p2, offset) {
    return !!p2 ? p2.toUpperCase() : p1.toLowerCase();
  });
};

var Listener = function Listener(element, name, callback) {
  _classCallCheck(this, Listener);

  var type = name.split(':')[0];
  var options = name.split(':')[1];

  if (type === 'key') type = 'keypress';

  element.addEventListener(type, function (event) {
    if (type === 'click') {
      return callback();
    } else if (type === 'keypress') {
      if (options) {
        if (options.split(',').indexOf(event.key) > -1) {
          return callback(event.key || event.keyCode);
        }
      } else {
        return callback(event.key || event.keyCode);
      }
    }
  });
};

var Element = function () {
  function Element(element) {
    _classCallCheck(this, Element);

    if (typeof element === 'string') {
      this.element = document.createElement(element);
    } else if (element instanceof HTMLElement) {
      this.element = element;
    } else {
      this.element = document.createElement('div');
    }
  }

  Element.prototype.append = function append(element) {
    this.element.appendChild(element);

    return this;
  };

  Element.prototype.prepend = function prepend(element) {
    this.element.insertAdjacentHTML('afterbegin', element);

    return this;
  };

  Element.prototype.text = function text(string) {
    this.element.innerText = string;

    return this;
  };

  Element.prototype.style = function style(styles) {
    for (var property in styles) {
      this.element.style[camelCase(property)] = styles[property];
    }

    return this;
  };

  Element.prototype.on = function on(event, callback) {
    new Listener(this.element, event, callback);
    return this;
  };

  _createClass(Element, [{
    key: 'width',
    set: function set(w) {
      this.element.width = w;
    },
    get: function get() {
      return this.element.width;
    }
  }, {
    key: 'height',
    set: function set(h) {
      this.element.height = h;
    },
    get: function get() {
      return this.element.height;
    }
  }]);

  return Element;
}();

var ElementArray = function () {
  function ElementArray(elements) {
    _classCallCheck(this, ElementArray);

    this.elements = elements;
  }

  ElementArray.prototype.exec = function exec(f) {
    this.elements.forEach(f);
    return this;
  };

  ElementArray.prototype.style = function style(styles) {
    this.exec(function (e) {
      return e.style(styles);
    });
    return this;
  };

  ElementArray.prototype.text = function text(string) {
    this.exec(function (e) {
      return e.text(string);
    });
  };

  ElementArray.prototype[Symbol.iterator] = function () {
    var _this = this;

    var i = 0;

    return {
      next: function next(_) {
        if (i < _this.elements.length) {
          return {
            value: _this.elements[i++],
            done: false
          };
        } else {
          return {
            done: true
          };
        }
      }
    };
  };

  return ElementArray;
}();

var BitscoutLib = function () {
  function BitscoutLib(root) {
    _classCallCheck(this, BitscoutLib);

    if (typeof root === 'string') {
      this.root = this.select(root);
    } else {
      this.root = root || document.body;
    }

    this.canvas = null;
    this.context = null;
  }

  BitscoutLib.prototype.select = function select(query) {
    var elements = this.root.querySelectorAll(query);

    if (elements.length < 2) {
      return new Element(elements[0]);
    } else {
      return new ElementArray(Array.from(elements).map(function (e) {
        return new Element(e);
      }));
    }
  };

  BitscoutLib.prototype.append = function append(element) {
    this.root.appendChild(element.element);
  };

  BitscoutLib.prototype.loadCanvas = function loadCanvas(canvas) {
    this.canvas = canvas.element;
    this.context = this.canvas.getContext('2d');
  };

  BitscoutLib.prototype.draw = function draw(f) {
    var _this2 = this;

    f();
    requestAnimationFrame(function (_) {
      return _this2.draw(f);
    });
  };

  BitscoutLib.prototype.color = function color(string) {
    this.context.fillStyle = string;
    this.context.strokeStyle = string;
  };

  BitscoutLib.prototype.lineWidth = function lineWidth(size) {
    this.context.lineWidth = size;
  };

  BitscoutLib.prototype.rectangle = function rectangle() {
    var _context;

    (_context = this.context).fillRect.apply(_context, arguments);
  };

  return BitscoutLib;
}();

var lib = new BitscoutLib();

for (var key in lib) {
  if (key !== 'root' && lib[key] !== null) {
    window[key] = lib[key].bind(lib);
  }
}