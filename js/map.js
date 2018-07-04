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
      window.form.init();
      window.pin.init();
      enableElements(fieldsets);
      enableElements(filters);
    }
    pageActivated = true;
  };

  var disableMap = function () {
    window.card.close();
    window.pin.close();
    disableElements(fieldsets);
    disableElements(filters);
    mapElement.classList.add('map--faded');
    window.pinMain.reset();
    pageActivated = false;
  };

  window.pinMain.reset();
  disableElements(fieldsets);
  disableElements(filters);

  window.map = {
    disable: disableMap,
    init: initPage
  };

})();
