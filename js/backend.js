'use strict';

(function () {

  var URL_DATA = 'https://js.dump.academy/keksobooking/data';
  var URL_SEND = 'https://js.dump.academy/keksobooking';

  var manageData = function (method, url, onLoad, onError, data) {
    var xhr = new XMLHttpRequest();
    if (method === 'GET') {
      xhr.responseType = 'json';
    }
    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        onLoad(xhr.response);
      } else {
        onError('Произошла ошибка. Статус ошибки: ' + xhr.status);
      }
    });
    xhr.addEventListener('error', function () {
      onError('Ошибка соединения');
    });
    xhr.timeout = 10000;
    xhr.addEventListener('timeout', function () {
      onError('Превышено допустимое время соединения');
    });
    xhr.open(method, url);
    xhr.send(data);
  };

  var loadData = function (onLoad, onError) {
    manageData('GET', URL_DATA, onLoad, onError, '');
  };

  var sendData = function (onLoad, onError, data) {
    manageData('POST', URL_SEND, onLoad, onError, data);
  };

  var showFailureMessage = function (message) {
    var messageElement = document.createElement('div');
    messageElement.textContent = message;
    messageElement.classList.add('error');
    document.body.insertAdjacentElement('afterbegin', messageElement);
    document.addEventListener('click', function () {
      messageElement.classList.remove('error');
    });
  };

  window.backend = {
    loadData: loadData,
    sendData: sendData,
    showFailureMessage: showFailureMessage
  };

})();