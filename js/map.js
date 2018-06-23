'use strict';

var advertParams = {
  AVATAR_SRC_PATH: 'img/avatars/user',
  AVATAR_SRC_EXT: '.png',
  TITLES: [
    'Большая уютная квартира',
    'Маленькая неуютная квартира',
    'Огромный прекрасный дворец',
    'Маленький ужасный дворец',
    'Красивый гостевой домик',
    'Некрасивый негостеприимный домик',
    'Уютное бунгало далеко от моря',
    'Неуютное бунгало по колено в воде'],
  PRICE_MIN: 1000,
  PRICE_MAX: 1000000,
  ROOMS_MIN: 1,
  ROOMS_MAX: 5,
  GUESTS_MAX: 10,
  CHECK_TIME: ['12:00', '13:00', '14:00'],
  FEATURES: ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'],
  PHOTOS: [
    'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel3.jpg'],
  ADVERTS_NUMBER: 8,
  PHOTO_WIDTH: 45,
  PHOTO_HEIGHT: 40
};
var markerParams = {
  X_MIN: 300,
  X_MAX: 900,
  Y_MIN: 130,
  Y_MAX: 630,
  WIDTH: 50,
  HEIGHT: 70
};
var mainPinParams = {
  WIDTH: 65,
  HEIGHT: 87
};
var keycodes = {
  ENTER: 13,
  ESC: 27
};
var mapBorders = {
  X_MIN : 0,
  Y_MIN : 130,
  Y_MAX : 630
};
var offerTypesTranslation = {
  'квартира': 'flat',
  'дворец': 'palace',
  'домик': 'house',
  'бунгало': 'bungalo'
};
var advertTitleTranslation = {
  'flat': 'квартира',
  'palace': 'дворец',
  'house': 'домик',
  'bungalo': 'бунгало'
};

var mapElement = document.querySelector('.map');
var pinsContainer = mapElement.querySelector('.map__pins');
var filtersContainer = mapElement.querySelector('.map__filters-container');
var template = document.querySelector('template');
var similarPinTemplate = template.content.querySelector('.map__pin');
var similarAdvTemplate = template.content.querySelector('.map__card');
var pins = [];
var isAdOpened;
var currentCard;
var isPinActive;
var pinActive;
var fieldsets = document.querySelectorAll('fieldset');
var filters = document.querySelectorAll('.map__filters select');
var noticeForm = document.querySelector('.ad-form');
var addressInput = document.querySelector('#address');
var pinMain = document.querySelector('.map__pin--main');
var pinMainXstart = 570;
var pinMainYstart = 375;
var typeSelect = document.querySelector('#type');
var priceInput = document.querySelector('#price');
var timeInSelect = document.querySelector('#timein');
var timeOutSelect = document.querySelector('#timeout');
var roomNumberSelect = document.querySelector('#room_number');
var capacitySelect = document.querySelector('#capacity');
var capacityOptions = capacitySelect.querySelectorAll('option');
var resetButton = noticeForm.querySelector('.ad-form__reset');
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

var getFeatures = function () {
  var featuresRandom = shuffleCopyArray(advertParams.FEATURES);
  var randomLength = getRandomValue(0, advertParams.FEATURES.length);
  var features = [];
  for (var i = 0; i < randomLength; i++) {
    features[i] = featuresRandom[i];
  }
  return features;
};
var getFeature = function (feature) {
  var featureElement = document.createElement('li');
  featureElement.classList.add('popup__feature');
  featureElement.classList.add('popup__feature--' + feature);
  return featureElement;
};

var getPhoto = function (photoSrc) {
  var img = document.createElement('img');
  img.classList.add('popup__photo');
  img.src = photoSrc;
  img.width = advertParams.PHOTO_WIDTH;
  img.height = advertParams.PHOTO_HEIGHT;
  img.alt = 'Фотография жилья';
  return img;
};

var getType = function (string) {
  var keyWord = string.match(/квартира|дворец|домик|бунгало/)[0];
  var type = offerTypesTranslation[keyWord];
  return type;
};

