'use strict';

(function () {

  var getRandomValue = function (min, max) {
    return Math.floor(Math.random() * (max + 1 - min)) + min;
  };

  var shuffleCopyArray = function (arrayOld) {
    var arrayNew = [];
    for (var i = 0; i < arrayOld.length; i++) {
      arrayNew.push(arrayOld[i]);
    }
    for (i = 0; i < arrayNew.length; i++) {
      var elementCopy = arrayNew[i];
      var randomIndex = getRandomValue(0, arrayNew.length - 1);
      arrayNew[i] = arrayNew[randomIndex];
      arrayNew[randomIndex] = elementCopy;
    }
    return arrayNew;
  };

  window.utils = {
    getRandomValue: getRandomValue,
    shuffleCopyArray: shuffleCopyArray
  };

})();
