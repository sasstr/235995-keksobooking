'use strict';

(function () {
  var PINS_NUMBER = -5;

  var housingType = document.querySelector('#housing-type');
  var housingRooms = document.querySelector('#housing-rooms');
  var housingGuests = document.querySelector('#housing-guests');
  var housingPrice = document.querySelector('#housing-price');
  var housingFeatures = document.querySelector('#housing-features');

  var PriceLevel = {
    CHEAP: 10000,
    EXPENSIVE: 50000
  };
  // Функция проверяет какая option выбрана в select.
  var checkIsOptionSelected = function (adItem, selectItem) {
    if (selectItem.value === 'any') {
      return true;
    } else if ((parseInt(selectItem.value, 10).isInteger)) {
      return parseInt(selectItem.value, 10) === adItem;
    } else {
      return selectItem.value === adItem;
    }
  };
  // Функция проверяет какая option выбрана в select housingType.
  var getSelectedTypeOfDwelling = function (ad) {
    if (housingType.value === 'any') {
      return true;
    }
    return housingType.value === ad.offer.type;
    /* checkIsOptionSelected(ad.offer.type, housingType); */
  };
  // Функция проверяет какая option выбрана в select housingRooms.
  var getSelectedRoomNumber = function (ad) {
    if (housingRooms.value === 'any') {
      return true;
    }
    return parseInt(housingRooms.value, 10) === ad.offer.rooms;
    /* checkIsOptionSelected(ad.offer.rooms, housingRooms);*/
  };
  // Функция проверяет какая option выбрана в select housingGuests.
  var getSelectedGuestsNumber = function (ad) {
    checkIsOptionSelected(ad.offer.guests, housingGuests);
  };
  // Функция проверяет какие checkbox-ы чекнуты в housingPrice.
  var getSelectedFeatures = function (ad) {
    var checkedFetures = housingFeatures.querySelectorAll('input[type=checkbox]:checked');
    var fetureContent = true;
    Array.from(checkedFetures).every(function (checkbox) {
      fetureContent = ad.offer.features.indexOf(checkbox.value) !== -1;
      return fetureContent;
    });
    return fetureContent;
  };
  // Функция проверяет какой интервал цен выбран в housingFeatures.
  var getSelectedPriceLevel = function (ad) {
    if (housingPrice.value === 'low') {
      return PriceLevel.CHEAP > ad.offer.price;
    } else if (housingPrice.value === 'middle') {
      return PriceLevel.CHEAP <= ad.offer.price && ad.offer.price < PriceLevel.EXPENSIVE;
    } else if (housingPrice.value === 'high') {
      return PriceLevel.EXPENSIVE <= ad.offer.price;
    }
    return true;
  };
  // Функция обновляет HtmlElement с отфильтрованными пинами.
  var getFiltredPins = function () {
    window.card.removeCard();
    window.form.removePinsFromScreen();
    if (window.adsLoaded) {
      var adsLoadedClone = window.adsLoaded.slice();
      var filteredPins = adsLoadedClone.filter(function (ad) {
        return getSelectedTypeOfDwelling(ad) && getSelectedPriceLevel(ad) && getSelectedRoomNumber(ad) && getSelectedGuestsNumber(ad) && getSelectedFeatures(ad);
      }).slice(PINS_NUMBER);
      console.log(filteredPins);
      document.querySelector('.map__pins').append(window.form.showPins(filteredPins));
    }
  };

  // var filterChangeHandler = window.debounce.debounceController(getFiltredPins);

  window.filter = {
    filterChangeHandler: getFiltredPins
  };
})();
