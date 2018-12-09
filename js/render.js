'use strict';

(function () {
  // Функция отрисует все пины
  window.data.renderPins = function () {
    var pinsFragment = document.createDocumentFragment();
    for (var i = 0; i < window.data.NUMBER_OF_ADS; i++) {
      pinsFragment.appendChild(window.data.createPin(ads[i]));
    }
    return pinsFragment;
  };
})();
