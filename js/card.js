'use strict';

(function () {
  var MAX_X_LOCATION = 1000;
  var MIN_X_LOCATION = 250;
  var MAX_Y_LOCATION = 630;
  var MIN_Y_LOCATION = 130;
  var OFFER_TITLES = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
  var TIMES_OF_REGISTRATION = ['12:00', '13:00', '14:00'];
  var OFFER_FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var OFFER_PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
  var TYPES_OF_DWELLING = {'palace': 'Дворец', 'flat': 'Квартира', 'house': 'Дом', 'bungalo': 'Бунгало'};
  var TYPES_OF_DWELLING_ARRAY = [TYPES_OF_DWELLING.palace, TYPES_OF_DWELLING.flat, TYPES_OF_DWELLING.house, TYPES_OF_DWELLING.bungalo];
  var MIN_PRICE = 1000;
  var MAX_PRICE = 1000000;
  var MAX_ROOMS = 5;
  var MIN_ROOMS = 1;
  var MAX_GUESTS = 5;
  var MIN_GUESTS = 1;

  window.card = {
    //  Функция создает один элемент массива с данными соседних жилищ
    createAd: function (index) {
      index = index || 0;
      var location = {
        'x': window.tools.getRandomInteger(MIN_X_LOCATION, MAX_X_LOCATION),
        'y': window.tools.getRandomInteger(MIN_Y_LOCATION, MAX_Y_LOCATION)
      };
      var similiarAd = {
        'author': {
          'avatar': 'img/avatars/user0' + (index + 1) + '.png',
        },
        'offer': {
          'title': OFFER_TITLES[index],
          'address': location.x + ', ' + location.y,
          'price': window.tools.getRandomInteger(MIN_PRICE, MAX_PRICE),
          'type': window.tools.getRendomItemOfArray(TYPES_OF_DWELLING_ARRAY),
          'rooms': window.tools.getRandomInteger(MIN_ROOMS, MAX_ROOMS),
          'guests': window.tools.getRandomInteger(MIN_GUESTS, MAX_GUESTS),
          'checkin': window.tools.getRendomItemOfArray(TIMES_OF_REGISTRATION),
          'checkout': window.tools.getRendomItemOfArray(TIMES_OF_REGISTRATION),
          'features': window.tools.getRandomLengthArray(window.tools.jumbleElemetsOfArray(OFFER_FEATURES)),
          'description': '',
          'photos': window.tools.jumbleElemetsOfArray(OFFER_PHOTOS)
        },
        'location': {
          x: location.x,
          y: location.y
        }
      };
      return similiarAd;
    }
  };
})();
