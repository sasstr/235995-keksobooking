'use strict';
var NUMBER_OF_ADS = 8;
var RUBLE_CURRENCY = '\u20BD';
var PIN_WIDTH = 50;
var PIN_HEIGHT = 70;
var MAX_ROOMS = 5;
var MIN_ROOMS = 1;
var MAX_GUESTS = 5;
var MIN_GUESTS = 1;
var MAX_X_LOCATION = 1000;
var MIN_X_LOCATION = 250;
var MAX_Y_LOCATION = 630;
var MIN_Y_LOCATION = 130;
var ROOM_WORDS = ['комнат', 'комната', 'комнаты'];
var GUEST_WORDS = ['гостей', 'гостя', 'гостей'];
var OFFER_TITLES = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
var TYPES_OF_DWELLING = {'palace': 'Дворец', 'flat': 'Квартира', 'house': 'Дом', 'bungalo': 'Бунгало'};
var MIN_PRICE = 1000;
var MAX_PRICE = 1000000;
var TYPES_OF_DWELLING_ARRAY = [TYPES_OF_DWELLING.palace, TYPES_OF_DWELLING.flat, TYPES_OF_DWELLING.house, TYPES_OF_DWELLING.bungalo];
var TIMES_OF_REGISTRATION = ['12:00', '13:00', '14:00'];
var OFFER_FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var OFFER_PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var ENABLED_CONDITION = false;
var DISABLED_CONDITION = true;
var ESC_KEYCODE = 27;
var ROOMS = {'1': {'1': 'для 1 гостя'}, '2': {'1': 'для 1 гостя', '2': 'для 2 гостей'}, '3': {'1': 'для 1 гостя', '2': 'для 2 гостей', '3': 'для 3 гостей'}, '100': {'0': 'не для гостей'}};
var TYPES_OF_HABITATION = {'bungalo': 0, 'flat': 1000, 'house': 5000, 'palace': 10000};

var map = document.querySelector('.map');

//  Функция возращает случайное целое число между min и max - включительно
var getRandomInteger = function (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};

//  Функция возращает случайной длины массив от исходного массива
var getRandomLengthArray = function (array) {
  return array.slice(0, getRandomInteger(1, array.length));
};

//  Функция возращает случайный элемент массива
var getRendomItemOfArray = function (array) {
  return array[getRandomInteger(0, array.length)];
};

//  Функция перемешивает элементы массива
var jumbleElemetsOfArray = function (array) {
  var cloneArray = array.slice();
  var j;
  var temp;
  for (var i = 0; i < cloneArray.length; i++) {
    j = Math.floor(Math.random() * (i + 1));
    temp = cloneArray[j];
    cloneArray[j] = cloneArray[i];
    cloneArray[i] = temp;
  }
  return cloneArray;
};

//  Функция создает один элемент массива с данными соседних жилищ
var createAd = function (index) {
  index = index || 0;
  var location = {
    'x': getRandomInteger(MIN_X_LOCATION, MAX_X_LOCATION),
    'y': getRandomInteger(MIN_Y_LOCATION, MAX_Y_LOCATION)
  };
  var similiarAd = {
    'author': {
      'avatar': 'img/avatars/user0' + (index + 1) + '.png',
    },
    'offer': {
      'title': OFFER_TITLES[index],
      'address': location.x + ', ' + location.y,
      'price': getRandomInteger(MIN_PRICE, MAX_PRICE),
      'type': getRendomItemOfArray(TYPES_OF_DWELLING_ARRAY),
      'rooms': getRandomInteger(MIN_ROOMS, MAX_ROOMS),
      'guests': getRandomInteger(MIN_GUESTS, MAX_GUESTS),
      'checkin': getRendomItemOfArray(TIMES_OF_REGISTRATION),
      'checkout': getRendomItemOfArray(TIMES_OF_REGISTRATION),
      'features': getRandomLengthArray(jumbleElemetsOfArray(OFFER_FEATURES)),
      'description': '',
      'photos': jumbleElemetsOfArray(OFFER_PHOTOS)
    },
    'location': {
      x: location.x,
      y: location.y
    }
  };
  return similiarAd;
};

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

