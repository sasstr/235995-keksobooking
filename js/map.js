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
// Функция по клику на главный пин переводит окно в активное состояние
var mainPinMouseupHandler = function (evt) {
  map.classList.remove('map--faded');
  adForm.classList.remove('ad-form--disabled');
  setConditionForms(ENABLED_CONDITION);
  mapPins.appendChild(renderPins());
  inputAddress.value = getCoordinatesOfMainPin(evt);
  mapPinMain.removeEventListener('mouseup', mainPinMouseupHandler);
};

var disableForm = function () {
  setConditionForms(DISABLED_CONDITION);
  mapPinMain.addEventListener('mouseup', mainPinMouseupHandler);
};

disableForm();

var roomNumber = document.querySelector('#room_number');
var capacity = document.querySelector('#capacity');

var rooms = {
  '1': ['для 1 гостя'],
  '2': ['для 1 гостя', 'для 2 гостей'],
  '3': ['для 1 гостя', 'для 2 гостей', 'для 3 гостей'],
  '100': ['не для гостей'],
  'default': ['для 1 гостя', 'для 2 гостей', 'для 3 гостей', 'не для гостей']
};

var selectRoomsChangeHandler = function () {
  capacity.innerHTML = '';
  var selectValue = roomNumber.options.selectedIndex || 'default';
  var options;
  console.log('Ключ объекта: ' + Object.keys(rooms)[selectValue]);
  for (var j = 0; j < rooms[Object.keys(rooms)[selectValue]].length; j++) {
    console.log('Значение value: ' + Object.keys(rooms)[j]);
    console.log('Длина массива Object.keys: ' + Object.keys(rooms)[selectValue].length);
    console.log('Текст text: ' + rooms[selectValue][j]);
    // console.log('Значение value: ' + Object.keys(rooms)[selectValue]);
    options = new Option(rooms[Object.keys(rooms)[selectValue]][j], Object.keys(rooms)[j], false, false);
    capacity.add(options);
  }
};
// rooms.keys(rooms)[j]
roomNumber.addEventListener('change', selectRoomsChangeHandler);

var selectTimein = document.querySelector('#timein');
var selectTimeout = document.querySelector('#timeout');

var connectSelect = function () {
  selectTimein.onchange = function () {
    selectTimeout.selectedIndex = this.selectedIndex;
  };

  selectTimeout.onchange = function () {
    selectTimein.selectedIndex = this.selectedIndex;
  };
};

selectTimein.addEventListener('change', connectSelect);
selectTimeout.addEventListener('change', connectSelect);
