'use strict';

var AVATAR_SRC = 'img/avatars/user0x.png';
var TITLES = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец',
  'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик',
  'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
var PRICE_MIN = 1000;
var PRICE_MAX = 1000000;
var ROOMS_MIN = 1;
var ROOMS_MAX = 5;
var GUESTS_MAX = 10;
var CHECK_TIME = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var markerParams = {
  X_MIN: 300,
  X_MAX: 900,
  Y_MIN: 130,
  Y_MAX: 630,
  WIDTH: 40,
  HEIGHT: 70
};
var ADVERT_NUMBER = 8;

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

var getAvatars = function () {
  var avatars = [];
  var arrFromStr = AVATAR_SRC.split('x');
  for (var i = 0; i < ADVERT_NUMBER; i++) {
    avatars[i] = (i < 9) ? arrFromStr[0] : arrFromStr[0].substring(0, arrFromStr[0].length - 1);
    avatars[i] += (i + 1) + arrFromStr[1];
  }
  return avatars;
};

var getFeatures = function () {
  var featuresRandom = shuffleCopyArray(FEATURES);
  var randomLength = getRandomValue(0, FEATURES.length);
  var features = [];
  for (var i = 0; i < randomLength; i++) {
    features[i] = featuresRandom[i];
  }
  return features;
};

var getType = function (string) {
  var offerTypesTranslation = {
    'квартира': 'flat',
    'дворец': 'palace',
    'домик': 'house',
    'бунгало': 'bungalo'
  };
  var reg = [];
  for (var i in offerTypesTranslation) {
    if (!offerTypesTranslation.hasOwnProperty(i)) continue;
    reg += i + '|';
  }
  reg = reg.substring(0, reg.length - 1);
  var keyWord = string.match(reg)[0];
  var type = offerTypesTranslation[keyWord];
  return type;
};

var getAdvert = function (titleAdv, avatarAdv) {
  var locationX = getRandomValue(markerParams.X_MIN, markerParams.X_MAX);
  var locationY = getRandomValue(markerParams.Y_MIN, markerParams.Y_MAX);

  var advert = {
    author: {
      avatar: avatarAdv
    },
    offer: {
      title: titleAdv,
      address: locationX + ', ' + locationY,
      price: getRandomValue(PRICE_MIN, PRICE_MAX),
      type: getType(titleAdv),
      rooms: getRandomValue(ROOMS_MIN, ROOMS_MAX),
      guests: getRandomValue(1, GUESTS_MAX),
      checkin: CHECK_TIME[getRandomValue(0, CHECK_TIME.length - 1)],
      checkout: CHECK_TIME[getRandomValue(0, CHECK_TIME.length - 1)],
      features: getFeatures(),
      description: '',
      photos: shuffleCopyArray(PHOTOS)
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
  var avatars = getAvatars();
  var titles = shuffleCopyArray(TITLES);
  for (var i = 0; i < ADVERT_NUMBER; i++) {
    adverts[i] = getAdvert(titles[i], avatars[i]);
  }
  return adverts;
};

var renderPin = function (advert) {
  var similarPinTemplate = elementTemplate.content.querySelector('.map__pin');
  var pinElement = similarPinTemplate.cloneNode(true);

  pinElement.style.left = advert.location.x - markerParams.WIDTH / 2 + 'px';
  pinElement.style.top = advert.location.y - markerParams.HEIGHT + 'px';
  pinElement.querySelector('img').src = advert.author.avatar;
  pinElement.querySelector('img').alt = advert.offer.title;
  return pinElement;
};

var renderFeatures = function (advert, element) {
  var features = advert.offer.features;
  var featuresDiff = shuffleCopyArray(FEATURES);
  for (var i = 0; i < features.length; i++) {
    for (var j = 0; j < featuresDiff.length; j++) {
      if (features[i] === featuresDiff[j]) {
        featuresDiff.splice(j, 1);
      }
    }
  }
  var listElement = element.querySelector('.popup__features');
  for (i = 0; i < featuresDiff.length; i++) {
    var featureClass = '.popup__feature--' + featuresDiff[i];
    var featureElement = listElement.querySelector(featureClass);
    listElement.removeChild(featureElement);
  }
};

var renderImgInhabitation = function (advert, element) {
  element.querySelector('.popup__photo').src = advert.offer.photos[0];
  var imgContainer = element.querySelector('.popup__photos');
  var imgMaster = element.querySelector('.popup__photo');
  for (var i = 1; i < advert.offer.photos.length; i++) {
    var imgCopy = imgMaster.cloneNode();
    imgCopy.src = advert.offer.photos[i];
    imgContainer.appendChild(imgCopy);
  }
};

var renderAdv = function (advert) {
  var similarAdvTemplate = elementTemplate.content.querySelector('.map__card');
  var advElement = similarAdvTemplate.cloneNode(true);

  advElement.querySelector('.popup__title').textContent = advert.offer.title;
  advElement.querySelector('.popup__text--address').textContent = advert.offer.address;
  advElement.querySelector('.popup__text--price').textContent = advert.offer.price + '₽/ночь';
  advElement.querySelector('.popup__type').textContent = advert.offer.type;
  advElement.querySelector('.popup__text--capacity').textContent = advert.offer.rooms + ' комнаты для ' + advert.offer.guests + ' гостей';
  advElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + advert.offer.checkin + ', выезд до ' + advert.offer.checkout;
  advElement.querySelector('.popup__description').textContent = advert.offer.description;
  advElement.querySelector('.popup__avatar').src = advert.author.avatar;

  renderFeatures(advert, advElement);
  renderImgInhabitation(advert, advElement);

  return advElement;
};

var getFragmentAdverts = function (adverts) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < adverts.length; i++) {
    fragment.appendChild(renderPin(adverts[i]));
  }
  fragment.appendChild(renderAdv(adverts[0]));
  return fragment;
};

var initPage = function () {
  var element = document.querySelector('.map');
  element.classList.remove('map--faded');
  var nextElement = element.querySelector('.map__filters-container');
  element.insertBefore(getFragmentAdverts(getAdverts()), nextElement);
};

var elementTemplate = document.querySelector('template');
initPage();
