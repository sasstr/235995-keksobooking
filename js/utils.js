'use strict';

var ESC_KEYCODE = 27;

// Функция запускает колбэк по нажатию на клавишу Esc
var invokeCallbackByKeydownEsc = function (cb, evtKey) {
  if (evtKey.keyCode === ESC_KEYCODE) {
    cb();
  }
};

window.utils = {
  invokeCallbackByKeydownEsc: invokeCallbackByKeydownEsc
};
