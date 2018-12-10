'use strict';

(function () {
  var NUMBER_OF_ADS = 8;
  var MAX_X_LOCATION = 1000;
  var MIN_X_LOCATION = 250;
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
  var PIN_WIDTH = 50;
  var PIN_HEIGHT = 70;
  var ESC_KEYCODE = 27;
  var RUBLE_CURRENCY = '\u20BD';
  var ROOM_WORDS = ['комнат', 'комната', 'комнаты'];
  var GUEST_WORDS = ['гостей', 'гостя', 'гостей'];

  var map = document.querySelector('.map');
  //  Функция создает один элемент массива с данными соседних жилищ
  var createAd = function (index) {
    index = index || 0;
    var location = {
      'x': window.tools.getRandomInteger(MIN_X_LOCATION, MAX_X_LOCATION),
      'y': window.tools.getRandomInteger(window.data.MIN_Y_LOCATION, window.data.MAX_Y_LOCATION)
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
  };

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
  // Функция создает popup для Пина
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
    adDomElement.querySelector('.popup__text--address').textContent = ad.offer.address;
    adDomElement.querySelector('.popup__text--price').textContent = (ad.offer.price + RUBLE_CURRENCY + '/ночь');
    adDomElement.querySelector('.popup__type').textContent = ad.offer.type;
    adDomElement.querySelector('.popup__text--capacity').textContent = (ad.offer.rooms + ' ' + window.tools.getCorrectWord(ad.offer.rooms, ROOM_WORDS) + ' для ' + ad.offer.guests + ' ' + window.tools.getCorrectWord(ad.offer.guests, GUEST_WORDS));
    adDomElement.querySelector('.popup__text--time').textContent = ('Заезд после ' + ad.offer.checkin + ', выезд до ' + ad.offer.checkout);
    adDomElement.replaceChild(createFeatureDomElements(ad.offer.features), adDomElement.querySelector('.popup__features'));
    adDomElement.querySelector('.popup__description').textContent = ad.offer.description;
    adDomElement.querySelector('.popup__close').addEventListener('click', popupCloseClickHandler);
    document.addEventListener('keydown', popupCloseKeydownEscHandler);
    adDomElement.replaceChild(createPopupPhotos(ad), adDomElement.querySelector('.popup__photos'));

    return adDomElement;
  };

  // Функция создает массив объявлений
  var createArrayOfAds = function (numderOfAds) {
    var ads = [];
    for (var i = 0; i < numderOfAds; i++) {
      ads.push(createAd(i));
    }
    return ads;
  };


  // Функция отрисовывает popup по пину
  var showCard = function (itemOfAds) {
    map.insertBefore(createAdCard(itemOfAds), mapPins.querySelector('.map__filters-container'));
  };
})();

