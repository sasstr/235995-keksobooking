'use strict';

(function () {
  var TYPES_OF_HABITATION = {'bungalo': 0, 'flat': 1000, 'house': 5000, 'palace': 10000};
  var ROOMS = {'1': {'1': 'для 1 гостя'}, '2': {'1': 'для 1 гостя', '2': 'для 2 гостей'}, '3': {'1': 'для 1 гостя', '2': 'для 2 гостей', '3': 'для 3 гостей'}, '100': {'0': 'не для гостей'}};
  var ENABLED_CONDITION = false;
  var DISABLED_CONDITION = true;
  var URL_DOWNLOAD_DATA = 'https://js.dump.academy/keksobooking/data';
  var URL_SEND_DATA = 'https://js.dump.academy/keksobooking/';
  var LAST_FIVE_PINS = -5;

  var fieldsetList = document.querySelectorAll('fieldset');
  var adForm = document.querySelector('.ad-form');
  var inputAddress = document.querySelector('#address');
  var mapPinsElement = document.querySelector('.map__pins');
  var mapFilters = document.querySelector('.map__filters');

  // Функция удаляет все пины
  var removePinsFromScreen = function () {
    var mapPinsListElements = document.querySelectorAll('.map__pin:not(.map__pin--main)');
    mapPinsListElements.forEach(function (pin) {
      pin.remove();
    });
  };

  var resetForm = function () {
    adForm.reset();
  };

  var successMessageTamplate = document.querySelector('#success');
  var successMessage = successMessageTamplate.content.querySelector('.success').cloneNode(true);

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
    window.utils.actionKeydownEsc(mainHtmlElementRemove, evtKey);
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
    adForm.classList.add('ad-form--disabled');
    cb();
  };

  var setAddress = function (address) {
    inputAddress.value = address;
  };

  // Функция отрезает от массива последние пять элементов.
  var cutLastFivePins = function (pinsArray) {
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
  var PinsNodeLoadHandler = function (ads) {
    window.adsLoaded = ads;
    var adsClone = cutLastFivePins(ads);
    showPins(adsClone);
    setConditionForms(ENABLED_CONDITION, mapFilters.childNodes);
  };

  // Функция установки начального состояния формы
  var enableForm = function (cb) {
    cb();
    window.backend.load(PinsNodeLoadHandler, window.error.show, URL_DOWNLOAD_DATA);
    adForm.classList.remove('ad-form--disabled');
    setConditionForms(ENABLED_CONDITION, fieldsetList);

    getRightNumberOfGuests();
    setRightMinPriceOfDwelling();
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
    cutLastFivePins: cutLastFivePins
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

  // Функция слушатель события выбора типа жилья, которая
  // вставляет нужное значение минимальной стоимости жилья.
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
