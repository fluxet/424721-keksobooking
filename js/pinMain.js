'use strict';

(function () {
  var mainPinParams = {
    WIDTH: 65,
    HEIGHT: 87
  };
  var mapBorders = {
    X_MIN: 0,
    X_MAX: 1200,
    Y_MIN: 130,
    Y_MAX: 630
  };
  var addressInput = document.querySelector('#address');

  var pinMain = document.querySelector('.map__pin--main');
  var pinMainXstart = 570;
  var pinMainYstart = 375;

  var getCoords = function (pinX, pinY) {
    var left = pinX;
    var top = pinY;
    var coords = {
      x: left + Math.round(mainPinParams.WIDTH / 2),
      y: top + mainPinParams.HEIGHT
    };
    return coords;
  };

  var setAdress = function (pinX, pinY) {
    var pinCoord = getCoords(pinX, pinY);
    addressInput.value = pinCoord.x + ', ' + pinCoord.y;
  };

  pinMain.addEventListener('mousedown', function (evt) {
    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };
    var onMouseMove = function (evtMove) {
      var shift = {
        x: startCoords.x - evtMove.clientX,
        y: startCoords.y - evtMove.clientY,
      };
      startCoords = {
        x: evtMove.clientX,
        y: evtMove.clientY
      };

      var pinX = pinMain.offsetLeft - shift.x;
      var pinY = pinMain.offsetTop - shift.y;
      if ((pinX > mapBorders.X_MIN - Math.round(mainPinParams.WIDTH / 2))
      && (pinX < mapBorders.X_MAX - Math.round(mainPinParams.WIDTH / 2))
      && (pinY > mapBorders.Y_MIN - mainPinParams.HEIGHT)
      && (pinY < mapBorders.Y_MAX - mainPinParams.HEIGHT)) {
        pinMain.style.left = pinX + 'px';
        pinMain.style.top = pinY + 'px';
      }
      setAdress(pinX, pinY);
    };
    var onMouseUp = function () {
      window.map.initPage();
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  var resetPinMain = function () {
    pinMain.style.left = pinMainXstart + 'px';
    pinMain.style.top = pinMainYstart + 'px';
    setAdress(pinMainXstart, pinMainYstart);
  };

  window.pinMain = {
    resetPinMain: resetPinMain
  };

})();
