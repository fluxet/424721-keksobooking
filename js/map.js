'use strict';

var advertParams = {
  AVATAR_SRC_PT1: 'img/avatars/user',
  AVATAR_SRC_PT2: '.png',
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
  WIDTH: 40,
  HEIGHT: 70
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
var nextElement = mapElement.querySelector('.map__filters-container');
var template = document.querySelector('template');
var similarPinTemplate = template.content.querySelector('.map__pin');
var similarAdvTemplate = template.content.querySelector('.map__card');

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

var getSrc = function (index) {
  var src = (index < 9) ? (advertParams.AVATAR_SRC_PT1 + '0') : (advertParams.AVATAR_SRC_PT1);
  src += index + 1 + advertParams.AVATAR_SRC_PT2;
  return src;
};

var getAdvert = function (index) {
  var locationX = getRandomValue(markerParams.X_MIN, markerParams.X_MAX);
  var locationY = getRandomValue(markerParams.Y_MIN, markerParams.Y_MAX);

  var avatarSrc = getSrc(index);
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

  pinElement.style.left = advert.location.x - markerParams.WIDTH / 2 + 'px';
  pinElement.style.top = advert.location.y - markerParams.HEIGHT + 'px';
  pinElement.querySelector('img').src = advert.author.avatar;
  pinElement.querySelector('img').alt = advert.offer.title;
  return pinElement;
};

var getFeature = function (feature) {
  var featureElement = document.createElement('li');
  featureElement.classList.add('popup__feature');
  var featureClass = 'popup__feature--' + feature;
  featureElement.classList.add(featureClass);
  return featureElement;
};

var getPhoto = function (photo) {
  var imgNew = document.createElement('img');
  imgNew.classList.add('popup__photo');
  imgNew.src = photo;
  imgNew.width = advertParams.PHOTO_WIDTH;
  imgNew.height = advertParams.PHOTO_HEIGHT;
  imgNew.alt = 'Фотография жилья';
  return imgNew;
};

var renderAdv = function (advert) {
  var advElement = similarAdvTemplate.cloneNode(true);

  advElement.querySelector('.popup__title').textContent = advert.offer.title;
  advElement.querySelector('.popup__text--address').textContent = advert.offer.address;
  advElement.querySelector('.popup__text--price').textContent = advert.offer.price + '₽/ночь';
  advElement.querySelector('.popup__type').textContent = advertTitleTranslation[advert.offer.type];
  advElement.querySelector('.popup__text--capacity').textContent = advert.offer.rooms + ' комнаты для ' + advert.offer.guests + ' гостей';
  advElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + advert.offer.checkin + ', выезд до ' + advert.offer.checkout;
  advElement.querySelector('.popup__description').textContent = advert.offer.description;
  advElement.querySelector('.popup__avatar').src = advert.author.avatar;

  var ulElement = advElement.querySelector('.popup__features');
  var liElements = ulElement.querySelectorAll('.popup__feature');
  for (var i = 0; i < liElements.length; i++) {
    ulElement.removeChild(liElements[i]);
  }
  for (i = 0; i < advert.offer.features.length; i++) {
    var featureElement = getFeature(advert.offer.features[i]);
    ulElement.appendChild(featureElement);
  }

  var imgContainer = advElement.querySelector('.popup__photos');
  var imgMaster = advElement.querySelector('.popup__photo');
  imgContainer.removeChild(imgMaster);
  for (i = 0; i < advert.offer.photos.length; i++) {
    var imgNew = getPhoto(advert.offer.photos[i]);
    imgContainer.appendChild(imgNew);
  }
  return advElement;
};

var getPinsFragment = function (adverts) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < adverts.length; i++) {
    fragment.appendChild(renderPin(adverts[i]));
  }
  return fragment;
};

var initPage = function () {
  mapElement.classList.remove('map--faded');

  var adverts = getAdverts();
  mapElement.insertBefore(renderAdv(adverts[0]), nextElement);
  pinsContainer.appendChild(getPinsFragment(adverts));
};

initPage();
