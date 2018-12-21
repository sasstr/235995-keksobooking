'use strict';

(function () {
  var ESC_KEYCODE = 27;
  var ESC_KEY = 'Escape';

  // Функция запускает колбэк по нажатию на клавишу Esc
  var checkEscKeyCode = function (evtKey, cb) {
    if (evtKey.keyCode === ESC_KEYCODE || evtKey.key === ESC_KEY) {
      cb();
    }
  };

  window.utils = {
    checkEscKeyCode: checkEscKeyCode
  };
})();