// Функция создает пин
var createPin = function (ad) {
  var pinElement = document.createElement('button');
  var pinChildImg = document.createElement('img');
  var pinElementClickHandler = function () {
    if (map.querySelector('.map__card') !== null) {
      map.querySelector('.map__card').remove();
    }
    showCard(ad);
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

// Функция отрисует все пины
var renderPins = function () {
  var pinsFragment = document.createDocumentFragment();
  for (var i = 0; i < NUMBER_OF_ADS; i++) {
    pinsFragment.appendChild(createPin(ads[i]));
  }
  return pinsFragment;
};

// Функция создает массив с HTML элементами features готовыми для вставки в разметку
var createFeatureDomElements = function (adOfferFeatures) {
  var popupFeatures = document.createElement('ul');
  popupFeatures.classList.add('popup__features');

  for (var i = 0; i < adOfferFeatures.length; i++) {
    var popupFeature = document.createElement('li');
    var classFeature = 'popup__feature--' + adOfferFeatures[i];
    popupFeature.classList.add('popup__feature');
    popupFeatures.appendChild(popupFeature).classList.add(classFeature);
  }
  return popupFeatures;
};

// Функция создает массив с HTML элементами photos готовыми для вставки в разметку
var createPopupPhotos = function (ad) {
  var popupPhotoDiv = document.createElement('div');
  popupPhotoDiv.classList.add('popup__photos');

  for (var i = 0; i < ad.offer.photos.length; i++) {
    var popupPhoto = document.createElement('img');
    popupPhoto.classList.add('popup__photo');
    popupPhoto.width = 45;
    popupPhoto.height = 40;
    popupPhoto.alt = 'Фотография жилья';
    popupPhoto.src = ad.offer.photos[i];
    popupPhotoDiv.appendChild(popupPhoto);
  }
  return popupPhotoDiv;
};

// Функция вставляет верное написание слова из массива
var getCorrectWord = function (items, words) {
  if (items % 100 > 4 && items % 100 < 21) {
    return words[0];
  } else if (items % 10 === 1) {
    return words[1];
  } else if (items % 10 > 1 && items % 10 < 5) {
    return words[2];
  }
  return words[0];
};

// Функция создает объявление
var createAdCard = function (ad) {
  var adDomElement = adCard.cloneNode(true);
  var popupCloseClickHandler = function () {
    map.querySelector('.map__card').remove();
    adDomElement.querySelector('.popup__close').removeEventListener('click', popupCloseClickHandler);
  };
  var popupCloseKeydownEscHandler = function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      map.querySelector('.map__card').remove();
      document.removeEventListener('keydown', popupCloseKeydownEscHandler);
    }
  };

  adDomElement.querySelector('.popup__avatar').src = ad.author.avatar;
  adDomElement.querySelector('.popup__title').textContent = ad.offer.title;
  adDomElement.querySelector('.popup__text--price').textContent = (ad.offer.price + RUBLE_CURRENCY + '/ночь');
  adDomElement.querySelector('.popup__type').textContent = ad.offer.type;
  adDomElement.querySelector('.popup__text--capacity').textContent = (ad.offer.rooms + ' ' + getCorrectWord(ad.offer.rooms, ROOM_WORDS) + ' для ' + ad.offer.guests + ' ' + getCorrectWord(ad.offer.guests, GUEST_WORDS));
  adDomElement.querySelector('.popup__text--time').textContent = ('Заезд после ' + ad.offer.checkin + ', выезд до ' + ad.offer.checkout);
  adDomElement.replaceChild(createFeatureDomElements(ad.offer.features), adDomElement.querySelector('.popup__features'));
  adDomElement.querySelector('.popup__description').textContent = ad.offer.description;
  adDomElement.querySelector('.popup__close').addEventListener('click', popupCloseClickHandler);
  document.addEventListener('keydown', popupCloseKeydownEscHandler);
  adDomElement.replaceChild(createPopupPhotos(ad), adDomElement.querySelector('.popup__photos'));

  return adDomElement;
};

var showCard = function (itemOfAds) {
  map.insertBefore(createAdCard(itemOfAds), mapPins.querySelector('.map__filters-container'));
};

var fieldsetList = document.querySelectorAll('fieldset');
var adForm = document.querySelector('.ad-form');
var mapPinMain = document.querySelector('.map__pin--main');
var inputAddress = document.querySelector('#address');

// Функция устанавливает состояние форм disabled или enabled
var setConditionForms = function (condition) {
  for (var i = 0; i < fieldsetList.length; i++) {
    fieldsetList[i].disabled = condition;
  }
};

var getCoordinatesOfMainPin = function () {
  return Math.round(mapPinMain.offsetTop + mapPinMain.offsetWidth / 2) + ', ' + (mapPinMain.offsetLeft + mapPinMain.offsetHeight);
};

