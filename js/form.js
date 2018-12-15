'use strict';

(function () {
  var TYPES_OF_HABITATION = {'bungalo': 0, 'flat': 1000, 'house': 5000, 'palace': 10000};
  var ROOMS = {'1': {'1': 'для 1 гостя'}, '2': {'1': 'для 1 гостя', '2': 'для 2 гостей'}, '3': {'1': 'для 1 гостя', '2': 'для 2 гостей', '3': 'для 3 гостей'}, '100': {'0': 'не для гостей'}};
  var ENABLED_CONDITION = false;
  var DISABLED_CONDITION = true;
  var URL_DOWNLOAD_DATA = 'https://js.dump.academy/keksobooking/data';
  var URL_SEND_DATA = 'https://js.dump.academy/keksobooking/00';

  var fieldsetList = document.querySelectorAll('fieldset');
  var adForm = document.querySelector('.ad-form');
  var inputAddress = document.querySelector('#address');
  var mapPinsElement = document.querySelector('.map__pins');

  var resetForm = function () {
    adForm.reset();
  };

  adForm.addEventListener('submit', function (evt) {
    window.backend.sendDataToServer(new FormData(adForm), window.backend.submitLoadHandler, window.backend.createErrorMessage, URL_SEND_DATA);
    evt.preventDefault();
  });

  // Функция, которая переводит страницу в начальное состояние. Реагирует только маффин на перетаскивание мышкой
  var disableForm = function (cb) {
    setConditionForms(DISABLED_CONDITION);
    cb();
  };

  var setAddress = function (address) {
    inputAddress.value = address;
  };

  //
  var loadHandler = function (ads) {
    var pinsFragment = document.createDocumentFragment();
    for (var i = 0; i < ads.length; i++) {
      pinsFragment.appendChild(window.map.createPin(ads[i]));
    }
    return mapPinsElement.appendChild(pinsFragment);
  };

  // Функция установки начального состояния формы
  var enableForm = function (cb) {
    cb();
    window.backend.receiveDataFromServer(loadHandler, window.backend.createErrorMessage, URL_DOWNLOAD_DATA);
    adForm.classList.remove('ad-form--disabled');
    setConditionForms(ENABLED_CONDITION);
    getRightNumberOfGuests();
    setRightMinPriceOfDwelling();
    setAddress(window.map.getCoordinatesOfMainPin());

    // mapPinsElement.appendChild(window.map.renderPins());
    roomNumber.addEventListener('change', selectRoomsChangeHandler);
    typeOfHabitation.addEventListener('change', inputTypeChangeHandler);
    selectTimeout.addEventListener('change', selectTimeoutChangeHandler);
    selectTimein.addEventListener('change', selectTimeinChangeHandler);
  };

  // Функция устанавливает состояние форм disabled или enabled
  var setConditionForms = function (condition) {
    for (var i = 0; i < fieldsetList.length; i++) {
      fieldsetList[i].disabled = condition;
    }
  };

  window.form = {
    setAddress: setAddress,
    enableForm: enableForm,
    disableForm: disableForm,
    resetForm: resetForm
  };

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
})();
