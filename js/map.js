'use strict';

var AVATAR_SRC = 'img/avatars/user0x.png';
var TITLES = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
var PRICE_MIN = 1000;
var PRICE_MAX = 1000000;
var ROOMS_MIN = 1;
var ROOMS_MAX = 5;
var GUESTS_MAX = 10;
var CHECK_TIME = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var X_MIN = 300;
var X_MAX = 900;
var Y_MIN = 130;
var Y_MAX = 630;
var MARKER_WIDTH = 40;
var MARKER_HEIGHT = 70;
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
    avatars[i] = arrFromStr[0] + (i + 1) + arrFromStr[1];
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
  var array = string.split(' ');
  for (var i = 0; i < array.length; i++) {
    if (array[i] === 'бунгало') {
      return 'bungalo';
    } else if (array[i] === 'домик') {
      return 'house';
    } else if (array[i] === 'квартира') {
      return 'flat';
    }
  }
  return 'palace';
};

var getAdverts = function () {
  var adverts = [];
  var avatars = getAvatars();
  var titles = shuffleCopyArray(TITLES);

  for (var i = 0; i < ADVERT_NUMBER; i++) {
    var titleAdv = titles[i];
    var locationX = getRandomValue(X_MIN, X_MAX);
    var locationY = getRandomValue(Y_MIN, Y_MAX);

    var advert = {
      author: {
        avatar: avatars[i]
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
    adverts[i] = advert;
  }
  return adverts;
};

var renderPin = function (advert) {
  var pinElement = similarPinTemplate.cloneNode(true);

  pinElement.style.left = advert.location.x - MARKER_WIDTH / 2 + 'px';
  pinElement.style.top = advert.location.y - MARKER_HEIGHT + 'px';
  pinElement.querySelector('img').src = advert.author.avatar;
  pinElement.querySelector('img').alt = advert.offer.title;
  return pinElement;
};

var renderAdv = function (advert) {
  var advElement = similarAdvTemplate.cloneNode(true);

  advElement.querySelector('.popup__title').textContent = advert.offer.title;
  advElement.querySelector('.popup__text--address').textContent = advert.offer.address;
  advElement.querySelector('.popup__text--price').textContent = advert.offer.price + '₽/ночь';
  advElement.querySelector('.popup__type').textContent = advert.offer.type;
  advElement.querySelector('.popup__text--capacity').textContent = advert.offer.rooms + ' комнаты для ' + advert.offer.guests + ' гостей';
  advElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + advert.offer.checkin + ', выезд до ' + advert.offer.checkout;
  advElement.querySelector('.popup__description').textContent = advert.offer.description;
  advElement.querySelector('.popup__avatar').src = advert.author.avatar;

  var listElement = advElement.querySelectorAll('.popup__feature');
  for (var i = 0; i < listElement.length; i++) {
    listElement[i].style.display = 'none';
  }
  for (i = 0; i < advert.offer.features.length; i++) {
    var featureClass = '.popup__feature--' + advert.offer.features[i];
    advElement.querySelector(featureClass).style.display = '';
  }

  advElement.querySelector('.popup__photo').src = advert.offer.photos[0];
  var imgContainer = advElement.querySelector('.popup__photos');
  var imgMaster = advElement.querySelector('.popup__photo');
  for (i = 1; i < advert.offer.photos.length; i++) {
    var imgCopy = imgMaster.cloneNode();
    imgCopy.src = advert.offer.photos[i];
    imgContainer.appendChild(imgCopy);
  }
  return advElement;
};

var getFragment = function (adverts) {
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
  return element;
};

var map = initPage();
var similarPinTemplate = document.querySelector('template').content.querySelector('.map__pin');
var similarAdvTemplate = document.querySelector('template').content.querySelector('.map__card');
var nextElement = map.querySelector('.map__filters-container');
map.insertBefore(getFragment(getAdverts()), nextElement);
