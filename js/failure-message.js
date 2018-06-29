'use strict';

(function () {

  window.renderFailureMessage = function (message) {
    var messageElement = document.createElement('div');
    messageElement.textContent = message;
    messageElement.classList.add('error');
    document.body.insertAdjacentElement('afterbegin', messageElement);
    document.addEventListener('click', function () {
      messageElement.classList.remove('error');
    });
  };

})();
