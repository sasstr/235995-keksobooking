'use strict';

(function () {
  var SHARP_END_MAIN_PIN = 14;
  var DIFFERENCE_ON_TOP = 13;
  var DIFFERENCE_ON_BOTTOM = 15;
  var NUMBER_OF_ADS = 8;
  var MAX_Y_LOCATION = 630;
  var MIN_Y_LOCATION = 130;
  var PIN_WIDTH = 50;
  var PIN_HEIGHT = 70;
  var START_COORDINATE_X = '570px';
  var START_COORDINATE_Y = '375px';
  var ENTER_KEYCODE = 'Enter';

  var mapPinMain = document.querySelector('.map__pin--main');
  var map = document.querySelector('.map');
  var adFormReset = document.querySelector('.ad-form__reset');
  // Функция колбэк снимает слушатели событий и убирает класс map--faded
  var mapPinMainRemoveEventListeners = function () {
    map.classList.remove('map--faded');
    mapPinMain.removeEventListener('mousedown', mainPinMousedownHandler);
    mapPinMain.removeEventListener('keydown', mainPinKeydownHandler);
    adFormReset.addEventListener('click', formResetHandler);
  };
  // Функция колбэк добавляет слушатели событий
  var mapPinMainAddListeners = function () {
    mapPinMain.addEventListener('mousedown', mainPinMousedownHandler);
    mapPinMain.addEventListener('keydown', mainPinKeydownHandler);
    adFormReset.removeEventListener('click', formResetHandler);
  };

  window.form.disableForm(mapPinMainAddListeners);

  // Функция определения допустимых координат мафина
  var getValidCoordinates = function (currentCoords, mapPinMainHtmlElement) {
    return Math.round(currentCoords.x + mapPinMainHtmlElement.offsetWidth / 2) >= map.clientLeft && Math.round(currentCoords.x + mapPinMainHtmlElement.offsetWidth / 2) <= map.offsetWidth;
  };

  // Функция  возращает координаты острого конца пина
  var getCoordinatesOfMainPin = function () {
    return Math.round(mapPinMain.offsetLeft + mapPinMain.offsetWidth / 2) + ', ' + (mapPinMain.offsetTop + mapPinMain.offsetHeight + SHARP_END_MAIN_PIN);
  };
  // Функция возращает DomElement с Пинами
  var renderPins = function () {
    var pinsFragment = document.createDocumentFragment();
    for (var i = 0; i < NUMBER_OF_ADS; i++) {
      pinsFragment.appendChild(createPin(window.data[i]));
    }
    return pinsFragment;
  };

  // Функция при нажатии на кнопку reset ставит мафин в первоначальное место и в поле адрес добавляет координаты.
  var formResetHandler = function (resetEvt) {
    setTimeout(function () {
      mapPinMain.style.left = START_COORDINATE_X;
      mapPinMain.style.top = START_COORDINATE_Y;
      window.form.setAddress(window.map.getCoordinatesOfMainPin(resetEvt));
    }, 0);
  };

  // Функция активирует окно по нажатию на  enter
  var mainPinKeydownHandler = function (evtKeyCode) {
    if (evtKeyCode.code === ENTER_KEYCODE) {
      window.form.enableForm(mapPinMainRemoveEventListeners);
    }
  };

  // Функция по клику на главный пин переводит окно в активное состояние
  var mainPinMousedownHandler = function () {
    window.form.enableForm(mapPinMainRemoveEventListeners);
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

      var validCoordinateX = getValidCoordinates(currentCoordinates, mapPinMain);
      var validCoordinateY = (currentCoordinates.y + mapPinMain.offsetHeight + DIFFERENCE_ON_BOTTOM) > MIN_Y_LOCATION && (currentCoordinates.y + mapPinMain.offsetHeight + DIFFERENCE_ON_TOP) < MAX_Y_LOCATION;

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };
      if (validCoordinateY) {
        mapPinMain.style.top = (mapPinMain.offsetTop - shift.y) + 'px';
        window.form.setAddress(getCoordinatesOfMainPin(moveEvt));
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
    window.form.setAddress(getCoordinatesOfMainPin());
    window.removeEventListener('load', windowLoadHendler);
    mapPinMain.addEventListener('mousedown', mainPinDragHandler);
    mapPinMain.addEventListener('keydown', mainPinKeydownHandler);
    mapPinMain.addEventListener('mousedown', mainPinMousedownHandler);
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