var getSrc = function (avatarNumber) {
  var src = (avatarNumber < 10) ? (advertParams.AVATAR_SRC_PATH + '0') : (advertParams.AVATAR_SRC_PATH);
  src += avatarNumber + advertParams.AVATAR_SRC_EXT;
  return src;
};

var getAdvert = function (index) {
  var locationX = getRandomValue(markerParams.X_MIN, markerParams.X_MAX);
  var locationY = getRandomValue(markerParams.Y_MIN, markerParams.Y_MAX);

  var avatarNumber = index + 1;
  var avatarSrc = getSrc(avatarNumber);
  var titleAdv = shuffleCopyArray(advertParams.TITLES)[index];

  var advert = {
    author: {
      avatar: avatarSrc
    },
    offer: {
      title: titleAdv,
      address: locationX + ', ' + locationY,
      price: getRandomValue(advertParams.PRICE_MIN, advertParams.PRICE_MAX),
      type: getType(titleAdv),
      rooms: getRandomValue(advertParams.ROOMS_MIN, advertParams.ROOMS_MAX),
      guests: getRandomValue(1, advertParams.GUESTS_MAX),
      checkin: advertParams.CHECK_TIME[getRandomValue(0, advertParams.CHECK_TIME.length - 1)],
      checkout: advertParams.CHECK_TIME[getRandomValue(0, advertParams.CHECK_TIME.length - 1)],
      features: getFeatures(),
      description: '',
      photos: shuffleCopyArray(advertParams.PHOTOS)
    },
    location: {
      x: locationX,
      y: locationY
    }
  };
  return advert;
};

var getAdverts = function () {
  var adverts = [];
  for (var i = 0; i < advertParams.ADVERTS_NUMBER; i++) {
    adverts[i] = getAdvert(i);
  }
  return adverts;
};

var renderPin = function (advert) {
  var pinElement = similarPinTemplate.cloneNode(true);
  var adElement = renderAdv(advert);
  pinElement.style.left = advert.location.x - markerParams.WIDTH / 2 + 'px';
  pinElement.style.top = advert.location.y - markerParams.HEIGHT + 'px';
  pinElement.querySelector('img').src = advert.author.avatar;
  pinElement.querySelector('img').alt = advert.offer.title;
  pins.push(pinElement);

  pinElement.addEventListener('click', function () {
    var currentPin = pinsContainer.querySelector('.map__pin--active');
    if (isPinActive) {
      pinActive.classList.remove('map__pin--active');
    }
    closeCard();
    isAdOpened = false;
    openCard(adElement);
    pinActive = pinElement;
    pinActive.classList.add('map__pin--active');
    isPinActive = true;
  });
  return pinElement;
};

var openCard = function (adElement) {
  mapElement.insertBefore(adElement, filtersContainer);
  currentCard = adElement;
  isAdOpened = true;
  document.addEventListener('keydown', onPopupEscPress);
};

var closeCard = function () {
  if (isAdOpened) {
    mapElement.removeChild(currentCard);
    isAdOpened = false;
  }
};

var onPopupEscPress = function (evt) {
  if (evt.keyCode === keycodes.ESC) {
    closeCard();
    document.removeEventListener('keydown', onPopupEscPress);
  }
};

var renderAdv = function (advert) {
  var adElement = similarAdvTemplate.cloneNode(true);

  adElement.querySelector('.popup__title').textContent = advert.offer.title;
  adElement.querySelector('.popup__text--address').textContent = advert.offer.address;
  adElement.querySelector('.popup__text--price').textContent = advert.offer.price + '₽/ночь';
  adElement.querySelector('.popup__type').textContent = advertTitleTranslation[advert.offer.type];
  adElement.querySelector('.popup__text--capacity').textContent = advert.offer.rooms + ' комнаты для ' + advert.offer.guests + ' гостей';
  adElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + advert.offer.checkin + ', выезд до ' + advert.offer.checkout;
  adElement.querySelector('.popup__description').textContent = advert.offer.description;
  adElement.querySelector('.popup__avatar').src = advert.author.avatar;

  var ulElement = adElement.querySelector('.popup__features');
  for (var i = 0; i < advert.offer.features.length; i++) {
    var featureElement = getFeature(advert.offer.features[i]);
    ulElement.appendChild(featureElement);
  }

  var imgContainer = adElement.querySelector('.popup__photos');
  for (i = 0; i < advert.offer.photos.length; i++) {
    var imgNew = getPhoto(advert.offer.photos[i]);
    imgContainer.appendChild(imgNew);
  }
  var advButtonClose = adElement.querySelector('.popup__close');
  advButtonClose.addEventListener('click', closeCard);
  return adElement;
};

