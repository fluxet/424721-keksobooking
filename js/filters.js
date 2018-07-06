'use strict';

(function () {

  var OUTPUT_DATA_CAPACITY = 5;
  var advertsCopy;
  var housingType = document.querySelector('#housing-type');
  var housingPrice = document.querySelector('#housing-price');
  var housingRooms = document.querySelector('#housing-rooms');
  var housingGuests = document.querySelector('#housing-guests');
  var featuresFieldset = document.querySelector('#housing-features');
  var features = featuresFieldset.querySelectorAll('.map__checkbox');
  var selects = document.querySelectorAll('.map__filter');
  var formFilters = document.querySelector('.map__filters');
  var priceIndicator = {
    low: {
      min: 0,
      max: 9999
    },
    middle: {
      min: 10000,
      max: 49999
    },
    high: {
      min: 50000,
      max: Infinity
    }
  };
  var dataFiltered = [];

  var setDeafaultSettings = function () {
    selects.forEach(function (select) {
      select.value = 'any';
    });
    features.forEach(function (feature) {
      feature.checked = false;
    });
    dataFiltered = advertsCopy;
  };

  var getFlagFilter = function (element, property) {
    var isFiltered = false;
    if ((element.value === 'any') || (element.value === property.toString())) {
      isFiltered = true;
    }
    return isFiltered;
  };

  var getTypeCondition = function (advert) {
    return getFlagFilter(housingType, advert.offer.type);
  };

  var getRoomsCondition = function (advert) {
    return getFlagFilter(housingRooms, advert.offer.rooms);
  };

  var getGuestsCondition = function (advert) {
    return getFlagFilter(housingGuests, advert.offer.guests);
  };

  var getPriceCondition = function (advert) {
    if (housingPrice.value === 'any') {
      return true;
    }
    if ((advert.offer.price >= priceIndicator[housingPrice.value].min)
    && (advert.offer.price <= priceIndicator[housingPrice.value].max)) {
      return true;
    }
    return false;
  };

  var getFilteredFeatures = function () {
    var featuresChecked = featuresFieldset.querySelectorAll('.map__checkbox:checked');
    featuresChecked.forEach(function (feature) {
      if (feature.checked) {
        dataFiltered = dataFiltered.filter(function (advert) {
          return advert.offer.features.indexOf(feature.value) >= 0;
        });
      }
    });
    return dataFiltered;
  };

  var onFormFiltersChange = window.debounce(function () {
    dataFiltered = advertsCopy;
    dataFiltered = getFilteredFeatures().filter(getTypeCondition)
    .filter(getPriceCondition).filter(getRoomsCondition).filter(getGuestsCondition);
    window.card.close();
    window.pin.close();
    window.pin.init();
  });

  var onSuccess = function (objects) {
    setDeafaultSettings();
    advertsCopy = objects.slice();
    dataFiltered = advertsCopy;
    formFilters.addEventListener('change', onFormFiltersChange);
  };

  var onError = function (message) {
    window.renderFailureMessage(message);
  };

  window.backend.loadData(onSuccess, onError);

  var getFilteredData = function () {
    return dataFiltered.slice(0, OUTPUT_DATA_CAPACITY);
  };

  window.filters = {
    get: getFilteredData,
    clear: setDeafaultSettings
  };
})();
