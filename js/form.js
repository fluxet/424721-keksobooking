'use strict';

(function () {

  var ESC_KEYCODE = 27;
  var invalidElements = [];
  var noticeForm = document.querySelector('.ad-form');
  var typeSelect = document.querySelector('#type');
  var priceInput = document.querySelector('#price');
  var timeInSelect = document.querySelector('#timein');
  var timeOutSelect = document.querySelector('#timeout');
  var roomNumberSelect = document.querySelector('#room_number');
  var capacitySelect = document.querySelector('#capacity');
  var capacityOptions = capacitySelect.querySelectorAll('option');
  var resetButton = noticeForm.querySelector('.ad-form__reset');
  var addressInput = document.querySelector('#address');
  var successElement = document.querySelector('.success');
  var minPriceIndicator = {
    bungalo: 0,
    flat: 1000,
    house: 5000,
    palace: 10000
  };
  var capacityInRoomsVariants = {
    '1': ['1'],
    '2': ['1', '2'],
    '3': ['1', '2', '3'],
    '100': ['0']
  };
  var isSuccessMessageOpen;

  var setTimeSelects = function (elem, newValue) {
    elem.value = newValue;
  };

  var onSelectTimeOut = function (evt) {
    setTimeSelects(timeInSelect, evt.target.value);
  };

  var onSelectTimeIn = function (evt) {
    setTimeSelects(timeOutSelect, evt.target.value);
  };

  var onSelectRoomSetCapacity = function () {
    var enableOptions = capacityInRoomsVariants[roomNumberSelect.value];
    capacityOptions.forEach(function (option) {
      option.disabled = !enableOptions.includes(option.value);
    });
    capacitySelect.value = enableOptions[0];
  };

  var hideInvalidElement = function (element) {
    element.addEventListener('change', function () {
      element.classList.remove('element-invalid');
    });
  };

  var onInvalidShowElement = function (evt) {
    var invalidElement = evt.target;
    invalidElement.classList.add('element-invalid');
    invalidElements.push(invalidElement);
    hideInvalidElement(invalidElement);
  };

  var onTypeSelectChange = function () {
    priceInput.min = minPriceIndicator[typeSelect.value];
    priceInput.placeholder = priceInput.min;
  };

  var setAdress = function (pinX, pinY) {
    addressInput.value = pinX + ', ' + pinY;
  };

  var initForm = function () {
    noticeForm.classList.remove('ad-form--disabled');
    typeSelect.addEventListener('change', onTypeSelectChange);
    timeInSelect.addEventListener('change', onSelectTimeIn);
    timeOutSelect.addEventListener('change', onSelectTimeOut);
    onSelectRoomSetCapacity();
    roomNumberSelect.addEventListener('change', onSelectRoomSetCapacity);
    noticeForm.addEventListener('invalid', onInvalidShowElement, true);
    resetButton.addEventListener('click', onResetClearPage);
  };

  var clearPage = function () {
    noticeForm.reset();
    onTypeSelectChange();
    typeSelect.removeEventListener('change', onTypeSelectChange);
    timeInSelect.removeEventListener('change', onSelectTimeIn);
    timeOutSelect.removeEventListener('change', onSelectTimeOut);
    roomNumberSelect.removeEventListener('change', onSelectRoomSetCapacity);
    invalidElements.forEach(function (element) {
      element.classList.remove('element-invalid');
    });
    invalidElements = [];
    window.map.disable();
    window.filters.clear();
    noticeForm.classList.add('ad-form--disabled');
  };

  var onResetClearPage = function (evt) {
    clearPage();
    noticeForm.removeEventListener('invalid', onInvalidShowElement, true);
    resetButton.removeEventListener('click', onResetClearPage);
    evt.preventDefault();
  };

  var closeSuccessMessage = function () {
    if (isSuccessMessageOpen === true) {
      successElement.classList.add('hidden');
    }
    isSuccessMessageOpen = false;
    successElement.removeEventListener('click', closeSuccessMessage);
  };

  var onEscMessageClose = function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      closeSuccessMessage();
      document.removeEventListener('keydown', onEscMessageClose);
    }
  };

  var onSubmitSuccess = function () {
    clearPage();
    successElement.classList.remove('hidden');
    isSuccessMessageOpen = true;
    successElement.addEventListener('click', closeSuccessMessage);
    document.addEventListener('keydown', onEscMessageClose);
  };

  var onSubmitError = function (message) {
    window.renderFailureMessage(message);
  };

  noticeForm.addEventListener('submit', function (evt) {
    window.backend.sendData(onSubmitSuccess, onSubmitError, new FormData(noticeForm));
    evt.preventDefault();
  });

  window.form = {
    init: initForm,
    setAdress: setAdress
  };

})();
