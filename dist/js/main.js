/******/ (function(modules) { // webpackBootstrap
/******/ 	// install a JSONP callback for chunk loading
/******/ 	function webpackJsonpCallback(data) {
/******/ 		var chunkIds = data[0];
/******/ 		var moreModules = data[1];
/******/ 		var executeModules = data[2];
/******/
/******/ 		// add "moreModules" to the modules object,
/******/ 		// then flag all "chunkIds" as loaded and fire callback
/******/ 		var moduleId, chunkId, i = 0, resolves = [];
/******/ 		for(;i < chunkIds.length; i++) {
/******/ 			chunkId = chunkIds[i];
/******/ 			if(Object.prototype.hasOwnProperty.call(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 				resolves.push(installedChunks[chunkId][0]);
/******/ 			}
/******/ 			installedChunks[chunkId] = 0;
/******/ 		}
/******/ 		for(moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				modules[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(parentJsonpFunction) parentJsonpFunction(data);
/******/
/******/ 		while(resolves.length) {
/******/ 			resolves.shift()();
/******/ 		}
/******/
/******/ 		// add entry modules from loaded chunk to deferred list
/******/ 		deferredModules.push.apply(deferredModules, executeModules || []);
/******/
/******/ 		// run deferred modules when all chunks ready
/******/ 		return checkDeferredModules();
/******/ 	};
/******/ 	function checkDeferredModules() {
/******/ 		var result;
/******/ 		for(var i = 0; i < deferredModules.length; i++) {
/******/ 			var deferredModule = deferredModules[i];
/******/ 			var fulfilled = true;
/******/ 			for(var j = 1; j < deferredModule.length; j++) {
/******/ 				var depId = deferredModule[j];
/******/ 				if(installedChunks[depId] !== 0) fulfilled = false;
/******/ 			}
/******/ 			if(fulfilled) {
/******/ 				deferredModules.splice(i--, 1);
/******/ 				result = __webpack_require__(__webpack_require__.s = deferredModule[0]);
/******/ 			}
/******/ 		}
/******/
/******/ 		return result;
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// object to store loaded and loading chunks
/******/ 	// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 	// Promise = chunk loading, 0 = chunk loaded
/******/ 	var installedChunks = {
/******/ 		"main": 0
/******/ 	};
/******/
/******/ 	var deferredModules = [];
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	var jsonpArray = window["webpackJsonp"] = window["webpackJsonp"] || [];
/******/ 	var oldJsonpFunction = jsonpArray.push.bind(jsonpArray);
/******/ 	jsonpArray.push = webpackJsonpCallback;
/******/ 	jsonpArray = jsonpArray.slice();
/******/ 	for(var i = 0; i < jsonpArray.length; i++) webpackJsonpCallback(jsonpArray[i]);
/******/ 	var parentJsonpFunction = oldJsonpFunction;
/******/
/******/
/******/ 	// add entry module to deferred list
/******/ 	deferredModules.push(["./src/js/index.js","vendor"]);
/******/ 	// run deferred modules when ready
/******/ 	return checkDeferredModules();
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/blocks/drivers/drivers.js":
/*!***************************************!*\
  !*** ./src/blocks/drivers/drivers.js ***!
  \***************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var swiper_bundle__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! swiper/bundle */ "./node_modules/swiper/swiper-bundle.esm.js");

/* harmony default export */ __webpack_exports__["default"] = (function () {
  var sliderEl = document.querySelector('.js-drivers-slider');
  if (!sliderEl) return;
  var swiper = new swiper_bundle__WEBPACK_IMPORTED_MODULE_0__["default"](sliderEl, {
    speed: 600,
    loop: true,
    slidesPerView: 3,
    spaceBetween: 32,
    navigation: {
      nextEl: '.drivers__arrow-next',
      prevEl: '.drivers__arrow-prev'
    },
    pagination: {
      el: '.drivers__pagination',
      type: 'bullets'
    },
    breakpoints: {
      320: {
        slidesPerView: 1,
        spaceBetween: 20
      },
      768: {
        slidesPerView: 2,
        spaceBetween: 32
      },
      1200: {
        slidesPerView: 3,
        spaceBetween: 32
      }
    }
  });
});

/***/ }),

/***/ "./src/blocks/faq/faq.js":
/*!*******************************!*\
  !*** ./src/blocks/faq/faq.js ***!
  \*******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (function () {
  function Accordion(element) {
    this.accordion = element;
    this.items = Array.from(this.accordion.querySelectorAll('.js-acc-item'));
    this.toggle = this.toggle.bind(this);
    this.onResize = this.onResize.bind(this);
  }

  Accordion.prototype.hideAll = function () {
    var items = this.items;
    items.forEach(function (val, idx) {
      val.removeAttribute('data-open');
      var content = val.querySelector('.js-acc-content');
      content.style.maxHeight = 0;
    });
  };

  Accordion.prototype.toggle = function (idx) {
    var item = this.items[idx];
    var isOpen = item.getAttribute('data-open') !== null;

    if (!isOpen) {
      this.hideAll();
      item.setAttribute('data-open', '');
      this.setItemHeight(item);
      return;
    }

    this.hideAll();
  };

  Accordion.prototype.setItemHeight = function (item) {
    var content = item.querySelector('.js-acc-content');
    setTimeout(function () {
      var children = Array.from(content.children);
      var scrollHeight = 0;
      children.forEach(function (val) {
        scrollHeight += val.offsetHeight;
      });
      content.style.maxHeight = scrollHeight + 'px';
    }, 0);
  };

  Accordion.prototype.setControls = function () {
    var toggle = this.toggle;
    this.items.forEach(function (item, idx) {
      var btn = item.querySelector('.js-acc-button');
      btn.addEventListener('click', function () {
        toggle(idx);
        var parent = this.closest('.js-acc-item');

        if (parent) {
          setTimeout(function () {
            var posY = parent.getBoundingClientRect().top + window.pageYOffset - 80;
            window.scrollTo({
              left: 0,
              top: posY,
              behavior: 'smooth'
            });
          }, 300);
        }
      });
    });
  };

  Accordion.prototype.init = function () {
    this.setControls();
    var items = this.items;
    items.forEach(function (val, idx) {
      var content = val.querySelector('.js-acc-content');

      if (val.getAttribute('data-open') === null) {
        content.style.maxHeight = 0;
        return;
      }

      content.style.maxHeight = content.offsetHeight + 'px';
    });
  };

  Accordion.prototype.onResize = function () {
    var current = this.accordion.querySelector('.js-acc-item[data-open]');
    if (!current) return;
    this.setItemHeight(current);
  };

  var accEl = document.querySelector('.js-acc');
  if (!accEl) return;
  var accordion = new Accordion(accEl);
  accordion.init();
  window.addEventListener('resize', accordion.onResize);
  accordion.onResize();
});

/***/ }),

/***/ "./src/blocks/feedback/feedback.js":
/*!*****************************************!*\
  !*** ./src/blocks/feedback/feedback.js ***!
  \*****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var swiper_bundle__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! swiper/bundle */ "./node_modules/swiper/swiper-bundle.esm.js");

