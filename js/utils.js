'use strict';

var ESC_KEYCODE = 27;

// Функция запускает колбэк по нажатию на клавишу Esc
var actionKeydownEsc = function (cb, evtKey) {
  if (evtKey.keyCode === ESC_KEYCODE || evtKey.key === 'Escape') {
    cb();
  }
};

window.utils = {
  actionKeydownEsc: actionKeydownEsc
};
