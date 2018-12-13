'use strict';

(function () {
  var DIFFERENCE_ON_TOP = -1;
  var DIFFERENCE_ON_BOTTOM = 1;
  var NUMBER_OF_ADS = 8;
  var MAX_Y_LOCATION = 630;
  var MIN_Y_LOCATION = 130;
  var PIN_WIDTH = 50;
  var PIN_HEIGHT = 70;

  var inputAddress = document.querySelector('#address');
  var map = document.querySelector('.map');
  var mapPinMain = map.querySelector('.map__pin--main');

  // Функция  возращает координаты острого конца пина
  var getCoordinatesOfMainPin = function () {
    return Math.round(mapPinMain.offsetLeft + mapPinMain.offsetWidth / 2) + ', ' + (mapPinMain.offsetTop + mapPinMain.offsetHeight);
  };
  // Функция возращает DomElement с Пинами
  var renderPins = function () {
    var pinsFragment = document.createDocumentFragment();
    for (var i = 0; i < NUMBER_OF_ADS; i++) {
      pinsFragment.appendChild(createPin(window.data[i]));
    }
    return pinsFragment;
  };

  window.map = {
    getCoordinatesOfMainPin: getCoordinatesOfMainPin,
    renderPins: renderPins
  };

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

      var validCoordinateX = Math.round(currentCoordinates.x + mapPinMain.offsetWidth / 2) >= map.clientLeft && Math.round(currentCoordinates.x + mapPinMain.offsetWidth / 2) <= map.offsetWidth;
      var validCoordinateY = (currentCoordinates.y + mapPinMain.offsetHeight + DIFFERENCE_ON_BOTTOM) > MIN_Y_LOCATION && (currentCoordinates.y + mapPinMain.offsetHeight + DIFFERENCE_ON_TOP) < MAX_Y_LOCATION;

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };
      if (validCoordinateY) {
        mapPinMain.style.top = (mapPinMain.offsetTop - shift.y) + 'px';
        inputAddress.value = window.map.getCoordinatesOfMainPin(moveEvt);
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


  // Функция устанавливает в поле Адрес координаты мафина
  var windowLoadHendler = function () {
    inputAddress.value = window.map.getCoordinatesOfMainPin();
    window.removeEventListener('load', windowLoadHendler);
    mapPinMain.addEventListener('mousedown', mainPinDragHandler);
    mapPinMain.addEventListener('keydown', window.form.mainPinKeydownHandler);
  };

  window.addEventListener('load', windowLoadHendler);

  // Функция создает пин
  var createPin = function (ad) {
    var pinElement = document.createElement('button');
    var pinChildImg = document.createElement('img');
    var pinElementClickHandler = function () {
      window.card.removeCard(ad);
      window.card.showCard(ad);
    };

    pinElement.classList.add('map__pin');
    pinElement.style.left = (ad.location.x - PIN_WIDTH / 2) + 'px';
    pinElement.style.top = (ad.location.y - PIN_HEIGHT) + 'px';
    pinChildImg.src = ad.author.avatar;
    pinChildImg.width = 40;
    pinChildImg.height = 40;
    pinChildImg.draggable = false;
    pinChildImg.alt = ad.offer.title;
    pinElement.appendChild(pinChildImg);
    pinElement.addEventListener('click', pinElementClickHandler);

    return pinElement;
  };
})();
