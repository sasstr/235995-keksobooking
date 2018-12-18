'use strict';
(function () {
  var DEBOUNCE_INTERVAL = 500;
  var lastTimeout;
  var debounce = function (cb) {
    if (lastTimeout) {
      window.clearTimeout(lastTimeout);
      lastTimeout = null;
    }
    lastTimeout = window.setTimeout(cb, DEBOUNCE_INTERVAL);
  };

  window.debounce = {
    debounceController: debounce
  };
})();
