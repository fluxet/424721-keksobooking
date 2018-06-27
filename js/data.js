'use strict';

(function () {
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
      'http://o0.github.io/assets/images/tokyo/hotel3.jpg']
  };
  var markerBorders = {
    X_MIN: 300,
    X_MAX: 900,
    Y_MIN: 130,
    Y_MAX: 630
  };
  var offerTypesTranslation = {
    'квартира': 'flat',
    'дворец': 'palace',
    'домик': 'house',
    'бунгало': 'bungalo'
  };

  var getFeatures = function () {
    var featuresRandom = window.utils.shuffleCopyArray(advertParams.FEATURES);
    var randomLength = window.utils.getRandomValue(0, advertParams.FEATURES.length);
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

  window.data = function (index) {
    var locationX = window.utils.getRandomValue(markerBorders.X_MIN, markerBorders.X_MAX);
    var locationY = window.utils.getRandomValue(markerBorders.Y_MIN, markerBorders.Y_MAX);

    var avatarNumber = index + 1;
    var avatarSrc = getSrc(avatarNumber);
    var titleAdv = window.utils.shuffleCopyArray(advertParams.TITLES)[index];

    var advert = {
      author: {
        avatar: avatarSrc
      },
      offer: {
        title: titleAdv,
        address: locationX + ', ' + locationY,
        price: window.utils.getRandomValue(advertParams.PRICE_MIN, advertParams.PRICE_MAX),
        type: getType(titleAdv),
        rooms: window.utils.getRandomValue(advertParams.ROOMS_MIN, advertParams.ROOMS_MAX),
        guests: window.utils.getRandomValue(1, advertParams.GUESTS_MAX),
        checkin: advertParams.CHECK_TIME[window.utils.getRandomValue(0, advertParams.CHECK_TIME.length - 1)],
        checkout: advertParams.CHECK_TIME[window.utils.getRandomValue(0, advertParams.CHECK_TIME.length - 1)],
        features: getFeatures(),
        description: '',
        photos: window.utils.shuffleCopyArray(advertParams.PHOTOS)
      },
      location: {
        x: locationX,
        y: locationY
      }
    };
    return advert;
  };


})();
