'use strict';
var NUMBER_OF_IMAGES = 8;
var NUMBER_OF_ADS = 8;
var RUBLE_CURRENCY = '\u20BD';
var MAX_ROOMS = 5;
var MIN_ROOMS = 1;
var OFFER_TITLES = ['Большая уютная квартира',
  'Маленькая неуютная квартира',
  'Огромный прекрасный дворец',
  'Маленький ужасный дворец',
  'Красивый гостевой домик',
  'Некрасивый негостеприимный домик',
  'Уютное бунгало далеко от моря',
  'Неуютное бунгало по колено в воде'
];// строка, заголовок предложения, одно из фиксированных значений  Значения не должны повторяться
var TYPES_OF_DWELLING = ['palace', 'flat', 'house', 'bungalo'];//  массив строк случайной длины из ниже предложенных:
var MIN_PRICE = 1000;
var MAX_PRICE = 1000000;// число, случайная цена от 1000 до 1000000
var TIMES_OF_REGISTRATION = ['12:00', '13:00', '14:00'];// строка с одним из трёх фиксированных значений:
var OFFER_FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var OFFER_PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];

var map = document.querySelector('.map');

// функция возращает случайный элемент массива
var getRendomItemOfArray = function (array) {
  return array[getRandomInteger(0, array.length - 1)];
};

// Функция вырезает случайный элемент массива
var cutRandomElementOfArray = function (array) {
  return array.splice(getRendomItemOfArray(array), 1).join();
};

// Функция возращает случайное целое число между min и max - включительно
var getRandomInteger = function (min, max) {
  return Math.round(Math.random() * (max - min)) + min;
};

// Функция перемешивает элементы массива
//TODO  Поссылке на один и тот же объект поэтому во всех объектах один и тот же результат.
var jumbleElemetsOfArray = function (array) {
  var j;
  var temp;
  for (var i = array.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    temp = array[j];
    array[j] = array[i];
    array[i] = temp;
  }
  return array;
};

// Функция возращает случайной длины массив от исходного массива
var getRandomLengthArray = function (array) {
  return array.slice(Math.floor(getRandomInteger(1, array.length)));
};

// Функция создает массив с адресами картинок 8 шт.
var createArrayAddressesImages = function () {
  var arrayAddressesImages = [];
  for (var i = NUMBER_OF_IMAGES; i > 0; i--) {
    arrayAddressesImages.push('img/avatars/user' + '0' + i + '.png');
  }
  return arrayAddressesImages;
};

// Функция создает объект с данными соседних жилищ
var createAds = function (numberOfAds) {
  var similiarAds = [];
  var arrayOfAddressesImages = createArrayAddressesImages(numberOfAds);
  var location = {
    x: 600,
    y: 350
  };

  for (var i = 0; i < numberOfAds; i++) {

    similiarAds.push({
      'author': {
        'avatar': cutRandomElementOfArray(arrayOfAddressesImages),  // TODO Доделать идут подряд

        'offer': {
          'title': cutRandomElementOfArray(OFFER_TITLES),  // TODO Доделать идут подряд
          'address': location.x + ', ' + location.y,
          'price': getRandomInteger(MIN_PRICE, MAX_PRICE),
          'type': getRendomItemOfArray(TYPES_OF_DWELLING),
          'guests': getRandomInteger(MIN_ROOMS, MAX_ROOMS),
          'checkin': getRendomItemOfArray(TIMES_OF_REGISTRATION),
          'checkout': getRendomItemOfArray(TIMES_OF_REGISTRATION),
          'features': getRandomLengthArray(OFFER_FEATURES),
          'description': '',
          'photos': jumbleElemetsOfArray(OFFER_PHOTOS)
        },

        'location': ['string']  // TODO Доделать написать функцию.
      }
    });
  }
  return similiarAds;
};
var similiarAds = createAds(NUMBER_OF_ADS);
console.log(similiarAds);

map.classList.remove('map--faded');
