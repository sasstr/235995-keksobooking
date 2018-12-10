'use strict';

(function () {
  var SHARP_END_HEIGHT = 15;
  var TYPES_OF_HABITATION = {'bungalo': 0, 'flat': 1000, 'house': 5000, 'palace': 10000};
  var START_COORDINATE_X = '570px';
  var START_COORDINATE_Y = '375px';
  var ROOMS = {'1': {'1': 'для 1 гостя'}, '2': {'1': 'для 1 гостя', '2': 'для 2 гостей'}, '3': {'1': 'для 1 гостя', '2': 'для 2 гостей', '3': 'для 3 гостей'}, '100': {'0': 'не для гостей'}};
  var ENABLED_CONDITION = false;
  var DISABLED_CONDITION = true;

  var fieldsetList = document.querySelectorAll('fieldset');
  var adForm = document.querySelector('.ad-form');
  var mapPinMain = document.querySelector('.map__pin--main');
  var inputAddress = document.querySelector('#address');
  var map = document.querySelector('.map');
  var mapPins = document.querySelector('.map__pins');

  window.form = {
    getCoordinatesOfMainPin: function () {
      return Math.round(mapPinMain.offsetLeft + mapPinMain.offsetWidth / 2) + ', ' + (mapPinMain.offsetTop + mapPinMain.offsetHeight + SHARP_END_HEIGHT);
    },

    mainPinKeydownHandler: function (evtKeyCode) {
      if (evtKeyCode.code === 'Enter') {
        enableForm();
      }
    }
  };

  // Функция устанавливает состояние форм disabled или enabled
  var setConditionForms = function (condition) {
    for (var i = 0; i < fieldsetList.length; i++) {
      fieldsetList[i].disabled = condition;
    }
  };
  // Функция возращает координаты острого конца пина
  window.form.getCoordinatesOfMainPin = function () {
    return Math.round(mapPinMain.offsetLeft + mapPinMain.offsetWidth / 2) + ', ' + (mapPinMain.offsetTop + mapPinMain.offsetHeight + SHARP_END_HEIGHT);
  };
  // Функция устанавливает в поле Адрес координаты мафина
  var windowLoadHendler = function () {
    inputAddress.value = window.form.getCoordinatesOfMainPin();
    window.removeEventListener('load', windowLoadHendler);
    mapPinMain.addEventListener('mousedown', window.map.mainPinDragHandler);
    mapPinMain.addEventListener('keydown', mainPinKeydownHandler);
  };

  window.addEventListener('load', windowLoadHendler);

  var adFormReset = document.querySelector('.ad-form__reset');

  // Функция активирует форму по нажатию на клавишу enter
  var mainPinKeydownHandler = function (evtKeyCode) {
    if (evtKeyCode.code === 'Enter') {
      enableForm();
    }
  };

  // Функция по клику на главный пин переводит окно в активное состояние
  var mainPinMousedownHandler = function (evt) {
    enableForm(evt);
  };

  // Функция установки начального состояния формы
  var enableForm = function (evt) {
    map.classList.remove('map--faded');
    adForm.classList.remove('ad-form--disabled');
    setConditionForms(ENABLED_CONDITION);
    getRightNumberOfGuests();
    setRightMinPriceOfDwelling();
    inputAddress.value = window.form.getCoordinatesOfMainPin(evt);
    mapPins.appendChild(window.map.renderPins());
    roomNumber.addEventListener('change', selectRoomsChangeHandler);
    typeOfHabitation.addEventListener('change', inputTypeChangeHandler);
    selectTimeout.addEventListener('change', selectTimeoutChangeHandler);
    selectTimein.addEventListener('change', selectTimeinChangeHandler);
    adFormReset.addEventListener('click', formResetHandler);
    mapPinMain.removeEventListener('keydown', mainPinKeydownHandler);
    mapPinMain.removeEventListener('mousedown', mainPinMousedownHandler);
  };

  // Функция, которая переводит страницу в начальное состояние. Реагирует только маффин на перетаскивание мышкой
  var disableForm = function () {
    setConditionForms(DISABLED_CONDITION);
    mapPinMain.addEventListener('keydown', mainPinKeydownHandler);
    mapPinMain.addEventListener('mousedown', mainPinMousedownHandler);
    adFormReset.removeEventListener('click', formResetHandler);
  };

  disableForm();

  var roomNumber = document.querySelector('#room_number');
  var capacity = document.querySelector('#capacity');
  // Функция создает список select с кол-ом гостей в соответсвии с кол-ом комнат
  var getRightNumberOfGuests = function () {
    capacity.innerHTML = '';
    var roomCount = roomNumber.options[roomNumber.selectedIndex].value;
    var room = ROOMS[roomCount];
    var keys = Object.keys(room);
    for (var k = 0; k < keys.length; k++) {
      var value = keys[k];
      var valueString = room[keys[k]];
      var option = new Option(valueString, value, false, false);
      capacity.add(option);
    }
  };

  // Функция собирает список select на основе значений option другого select
  var selectRoomsChangeHandler = function () {
    getRightNumberOfGuests();
  };

  var typeOfHabitation = document.querySelector('#type');
  var inputMinMaxPrice = document.querySelector('#price');

  // Функция вставляет в разметку минмальную стоимость жилья
  var setRightMinPriceOfDwelling = function () {
    inputMinMaxPrice.min = TYPES_OF_HABITATION[typeOfHabitation.value];
    inputMinMaxPrice.placeholder = TYPES_OF_HABITATION[typeOfHabitation.value];
  };

  // Функция слушатель события выбора типа жилья, которая вставляет нужное значение минимальной стоимости жилья.
  var inputTypeChangeHandler = function () {
    setRightMinPriceOfDwelling();
  };

  var selectTimein = document.querySelector('#timein');
  var selectTimeout = document.querySelector('#timeout');

  // Функция синхронизации времени въезда и отъезда гостя
  var selectTimeinChangeHandler = function () {
    selectTimeout.selectedIndex = selectTimein.selectedIndex;
  };

  // Функция синхронизации времени въезда и отъезда гостя
  var selectTimeoutChangeHandler = function () {
    selectTimein.selectedIndex = selectTimeout.selectedIndex;
  };

  // Функция при нажатии на кнопку reset ставит мафин в первоначальное место и в поле адрес добавляет координаты.
  var formResetHandler = function (resetEvt) {
    setTimeout(function () {
      mapPinMain.style.left = START_COORDINATE_X;
      mapPinMain.style.top = START_COORDINATE_Y;
      inputAddress.value = window.form.getCoordinatesOfMainPin(resetEvt);
    }, 0);
  };
})();
