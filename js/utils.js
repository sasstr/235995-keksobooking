'use strict';

(function () {
  var ESC_KEYCODE = 27;

  // Функция запускает колбэк по нажатию на клавишу Esc
  window.utils = function (cb, evtKey) {
    if (evtKey.keyCode === ESC_KEYCODE || evtKey.key === 'Escape') {
      cb();
    }
  };
})();
