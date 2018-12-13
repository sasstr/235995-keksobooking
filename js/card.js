'use strict';

(function () {
  var ESC_KEYCODE = 27;
  var RUBLE_CURRENCY = '\u20BD';
  var ROOM_WORDS = ['комнат', 'комната', 'комнаты'];
  var GUEST_WORDS = ['гостей', 'гостя', 'гостей'];
  var adCard = document.querySelector('#card').content.querySelector('.map__card');
  var map = document.querySelector('.map');

  var getValidCoordinates = function (currentCoords, mapPinMainHtmlElement) {
    return Math.round(currentCoords.x + mapPinMainHtmlElement.offsetWidth / 2) >= map.clientLeft && Math.round(currentCoords.x + mapPinMainHtmlElement.offsetWidth / 2) <= map.offsetWidth;
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

  // Функция создает массив с HTML элементами features готовыми для вставки в разметку
  // @fixme перенести в карточку
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
    adDomElement.querySelector('.popup__text--capacity').textContent = (ad.offer.rooms + ' ' + getCorrectWord(ad.offer.rooms, ROOM_WORDS) + ' для ' + ad.offer.guests + ' ' + getCorrectWord(ad.offer.guests, GUEST_WORDS));
    adDomElement.querySelector('.popup__text--time').textContent = ('Заезд после ' + ad.offer.checkin + ', выезд до ' + ad.offer.checkout);
    adDomElement.replaceChild(createFeatureDomElements(ad.offer.features), adDomElement.querySelector('.popup__features'));
    adDomElement.querySelector('.popup__description').textContent = ad.offer.description;
    adDomElement.querySelector('.popup__close').addEventListener('click', popupCloseClickHandler);
    document.addEventListener('keydown', popupCloseKeydownEscHandler);
    adDomElement.replaceChild(createPopupPhotos(ad), adDomElement.querySelector('.popup__photos'));

    return adDomElement;
  };

  var showCard = function (ad) {
    map.appendChild(createAdCard(ad));
  };

  // removeCard @fixme in 6 part
  var removeCard = function () {
    if (document.querySelector('.map__card') !== null) {
      document.querySelector('.map__card').remove();
    }
  };

  window.card = {
    showCard: showCard,
    removeCard: removeCard,
    getValidCoordinates: getValidCoordinates
  };
})();
