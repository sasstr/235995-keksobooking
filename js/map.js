'use strict';
(function () {
  var NUMBER_OF_ADS = 8;
  var MAX_Y_LOCATION = 630;
  var MIN_Y_LOCATION = 130;
  var SHARP_END_HEIGHT = 15;

  var map = document.querySelector('.map');

  // data.js -------------------------------------------------------


  // Функция создает массив объявлений
  var createArrayOfAds = function (numderOfAds) {
    var ads = [];
    for (var i = 0; i < numderOfAds; i++) {
      ads.push(createAd(i));
    }
    return ads;
  };

  var ads = createArrayOfAds(NUMBER_OF_ADS);
  var adCard = document.querySelector('#card').content.querySelector('.map__card');
  var mapPins = document.querySelector('.map__pins');

  // ----------- form.js
  var mapPinMain = document.querySelector('.map__pin--main');
  var inputAddress = document.querySelector('#address');

  // Map.js
  // Функция возращает координаты острого конца пина
  var getCoordinatesOfMainPin = function () {
    return Math.round(mapPinMain.offsetLeft + mapPinMain.offsetWidth / 2) + ', ' + (mapPinMain.offsetTop + mapPinMain.offsetHeight + SHARP_END_HEIGHT);
  };

  // Функция устанавливает в поле Адрес координаты мафина
  var windowLoadHendler = function () {
    inputAddress.value = getCoordinatesOfMainPin();
    window.removeEventListener('load', windowLoadHendler);
    mapPinMain.addEventListener('mousedown', mainPinDragHandler);
    mapPinMain.addEventListener('keydown', mainPinKeydownHandler);
  };

  window.addEventListener('load', windowLoadHendler);

  // Функция Drag and Drop мафина
  var mainPinDragHandler = function (evt) {

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };
    // функция отвечает за перемешение мафина
    var MouseMoveHandler = function (moveEvt) {
      moveEvt.preventDefault();

      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      var currentCoordinates = {
        x: mapPinMain.offsetLeft - shift.x,
        y: mapPinMain.offsetTop - shift.y
      };

      var validCoordinateX = Math.round(currentCoordinates.x + mapPinMain.offsetWidth) > map.clientLeft && Math.round(currentCoordinates.x + mapPinMain.offsetWidth) < map.offsetWidth;
      var validCoordinateY = (currentCoordinates.y + mapPinMain.offsetHeight / 2) > MIN_Y_LOCATION && (currentCoordinates.y + mapPinMain.offsetHeight / 2) < MAX_Y_LOCATION;

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };
      if (validCoordinateY) {
        mapPinMain.style.top = (mapPinMain.offsetTop - shift.y) + 'px';
        inputAddress.value = getCoordinatesOfMainPin(moveEvt);
      }
      if (validCoordinateX) {
        mapPinMain.style.left = (mapPinMain.offsetLeft - shift.x) + 'px';
      }
    };
    // Функция останавливает перемещение мафина при событии mouseup
    var MouseUpHandler = function (upEvt) {
      upEvt.preventDefault();
      document.removeEventListener('mousemove', MouseMoveHandler);
      document.removeEventListener('mouseup', MouseUpHandler);
    };

    document.addEventListener('mousemove', MouseMoveHandler);
    document.addEventListener('mouseup', MouseUpHandler);
  };

  // Функция отрисует все пины
  var renderPins = function () {
    var pinsFragment = document.createDocumentFragment();
    for (var i = 0; i < NUMBER_OF_ADS; i++) {
      pinsFragment.appendChild(createPin(ads[i]));
    }
    return pinsFragment;
  };
})();


