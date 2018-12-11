'use strict';

(function () {
  var NUMBER_OF_ADS = 8;

  // Функция создает массив объявлений
  var createArrayOfAds = function (numderOfAds) {
    var ArrayOfAds = [];
    for (var i = 0; i < numderOfAds; i++) {
      ArrayOfAds.push(window.card.createAd(i));
    }
    return ArrayOfAds;
  };

  window.data = {
    mapPins: document.querySelector('.map__pins'),
    ads: createArrayOfAds(NUMBER_OF_ADS),
    // Функция создает массив с HTML элементами features готовыми для вставки в разметку
    createFeatureDomElements: function (adOfferFeatures) {
      var popupFeatures = document.createElement('ul');
      popupFeatures.classList.add('popup__features');

      for (var i = 0; i < adOfferFeatures.length; i++) {
        var popupFeature = document.createElement('li');
        var classFeature = 'popup__feature--' + adOfferFeatures[i];
        popupFeature.classList.add('popup__feature');
        popupFeatures.appendChild(popupFeature).classList.add(classFeature);
      }
      return popupFeatures;
    },
    // Функция создает массив с HTML элементами photos готовыми для вставки в разметку
    createPopupPhotos: function (ad) {
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
    }
  };
})();

