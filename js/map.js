'use strict';
var NUMBER_OF_IMAGES = 8;
var NUMBER_OF_ADS = 8;
var RUBLE_CURRENCY = '\u20BD';
var MAX_ROOMS = 5;
var MIN_ROOMS = 1;
var MAX_GUESTS = 5;
var MIN_GUESTS = 1;
var MAX_X_LOCATION = 1000;
var MIN_X_LOCATION = 0;
var MAX_Y_LOCATION = 630;
var MIN_Y_LOCATION = 130;
var MIN_X_ADDRESS = 0;
var MAX_X_ADDRESS = 1200;
var MIN_Y_ADDRESS = 0;
var MAX_Y_ADDRESS = 600;
var OFFER_TITLES = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
var TYPES_OF_DWELLING = {'palace': 'Дворец', 'flat': 'Квартира', 'house': 'Дом', 'bungalo': 'Бунгало'};
var MIN_PRICE = 1000;
var MAX_PRICE = 1000000;
var TIMES_OF_REGISTRATION = ['12:00', '13:00', '14:00'];
var OFFER_FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var OFFER_PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];

var map = document.querySelector('.map');

//  Функция возращает случайное целое число между min и max - включительно
var getRandomInteger = function (min, max) {
  return Math.round(Math.random() * (max - min)) + min;
};

//  Функция возращает случайный элемент массива
var getRendomItemOfArray = function (array) {
  return array[getRandomInteger(0, array.length - 1)];
};

//  Функция вырезает случайный элемент массива
var cutRandomElementOfArray = function (array) {
  return array.splice(getRandomInteger(0, array.length - 1), 1).join();
};

//  Функция перемешивает элементы массива
var jumbleElemetsOfArray = function (array) {
  array.slice();
  var j;
  var temp;
  for (var i = 0; i < array.length; i++) {
    j = Math.floor(Math.random() * (i + 1));
    temp = array[j];
    array[j] = array[i];
    array[i] = temp;
  }
  return array;
};

//  Функция возращает случайной длины массив от исходного массива
var getRandomLengthArray = function (array) {
  return array.slice(Math.floor(getRandomInteger(1, array.length)));
};

