'use strict';

(function () {
  var messageTimer = 5000;

  window.renderFailureMessage = function (message) {
    var messageElement = document.createElement('div');
    messageElement.textContent = message;
    messageElement.classList.add('error');
    document.body.insertAdjacentElement('afterbegin', messageElement);

    setTimeout(function () {
      document.body.removeChild(messageElement);
    }, messageTimer);
  };

})();
