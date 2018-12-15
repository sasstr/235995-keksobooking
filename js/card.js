'use strict';

(function () {
  var ESC_KEYCODE = 27;
  var RUBLE_CURRENCY = '\u20BD';
  var ROOM_WORDS = ['комнат', 'комната', 'комнаты'];
  var GUEST_WORDS = ['гостей', 'гостя', 'гостей'];
  var cardTemplate = document.querySelector('#card');

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

  var invokeCallbackByKeydownEsc = function (cb, evtKey) {
    if (evtKey.keyCode === ESC_KEYCODE) {
      cb();
    }
  };

  var popupCloseKeydownEscHandler = function (evt) {
    invokeCallbackByKeydownEsc(removeCard, evt);
  };

  // Функция создает popup для Пина
  var createAdCard = function (ad) {
    removeCard();
    var cardElement = cardTemplate.content.querySelector('.map__card').cloneNode(true);
    var popupCloseClickHandler = function () {
      removeCard();
    };

    cardElement.querySelector('.popup__avatar').src = ad.author.avatar;
    cardElement.querySelector('.popup__title').textContent = ad.offer.title;
    cardElement.querySelector('.popup__text--address').textContent = ad.offer.address;
    cardElement.querySelector('.popup__text--price').textContent = (ad.offer.price + RUBLE_CURRENCY + '/ночь');
    cardElement.querySelector('.popup__type').textContent = ad.offer.type;
    cardElement.querySelector('.popup__text--capacity').textContent = (ad.offer.rooms + ' ' + getCorrectWord(ad.offer.rooms, ROOM_WORDS) + ' для ' + ad.offer.guests + ' ' + getCorrectWord(ad.offer.guests, GUEST_WORDS));
    cardElement.querySelector('.popup__text--time').textContent = ('Заезд после ' + ad.offer.checkin + ', выезд до ' + ad.offer.checkout);
    cardElement.replaceChild(createFeatureDomElements(ad.offer.features), cardElement.querySelector('.popup__features'));
    cardElement.querySelector('.popup__description').textContent = ad.offer.description;
    cardElement.querySelector('.popup__close').addEventListener('click', popupCloseClickHandler);
    document.addEventListener('keydown', popupCloseKeydownEscHandler);
    cardElement.replaceChild(createPopupPhotos(ad), cardElement.querySelector('.popup__photos'));

    return cardElement;
  };

  var showCard = function (ad) {
    document.querySelector('.map').appendChild(createAdCard(ad));
  };

  // Функция удаляет карточку пина
  var removeCard = function () {
    var cardElement = document.querySelector('.map__card');
    if (cardElement) {
      cardElement.remove();
      document.removeEventListener('keydown', popupCloseKeydownEscHandler);
    }
  };

  window.card = {
    showCard: showCard,
    removeCard: removeCard,
    invokeCallbackByKeydownEsc: invokeCallbackByKeydownEsc
  };
})();
