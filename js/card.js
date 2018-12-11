'use strict';

(function () {
  var ESC_KEYCODE = 27;
  var RUBLE_CURRENCY = '\u20BD';
  var ROOM_WORDS = ['комнат', 'комната', 'комнаты'];
  var GUEST_WORDS = ['гостей', 'гостя', 'гостей'];
  var adCard = document.querySelector('#card').content.querySelector('.map__card');


  // Функция создает popup для Пина
  var createAdCard = function (ad) {
    var adDomElement = adCard.cloneNode(true);
    var popupCloseClickHandler = function () {
      window.map.map.querySelector('.map__card').remove();
      adDomElement.querySelector('.popup__close').removeEventListener('click', popupCloseClickHandler);
    };
    var popupCloseKeydownEscHandler = function (evt) {
      if (evt.keyCode === ESC_KEYCODE) {
        window.map.map.querySelector('.map__card').remove();
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
    adDomElement.replaceChild(window.data.createFeatureDomElements(ad.offer.features), adDomElement.querySelector('.popup__features'));
    adDomElement.querySelector('.popup__description').textContent = ad.offer.description;
    adDomElement.querySelector('.popup__close').addEventListener('click', popupCloseClickHandler);
    document.addEventListener('keydown', popupCloseKeydownEscHandler);
    adDomElement.replaceChild(window.data.createPopupPhotos(ad), adDomElement.querySelector('.popup__photos'));

    return adDomElement;
  };

  window.card = {
    showCard: function (itemOfAds) {
      window.map.map.insertBefore(createAdCard(itemOfAds), window.data.mapPins.querySelector('.map__filters-container'));
    }
  };
})();
