'use strict';

(function () {
  var housingType = document.querySelector('#housing-type');
  var housingRooms = document.querySelector('#housing-rooms');
  var housingGuests = document.querySelector('#housing-guests');
  var housingPrice = document.querySelector('#housing-price');
  var housingFeatures = document.querySelector('#housing-features');

  var PriceLevel = {
    CHEAP: 10000,
    EXPENSIVE: 50000
  };
  // Функция проверяет какая option выбрана в select housingType.
  var compareType = function (ad) {
    return (housingType.value === 'any') || housingType.value === ad.offer.type;
  };
  // Функция проверяет какая option выбрана в select housingRooms.
  var compareRooms = function (ad) {
    return (housingRooms.value === 'any') || parseInt(housingRooms.value, 10) === ad.offer.rooms;

  };
  // Функция проверяет какая option выбрана в select housingGuests.
  var compareGuests = function (ad) {
    return (housingGuests.value === 'any') || parseInt(housingGuests.value, 10) === ad.offer.guests;
  };
  // Функция проверяет какие checkbox-ы чекнуты в housingPrice.
  var compareFeatures = function (ad) {
    var checkedFetures = housingFeatures.querySelectorAll('input[type=checkbox]:checked');
    var fetureContent = true;
    Array.from(checkedFetures).every(function (checkbox) {
      fetureContent = ad.offer.features.indexOf(checkbox.value) !== -1;
      return fetureContent;
    });
    return fetureContent;
  };
  // Функция проверяет какой интервал цен выбран в housingFeatures.
  var comparePrice = function (ad) {
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
    var adsLoadedClone = window.adsLoaded.slice();

    if (adsLoadedClone) {
      var filteredPins = adsLoadedClone.filter(function (ad) {
        return compareType(ad) && comparePrice(ad) && compareRooms(ad) && compareGuests(ad) && compareFeatures(ad);
      });
      filteredPins = window.form.cutPins(filteredPins);
      document.querySelector('.map__pins').append(window.form.showPins(filteredPins));
    }
  };

  var actDebounce = function () {
    window.debounce(getFiltredPins);
  };

  window.filter = {
    filterChangeHandler: actDebounce
  };
})();
