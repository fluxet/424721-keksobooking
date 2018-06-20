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

var fieldsets = document.querySelectorAll('fieldset');
var filters = document.querySelectorAll('.map__filters select');
var noticeForm = document.querySelector('.ad-form');
var addressInput = document.querySelector('#address');
var pinMain = document.querySelector('.map__pin--main');
var advertCard;
var typeSelect = document.querySelector('#type');
var priceInput = document.querySelector('#price');
var timeInSelect = document.querySelector('#timein');
var timeOutSelect = document.querySelector('#timeout');
var roomNumberSelect = document.querySelector('#room_number');
var capacitySelect = document.querySelector('#capacity');
var capacityOptions = capacitySelect.querySelectorAll('option');
var submitButton = document.querySelector('.ad-form__element--submit');
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
  pinElement.addEventListener('click', function () {
    openCard(adElement);
  });
  return pinElement;
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

var closeAd = function (adElement) {
  var advButtonClose = adElement.querySelector('.popup__close');
  advButtonClose.addEventListener('click', function () {
    mapElement.removeChild(adElement);
    adElement = null;
    document.removeEventListener('keydown', onPopupEscPress);
  });
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
  closeAd(adElement);
  return adElement;
};

var openCard = function (adElement) {
  mapElement.insertBefore(adElement, filtersContainer);
  advertCard = adElement;
  document.addEventListener('keydown', onPopupEscPress);
};

var getCoords = function () {
  var left = pinMain.offsetLeft;
  var top = pinMain.offsetTop;
  var coords = {
    x: left + Math.round(mainPinParams.WIDTH / 2),
    y: top + mainPinParams.HEIGHT
  };
  return coords;
};

var setAdress = function () {
  var pinCoord = getCoords();
  addressInput.value = pinCoord.x + ', ' + pinCoord.y;
};

var onPopupEscPress = function (evt) {
  if (evt.keyCode === keycodes.ESC) {
    mapElement.removeChild(advertCard);
    advertCard = null;
    document.removeEventListener('keydown', onPopupEscPress);
  }
};

var initPins = function () {
  var fragmentPin = document.createDocumentFragment();
  for (var i = 0; i < adverts.length; i++) {
    fragmentPin.appendChild(renderPin(adverts[i]));
  }
  pinsContainer.appendChild(fragmentPin);
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

    setAdress();
  }
  pageActivated = true;
};

var setTimeSelects = function (masterElement, slaveElement) {
  if (masterElement.value !== slaveElement.value) {
    slaveElement.value = masterElement.value;
  }
};

var disableCapacityOptions = function () {
  for (var i = 0; i < capacityOptions.length; i++) {
    capacityOptions[i].disabled = true;
  }
  var enableOptions = capacityInRoomsVariants[roomNumberSelect.value];
  for (i = 0; i < enableOptions.length; i++) {
    var selectorName = 'option[value=\''+ enableOptions[i] + '\']';
    capacitySelect.querySelector(selectorName).disabled = false;
  }
  capacitySelect.value = enableOptions[0];
};

var showInvalidElement = function (evt) {
  var invalidElement = evt.target;
  invalidElement.parentNode.classList.add('ad-form__element--invalid');
  invalidElement.addEventListener('change', function () {
    invalidElement.parentNode.classList.remove('ad-form__element--invalid');
    
  });
};

var adverts = getAdverts();
var pageActivated = false;

disableElements(fieldsets);
disableElements(filters);

pinMain.addEventListener('mouseup', function () {
  onMainPinInitPage();
});

typeSelect.addEventListener('change', function () {
  priceInput.min = minPriceIndicator[typeSelect.value];
  priceInput.placeholder = priceInput.min;
});

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
