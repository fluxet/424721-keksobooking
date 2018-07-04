'use strict';

(function () {

  var cardParams = {
    PHOTO_WIDTH: 45,
    PHOTO_HEIGHT: 40
  };
  var ESC_KEYCODE = 27;
  var advertTitleTranslation = {
    'flat': 'квартира',
    'palace': 'дворец',
    'house': 'домик',
    'bungalo': 'бунгало'
  };
  var isAdOpened;
  var similarAdvTemplate = document.querySelector('template').content.querySelector('.map__card');
  var currentCard;
  var mapElement = document.querySelector('.map');
  var filtersContainer = mapElement.querySelector('.map__filters-container');

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
    img.width = cardParams.PHOTO_WIDTH;
    img.height = cardParams.PHOTO_HEIGHT;
    img.alt = 'Фотография жилья';
    return img;
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
    if (evt.keyCode === ESC_KEYCODE) {
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
    advert.offer.features.forEach(function (feature) {
      var featureElement = getFeature(feature);
      ulElement.appendChild(featureElement);
    });
    var imgContainer = adElement.querySelector('.popup__photos');
    advert.offer.photos.forEach(function (photo) {
      var imgNew = getPhoto(photo);
      imgContainer.appendChild(imgNew);
    });
    var advButtonClose = adElement.querySelector('.popup__close');
    advButtonClose.addEventListener('click', closeCard);
    return adElement;
  };

  var showNewCard = function (adElement) {
    closeCard();
    isAdOpened = false;
    openCard(adElement);
  };

  window.card = {
    render: renderAdv,
    close: closeCard,
    show: showNewCard
  };

})();