var getCoords = function (pinX, pinY) {
  var left = pinX
  var top = pinY
  var coords = {
    x: left + Math.round(mainPinParams.WIDTH / 2),
    y: top
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
  var onMouseMove = function(evtMove) {
    var shift = {
      x: startCoords.x - evtMove.clientX,
      y: startCoords.y - evtMove.clientY,
    };    
    startCoords = {
      x: evtMove.clientX,
      y: evtMove.clientY
    };
    mapBorders.xMax = mapElement.clientWidth - mainPinParams.WIDTH;
    
    var pinX = pinMain.offsetLeft - shift.x;
    var pinY = pinMain.offsetTop - shift.y;
    if ((pinX > mapBorders.X_MIN)
    && (pinX < mapBorders.xMax)                    
    && (pinY > mapBorders.Y_MIN) 
    && (pinY < mapBorders.Y_MAX)) {
      pinMain.style.left = (pinX) + 'px';
      pinMain.style.top = (pinY) + 'px';
    } 
    setAdress(pinX, pinY);
  };
  var onMouseUp = function (upEvt) {
    onMainPinInitPage();
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };
  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
});

var initPins = function () {
  var fragmentPin = document.createDocumentFragment();
  for (var i = 0; i < adverts.length; i++) {
    fragmentPin.appendChild(renderPin(adverts[i]));
  }
  pinsContainer.appendChild(fragmentPin);
};

var closePins = function () {
  var pinsLength = pins.length;
  for (var i = pinsLength - 1; i >= 0; i--) {
    pinsContainer.removeChild(pins[i]);
    pins.pop(pins[i]);
  }
};

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

var onMainPinInitPage = function () {
  if (!pageActivated) {
    mapElement.classList.remove('map--faded');
    noticeForm.classList.remove('ad-form--disabled');

    initPins();

    enableElements(fieldsets);
    enableElements(filters);
    
    isAdOpened = false;
    isPinActive = false;
  }
  pageActivated = true;
};

var setTimeSelects = function (masterElement, slaveElement) {
  slaveElement.value = masterElement.value;
};

var disableCapacityOptions = function () {
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

var showInvalidElement = function (evt) {
  var invalidElement = evt.target;
  invalidElement.classList.add('element-invalid');
  hideInvalidElement(invalidElement);
};

var onResetClearPage = function (evt) {
  noticeForm.reset();
  onTypeSelectChange();
  closeCard();
  closePins();
  disableElements(fieldsets);
  disableElements(filters);
  mapElement.classList.add('map--faded');
  noticeForm.classList.add('ad-form--disabled');
  pinMain.style.left = pinMainXstart + 'px';
  pinMain.style.top = pinMainYstart + 'px';
  pageActivated = false;
  evt.preventDefault();
};

var adverts = getAdverts();
var pageActivated = false;

disableElements(fieldsets);
disableElements(filters);

var onTypeSelectChange = function () {
  priceInput.min = minPriceIndicator[typeSelect.value];
  priceInput.placeholder = priceInput.min;
};

typeSelect.addEventListener('change', onTypeSelectChange);

timeInSelect.addEventListener('change', function () {
  setTimeSelects(timeInSelect, timeOutSelect);
});
timeOutSelect.addEventListener('change', function () {
  setTimeSelects(timeOutSelect, timeInSelect);
});

roomNumberSelect.addEventListener('change', function () {
  disableCapacityOptions();
});

noticeForm.addEventListener('invalid', showInvalidElement, true);

resetButton.addEventListener('click', onResetClearPage);
