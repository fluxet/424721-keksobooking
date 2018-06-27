'use strict';

(function () {

  var mapElement = document.querySelector('.map');
  var pageActivated = false;
  var fieldsets = document.querySelectorAll('fieldset');
  var filters = document.querySelectorAll('.map__filters select');

  var disableElements = function (elements) {
    for (var i = 0; i < elements.length; i++) {
      elements[i].disabled = true;
    }
  };

  var enableElements = function (elements) {
    for (var i = 0; i < elements.length; i++) {
      elements[i].disabled = false;
    }
  };

  var initPage = function () {
    if (!pageActivated) {

    mapElement.classList.remove('map--faded');
    window.form.initForm();
    window.pins.initPins();

    enableElements(fieldsets);
    enableElements(filters);
      
      window.cards.isAdOpened = false;
      window.pins.isPinActive = false;
    }
    pageActivated = true;
  };

  var disableMap = function () {
    window.cards.closeCard();
    window.pins.closePins();
    disableElements(fieldsets);
    disableElements(filters);
    mapElement.classList.add('map--faded');
    
    window.pinMain.resetPinMain();
    pageActivated = false;
  };

  window.pinMain.resetPinMain();
  disableElements(fieldsets);
  disableElements(filters);

  window.map = {
    disableMap: disableMap,
    initPage: initPage
  };
  
})();