/* harmony default export */ __webpack_exports__["default"] = (function () {
  var sliderEl = document.querySelector('.js-feedback-slider');
  if (!sliderEl) return;
  var swiper = new swiper_bundle__WEBPACK_IMPORTED_MODULE_0__["default"](sliderEl, {
    speed: 600,
    loop: true,
    spaceBetween: 10,
    slidesPerView: 1,
    navigation: {
      nextEl: '.feedback__arrow-next',
      prevEl: '.feedback__arrow-prev'
    },
    pagination: {
      el: '.feedback__pagination',
      type: 'bullets'
    },
    autoHeight: true
  });
});

/***/ }),

/***/ "./src/blocks/header/header.js":
/*!*************************************!*\
  !*** ./src/blocks/header/header.js ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (function () {
  var burger = document.querySelector('.js-burger');
  var nav = document.querySelector('.js-nav');
  var navClose = document.querySelector('.js-nav-close');

  var toggleNav = function toggleNav() {
    nav.classList.toggle('opened');
    document.body.classList.toggle('js-no-scroll');
  };

  burger.addEventListener('click', toggleNav);
  navClose.addEventListener('click', toggleNav);
});

/***/ }),

/***/ "./src/js/index.js":
/*!*************************!*\
  !*** ./src/js/index.js ***!
  \*************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var vh_check__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vh-check */ "./node_modules/vh-check/dist/vh-check.js");
/* harmony import */ var vh_check__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(vh_check__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _blocks_header_header__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../blocks/header/header */ "./src/blocks/header/header.js");
/* harmony import */ var _blocks_feedback_feedback__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../blocks/feedback/feedback */ "./src/blocks/feedback/feedback.js");
/* harmony import */ var _blocks_faq_faq__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../blocks/faq/faq */ "./src/blocks/faq/faq.js");
/* harmony import */ var _blocks_drivers_drivers__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../blocks/drivers/drivers */ "./src/blocks/drivers/drivers.js");





vh_check__WEBPACK_IMPORTED_MODULE_0___default()();
window.addEventListener('DOMContentLoaded', function () {
  Object(_blocks_header_header__WEBPACK_IMPORTED_MODULE_1__["default"])();
  Object(_blocks_feedback_feedback__WEBPACK_IMPORTED_MODULE_2__["default"])();
  Object(_blocks_faq_faq__WEBPACK_IMPORTED_MODULE_3__["default"])();
  Object(_blocks_drivers_drivers__WEBPACK_IMPORTED_MODULE_4__["default"])();
});

/***/ })

/******/ });
//# sourceMappingURL=main.js.map