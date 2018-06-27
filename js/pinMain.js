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

  var pinMain = document.querySelector('.map__pin--main');
  var pinMainXstart = 570;
  var pinMainYstart = 375;
  
  var pinX;
  var pinY;

  var getCoords = function (x,y) {
    var coords = {
      left: x + Math.round(mainPinParams.WIDTH / 2),
      top: y + mainPinParams.HEIGHT
    }
    return coords;
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

      pinX = pinMain.offsetLeft - shift.x;
      pinY = pinMain.offsetTop - shift.y;
      if ((pinX > mapBorders.X_MIN - Math.round(mainPinParams.WIDTH / 2))
      && (pinX < mapBorders.X_MAX - Math.round(mainPinParams.WIDTH / 2))
      && (pinY > mapBorders.Y_MIN - mainPinParams.HEIGHT)
      && (pinY < mapBorders.Y_MAX - mainPinParams.HEIGHT)) {
        pinMain.style.left = pinX + 'px';
        pinMain.style.top = pinY + 'px';
      }
      var address = {
        x: getCoords(pinX, 0).left,
        y: getCoords(0, pinY).top
      };
      window.form.setAdress(address.x, address.y);
    };
    var onMouseUp = function () {
      window.map.init();
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  var resetPinMain = function () {
    pinMain.style.left = pinMainXstart + 'px';
    pinMain.style.top = pinMainYstart + 'px';
    var addressStart = {
        x: getCoords(pinMainXstart, 0).left,
        y: getCoords(0, pinMainYstart).top
      };
    window.form.setAdress(addressStart.x, addressStart.y);
  };

  window.pinMain = {
    reset: resetPinMain
  };

})();
