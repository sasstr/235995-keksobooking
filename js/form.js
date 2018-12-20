'use strict';

(function () {
  var TYPES_OF_HABITATION = {'bungalo': 0, 'flat': 1000, 'house': 5000, 'palace': 10000};
  var ROOMS = {'1': {'1': 'для 1 гостя'}, '2': {'1': 'для 1 гостя', '2': 'для 2 гостей'}, '3': {'1': 'для 1 гостя', '2': 'для 2 гостей', '3': 'для 3 гостей'}, '100': {'0': 'не для гостей'}};
  var ENABLED_CONDITION = false;
  var DISABLED_CONDITION = true;
  var URL_DOWNLOAD_DATA = 'https://js.dump.academy/keksobooking/data';
  var URL_SEND_DATA = 'https://js.dump.academy/keksobooking/';
  var LAST_FIVE_PINS = -5;

  var mapPinsElement = document.querySelector('.map__pins');
  var mapFilters = document.querySelector('.map__filters');
  var adForm = document.querySelector('.ad-form');
  var fieldsetList = adForm.querySelectorAll('fieldset');
  var inputAddress = adForm.querySelector('#address');
  var typeOfHabitation = adForm.querySelector('#type');
  var inputMinMaxPrice = adForm.querySelector('#price');
  var roomNumber = adForm.querySelector('#room_number');
  var capacity = adForm.querySelector('#capacity');
  var selectTimein = adForm.querySelector('#timein');
  var selectTimeout = adForm.querySelector('#timeout');
  var successMessageTamplate = document.querySelector('#success');
  var successMessage = successMessageTamplate.content.querySelector('.success').cloneNode(true);

  // Функция удаляет все пины
  var removePinsFromScreen = function () {
    var mapPinsListElements = mapPinsElement.querySelectorAll('.map__pin:not(.map__pin--main)');
    mapPinsListElements.forEach(function (pin) {
      pin.remove();
    });
  };

  var resetForm = function () {
    adForm.reset();
  };

  // Функция удаляет дом элемент с сообщением о успешной загрузке
  var mainHtmlElementRemove = function () {
    var successMessageDivElement = document.querySelector('.success');
    if (successMessageDivElement) {
      document.querySelector('main').removeChild(successMessageDivElement);
    }
  };

  // Функция слушатель нажатия на  Esc по сообщению о успешной загрзке
  var successMessageEscKeydownHandler = function (evtKey) {
    document.addEventListener('keydown', mainHtmlElementRemove);
    window.utils.checkEscKeyCode(mainHtmlElementRemove, evtKey);
  };
  document.addEventListener('click', successMessageEscKeydownHandler);
  // Функция слушатель клика по сообщению о успешной загрзке
  var successMessageClickHandler = function () {
    mainHtmlElementRemove();
  };

  //  Функция слушатель события submit в случае удачного соединения выводит сообщение SUCCESS
  var submitLoad = function () {
    window.map.formResetHandler();
    document.addEventListener('click', successMessageClickHandler);
    document.addEventListener('click', successMessageEscKeydownHandler);
    document.querySelector('main').appendChild(successMessage);
  };

  adForm.addEventListener('submit', function (evt) {
    window.backend.save(new FormData(adForm), submitLoad, window.error.show, URL_SEND_DATA);
    evt.preventDefault();
  });
  // Функция, которая переводит страницу в начальное состояние. Реагирует только маффин на перетаскивание мышкой
  var disableForm = function (cb) {
    setConditionForms(DISABLED_CONDITION, fieldsetList);
    setConditionForms(DISABLED_CONDITION, mapFilters.childNodes);
    mapFilters.removeEventListener('change', window.filter.filterChangeHandler);
    roomNumber.removeEventListener('change', selectRoomsChangeHandler);
    typeOfHabitation.removeEventListener('change', inputTypeChangeHandler);
    selectTimeout.removeEventListener('change', selectTimeoutChangeHandler);
    selectTimein.removeEventListener('change', selectTimeinChangeHandler);
    adForm.classList.add('ad-form--disabled');
    cb();
  };

  var setAddress = function (address) {
    inputAddress.value = address;
  };

  // Функция отрезает от массива последние пять элементов.
  var cutPins = function (pinsArray) {
    return pinsArray.slice(LAST_FIVE_PINS);
  };

  // Функция отрисовки Пинов.
  var showPins = function (ads) {
    var pinsFragment = document.createDocumentFragment();
    ads.forEach(function (ad) {
      pinsFragment.appendChild(window.map.createPin(ad));
    });
    return mapPinsElement.appendChild(pinsFragment);
  };

  // Функция создает HTML фрагмент элементов пинов и добавляет в DOM этот фрагмент.
  var pinsNodeLoadHandler = function (ads) {
    window.adsLoaded = ads;
    var adsClone = cutPins(ads);
    showPins(adsClone);
    setConditionForms(ENABLED_CONDITION, mapFilters.childNodes);
  };

  // Функция установки начального состояния формы
  var enableForm = function (cb) {
    cb();
    window.backend.load(pinsNodeLoadHandler, window.error.show, URL_DOWNLOAD_DATA);
    adForm.classList.remove('ad-form--disabled');
    setConditionForms(ENABLED_CONDITION, fieldsetList);
    getRightNumberOfGuests();
    setDwellingMinPrice();
    setAddress(window.map.getCoordinatesOfMainPin());
    mapFilters.addEventListener('change', window.filter.filterChangeHandler);
    roomNumber.addEventListener('change', selectRoomsChangeHandler);
    typeOfHabitation.addEventListener('change', inputTypeChangeHandler);
    selectTimeout.addEventListener('change', selectTimeoutChangeHandler);
    selectTimein.addEventListener('change', selectTimeinChangeHandler);
  };

  // Функция устанавливает состояние форм disabled или enabled
  var setConditionForms = function (condition, htmlElementList) {
    for (var i = 0; i < htmlElementList.length; i++) {
      htmlElementList[i].disabled = condition;
    }
  };

  window.form = {
    setAddress: setAddress,
    enableForm: enableForm,
    disableForm: disableForm,
    resetForm: resetForm,
    removePinsFromScreen: removePinsFromScreen,
    showPins: showPins,
    cutPins: cutPins
  };

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

  // Функция вставляет в разметку минмальную стоимость жилья
  var setDwellingMinPrice = function () {
    inputMinMaxPrice.min = TYPES_OF_HABITATION[typeOfHabitation.value];
    inputMinMaxPrice.placeholder = TYPES_OF_HABITATION[typeOfHabitation.value];
  };

  // Функция слушатель события выбора типа жилья, которая
  // вставляет нужное значение минимальной стоимости жилья.
  var inputTypeChangeHandler = function () {
    setDwellingMinPrice();
  };

  // Функция синхронизации времени въезда и отъезда гостя
  var selectTimeinChangeHandler = function () {
    selectTimeout.selectedIndex = selectTimein.selectedIndex;
  };

  // Функция синхронизации времени въезда и отъезда гостя
  var selectTimeoutChangeHandler = function () {
    selectTimein.selectedIndex = selectTimeout.selectedIndex;
  };
})();
