'use strict';

var ESC_KEYCODE = 27;

// Функция запускает колбэк по нажатию на клавишу Esc
var actionKeydownEsc = function (cb, evtKey) {  // @fixme escKeyDownAction(evt, cb) invokeCallbackByKeydownEsc
  if (evtKey.keyCode === ESC_KEYCODE) {
    cb();
  }
};

window.utils = {
  actionKeydownEsc: actionKeydownEsc
};
