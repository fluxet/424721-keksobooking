'use strict';

(function () {

  var advertsCopy;
  var housingType = document.querySelector('#housing-type');
  var housingPrice = document.querySelector('#housing-price');
  var housingRooms = document.querySelector('#housing-rooms');
  var housingGuests = document.querySelector('#housing-guests');
  var wifi = document.querySelector('#filter-wifi');
  var dishwasher = document.querySelector('#filter-dishwasher');
  var parking = document.querySelector('#filter-parking');
  var washer = document.querySelector('#filter-washer');
  var elevator = document.querySelector('#filter-elevator');
  var conditioner = document.querySelector('#filter-conditioner');
  var featuresFieldset = document.querySelector('#housing-features');
  var features = featuresFieldset.querySelectorAll('.map__checkbox');
  var selects = document.querySelectorAll('.map__filter');
  var formFilters = document.querySelector('.map__filters');
  var priceIndicator = {
    any: [-Infinity, Infinity],
    low: [0, 9999],
    middle: [10000, 49999],
    high: [50000, Infinity]
  };
  var rangeIndexIndicator = {
    housingType: 0,
    housingPrice: 1,
    housingRooms: 2,
    housingGuests: 3
  };
  var rangeIndexes = {
    type: 0,
    price: 1,
    rooms: 2,
    guests: 3
  };
  var OUTPUT_DATA_CAPACITY = 5;
  var allFeaturesFilters;
  var dataFiltered = [];

  var setDeafaultSettings = function() {
    advertsCopy.forEach(function (advert) {
      advert.range = [1, 1, 1, 1];
    });
    selects.forEach(function (select) {
      select.value = 'any';
    });
    allFeaturesFilters = advertsCopy;
    features.forEach(function (feature) {
      feature.checked = false;
    });
    dataFiltered = advertsCopy;
  };

  var getFilteredFeatures = function () {
    allFeaturesFilters = advertsCopy;
    features.forEach(function (feature) {
      if (feature.checked) {
        allFeaturesFilters = allFeaturesFilters.filter(function (advert) {
          return advert.offer.features.indexOf(feature.value) >= 0;
        });
      }
    });
  };

  var onChangeFilterType = function () {
    advertsCopy.forEach(function (advert) {
      if ((housingType.value === advert.offer.type)
      || (housingType.value === 'any')) {
        advert.range[rangeIndexes.type] = 1;
      } else {
        advert.range[rangeIndexes.type] = 0;
      }
    });
  };

  var onChangeFilterPrice = function () {
    advertsCopy.forEach(function (advert) {
      if (((advert.offer.price >= priceIndicator[housingPrice.value][0]) && (advert.offer.price <= priceIndicator[housingPrice.value][1])
      || (housingPrice.value === 'any'))) {
        advert.range[rangeIndexes.price] = 1;
      } else {
        advert.range[rangeIndexes.price] = 0;
      }
    });
  };

  var onChangeFilterRooms = function () {
    advertsCopy.forEach(function (advert) {
      if ((advert.offer.rooms === +housingRooms.value)
      || (housingRooms.value === 'any')) {
        advert.range[rangeIndexes.rooms] = 1;
      } else {
        advert.range[rangeIndexes.rooms] = 0;
      }
    });
  };

  var onChangeFilterGuests = function () {
    advertsCopy.forEach(function (advert) {
      if ((advert.offer.guests === +housingGuests.value)
      || (housingGuests.value === 'any')) {
        advert.range[rangeIndexes.guests] = 1;
      } else {
        advert.range[rangeIndexes.guests] = 0;
      }
    });
  };

  var onChangeFormSetFilters = window.debounce(function () {
    getDataFiltered();
    window.card.close();
    window.pin.close();
    window.pin.init();
  });

  var getDataFiltered = function() {
    dataFiltered = allFeaturesFilters.filter(function (advert) {
      return advert.range.join('') === '1111';
    });
    return dataFiltered;
  };

  var onSuccess = function (objects) {
    advertsCopy = objects.slice();
    setDeafaultSettings();      
    features.forEach(function (feature) {
      feature.addEventListener('change', getFilteredFeatures);
    });
    housingType.addEventListener('change', onChangeFilterType);
    housingPrice.addEventListener('change', onChangeFilterPrice);
    housingRooms.addEventListener('change', onChangeFilterRooms);
    housingGuests.addEventListener('change', onChangeFilterGuests);
    formFilters.addEventListener('change', onChangeFormSetFilters);
  };

  var onError = function (message) {
    window.renderFailureMessage(message);
  };

  window.backend.loadData(onSuccess, onError);

  var getFilteredData = function () {
    return  dataFiltered.slice(0, OUTPUT_DATA_CAPACITY);
  };

  window.filters = {
    get: getFilteredData,
    clear: setDeafaultSettings
  };
})();
