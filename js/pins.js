'use strict';

(function () {

  var ADVERTS_NUMBER = 8;
  var pinsContainer = document.querySelector('.map__pins');
  var similarPinTemplate = document.querySelector('template').content.querySelector('.map__pin');
  var isPinActive;

  var markerParams = {
    WIDTH: 50,
    HEIGHT: 70
  };
  var pins = [];
  var pinActive;
  var getAdverts = function () {
    var adverts = [];
    for (var i = 0; i < ADVERTS_NUMBER; i++) {
      adverts[i] = window.advert.getAdvert(i);
    }
    return adverts;
  };
  var adverts = getAdverts();

  var renderPin = function (advert) {
    var pinElement = similarPinTemplate.cloneNode(true);
    var adElement = window.cards.renderAdv(advert);
    pinElement.style.left = advert.location.x - markerParams.WIDTH / 2 + 'px';
    pinElement.style.top = advert.location.y - markerParams.HEIGHT + 'px';
    pinElement.querySelector('img').src = advert.author.avatar;
    pinElement.querySelector('img').alt = advert.offer.title;
    pins.push(pinElement);

    pinElement.addEventListener('click', function () {
      if (isPinActive) {
        pinActive.classList.remove('map__pin--active');
      }
      window.cards.closeCard();
      window.cards.isAdOpened = false;
      window.cards.openCard(adElement);
      pinActive = pinElement;
      pinActive.classList.add('map__pin--active');
      isPinActive = true;
    });
    return pinElement;
  };

  var initPins = function () {
    var fragmentPin = document.createDocumentFragment();
    for (var i = 0; i < adverts.length; i++) {
      fragmentPin.appendChild(renderPin(adverts[i]));
    }
    pinsContainer.appendChild(fragmentPin);
  };
  var closePins = function () {
    pins.forEach(function (pin) {
      pinsContainer.removeChild(pin);
    });
    pins = [];
  };

  window.pins = {
    initPins: initPins,
    closePins: closePins,
    isPinActive: isPinActive
  };
})();
