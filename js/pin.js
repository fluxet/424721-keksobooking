'use strict';

(function () {

  var pinsContainer = document.querySelector('.map__pins');
  var similarPinTemplate = document.querySelector('template').content.querySelector('.map__pin');
  var isPinActive;
  var markerParams = {
    WIDTH: 50,
    HEIGHT: 70
  };
  var pins = [];
  var pinActive;
  var filteredData;

  var renderPin = function (advert) {
    var pinElement = similarPinTemplate.cloneNode(true);
    var adElement = window.card.render(advert);
    pinElement.style.left = advert.location.x - markerParams.WIDTH / 2 + 'px';
    pinElement.style.top = advert.location.y - markerParams.HEIGHT + 'px';
    pinElement.querySelector('img').src = advert.author.avatar;
    pinElement.querySelector('img').alt = advert.offer.title;
    pins.push(pinElement);
    pinElement.addEventListener('click', function () {
      if (isPinActive) {
        pinActive.classList.remove('map__pin--active');
      }
      window.card.show(adElement);
      pinActive = pinElement;
      pinActive.classList.add('map__pin--active');
      isPinActive = true;
    });
    return pinElement;
  };

  var initPin = function () {
    filteredData = window.filters.get();
    var fragmentPin = document.createDocumentFragment();
    for (var i = 0; i < filteredData.length; i++) {
      fragmentPin.appendChild(renderPin(filteredData[i]));
    }
    pinsContainer.appendChild(fragmentPin);
  };

  var closePin = function () {
    pins.forEach(function (pin) {
      pinsContainer.removeChild(pin);
    });
    pins = [];
  };

  window.pin = {
    init: initPin,
    close: closePin,
  };

})();
