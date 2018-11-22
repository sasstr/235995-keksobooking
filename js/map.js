'use strict';
var NUMBER_OF_IMAGES = 8;
var NUMBER_OF_ADS = 8;
var RUBLE_CURRENCY = '\u20BD';
var MAX_ROOMS = 5;
var MIN_ROOMS = 1;
var MAX_X_LOCATION = 1199;
var MIN_X_LOCATION = 0;
var MAX_Y_LOCATION = 630;
var MIN_Y_LOCATION = 130;
var MIN_X_ADDRESS = 0;
var MAX_X_ADDRESS = 1200;
var MIN_Y_ADDRESS = 0;
var MAX_Y_ADDRESS = 600;
var OFFER_TITLES = ['Большая уютная квартира',
  'Маленькая неуютная квартира',
  'Огромный прекрасный дворец',
  'Маленький ужасный дворец',
  'Красивый гостевой домик',
  'Некрасивый негостеприимный домик',
  'Уютное бунгало далеко от моря',
  'Неуютное бунгало по колено в воде'
];
var TYPES_OF_DWELLING = ['palace', 'flat', 'house', 'bungalo'];
var MIN_PRICE = 1000;
var MAX_PRICE = 1000000;
var TIMES_OF_REGISTRATION = ['12:00', '13:00', '14:00'];
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
//  TODO  Поссылке на один и тот же объект поэтому во всех объектах один и тот же результат.
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

  for (var i = 0; i < numberOfAds; i++) {
    var location = { // TODO Доделать случайные значения в нужном диапозоне
      'x': getRandomInteger(MIN_X_ADDRESS, MAX_X_ADDRESS),
      'y': getRandomInteger(MIN_Y_ADDRESS, MAX_Y_ADDRESS)
    };
    similiarAds.push({
      'author': {
        'avatar': cutRandomElementOfArray(arrayOfAddressesImages), // TODO Доделать идут подряд

        'offer': {
          'title': cutRandomElementOfArray(OFFER_TITLES), // TODO Доделать идут подряд
          'address': location.x + ', ' + location.y,
          'price': getRandomInteger(MIN_PRICE, MAX_PRICE),
          'type': getRendomItemOfArray(TYPES_OF_DWELLING),
          'guests': getRandomInteger(MIN_ROOMS, MAX_ROOMS),
          'checkin': getRendomItemOfArray(TIMES_OF_REGISTRATION),
          'checkout': getRendomItemOfArray(TIMES_OF_REGISTRATION),
          'features': getRandomLengthArray(OFFER_FEATURES),
          'description': '',
          'photos': jumbleElemetsOfArray(OFFER_PHOTOS)// TODO Доделать ссылка на значение последнего перемешивания
        },

        'location': {
          x: getRandomInteger(MIN_X_LOCATION, MAX_X_LOCATION),
          y: getRandomInteger(MIN_Y_LOCATION, MAX_Y_LOCATION)
        }
      }
    });
  }
  return similiarAds;
};
var similiarAds = createAds(NUMBER_OF_ADS);

console.log(similiarAds);

map.classList.remove('map--faded');

var card = document.querySelector('#card')
    .content
    .querySelector('.map__card popup');

    console.log(card);

var createDomElement = function () {

};

/*
В файле index.html подключите ваш файл при помощи тега script.  +++++++++

1.  Создайте массив, состоящий из 8 сгенерированных JS объектов,  ++++ -----
которые будут описывать похожие объявления неподалёку.

2.  У блока .map уберите класс .map--faded.   ++++++++++++

3.  На основе данных, созданных в первом пункте,   --------------
создайте DOM-элементы, соответствующие меткам на карте,
и заполните их данными из массива. Итоговую разметку
метки .map__pin можно взять из шаблона .map__card.

4.Отрисуйте сгенерированные DOM-элементы в блок .map__pins.  -------------
Для вставки элементов используйте DocumentFragment.

5.На основе первого по порядку элемента из сгенерированного  ------------
массива и шаблона .map__card создайте DOM-элемент объявления,
заполните его данными из объекта и вставьте полученный
DOM-элемент в блок .map перед блоком.map__filters-container:


Требования к коду

Код должен быть разделён на отдельные функции.
Стоит отдельно объявить:
    функцию генерации случайных данных,
    функцию создания DOM-элемента на основе JS-объекта,
    функцию заполнения блока DOM-элементами на основе массива JS-объектов.
Пункты задания примерно соответствуют функциям, которые вы должны создать.
*/