/* document.addEventListener('onload', function () {
  inputAddress.value = getCoordinatesOfMainPin();
}); */
// Функция по клику на главный пин переводит окно в активное состояние
var mainPinMousedownHandler = function (evt) {
  map.classList.remove('map--faded');
  adForm.classList.remove('ad-form--disabled');
  setConditionForms(ENABLED_CONDITION);
  enableForm();
  mapPins.appendChild(renderPins());
  inputAddress.value = getCoordinatesOfMainPin(evt);
  mapPinMain.removeEventListener('mousedown', mainPinMousedownHandler);
  mapPinMain.addEventListener('mousemove', mainPinDragHandler);
};
// Функция, которая переводит страницу в начальное состояние. Реагирует только маффин на перетаскивание мышкой
var disableForm = function () {
  setConditionForms(DISABLED_CONDITION);
  mapPinMain.addEventListener('mousedown', mainPinMousedownHandler);
  mapPinMain.removeEventListener('mousemove', mainPinDragHandler);
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

// Функция установки начального состояния формы
var enableForm = function () {
  getRightNumberOfGuests();
  setRightMinPriceOfDwelling();
  roomNumber.addEventListener('change', selectRoomsChangeHandler);
  typeOfHabitation.addEventListener('change', inputTypeChangeHandler);
  selectTimeout.addEventListener('change', selectTimeoutChangeHandler);
  selectTimein.addEventListener('change', selectTimeinChangeHandler);
};

var mainPinMouseDownActive = function (evtAct) {
  if (map.classList === 'map--faded') {
    map.classList.remove('map--faded');
    adForm.classList.remove('ad-form--disabled');
    setConditionForms(ENABLED_CONDITION);
    enableForm();
    // mapPins.appendChild(renderPins());
    inputAddress.value = getCoordinatesOfMainPin(evtAct);
    mapPinMain.removeEventListener('mousedown', mainPinMousedownHandler);
    mapPinMain.addEventListener('mousemove', mainPinDragHandler);
  }
};

var mainPinDragHandler = function (evt) {

  var startCoords = {
    x: evt.clientX,
    y: evt.clientY
  };

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

    var validCoordinateX = Math.round(currentCoordinates.x + mapPinMain.offsetWidth / 2) > MIN_X_LOCATION && Math.round(currentCoordinates.x + mapPinMain.offsetWidth / 2) < MAX_X_LOCATION;
    var validCoordinateY = (currentCoordinates.y + mapPinMain.offsetHeight) > MIN_Y_LOCATION && (currentCoordinates.y + mapPinMain.offsetHeight) < MAX_Y_LOCATION;

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

  var MouseUpHandler = function (upEvt) {
    upEvt.preventDefault();
    document.removeEventListener('mousemove', MouseMoveHandler);
    document.removeEventListener('mouseup', MouseUpHandler);
  };

  document.addEventListener('mousemove', MouseMoveHandler);
  document.addEventListener('mouseup', MouseUpHandler);
};
mapPinMain.addEventListener('mousemove', mainPinDragHandler);
console.dir(map);
/*
В этом задании мы решим задачу перемещения главного маркера (.map__pin--main) по карте.

Опишите полный цикл Drag-and-drop для маркера,
добавив обработчики событий
mousedown,
mousemove,
mouseup
на маркер.

Перед тем, как добавить новые обработчики не забудьте удалить код установки обработчика click,
который мы писали для перевода страницы Букинга в активный режим. Он нам больше не понадобится, т.к.
мы реализуем полноценное перетаскивание маркера и переводить страницу в активный режим будем

В соответствии с техническим заданием: первое перемещение метки переводит страницу в активное состояние.

Обработчики mousemove и mouseup должны добавляться только при вызове обработчика mousedown.

Обработчики mousemove и mouseup должны запускать логику изменения положения маркера:
в нём должны вычисляться новые координаты маркера на основании смещения,
применяться через стили к элементу и записываться в поле адреса
(с поправкой на то, что в адрес записываются координаты острого конца).

Учтите, что расчёт координат маркера и их запись в поле адреса должна дублироваться и
в обработчике mouseup, потому что в некоторых случаях пользователь
может нажать мышь на маркере, но никуда его не переместить.

Ещё один момент касается ограничения перетаскивания: не забудьте сделать так,
чтобы маркер невозможно было переместить за пределы карты (см. пункт 3.4).

Вспомните, что в прошлом задании вы уже добавляли обработчик на событие mouseup,
который переводил страницу в активный режим. Теперь, когда у вас есть синхронизация с координатами,
вам нужно выбрать стратегию, вы можете использовать или несколько
обработчиков или один обработчик со сложной логикой.

Пункты ТЗ, выполненные в задании:
Неактивное состояние. Единственное доступное действие в неактивном состоянии
— перетаскивание метки .map__pin--main, являющейся контролом указания адреса объявления.
Первое перемещение метки переводит страницу в активное состояние.

3.3. Обратите внимание на то, что координаты по X и Y, соответствующие адресу,
должны высчитываться не от левого верхнего угла блока с меткой,
а от места, куда указывает метка своим острым концом.

3.4. Чтобы метку невозможно было поставить выше горизонта или ниже панели фильтров,
значение координаты Y должно быть ограничено интервалом от 130 до 630.
Значение координаты X должно быть ограничено размерами блока, в котором перетаскивается метка.

При органичении перемещения маркера по горизонтали можно
как учитывать ширину маркера, так и не учитывать.
Если при перемещении не учитывать ширину маркера, острый
конец может указывать на крайнюю точку блока, при этом часть
маркера окажется за пределами блока. Если размеры маркера учитывать,
то при достижении края блока, граница маркера будет касаться края,
при этом острый конец будет немного отстоять от края.

Допустимы оба варианта.

Например:

Если метка .map__pin--main имеет координаты 300×200,
то в поле адрес должно быть записано значение 300, 200.
*/
