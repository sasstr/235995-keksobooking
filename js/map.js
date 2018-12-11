'use strict';
(function () {
  var DIFFERENCE_ON_TOP = 14;
  var DIFFERENCE_ON_BOTTOM = 16;
  var NUMBER_OF_ADS = 8;
  var MAX_Y_LOCATION = 630;
  var MIN_Y_LOCATION = 130;
  var PIN_WIDTH = 50;
  var PIN_HEIGHT = 70;

  var inputAddress = document.querySelector('#address');

  window.map = {
    map: document.querySelector('.map'),
    mapPinMain: document.querySelector('.map__pin--main'),
    // Функция Drag and Drop мафина
    mainPinDragHandler: function (evt) {

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
          x: window.map.mapPinMain.offsetLeft - shift.x,
          y: window.map.mapPinMain.offsetTop - shift.y
        };

        var validCoordinateX = Math.round(currentCoordinates.x + window.map.mapPinMain.offsetWidth / 2) >= window.map.map.clientLeft && Math.round(currentCoordinates.x + window.map.mapPinMain.offsetWidth / 2) <= window.map.map.offsetWidth;
        var validCoordinateY = (currentCoordinates.y + window.map.mapPinMain.offsetHeight + DIFFERENCE_ON_BOTTOM) > MIN_Y_LOCATION && (currentCoordinates.y + window.map.mapPinMain.offsetHeight + DIFFERENCE_ON_TOP) < MAX_Y_LOCATION;

        startCoords = {
          x: moveEvt.clientX,
          y: moveEvt.clientY
        };
        if (validCoordinateY) {
          window.map.mapPinMain.style.top = (window.map.mapPinMain.offsetTop - shift.y) + 'px';
          inputAddress.value = window.form.getCoordinatesOfMainPin(moveEvt);
        }
        if (validCoordinateX) {
          window.map.mapPinMain.style.left = (window.map.mapPinMain.offsetLeft - shift.x) + 'px';
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
    },
    renderPins: function () {
      var pinsFragment = document.createDocumentFragment();
      for (var i = 0; i < NUMBER_OF_ADS; i++) {
        pinsFragment.appendChild(createPin(window.data.ads[i]));
      }
      return pinsFragment;
    }
  };

  // Функция устанавливает в поле Адрес координаты мафина
  var windowLoadHendler = function () {
    inputAddress.value = window.form.getCoordinatesOfMainPin();
    window.removeEventListener('load', windowLoadHendler);
    window.map.mapPinMain.addEventListener('mousedown', window.map.mainPinDragHandler);
    window.map.mapPinMain.addEventListener('keydown', window.form.mainPinKeydownHandler);
  };

  window.addEventListener('load', windowLoadHendler);

  // Функция создает пин
  var createPin = function (ad) {
    var pinElement = document.createElement('button');
    var pinChildImg = document.createElement('img');
    var pinElementClickHandler = function () {
      if (window.map.map.querySelector('.map__card') !== null) {
        window.map.map.querySelector('.map__card').remove();
      }
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