//  Функция создает массив с адресами картинок.
var createArrayAddressesImages = function (numberOfImages) {
  var arrayAddressesImages = [];
  for (var i = 0; i < numberOfImages; i++) {
    arrayAddressesImages.push('img/avatars/user0' + (i + 1) + '.png');
  }
  return arrayAddressesImages;
};
var arrayOfAddressesImages = createArrayAddressesImages(NUMBER_OF_IMAGES);
//  Функция создает один элемент массива с данными соседних жилищ
var createAd = function (arrayOfImages) {
  var TYPES_OF_DWELLING_ARRAY = [TYPES_OF_DWELLING.palace, TYPES_OF_DWELLING.flat, TYPES_OF_DWELLING.house, TYPES_OF_DWELLING.bungalo];
  var location = {
    'x': getRandomInteger(MIN_X_ADDRESS, MAX_X_ADDRESS),
    'y': getRandomInteger(MIN_Y_ADDRESS, MAX_Y_ADDRESS)
  };
  var similiarAd = {
    'author': {
      'avatar': cutRandomElementOfArray(arrayOfImages),

      'offer': {
        'title': cutRandomElementOfArray(OFFER_TITLES),
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

      'location': {//  TODO Проверить верно ли заданы мин и макс для координат
        x: getRandomInteger(MIN_X_LOCATION, MAX_X_LOCATION),
        y: getRandomInteger(MIN_Y_LOCATION, MAX_Y_LOCATION)
      }
    }
  };
  return similiarAd;
};

// Функция создает массив объявлений
var createArrayOfAds = function (numderOfAds) {
  var ArrayOfAds = [];
  for (var i = 0; i < numderOfAds; i++) {
    ArrayOfAds.push(createAd(arrayOfAddressesImages));
  }
  return ArrayOfAds;
};

map.classList.remove('map--faded');
var ads = createArrayOfAds(NUMBER_OF_ADS);
var adCard = document.querySelector('#card').content.querySelector('.map__card');
var mapPin = document.querySelector('.map__pins');

// Функция создает пин
var createPin = function (ad) {
  var pinElement = document.createElement('button');
  var pinChildImg = document.createElement('img');

  pinElement.classList.add('map__pin');
  pinElement.style.left = (ad.author.location.x + 32) + 'px';
  pinElement.style.top = (ad.author.location.y + 32) + 'px';
  pinChildImg.src = ad.author.avatar;
  pinChildImg.width = 40;
  pinChildImg.height = 40;
  pinChildImg.draggable = false;
  pinChildImg.alt = ad.author.offer.title;
  pinElement.appendChild(pinChildImg);

  return pinElement;
};

// Функция отрисует все пины
var renderPins = function (numberOfPins) {
  var pinsFragment = document.createDocumentFragment();
  for (var i = 0; i < numberOfPins; i++) {
    pinsFragment.appendChild(createPin(ads[i]));
  }
  return pinsFragment;
};
// Добавляем пины на карту
mapPin.appendChild(renderPins(NUMBER_OF_ADS));

// Функция создает массив с HTML элементами features готовыми для вставки в разметку
var createFeatureDomElements = function (ad) {
  var popupFeatures = document.createElement('ul');
  popupFeatures.classList.add('popup__features');

  for (var i = 0; i < ad.author.offer.features.length; i++) {
    var popupFeature = document.createElement('li');
    var classFeature = 'popup__feature--' + ad.author.offer.features[i];
    popupFeature.classList.add('popup__feature');
    popupFeatures.appendChild(popupFeature).classList.add(classFeature);
  }
  return popupFeatures;
};

// Функция создает массив с HTML элементами photos готовыми для вставки в разметку
var createPopupPhotos = function (ad) {
  var popupPhotoDiv = document.createElement('div');
  popupPhotoDiv.classList.add('popup__photos');

  for (var i = 0; i < ad.author.offer.photos.length; i++) {
    var popupPhoto = document.createElement('img');
    popupPhoto.classList.add('popup__photo');
    popupPhoto.width = 45;
    popupPhoto.height = 40;
    popupPhoto.alt = 'Фотография жилья';
    popupPhoto.src = ad.author.offer.photos[i];
    popupPhotoDiv.appendChild(popupPhoto);
  }
  return popupPhotoDiv;
};

// Функция вставляет верное написание слова гость
var getCorrectWord = function (numberOfGuests) {
  if (numberOfGuests % 10 === 1) {
    return 'гостя';
  }
  return (numberOfGuests % 100 > 4 && numberOfGuests % 100 < 21) ? 'гостей' : 'гостей';
};

// Функция вставляет верное написание слова комнат
var getCorrectWordRoom = function (numberOfRooms) {
  if (numberOfRooms % 10 === 1) {
    return 'комната';
  }
  else if (numberOfRooms % 10 > 1 && numberOfRooms % 10 < 5) {
    return 'комнаты';
  }
  return (numberOfRooms % 100 > 4 && numberOfRooms % 100 < 21) ? 'комнат' : 'комнат';
};

// Функция создает объявление
var createAdCard = function (ad) {
  var adDomElement = adCard.cloneNode(true);

  adDomElement.querySelector('.popup__avatar').src = ad.author.avatar;
  adDomElement.querySelector('.popup__title').textContent = ad.author.offer.title;
  adDomElement.querySelector('.popup__text--price').textContent = (ad.author.offer.price + RUBLE_CURRENCY + '/ночь');
  adDomElement.querySelector('.popup__type').textContent = ad.author.offer.type;
  adDomElement.querySelector('.popup__text--capacity').textContent = (ad.author.offer.rooms + ' ' + getCorrectWordRoom(ad.author.offer.rooms) + ' для ' + ad.author.offer.guests + ' ' + getCorrectWord(ad.author.offer.guests));
  adDomElement.querySelector('.popup__text--time').textContent = ('Заезд после ' + ad.author.offer.checkin + ', выезд до ' + ad.author.offer.checkout);
  adDomElement.replaceChild(createFeatureDomElements(ad), adDomElement.querySelector('.popup__features'));
  // adDomElement.querySelector('popup__description').textContent = ad.author.offer.description;
  adDomElement.replaceChild(createPopupPhotos(ad), adDomElement.querySelector('.popup__photos'));

  return adDomElement;
};

// Функция отрисует первую карточку из массива
var renderCard = function (createCardAd, arrayOfAds) {
  var cardFragment = document.createDocumentFragment();
  cardFragment.appendChild(createCardAd(arrayOfAds[0]));

  return cardFragment;
};
// Добавляем первую карточку из массива сгенерированных карточек
map.insertBefore(renderCard(createAdCard, ads), mapPin.querySelector('.map__filters-container'));
