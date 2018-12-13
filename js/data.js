'use strict';

(function () {
  var NUMBER_OF_ADS = 8;
  var MAX_X_LOCATION = 1000;
  var MIN_X_LOCATION = 250;
  var MAX_Y_LOCATION = 630;
  var MIN_Y_LOCATION = 130;
  var OFFER_TITLES = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
  var TIMES_OF_REGISTRATION = ['12:00', '13:00', '14:00'];
  var OFFER_FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var TYPES_OF_DWELLING = {'palace': 'Дворец', 'flat': 'Квартира', 'house': 'Дом', 'bungalo': 'Бунгало'};
  var OFFER_PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
  var TYPES_OF_DWELLING_ARRAY = [TYPES_OF_DWELLING.palace, TYPES_OF_DWELLING.flat, TYPES_OF_DWELLING.house, TYPES_OF_DWELLING.bungalo];
  var MIN_PRICE = 1000;
  var MAX_PRICE = 1000000;
  var MAX_ROOMS = 5;
  var MIN_ROOMS = 1;
  var MAX_GUESTS = 5;
  var MIN_GUESTS = 1;

  //  Функция возращает случайное целое число между min и max - включительно
  var getRandomInteger = function (min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  };

  //  Функция возращает случайной длины массив от исходного массива
  var getRandomLengthArray = function (array) {
    return array.slice(0, array[getRandomInteger(1, array.length)]);
  };

  //  Функция возращает случайный элемент массива
  var getRendomItemOfArray = function (array) {
    return array[Math.floor(Math.random() * array.length)];
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
    var ArrayOfAds = [];
    for (var i = 0; i < numderOfAds; i++) {
      ArrayOfAds.push(createAd(i));
    }
    return ArrayOfAds;
  };

  window.data = createArrayOfAds(NUMBER_OF_ADS);

})();
