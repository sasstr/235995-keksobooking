'use strict';

(function () {

  var RUBLE_CURRENCY = '\u20BD';
  var ROOM_WORDS = ['комнат', 'комната', 'комнаты'];
  var GUEST_WORDS = ['гостей', 'гостя', 'гостей'];
  var TYPES_OF_DWELLING = {'palace': 'Дворец', 'flat': 'Квартира', 'house': 'Дом', 'bungalo': 'Бунгало'};

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
  var createFeatureList = function (adOfferFeatures) {
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

  var popupCloseKeydownEscHandler = function (evt) {
    window.utils.checkEscKeyCode(evt, removeCard);
  };

  var popupCloseClickHandler = function () {
    removeCard();
  };

  // Функция создает popup для Пина
  var createAdCard = function (ad) {
    removeCard();
    var card = cardTemplate.content.querySelector('.map__card').cloneNode(true);

    card.querySelector('.popup__avatar').src = ad.author.avatar;
    card.querySelector('.popup__title').textContent = ad.offer.title;
    card.querySelector('.popup__text--address').textContent = ad.offer.address;
    card.querySelector('.popup__text--price').textContent = (ad.offer.price + RUBLE_CURRENCY + '/ночь');
    card.querySelector('.popup__type').textContent = TYPES_OF_DWELLING[ad.offer.type];
    card.querySelector('.popup__text--capacity').textContent = (ad.offer.rooms + ' ' + getCorrectWord(ad.offer.rooms, ROOM_WORDS) + ' для ' + ad.offer.guests + ' ' + getCorrectWord(ad.offer.guests, GUEST_WORDS));
    card.querySelector('.popup__text--time').textContent = ('Заезд после ' + ad.offer.checkin + ', выезд до ' + ad.offer.checkout);
    card.replaceChild(createFeatureList(ad.offer.features), card.querySelector('.popup__features'));
    card.querySelector('.popup__description').textContent = ad.offer.description;
    card.querySelector('.popup__close').addEventListener('click', popupCloseClickHandler);
    document.addEventListener('keydown', popupCloseKeydownEscHandler);
    card.replaceChild(createPopupPhotos(ad), card.querySelector('.popup__photos'));
    card.childNodes.forEach(function (item, i) {
      if ((item.textContent === '' && item.childNodes.length === 0 && item.src === undefined) || item.src === '') {
        card.childNodes[i].classList.add('hidden');
      }
    });
    return card;
  };

  var showCard = function (ad) {
    document.querySelector('.map').appendChild(createAdCard(ad));
  };

  // Функция удаляет карточку пина
  var removeCard = function () {
    var cardElement = document.querySelector('.map__card');
    if (cardElement) {
      window.map.deleteClassMapPinActive();
      cardElement.querySelector('.popup__close').removeEventListener('click', popupCloseClickHandler);
      document.removeEventListener('keydown', popupCloseKeydownEscHandler);
      cardElement.remove();
    }
  };

  window.card = {
    show: showCard,
    remove: removeCard,
  };
})();
